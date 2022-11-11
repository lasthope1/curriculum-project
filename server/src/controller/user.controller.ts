import { compare, createUser, findById, findUser, hashed, userbyId } from "../services/user.service";
import { ICat, IRoot, IUser } from "../types/types";
import { sign } from "jsonwebtoken";
import { ADMIN_TOKEN } from "../constants";
import { UserInputError } from "apollo-server-core";
import { createQ } from "../services/question.service";
import Cat from '../model/catNode.model'
import Cur from '../model/Curriculum.model'
import Course from '../model/Course.model'
import User from '../model/User.model'
import Grade from '../model/userCourse.model'
import Kick from '../model/kickCourse.model'
import Info from '../model/sInfo.model'
import { studentGrade } from "../grade/getGrade"
import { differenceBy } from "lodash"
import { hashId } from "../helper/getData";

export const regiseterUser = async (_: any, {fullname, email, password, role}: IUser) => {
    const user = await findUser(email)
    if(user) {
        return "User exist"
    }

    const hPassword = await hashed(password)

    const newUser = await createUser(fullname, email, hPassword, role)

    // New Question and store questionId in question field of user
    const question = await createQ('what is your Educational plan', ['Normal Educational Plan', 'Cooperative Educational Plan'], 'normal')
    await newUser.updateOne({ question: question.id})
    await newUser.save()
    
    return "Successfully create user"
}

export const login = async (_: any, {email, password}: IUser, {req, res}: any) => {
    const user = await findUser(email)
    if(!user) {
        return "Please Register"
    }
    
    const isValid = await compare(email, password)
    if(!isValid) {
        return " Invalid Credentials"
    }

    const adminToken = sign({ adminId: user.id }, ADMIN_TOKEN, {
        expiresIn: "20min"})

    res.cookie("admin-token", adminToken, {
        expires: new Date(Date.now() + 20 * 60000)
    })

    // const refreshToken = sign({ userId: user.id}, REFRESH_TOKEN, {
    //     expiresIn: "7d"})

     // res.cookie("refresh-token", refreshToken, { 
    //     expires: new Date(Date.now() + 7 * 3600000)
    // })

    return "Login successfully"
}

export const me = async (_: any, ___: any, {req, res}: any) => {
    if(!req.userId) {
        return null
    }

    const user = await findById(req.userId)

    if(user?.role !== 'god') {
        return null
    }

    return user

}

export const testMe = async (_: any, ___: any, {req, res}: any) => {
    console.log(req.firstname_EN)
    return req.firstname_EN
}

export const data = async (_: any, ___: any, {req, res}: any) => {
    
    const user = await User.findById(req.userId) as IUser
    const info = await Info.findOne({ student_id: user.sid})
    
    return await Cur.findOne({ curId: info?.curriculum_id })
}

export const fe = async (_: any, ___: any, {req, res}: any) => {

    const user = await User.findById(req.userId) as IUser
    const info = await Info.findOne({ student_id: user.sid})
    
    const cur = await Cur.findOne({ mid: info?.major_id, curId: info?.curriculum_id })
    const fe = await Cat.findById(cur?.fe)

    return await fe
}

// export const fe = async (_: any, ___: any, {req, res}: any) => {
    
//     const user = await User.findById(req.userId)

//     const fe_course = []

//     const id: string = '610610578'
//     const path: string = `src/grade/${id}.csv`
//     const grade = await studentGrade(path)

    
//     const courses = await Course.find({})
    
//     // const fCourse = await Promise.all(
//     //     grade.map(async (object) => {
//     //         object.COURSENO
//     //         if(courses.indexOf(object.COURSENO) === -1){
//     //             fe_course.push(object)
//     //             await user?.updateOne({ $inc: {fe_credit: object.credit }})
//     //         }
//     //     })
//     // )
 
//     const fCourse = differenceBy(grade, courses, 'COURSENO')
//     console.log(fCourse.length)

//     console.log(fCourse)

//     for(let i=0; i<fCourse.length; i++){
//         let upGrade: number
//         if(!(fCourse[i].GRADE === 'W' || fCourse[i].GRADE === 'P')){
//             if(fCourse[i].GRADE === 'F'){
//                 await user?.updateOne({ $inc: {downgrade: fCourse[i].credit }})
//             }
//             else if(fCourse[i].GRADE === ''){
//                 const cc = new Grade({
//                     COURSENO: fCourse[i].COURSENO,
//                     name: fCourse[i].name,
//                     grade: fCourse[i].GRADE,
//                     credit: fCourse[i].credit,
//                     status: 'learning'
//                 })
//                 fe_course.push(cc)
//             } else if(fCourse[i].GRADE === 'S') {
//                 const cc = new Grade({
//                     COURSENO: fCourse[i].COURSENO,
//                     name: fCourse[i].name,
//                     grade: fCourse[i].GRADE,
//                     credit: fCourse[i].credit,
//                     status: 'completed'
//                 })
//                 await cc.save()
//                 await user?.userCourse.push(cc.id)
//                 await user?.save()
//                 await fe_course.push(cc)
//                 await user?.updateOne({ $inc: {fe_credit: fCourse[i].credit }})
//             }
//             else {
//                     const cc = new Grade({
//                     COURSENO: fCourse[i].COURSENO,
//                     name: fCourse[i].name,
//                     grade: fCourse[i].GRADE,
//                     credit: fCourse[i].credit,
//                     status: 'completed'
//                 })
//                 fe_course.push(cc)
//                 await user?.updateOne({ $inc: {fe_credit: fCourse[i].credit }})
//                 await user?.updateOne({ $inc: {downgrade: fCourse[i].credit }})
//                 if(fCourse[i].GRADE === 'A'){
//                     upGrade = (Number(fCourse[i].credit) * 4)
//                     await user?.updateOne({ $inc: {upgrade: upGrade }})
//                 } else if(fCourse[i].GRADE === 'B+'){
//                     upGrade = (Number(fCourse[i].credit) * 3.5)
//                     await user?.updateOne({ $inc: {upgrade: upGrade }})
//                 } else if(fCourse[i].GRADE === 'B'){
//                     upGrade = (Number(fCourse[i].credit) * 3)
//                     await user?.updateOne({ $inc: {upgrade: upGrade }})
//                 } else if(fCourse[i].GRADE === 'C+'){
//                     upGrade = (Number(fCourse[i].credit) * 2.5)
//                     await user?.updateOne({ $inc: {upgrade: upGrade }})
//                 } else if(fCourse[i].GRADE === 'C'){
//                     upGrade = (Number(fCourse[i].credit) * 2)
//                     await user?.updateOne({ $inc: {upgrade: upGrade }})
//                 } else if(fCourse[i].GRADE === 'D+'){
//                     upGrade = (Number(fCourse[i].credit) * 1.5)
//                     await user?.updateOne({ $inc: {upgrade: upGrade }})
//                 } else if(fCourse[i].GRADE === 'D'){
//                     upGrade = (Number(fCourse[i].credit) * 1)
//                     await user?.updateOne({ $inc: {upgrade: upGrade }})
//                 }
//             }
//         }
//     }

//     const kickCourse = await Kick.find({})

//     for(let i=0; i<kickCourse.length; i++){
//         await fe_course.push(kickCourse[i])
//     }

//     return fe_course
// }

export const gpa = async (_: any, ___: any, {req, res}: any) => {
    const user = await findById(req.userId)
    let gpaRound
    
    if(!user?.fs_credit){
        gpaRound = 0
    }else if(!user.ge_credit){
        const gpa = (((user as any)?.upgrade)/((user as any)?.downgrade))
        gpaRound = Number(gpa).toFixed(2)
    }else if(!user?.fe_credit){
        const gpa = (((user as any)?.upgrade)/((user as any)?.downgrade))
        gpaRound = Number(gpa).toFixed(2)
    }else{
        const gpa = ((((user as any)?.upgrade + (user as any)?.fe_upgrade))/(((user as any)?.downgrade + (user as any)?.fe_downgrade)))
        gpaRound = Number(gpa).toFixed(2)
    }
    
    if(!user?.gpa){
        await user?.updateOne({$set: {gpa: gpaRound}})
    }
     
    const user2 = await User.findById(req.userId)
    return await user2?.gpa
}

export const grad = async (parent: any, _: any, {req, res}: any) => {
    const user = await User.findById(req.userId)

    let c = true as any

    for(let i=0; i<(user as any)?.tree_check.length; i++){
        c = c && (user as any)?.tree_check[i]
        // console.log(c)
    }

    if(c === true){
        if(!user?.isGrad){
            await user?.updateOne({$set: {isGrad: 'true'}})
        }

    } else {
        if(!user?.isGrad){
            await user?.updateOne({$set: {isGrad: 'false'}})
        }
    }

    const user2 = await User.findById(req.userId)
    return await user2?.isGrad
}

export const setField = async (parent: any, _: any, {req, res}: any) => {
    
    const user = await User.findById(req.userId)

    await user?.updateOne({$unset: {__v: 0, userCourse: 0, kickCourse: 0, tree_check: 0}})
    await user?.updateOne({$set: { ge_credit: 0, fs_credit: 0, fe_credit: 0, upgrade: 0, downgrade: 0, fe_upgrade: 0, fe_downgrade: 0 } })

    return await 'set field success'
}

export const root = async (parent: any, _: any, {req, res}: any) => {

    const user = await User.findById(req.userId) as IUser

    const root: IRoot = {ge: user?.ge_credit, fs: user?.fs_credit, fe: user?.fe_credit}

    return root
}