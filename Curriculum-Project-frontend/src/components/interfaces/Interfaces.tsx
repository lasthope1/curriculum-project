
interface Inf_CatNode{
    id: string
    name: string
    refCat: Inf_CatNode[]
    refList: Inf_CourseList[]
    credit: number
}

interface Inf_CourseList{ 
    id: string
    name: string
    courses: Inf_Course[]
    credit: number
    newCredit: number
    type: string
    status?: string
}

interface Inf_Course{
    id: string
    name: string
    COURSENO: string
    credit: number
    grade?: string
    status?: string
}

interface Inf_Filter{
    id: string
    question: Inf_Question
    activation: string[]
}

interface Inf_Question{
    id: string
    question: string
    choices: string[]
    answer: string
}

export type {Inf_CatNode, Inf_CourseList, Inf_Course, Inf_Filter, Inf_Question}

// interface CatNodeData {
//     id: string
//     name: string
//     Catref: (CatNodeData | CourseListData | CourseData) []
//     kind: 'CatNode'
// }

// interface CourseListData {
//     id: string
//     name: string
//     Listref: CourseData[]
//     kind: 'CourseList'
// }

// interface CourseData {
//     id: string
//     name: string
//     kind: 'Course'
// }