import {useEffect, useState} from 'react';
import { useLazyQuery } from '@apollo/client';
import {ADMIN_DATA_QUERY} from '../query/queryData';

// Interfaces
import {Inf_CatNode, Inf_CourseList, Inf_Course} from '../interfaces/Interfaces';
import {Inf_CurriData} from '../interfaces/InfOther';

// Components
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Function helpers
import {instanceOfCat, instanceOfCL} from '../../functions/InstanceOfNodes';

type NodeType = Inf_CatNode | Inf_CourseList | Inf_Course;

function dataLabel(node: NodeType, elementKey: number){

    if(instanceOfCat(node) || instanceOfCL(node)){
        return (
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Box>
                    <span>{node.name}</span>
                    {/* <span>{node.credit}</span> */}
                </Box>
                <span>{node.credit}</span>
            </Box>
        )
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Box>
                <span style={{paddingRight: '1.5rem'}}>{node.COURSENO}</span>
                <span style={{paddingRight: '0.5rem'}}>{node.name}</span>
            </Box>
           <span>{node.credit}</span>
        </Box>
    )
}

function RecursiveElement(param: {nodeElement: NodeType, elementKey: number }): JSX.Element {
    const [childrenCat_Cat, setChildrenCat_Cat] = useState<Array<Inf_CatNode>>([])
    const [childrenCat_List, setChildrenCat_List] = useState<Array<Inf_CourseList>>([])
    const [childrenList_Course, setChildrenList_Course] = useState<Array<Inf_Course>>([])

    async function setData(){
        if(instanceOfCat(param.nodeElement)){
            await setChildrenCat_Cat(param.nodeElement.refCat);
            await setChildrenCat_List(param.nodeElement.refList);
        }else if(instanceOfCL(param.nodeElement)){
            await setChildrenList_Course(param.nodeElement.courses);
        }
    }

    useEffect(() => {
        setData()
    },[])

    return (
        <>
            {
                (instanceOfCat(param.nodeElement) || instanceOfCL(param.nodeElement)) ?
                    <TreeItem key={param.elementKey} nodeId={param.nodeElement.id} 
                        label={dataLabel(param.nodeElement, param.elementKey)}>
                        {
                            childrenCat_Cat?.map((node: Inf_CatNode, index: number) => 
                                <RecursiveElement nodeElement={node} elementKey={index}/>
                            )
                        }
                        {
                            childrenCat_List?.map((node: Inf_CourseList, index: number) => 
                                <RecursiveElement nodeElement={node} elementKey={index} />
                            )
                        }
                        {
                            childrenList_Course?.map((node: Inf_Course, index: number) => 
                                <RecursiveElement nodeElement={node} elementKey={index}/>
                            )
                        }
                    </TreeItem> : 
                    <TreeItem key={param.elementKey} nodeId={param.nodeElement.id} 
                        label={dataLabel(param.nodeElement, param.elementKey)} />
            }
        </>
    )
}


// --> Main function component <-- 
function ModalTV(props: {isOpen: boolean, setOpen: (isOpen: boolean) => void}) {
    const [fetchData,{loading, error}] = useLazyQuery(ADMIN_DATA_QUERY);
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

    function handleClose() { 
        props.setOpen(false);
    }

    return (
        <div>
            <Modal open={props.isOpen}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}>
                <Fade in={props.isOpen}>
                    <Box sx={styledDupPartial}>
                        <Typography variant='h6' component='h2'>
                            Duplicate some partial from category folders
                        </Typography>
                        <TreeView sx={{ width: '100%', height: 400, flexGrow: 1, overflowY: 'auto' }}
                            defaultCollapseIcon={<ExpandMoreIcon/>}
                            defaultExpandIcon={<ChevronRightIcon/>}
                            multiSelect>
                            {
                                curriData.cat?.map((node: Inf_CatNode, index: number) => 
                                    <RecursiveElement nodeElement={node} elementKey={index}/>
                                )
                            }
                        </TreeView>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default ModalTV;

const styledDupPartial = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #A3A3A3',
    boxShadow: 24,
    p: 4,
};
