
import {useState} from 'react';
import styled from 'styled-components';
import '../../styles/catNode.css';
import '../../styles/courseList.css';
import '../../styles/course.css';

/////
interface CourseData {
    id: string
    name: string
    parentsID: string
}

interface CourseListData {
    id: string
    name: string 
    parentsID?: string
    ref?: string[]
}

interface CatNodeData {
    id: string
    name: string
    parentsID?: string
    ref: string[]
}

interface CurriData {
    id: string
    name: string
    CatList: string[]
}

interface GroupForTest {
    CatNode: CatNodeData[]
    CourseList: CourseListData[]
    Course: CourseData[]
}


/////
const StyledAccordion = styled.div`
    .Accordion-wrapper {
        margin-top: 5rem;
    }

    .Accordion-item {
        position: relative;
        display: flex;
        padding: 6px;
        justify-content: flex-start;
    }

    .Accordion-header {
        display: flex;
        width: 100%;
        height: auto;
        box-sizing: border-box;
    }

    .Accordion-body {
        position: relative;
        display: block;
        width: 100%;
        heigth: auto;
        margin: 8px;
        padding: 6px;
        justify-content: flex-start;

        top: 30px;
        left: -30rem;
    }
`

const CatNodeItem = (param: {props: CatNodeData, children: JSX.Element}) => {
    const [CatToggle, setCatToggle] = useState(false);
    const rotate : string = CatToggle ? "rotate(90deg)":"rotate(0)";

    return (
        <>
            <div className="Accordion-header" onClick={() => setCatToggle(!CatToggle)}>
                <div className="inline-catNode">
                    <span>
                        <i className="gg-play-button" 
                            style={{transform: rotate, transition:"all 0.2s linear"}}
                        />
                    </span>
                    &nbsp;&nbsp;
                    <span className='ms-4'>{param.props.name}</span>
                </div>
                {/* <span className="inline-catNode">{param.Props.credits} credits</span> */}
            </div>
            <div className='Accordion-body'>
                {
                    CatToggle && param.children
                }
            </div>
        </>
    )
}

const CourseListItem = (param: {catRef: string[], Element: CourseListData[], ChildElement: CourseData[]}): JSX.Element | null => {
    const [CourseToggle, setCourseToggle] = useState(false);
    const rotate : string = CourseToggle ? "rotate(90deg)":"rotate(0)";

    return (
        <>
            {
                param.Element.map((courseList: CourseListData) => {
                    for(let i:number = 0; i < param.catRef.length; i++){
                        if(param.catRef[i] === courseList.id){
                            return (
                                <>
                                    <div className="Accordion-header" onClick={() => setCourseToggle(!CourseToggle)}>
                                        <div className="inline-courseList">
                                            <span>
                                                <i className="gg-play-button"
                                                    style={{transform: rotate, transition: "all 0.2s linear"}}/>
                                            </span>
                                            &nbsp;&nbsp;
                                            <span>{courseList.name}</span>
                                        </div>
                                        {/* <span className='inline-courseList'>{courseList.id}</span> */}
                                    </div>
                                    <div className='Accordion-body'>
                                        {CourseToggle && param.ChildElement}
                                    </div>
                                </>
                            )
                        }else{
                            return null
                        }
                    }
                })
            }
        </>
    )
}

const CourseItem = (param: any) => {

    return (
        <div className='accordion-course-item'>
            <div className="inline-course">
                <span>{param.props.course_number}&emsp;</span>
                <span>{param.props.name}</span>
            </div>
            <div className='inline-course'>
                <span>{param.props.grade}&emsp;&emsp;</span>
                <span>{param.props.credit}</span>
            </div>
        </div>
    )
}

const RecursiveElement = (param: {parentCat: CatNodeData, Element: GroupForTest}): JSX.Element => {

    return (
        <>
            {
                param.Element.CatNode.map((catNode: CatNodeData) => (
                    (param.parentCat.id === catNode.parentsID) ? 
                        <CatNodeItem props={catNode}>
                            <RecursiveElement parentCat={catNode} Element={param.Element} />
                        </CatNodeItem>
                        : null
                ))
                // && 
                // param.Element.CourseList.map((courseList: CourseListData) => (
                //     (param.parentCat.id === courseList.parentsID) ?
                //         <CourseListItem ParentCatRefs={param.parentCat.ref} Element={param.Element.CourseList} ChildElement={param.Element.Course}/> 
                //         : null
                // ))
            }
        </>
    )
}

function Accordion(prop: {className: string, CurriDatas: GroupForTest, children:JSX.Element}) {
    const [toggleEditMode, setToggleEditMode] = useState(false);
    const [targetName, setTargetName] = useState<string>('');
    const [nameChanged, setNameChanged] = useState<string>('')

    // useEffect(() => {
    //     setCurriDt(prop.CurriDatas)
    // },[])

    function handleDoubleClick(event: React.MouseEvent<HTMLElement> , Target: CatNodeData) {
        event.preventDefault();
        setToggleEditMode(true);
        setTargetName(Target.id);
        setNameChanged(Target.name);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === 'Enter' || event.key === 'Escape'){
            event.preventDefault();
            event.stopPropagation();
            setToggleEditMode(false);
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNameChanged(event.target.value);
    }

  return (
    <>
      <StyledAccordion>
        <div className='Accordion-wrapper'>
            {
                prop.CurriDatas.CatNode.map((catNode: CatNodeData) => {
                    if(typeof catNode.parentsID === 'undefined'){
                        return (
                            <div className="Accordion-item">
                                <CatNodeItem props={catNode}>
                                    <RecursiveElement parentCat={catNode} Element={prop.CurriDatas} />
                                </CatNodeItem>
                            </div>
                        )
                    }
                })
            }
        </div>
      </StyledAccordion>

      <div>
            { prop.children }
      </div>
    </>
  )
}

export default Accordion