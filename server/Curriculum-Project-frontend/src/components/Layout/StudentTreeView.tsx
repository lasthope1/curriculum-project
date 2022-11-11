import {useState, useEffect, useContext} from 'react';
import {useMutation, useLazyQuery, useQuery} from '@apollo/client';
import {ModeContext, ModeInf} from '../../pages/Student';
import DashboardSub from '../../components/Layout/DashboardSubject';
import '../../styles/catNode.css';

// Queries and Mutations
import {STUDENT_DATA_QUERY, STUDENT_FE_QUERY, STUDENT_GRADE_QUERY, STUDENT_RESET_QUERY} from '../query/queryData';

// Function helpers
import {instanceOfCat, instanceOfCL} from '../../functions/InstanceOfNodes';

// Components
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

// Icons
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Interfaces
import {Inf_CatNode, Inf_CourseList, Inf_Course} from '../interfaces/Interfaces';

type NodeType = Inf_CatNode | Inf_CourseList | Inf_Course;
interface CatCre {
    ge?: number
    fs?: number
    fe?: number
}

function labelData(node: NodeType, catCredit: CatCre, typeReq: string) {

    function statusColor(status: string | undefined) {
        switch(status){
            case 'completed' : return 'green'
            case 'inprocess' : return '#dd7800'
            default : {
                switch(typeReq){
                    case 'require' : return '#ef4646'
                    case 'non-require' : return '#727272'
                    default : return '#000'
                }
            }
        }
    }

    function gradeCheck(grade: string | undefined, status: string | undefined){
        switch(grade){
            case "" : {
                if(status === "inprocess"){
                    return "In process"
                }else{
                    return "Pending"
                }
            }
            default : return grade
        }
    }

    function checkName(name : string){
        switch(name){
            case 'General Education': return `${catCredit.ge} /`
            case 'Field of Specialization' : return `${catCredit.fs} /`
            case 'Free Electives' : return `${catCredit.fe} /`
            default : return null
        }
    }

    if(instanceOfCat(node)){
        return (
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span>{node.name}</span>
                { (node.credit) ? <span>{checkName(node.name)}{node.credit}</span> : null }
            </Box>
        )
    }else if(instanceOfCL(node)){
        return (
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                        color: statusColor(node.status)}}>
                <span>{node.name}</span>
                <span>{node.newCredit} / {node.credit}</span>
            </Box>
        )
    }else{
        return (
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                        color: statusColor(node.status)}}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: 40}}>{node.COURSENO}</span>
                    <span>{node.name}</span>
                </Box>
                <Box>
                    <span style={{marginRight: (node.grade) ? '11.5rem' : '9.5rem'}}>
                        {gradeCheck(node.grade, node.status)}
                    </span>
                    <span>{node.credit}</span>
                </Box>
            </Box>
        )
    }
}

function RecursiveElement(param: { typeRequirement: string,
        CatElements: Inf_CatNode[], 
        ListElements: Inf_CourseList[], 
        CourseElements: Inf_Course[],

    }): JSX.Element {

    let nodeElement: NodeType[] = []
    let modeDatas = useContext<ModeInf>(ModeContext).modeSelected
    const [cominpCourse, setcominpCourse] = useState<Array<Inf_Course>>([]);
    const [pendingCourse, setPendingCourse] = useState<Array<Inf_Course>>([]);

    useEffect(() => {
        setcominpCourse([])
        setPendingCourse([])
        modeDatas.map(async(mode: string) => 
            await param.CourseElements.map(async(node: Inf_Course) => {
                if(node.status === mode){
                    if(node.status === 'completed' || node.status === 'inprocess'){
                        await setcominpCourse((prev: Inf_Course[]) => [...prev, node])
                    }else{
                        await setPendingCourse((prev: Inf_Course[]) => [...prev, node])
                    }
                }
            })
        )
    }, [modeDatas])
    
    function typeCheck(node: NodeType, index: number){
        if(instanceOfCat(node)){
            return (
                <RecursiveElement CatElements={node.refCat} 
                    ListElements={node.refList} 
                    CourseElements={[]} 
                    typeRequirement=''/>
            )
        }else if(instanceOfCL(node)){
            return (
                <RecursiveElement CatElements={[]} 
                    ListElements={[]} 
                    CourseElements={node.courses} 
                    typeRequirement={node.type}/>
            )
        }
    }
        
    function zipWith(arr: NodeType[] ) {
        let tempElement : Array<JSX.Element> = [];
        const typeReq: string = param.typeRequirement;
        arr?.map((node: NodeType, index: number) => { 
            tempElement = [...tempElement, 
                <TreeItem key={index} nodeId={node.id} 
                    label={labelData(node, {ge: 0, fs: 0, fe:0}, typeReq)}>
                    { typeCheck(node, index) }
                </TreeItem>
            ]
        })
        return tempElement;
    }

    return (
        <> 
            {   zipWith(nodeElement.concat(param.CatElements, 
                    param.ListElements, cominpCourse))
                    .map((el: JSX.Element) => el)
            }
            {   (param.CourseElements.length !== 0 && pendingCourse.length !== 0) ?
                <Box sx={{width: '98%', marginTop: 2, marginBottom: 2}}>
                    <Divider>{(param.typeRequirement === 'require') ? 'Require' : 'Non-require'} courses</Divider>
                </Box> : null
            }
            {
                zipWith(pendingCourse).map((el: JSX.Element) => el)
            }
        </>
    )
}


// --> Main function component <--
function StudentTreeView(param: {userCurriID: string, setAveGPA: (gpa: number) => void}) {
    const [catCredit, setCatCredit] = useState<CatCre>({
        ge: 0,
        fs: 0,
        fe:0
    })
    const [expanded, setExpanded] = useState<string[]>([])
    const [isGrad, setIsGrad] = useState<boolean>(false)
    const [initialData, setInitialData] = useState<Inf_CatNode[]>([])
    const [subjInProc, setSubjInProc] = useState<Inf_Course[]>([])
    const {data, loading} = useQuery(STUDENT_DATA_QUERY, {
        variables: {
            "id" : param.userCurriID
        }
    })

    const [fetchFe] = useLazyQuery(STUDENT_FE_QUERY)
    const [fetchGrade] = useLazyQuery(STUDENT_GRADE_QUERY)
    const [fetchReset] = useLazyQuery(STUDENT_RESET_QUERY)

    const fetchFeData = async() => {
        const res = await fetchFe()
        const feData = res.data.me.data.fe
        await setExpanded((prev: string[]) => [...prev, feData.id])
        await setInitialData((prev: Inf_CatNode[]) => [...prev, feData])
    }

    const fetchGPA = async() => {
        const res = await fetchGrade()
        const gpa = res.data.me.gpa
        param.setAveGPA(Number(gpa))
        setIsGrad((res.data.me.isGrad === 'false') ? false : true)
        setCatCredit(res.data.me.rootCredit)
    }

    useEffect(() => {
        setInitialData([]);
        const fetchInitData = async() => {
            if(data){
                data.uCur.cat?.map( async(node: Inf_CatNode) => {
                    await setExpanded((prev: string[]) => [...prev, node.id])
                    await setInitialData((prev: Inf_CatNode[]) => [...prev, node])
                })
                await fetchFeData()
                await fetchGPA()
                await fetchReset()
            }
            await fetchReset()
        }

        fetchInitData()
    }, [data])

    if(loading){
        return (
            <Box sx={{ display: 'flex', position: 'absolute', top: '20%', left: '47.5%'}}>
                <CircularProgress size={65}/>
            </Box>
        )
    }

    function handleToggle(event: React.SyntheticEvent, nodeIds: string[]) {
        setExpanded(nodeIds);
    };

    async function handleExpandClick() {
        var acc: string[] = [];
        const findSub = async(node: Inf_CatNode | Inf_CourseList | Inf_Course) => {
            acc.push(node.id)
            if(instanceOfCat(node)) {
                await node.refCat?.map((subNode: Inf_CatNode) => findSub(subNode))
                await node.refList.map((sublistNode: Inf_CourseList) => findSub(sublistNode))
            }
        }

        if(expanded.length === 0) {
            await initialData.map((node: Inf_CatNode) => {
                findSub(node)
            })
        }
        setExpanded(acc)
    }

    return (
        <>
        <div className='showGrad' style={{display: 'flex', position: 'absolute', top: '13%', left: '29%'}}>
            {   (isGrad) ? 
                    <h3 style={{color:'green'}}>
                        You have fullfilled all requirements for graduation 
                    </h3> : 
                    <h3 style={{color: '#f76464'}}> 
                        You have not fullfilled all requirements for graduation
                    </h3>}
        </div>
        <Container sx={{display: 'flex', position: 'absolute', width: '80%', top: '7%', left: '15%'}}>
            <div className="treeview-wrapper">
                <Box sx={{ mb: 1 ,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Button onClick={handleExpandClick}>
                        {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
                    </Button>
                    <Box>
                        <span style={{marginRight: '9.25rem'}}>Grade</span>
                        <span style={{marginRight: '0.75rem'}}>Credit</span>
                    </Box>
                </Box>
                <TreeView
                    aria-label="multi-select"
                    defaultCollapseIcon={<ExpandMoreIcon/>}
                    defaultExpandIcon={<ChevronRightIcon/>}
                    expanded={expanded}
                    onNodeToggle={handleToggle}
                    sx={{ width: '100%', height: 640, flexGrow: 1, overflowY: 'auto' }}
                    multiSelect >
                    {
                        initialData.map((node: Inf_CatNode, index: number) => (
                            <TreeItem key={index} nodeId={node.id} label={labelData(node, catCredit, '')}>
                                <RecursiveElement CatElements={(node.name === 'Free Electives') ? [] : node.refCat} 
                                    ListElements={node.refList} 
                                    CourseElements={[]}
                                    typeRequirement={''}/>
                            </TreeItem>
                        ))
                    }
                </TreeView>
            </div>
        </Container>
        </>
    )
}

export default StudentTreeView ;
