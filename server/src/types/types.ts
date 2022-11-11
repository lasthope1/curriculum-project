import { Types } from "mongoose"
export interface ICourse {
    id: Types.ObjectId,
    COURSENO: string,
    name: string,
    credit: number
}

export interface ICourse2 {
    id: Types.ObjectId,
    COURSENO: string,
    name: string,
    credit: number,
    cur: string
}

export interface IUserCourse {
    id: Types.ObjectId,
    COURSENO: string,
    name: string,
    grade: string,
    credit: number,
    status: string
}

export interface IKickCourse {
    id: Types.ObjectId,
    COURSENO: string,
    name: string,
    grade: string,
    credit: number,
    status: string
}

export interface IList {
    id: Types.ObjectId,
    name: string,
    credit: number,
    keep_over_credit: boolean,
    filter?: Types.ObjectId,
    courses?: Types.ObjectId[],
    reRef?: Types.ObjectId[],
    type: string,
    cut: string
}

export interface ICat {
    id: Types.ObjectId,
    name: string,
    credit: number,
    keep_over_credit: boolean,
    filter?: Types.ObjectId,
    refCat?: Types.ObjectId[],
    refList?: Types.ObjectId[],
    refCourse?: Types.ObjectId[],
    root: string
}

export interface IFilter {
    id: Types.ObjectId,
    question: string,
    activation: string
}

export interface IQuestion {
    id: Types.ObjectId,
    question: string,
    choice: string[],
    answer: string
}

export interface IUser {
    id: Types.ObjectId,
    fullname: string,
    email: string,
    password: string,
    role: string,
    question?: Types.ObjectId,
    userCourse: Types.ObjectId[],
    kickCourse: Types.ObjectId[],
    ge_credit: number,
    fs_credit: number,
    fe_credit: number,
    sid: string, 
    fid: string,
    upgrade: number,
    downgrade: number,
    tree_check: boolean[],
    fe_upgrade: number,
    fe_downgrade: number,
    gpa: string,
    isGrad: string
}

export interface IAdvisor {
    id: Types.ObjectId,
    fullname: string,
    email: string,
    cmu_name: string,
    role: string
}

// export interface IData {
//     refCat: ICat[],,
//     refList: IList[],
//     refCourse: ICourse[]
// }
export interface IFaculty {
    id: Types.ObjectId,
    fid: string,
    name: string,
    major: Types.ObjectId[]
}

export interface IMajor {
    id: Types.ObjectId,
    mid: string,
    fid: string,
    name: string,
    curriculum: Types.ObjectId[]
}

export interface ICurriculum {
    id: Types.ObjectId,
    mid: string,
    curId: string,
    name: string,
    cat: Types.ObjectId[],
    fe?: Types.ObjectId
}

export interface IInfo {
    id: Types.ObjectId,
    student_id: string,
    major_id: string,
    curriculum_id: string,
    major_name_th: string,
    semester_admit: string,
    year_admit: string,
    study_time_id: string,
    adviser_id: string,
    adviser_name: string,
    adviser_cmu_account: string
}

export interface ISInfo {
    id: Types.ObjectId,
    student_id: string,
    major_id: string,
    curriculum_id: string,
    major_name_th: string,
    semester_admit: string,
    year_admit: string,
    study_time_id: string,
    adviser_id: string,
    adviser_name: string,
    adviser_cmu_account: string,
    grade_status?: String
}

export interface IsGrade {
    id: Types.ObjectId,
    STUDENT_ID: string,
    YEAR: string,
    SEMESTER: string,
    COURSENO: string,
    GRADE: string
}

export interface IsCourse {
    id: Types.ObjectId,
    courseno: string,
    courseno_en: string,
    title_long_en: string,
    crelec: string,
    crelab: string
}

export interface IRoot {
    ge: number,
    fs: number,
    fe: number
}