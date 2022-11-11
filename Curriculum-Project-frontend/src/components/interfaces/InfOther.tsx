import {Inf_Question, Inf_CatNode, Inf_CourseList, Inf_Course} from '../interfaces/Interfaces' ;

interface IAdviseeData {
    id: string
    student_id: string
    major_id: string
    curriculum_id: string
    year_admit: string
    adviser_id?: string
    grade_status?: string
}
interface IAdviserData {
    id: string
    fullname: string
    stu: IAdviseeData[]
}

interface Inf_FacultyData {
    id: string
    name: string
    MajorList: Array<Inf_MajorData> // it's the same --> MajorData[] <--
}

interface Inf_MajorData {
    id: string
    name: string
}

interface Inf_CurriData {
    id: string
    name: string
    cat: Array<Inf_CatNode>
    // refList?: Array<Inf_CourseList>
    // refCourse?: Array<Inf_Course>
}

interface Inf_User {
    id: string
    fullname: string
    question: Inf_Question
    data: {
        id: string
        name: string
    }
    gpa?: number
    isGrad?: boolean
}

export type {IAdviserData, IAdviseeData, Inf_FacultyData, Inf_MajorData, Inf_User, Inf_CurriData}