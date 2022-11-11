import {Fragment, useState, useContext} from 'react';
import '../../styles/catNode.css';

import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {Inf_CatNode, Inf_CourseList, Inf_Course} from '../interfaces/Interfaces';
import {ModeContext, ModeInf} from '../../pages/Student';

function labelData(node: Inf_CatNode | Inf_CourseList | Inf_Course) {
    return (
        <div className='inline-catNode'>
            <span>{node.name}</span>
        </div>
    )
}

// function RecursiveElement(param: {CatElement: Inf_CatNode[] , ListElement: Inf_CourseList[], CourseElement: Inf_Course[]}): JSX.Element{
//     return (
//         <>
//             {
//                 param.CatElement.map((node: Inf_CatNode, index: number) => 
//                     <TreeItem key={index} nodeId={node.id} label={labelData(node)}>
//                         <RecursiveElement CatElement={node.refCat} 
//                             ListElement={node.refList} 
//                             CourseElement={node.courses} />
//                     </TreeItem>
//                 )
//             }
//             {
//                 param.ListElement.map((node: Inf_CourseList, index: number) => 
//                     <TreeItem key={index} nodeId={node.id} label={node.name}>
//                         <RecursiveElement CatElement={[]} ListElement={[]} CourseElement={node.courses} />
//                     </TreeItem>
//                 )
//             }
//             {
//                 param.CourseElement.map((node: Inf_Course, index: number) => 
//                     <TreeItem key={index} nodeId={node.id} label={node.name}></TreeItem>
//                 )
//             }
//         </>
//     )
// }

// function CatNodeItem(param: {props: Inf_CatNode, children: JSX.Element}) {
//     const [Toggle, setToggle] = useState(false);
//     const rotate = Toggle ? "rotate(90deg)":"rotate(0)";

//     return (
//         <>
//             <div className="accordion-catNode-item" onClick={() => setToggle(!Toggle)}>
//                 <div className="inline-catNode">
//                     <span>
//                         <i className="gg-play-button" 
//                             style={{transform: rotate, transition:"all 0.2s linear"}}
//                         />
//                     </span>
//                     &nbsp;&nbsp;
//                     <span>{param.props.name}</span>
//                 </div>
//                 {/* <span className="inline-catNode">{param.props.credits} credits</span>  */}
//             </div>
//             <div>
//                 {Toggle && param.children}
//             </div>
//         </>
//     )
// }

export default function CatNode() {
    const [expanded, setExpanded] = useState<string[]>([])
    const modeSelected = useContext(ModeContext);

    function handleToggle(event: React.SyntheticEvent, nodeIds: string[]) {
        setExpanded(nodeIds);
    };

    // async function handleExpandClick() {
    //     var acc: string[] = [];
    //     if (expanded.length === 0) {
    //         await curriData.refCat.map((node: Inf_CatNode) => acc.push(node.id))
    //     }
    //     setExpanded(acc)
    // }

    return (
        <Fragment>
            {/* <div className="accordion-catNode">
                <Box sx={{ mb: 1 }}>
                    <Button onClick={handleExpandClick}>
                        {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
                    </Button>
                </Box>
                <TreeView
                    aria-label="multi-select"
                    defaultCollapseIcon={<ExpandMoreIcon/>}
                    defaultExpandIcon={<ChevronRightIcon/>}
                    expanded={expanded}
                    onNodeToggle={handleToggle}
                    // sx={{ height: 216, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                    multiSelect >
                    {
                        curriData.refCat.map((node: Inf_CatNode, index: number) => (
                            <TreeItem key={index} nodeId={node.id} label={node.name}>
                                <RecursiveElement CatElement={node.refCat} 
                                    ListElement={node.refList} 
                                    CourseElement={node.courses}/>
                            </TreeItem>
                        ))
                    }
                </TreeView>
            </div> */}
        </Fragment>
    )
}

// interface CurriData {
//     id: string
//     name: string
//     refCat: Inf_CatNode[]
// } 

// const curriData: CurriData = {
//     id: 'CPE58',
//     name: 'Computer Engineering 58',
//     refCat: [
//         {
//             id: 'GE01',
//             name: 'General Education',
//             kind: 'CatNode',
//             refCat: [],
//             refList: [
//                 {
//                     id: 'Lang02',
//                     name: 'Language and Community',
//                     kind: 'CourseList',
//                     Courses: [
//                         {
//                             id: 'Engl1',
//                             name: 'English 1',
//                             kind: 'Course'
//                         },
//                         {
//                             id: 'Engl2',
//                             name: 'English 2',
//                             kind: 'Course'
//                         },
//                         {
//                             id: 'Engl3',
//                             name: 'English 3',
//                             kind: 'Course',
//                         },
//                         {
//                             id: 'Engl4',
//                             name: 'English 4',
//                             kind: 'Course'
//                         },
//                     ]
//                 },
//                 {
//                     id: 'Learn02',
//                     name: 'Learning thought activities',
//                     kind: 'CourseList',
//                     Courses: [
//                         {
//                             id: '191',
//                             name: 'The killer',
//                             kind: 'Course'
//                         },
//                         {
//                             id: '192',
//                             name: 'The killer 2',
//                             kind: 'Course'
//                         },
//                         {
//                             id: '194',
//                             name: 'Chill subject',
//                             kind: 'Course'
//                         }
//                     ]
//                 }
//             ],
//             refCourse: []
//         },
//         {
//             id: 'FS01',
//             name: 'Field of spacialization',
//             kind: 'CatNode',
//             refCat: [
//                 {
//                     id: 'Maj02',
//                     name: 'Major',
//                     kind: 'CatNode',
//                     refCat: [
//                         {
//                             id: 'MajReq',
//                             name: 'Major requirements',
//                             kind: 'CatNode',
//                             refCat: [],
//                             refList: [
//                                 {
//                                     id: 'Nor58',
//                                     name: 'Normal',
//                                     kind: 'CourseList',
//                                     Courses: []
//                                 }
//                             ],
//                             refCourse: []
//                         },
//                         {
//                             id: 'MajEle',
//                             name: 'Major electives',
//                             kind: 'CatNode',
//                             refCat: [],
//                             refList: [
//                                 {
//                                     id: 'NorEle58',
//                                     name: 'Normal Election',
//                                     kind: 'CourseList',
//                                     Courses: []
//                                 },
//                                 {
//                                     id: 'Coop58',
//                                     name: 'Co-opertion Election',
//                                     kind: 'CourseList',
//                                     Courses: []
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
//                     kind: 'CourseList',
//                     Courses: [
//                         {
//                             id: 'Engl1',
//                             name: 'English 1',
//                             kind: 'Course'
//                         },
//                         {
//                             id: 'Engl2',
//                             name: 'English 2',
//                             kind: 'Course'
//                         },
//                         {
//                             id: 'Engl3',
//                             name: 'English 3',
//                             kind: 'Course',
//                         },
//                         {
//                             id: 'Engl4',
//                             name: 'English 4',
//                             kind: 'Course'
//                         },
//                     ] 
//                 }
//             ],
//             refCourse: []
//         }
//     ]
// }
