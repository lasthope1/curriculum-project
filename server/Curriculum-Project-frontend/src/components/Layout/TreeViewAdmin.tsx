import {useState, useEffect} from 'react';
import {useQuery, useLazyQuery} from '@apollo/client';
import {v4 as uuid} from 'uuid'

// Queries and Mutations 
import {ADMIN_DATA_QUERY} from '../query/queryData';

// Components
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
// import { MuiDraggableTreeView, TreeNode } from "@mui/lab/TreeV";

// Icons
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';
import AllInboxOutlinedIcon from '@mui/icons-material/AllInboxOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Interfaces
import {Inf_CatNode, Inf_CourseList, Inf_Course} from '../interfaces/Interfaces';
import {Inf_CurriData} from '../interfaces/InfOther';

//Function helpers
import {instanceOfCat, instanceOfCL} from '../../functions/InstanceOfNodes';

type NodeType = Inf_CatNode | Inf_CourseList | Inf_Course;

function dataLabel(node: Inf_CatNode | Inf_CourseList | Inf_Course , 
                    isEditMode: boolean, 
                    addCat_callBack: () => void,
                    addCourse_callBack: (node: Inf_CatNode | Inf_CourseList) => void,
                    hasListChildren: boolean,
                    elementKey: number){

    const addCatChild = () => {
        addCat_callBack()
    }

    const addCourse = () => {
        if(instanceOfCat(node) || instanceOfCL(node)){
            addCourse_callBack(node)
        }
    }

    const iconDisplayer = () => {
        if(instanceOfCat(node) || instanceOfCL(node)){
            return (
                <Box sx={{display: 'flex', '& hr': {mx: 1.5, height: 'auto'}}}>
                    <IconButton size='small' color='primary' sx={{mx: 1}} onClick={addCatChild} disabled={instanceOfCL(node)}>
                        <CreateNewFolderOutlinedIcon fontSize="inherit"/>
                    </IconButton>
                    <IconButton size='small' color='primary' sx={{mx: 1}} onClick={addCourse} disabled={hasListChildren}>
                        <NoteAddOutlinedIcon fontSize="inherit"/>
                    </IconButton>
                    <Divider orientation='vertical' flexItem />
                    <IconButton size='small' color='error' sx={{mx: 1}}>
                        <DeleteOutlinedIcon fontSize='inherit'/>
                    </IconButton>
                </Box>
            )
        }else{
            return (
                <Box sx={{display: 'flex', '& hr': {mx: 1.5, height: 'auto'}}}>
                    <IconButton size='small' color='error' sx={{mx: 1}}>
                        <DeleteOutlinedIcon fontSize="inherit"/>
                    </IconButton>
                </Box>
            )
        }
    }

    if(instanceOfCat(node) || instanceOfCL(node)){
        return (
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Box>
                    <span>{node.name}</span>
                    {/* <span>{node.credit}</span> */}
                </Box>
                { (isEditMode) ? iconDisplayer() : <span>{node.credit}</span> }
            </Box>
        )
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Box>
                <span style={{paddingRight: '1.5rem'}}>{node.COURSENO}</span>
                <span style={{paddingRight: '0.5rem'}}>{node.name}</span>
            </Box>
            { (isEditMode) ? iconDisplayer() : <span>{node.credit}</span> }
        </Box>
    )
}


function RecursiveElement(param: { nodeElement: NodeType,
                elementKey: number, 
                isEditMode: boolean 
        }): JSX.Element {

        const [childrenCat, setChildrenCat] = useState<Array<Inf_CatNode>>([])
        const [childrenCat_list, setChildrenCat_list] = useState<Array<Inf_CourseList>>([])
        const [childrenList, setChildrenList] = useState<Array<Inf_Course>>([])
        const [hasListChildren, setHasListChildren] = useState<boolean>(false)
        let nodeElement: NodeType[] = [];

        async function setData(){
            if(instanceOfCat(param.nodeElement)){
                await setChildrenCat(param.nodeElement.refCat);
                await setChildrenCat_list(param.nodeElement.refList);
                await setHasListChildren(param.nodeElement.refList.length === 0)
            }else if(instanceOfCL(param.nodeElement)){
                await setChildrenList(param.nodeElement.courses);
            }
        }

        useEffect(() => {
            setData()
        }, [param.nodeElement])

        const addChild = (): void => {
            setChildrenCat((prevState: Inf_CatNode[]) => [
                ...prevState, {
                    id: Math.floor(Math.random() * 100).toString(),
                    name: 'New catagory node',
                    refCat: [],
                    refList: [],
                    credit: 0
                }
            ])
        }

        const addCourse = (node: Inf_CatNode | Inf_CourseList) => {
            if(instanceOfCat(node) && childrenCat_list.length === 0){
                setChildrenCat((prevState: Inf_CatNode[]) => [
                    ...prevState, {
                        id: Math.floor(Math.random() * 100).toString(),
                        name: 'New catagory node',
                        refCat: [],
                        refList: [],
                        credit: 0,
                    }
                ])
            }else{
                setChildrenList((prevState: Inf_Course[]) => [
                    ...prevState, {
                        id: Math.floor(Math.random() * 100).toString(),
                        name: 'New course',
                        COURSENO: Math.floor(Math.random() * 100).toString(),
                        credit: 0
                    }
                ])
            }
        }

        function zipWith(arr: NodeType[]) {
            let tempElement : Array<JSX.Element> = [];
            arr?.map((node: NodeType, index: number) => {
                tempElement = [...tempElement,
                    <RecursiveElement nodeElement={node} 
                                elementKey={index}
                                isEditMode={param.isEditMode}
                    />
                ]
            })

            return tempElement;
        }

    return (
        <>
            {
                (instanceOfCat(param.nodeElement) || instanceOfCL(param.nodeElement)) ?
                    <TreeItem key={param.elementKey} nodeId={param.nodeElement.id} 
                        label={dataLabel(param.nodeElement, 
                                param.isEditMode, 
                                addChild, 
                                addCourse, 
                                hasListChildren,
                                param.elementKey
                            )}>      
                        {
                            zipWith(nodeElement.concat(childrenCat,
                                childrenCat_list, childrenList))
                                .map((el: JSX.Element) => el)
                        }
                    </TreeItem> : 
                    <TreeItem key={param.elementKey} nodeId={param.nodeElement.id} 
                        label={dataLabel(param.nodeElement, 
                                    param.isEditMode, 
                                    addChild, 
                                    addCourse, 
                                    hasListChildren,
                                    param.elementKey
                                )} />
            }
        </>
    )
}


// --> Main function component <-- 
function AdminTreeView(prop: {CurrTarget: string}) {
    const [fetchData,{loading, error}] = useLazyQuery(ADMIN_DATA_QUERY);

    const [expanded, setExpanded] = useState<string[]>([]);
    const [toggleMode, setToggleEditMode] = useState<boolean>(false);
    const [curriData, setCurriData] = useState<Inf_CurriData>({
        id: '',
        name: '',
        cat: []
    })

    useEffect(() => {

        const fetchCurriData = async() => {
            const res = await fetchData();
            const data : Inf_CurriData = res.data.aCur;
            setCurriData(data)
        }

        fetchCurriData()
    }, [])
    
    if(loading){
        return <p>Loading...</p>
    }

    if(error){
        return <p>{error.message}</p>
    }

    function handleToggle(event: React.SyntheticEvent, nodeIds: string[]) {
        setExpanded(nodeIds);
    };

    function handleAddRootCat(){
        setCurriData((prevState: Inf_CurriData) => (
            { 
                ...prevState, 
                cat : [ ...prevState.cat , {
                    id: uuid(),
                    name: 'New catagory node',
                    refCat: [],
                    refList: [],
                    credit: 0
                }]
            }
        ));
    }

    async function handleExpandClick() {
        var acc: string[] = [];
        const findSub = async(node: Inf_CatNode | Inf_CourseList) => {
            if(instanceOfCat(node)) {
                acc.push(node.id)
                await node.refCat.map((subNode: Inf_CatNode) => findSub(subNode))
                await node.refList.map((sublistNode: Inf_CourseList) => findSub(sublistNode))
            }else{
                acc.push(node.id)
            }
        }

        if (typeof curriData.cat !== 'undefined' && expanded.length === 0) {
            await curriData.cat.map((node: Inf_CatNode) => {
                findSub(node)
            })
        }
        setExpanded(acc)
    }

    return (
        <Container sx={{display: 'inline', width: '90%', height: 'auto', mt: 2}}>
            <Box sx={{mb: 1, display: 'flex', justifyContent: 'space-between'}}>
                <Button onClick={handleExpandClick}>
                    {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
                </Button>
                <ButtonGroup onClick={() => setToggleEditMode(!toggleMode)}>
                    { toggleMode ? 
                        <>
                            <Button>Save</Button>
                            <Button>Cancle</Button> 
                        </>
                        : <Button>Edit Mode</Button> 
                    }
                </ButtonGroup>
            </Box>
            <Box>
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon/>}
                    defaultExpandIcon={<ChevronRightIcon/>}
                    expanded={expanded}
                    onNodeToggle={handleToggle}
                    // sx={{ height: 216, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                    sx={{ width: '100%', height: 700, flexGrow: 1, overflowY: 'auto' }}
                    multiSelect >
                    {
                        curriData.cat?.map((node: Inf_CatNode, index: number) => 
                            <RecursiveElement nodeElement={node} 
                                elementKey={index}
                                isEditMode={toggleMode}/>
                        )
                    }
                </TreeView>
            </Box>
            { toggleMode &&
                <Box sx={{mt: 1, display: 'flex', width: '100%', justifyContent: 'center'}}>
                    <IconButton size='large' color='primary' onClick={handleAddRootCat}>
                        <AddCircleOutlineOutlinedIcon fontSize="inherit"/>
                    </IconButton>
                </Box>
            }
        </Container>
    )
}

export default AdminTreeView ;


// const curriData: Inf_CurriData = {
//     id: 'CPE58',
//     name: 'Computer Engineering 58',
//     refCat: [
//         {
//             id: 'GE01',
//             name: 'General Education',
//             refCat: [],
//             refList: [
//                 {
//                     id: 'Lang02',
//                     name: 'Language and Community',
//                     courses: [
//                         {
//                             id: 'Engl1',
//                             name: 'English 1',
//                         },
//                         {
//                             id: 'Engl2',
//                             name: 'English 2',
//                         },
//                         {
//                             id: 'Engl3',
//                             name: 'English 3',
//                         },
//                         {
//                             id: 'Engl4',
//                             name: 'English 4',
//                         },
//                     ]
//                 },
//                 {
//                     id: 'Learn02',
//                     name: 'Learning thought activities',
//                     courses: [
//                         {
//                             id: '191',
//                             name: 'The killer',
//                         },
//                         {
//                             id: '192',
//                             name: 'The killer 2',
//                         },
//                         {
//                             id: '194',
//                             name: 'Chill subject',
//                         }
//                     ]
//                 }
//             ],
//             credit: 56
//         },
//         {
//             id: 'FS01',
//             name: 'Field of spacialization',
//             refCat: [
//                 {
//                     id: 'Maj02',
//                     name: 'Major',
//                     refCat: [
//                         {
//                             id: 'MajReq',
//                             name: 'Major requirements',
//                             refCat: [],
//                             refList: [
//                                 {
//                                     id: 'Nor58',
//                                     name: 'Normal',
//                                     courses: []
//                                 }
//                             ],
//                             refCourse: []
//                         },
//                         {
//                             id: 'MajEle',
//                             name: 'Major electives',
//                             refCat: [],
//                             refList: [
//                                 {
//                                     id: 'NorEle58',
//                                     name: 'Normal Election',
//                                     courses: []
//                                 },
//                                 {
//                                     id: 'Coop58',
//                                     name: 'Co-opertion Election',
//                                     courses: []
//                                 }
//                             ],
//                             refCourse: []
//                         },
//                     ],
//                     refList: [],
//                     refCourse: []
//                 }
//             ],
//             refList: [
//                 {
//                     id: 'CC02',
//                     name: 'CoreCourse',
//                     courses: [
//                         {
//                             id: 'Engl1',
//                             name: 'English 1',
//                         },
//                         {
//                             id: 'Engl2',
//                             name: 'English 2',
//                         },
//                         {
//                             id: 'Engl3',
//                             name: 'English 3',
//                         },
//                         {
//                             id: 'Engl4',
//                             name: 'English 4',
//                         },
//                     ] 
//                 }
//             ],
//             credit: 33
//         }
//     ]
// }
