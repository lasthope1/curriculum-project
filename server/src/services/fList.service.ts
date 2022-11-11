import { studentGrade } from "../grade/getGrade"
import User from '../model/User.model'
import Course2 from '../model/Course2.model'
import Grade from '../model/userCourse.model'
import Info from '../model/sInfo.model'
import Cur from '../model/Curriculum.model'
import Kick from '../model/kickCourse.model'
import sGrade from '../model/sGrade.model'
import sCourse from '../model/sCourse.model'
import { differenceBy } from "lodash"
import { hashId } from "../helper/getData"

export const fCourse = async (_: any, ___: any, {req, res}: any) => {
    
    const user = await User.findById(req.userId)

    // await user?.updateOne({$set: { fe_upgrade: 0, fe_downgrade: 0 } })

    const fe_course = []

    // const id: string = '610610578'
    // const path: string = `src/grade/${id}.csv`
    // const grade = await studentGrade(path)

    const encode_id = await hashId((user as any)?.sid)
    const grade = await sGrade.find({ STUDENT_ID: encode_id })

    const info = await Info.findOne({ student_id: user?.sid})
    const cur = await Cur.findOne({ mid: info?.major_id, curId: info?.curriculum_id })
    
    const courses = await Course2.find({ cur: cur?.name })
     
    const fCourse = differenceBy(grade, courses, 'COURSENO')
    console.log(fCourse.length)

    console.log(fCourse)

    for(let i=0; i<fCourse.length; i++){
        let upGrade: number
        const course = await sCourse.findOne({ courseno: fCourse[i].COURSENO })
        if(!(fCourse[i].GRADE === 'W' || fCourse[i].GRADE === 'P')){
            if(fCourse[i].GRADE === 'F'){
                await user?.updateOne({ $inc: {fe_downgrade: course?.crelec }})
            }
            else if(!(fCourse[i].GRADE)){
                const cc = new Grade({
                    COURSENO: fCourse[i].COURSENO,
                    name: course?.title_long_en,
                    grade: fCourse[i].GRADE,
                    credit: Number((course as any)?.crelec) + Number((course as any)?.crelab),
                    status: 'inprocess'
                })
                fe_course.push(cc)
            } else if(fCourse[i].GRADE === 'S') {
                const cc = new Grade({
                    COURSENO: fCourse[i].COURSENO,
                    name: course?.title_long_en,
                    grade: fCourse[i].GRADE,
                    credit: course?.crelec,
                    status: 'completed'
                })
                await cc.save()
                await user?.userCourse.push(cc.id)
                await user?.save()
                await fe_course.push(cc)
                await user?.updateOne({ $inc: {fe_credit: course?.crelec }})
            }
            else {
                    const cc = new Grade({
                    COURSENO: fCourse[i].COURSENO,
                    name: course?.title_long_en,
                    grade: fCourse[i].GRADE,
                    credit: course?.crelec,
                    status: 'completed'
                })
                fe_course.push(cc)
                await user?.updateOne({ $inc: {fe_credit: course?.crelec }})
                await user?.updateOne({ $inc: {fe_downgrade: course?.crelec }})
                if(fCourse[i].GRADE === 'A'){
                    upGrade = (Number(course?.crelec) * 4)
                    await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
                } else if(fCourse[i].GRADE === 'B+'){
                    upGrade = (Number(course?.crelec) * 3.5)
                    await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
                } else if(fCourse[i].GRADE === 'B'){
                    upGrade = (Number(course?.crelec) * 3)
                    await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
                } else if(fCourse[i].GRADE === 'C+'){
                    upGrade = (Number(course?.crelec) * 2.5)
                    await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
                } else if(fCourse[i].GRADE === 'C'){
                    upGrade = (Number(course?.crelec) * 2)
                    await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
                } else if(fCourse[i].GRADE === 'D+'){
                    upGrade = (Number(course?.crelec) * 1.5)
                    await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
                } else if(fCourse[i].GRADE === 'D'){
                    upGrade = (Number(course?.crelec) * 1)
                    await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
                }
            }
        }
    }

    const kickCourse = await user?.kickCourse as any

    for(let i=0; i<kickCourse.length; i++){
        const kick = await Kick.findById(kickCourse[i])
        await fe_course.push(kick)
    }

    return fe_course
}

// export const fCourse = async (_: any, ___: any, {req, res}: any) => {
    
//     const user = await User.findById(req.userId)

//     // await user?.updateOne({$set: { fe_upgrade: 0, fe_downgrade: 0 } })

//     const fe_course = []

//     // const id: string = '610610578'
//     // const path: string = `src/grade/${id}.csv`
//     // const grade = await studentGrade(path)

//     const encode_id = await hashId((user as any)?.sid)
//     const grade = await sGrade.find({ STUDENT_ID: encode_id })
    
//     const courses = await Course.find({})
     
//     const fCourse = differenceBy(grade, courses, 'COURSENO')
//     console.log(fCourse.length)

//     console.log(fCourse)

//     for(let i=0; i<fCourse.length; i++){
//         let upGrade: number
//         const course = await sCourse.findOne({ courseno: fCourse[i].COURSENO })
//         if(!(fCourse[i].GRADE === 'W' || fCourse[i].GRADE === 'P')){
//             if(fCourse[i].GRADE === 'F'){
//                 await user?.updateOne({ $inc: {fe_downgrade: Number((course as any)?.crelec) + Number((course as any)?.crelab) }})
//             }
//             else if(!(fCourse[i].GRADE)){
//                 const cc = new Grade({
//                     COURSENO: fCourse[i].COURSENO,
//                     name: course?.title_long_en,
//                     grade: fCourse[i].GRADE,
//                     credit: Number((course as any)?.crelec) + Number((course as any)?.crelab),
//                     status: 'inprocess'
//                 })
//                 fe_course.push(cc)
//             } else if(fCourse[i].GRADE === 'S') {
//                 const cc = new Grade({
//                     COURSENO: fCourse[i].COURSENO,
//                     name: course?.title_long_en,
//                     grade: fCourse[i].GRADE,
//                     credit: Number((course as any)?.crelec) + Number((course as any)?.crelab),
//                     status: 'completed'
//                 })
//                 await cc.save()
//                 await user?.userCourse.push(cc.id)
//                 await user?.save()
//                 await fe_course.push(cc)
//                 await user?.updateOne({ $inc: {fe_credit: Number((course as any)?.crelec) + Number((course as any)?.crelab) }})
//             }
//             else {
//                     const cc = new Grade({
//                     COURSENO: fCourse[i].COURSENO,
//                     name: course?.title_long_en,
//                     grade: fCourse[i].GRADE,
//                     credit: course?.crelec,
//                     status: 'completed'
//                 })
//                 fe_course.push(cc)
//                 await user?.updateOne({ $inc: {fe_credit: Number((course as any)?.crelec) + Number((course as any)?.crelab) }})
//                 await user?.updateOne({ $inc: {fe_downgrade: Number((course as any)?.crelec) + Number((course as any)?.crelab) }})
//                 if(fCourse[i].GRADE === 'A'){
//                     upGrade = (Number((course as any)?.crelec) + Number((course as any)?.crelab) * 4)
//                     await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
//                 } else if(fCourse[i].GRADE === 'B+'){
//                     upGrade = (Number((course as any)?.crelec) + Number((course as any)?.crelab) * 3.5)
//                     await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
//                 } else if(fCourse[i].GRADE === 'B'){
//                     upGrade = (Number((course as any)?.crelec) + Number((course as any)?.crelab) * 3)
//                     await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
//                 } else if(fCourse[i].GRADE === 'C+'){
//                     upGrade = (Number((course as any)?.crelec) + Number((course as any)?.crelab) * 2.5)
//                     await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
//                 } else if(fCourse[i].GRADE === 'C'){
//                     upGrade = (Number((course as any)?.crelec) + Number((course as any)?.crelab) * 2)
//                     await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
//                 } else if(fCourse[i].GRADE === 'D+'){
//                     upGrade = (Number((course as any)?.crelec) + Number((course as any)?.crelab) * 1.5)
//                     await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
//                 } else if(fCourse[i].GRADE === 'D'){
//                     upGrade = (Number((course as any)?.crelec) + Number((course as any)?.crelab) * 1)
//                     await user?.updateOne({ $inc: {fe_upgrade: upGrade }})
//                 }
//             }
//         }
//     }

//     const kickCourse = await user?.kickCourse as any

//     for(let i=0; i<kickCourse.length; i++){
//         const kick = await Kick.findById(kickCourse[i])
//         await fe_course.push(kick)
//     }

//     return fe_course
// }

export const fNewcredit = async (parent: any, ___: any, {req, res}: any) => {
    
    const user = await User.findById(req.userId)

    let newCredit: number = 0

    const fe_course = []

    // const id: string = '610610578'
    // const path: string = `src/grade/${id}.csv`
    // const grade = await studentGrade(path)

    const encode_id = await hashId((user as any)?.sid)
    const grade = await sGrade.find({ STUDENT_ID: encode_id })
    
    const info = await Info.findOne({ student_id: user?.sid})
    const cur = await Cur.findOne({ mid: info?.major_id, curId: info?.curriculum_id })
    
    const courses = await Course2.find({ cur: cur?.name })
    
    const fCourse = differenceBy(grade, courses, 'COURSENO')
    
    const kickCourse = await user?.kickCourse as any

    for(let i=0; i<kickCourse.length; i++){
        const kick = await Kick.findById(kickCourse[i]) as any
        await fCourse.push(kick)
    }

    for(let i=0; i<fCourse.length; i++){
        if(!(fCourse[i].GRADE === 'W' || fCourse[i].GRADE === 'P' || fCourse[i].GRADE === 'F' || fCourse[i].GRADE === '')){
                const course = await sCourse.findOne({ courseno: fCourse[i].COURSENO }) 
                newCredit = newCredit + Number((course as any)?.crelec) + Number((course as any)?.crelab)
        }
    }


    if(newCredit >= parent.credit){
        user?.tree_check.push(true)
        await user?.save()
    }else{
        user?.tree_check.push(false)
        await user?.save()
    }
   

    return newCredit
}


export const fSuccess = async (parent: any, ___: any, {req, res}: any) => {
    
    const user = await User.findById(req.userId)

    let newCredit: number = 0

    const fe_course = []

    // const id: string = '610610578'
    // const path: string = `src/grade/${id}.csv`
    // const grade = await studentGrade(path)

    const encode_id = await hashId((user as any)?.sid)
    const grade = await sGrade.find({ STUDENT_ID: encode_id })
    
    const info = await Info.findOne({ student_id: user?.sid})
    const cur = await Cur.findOne({ mid: info?.major_id, curId: info?.curriculum_id })
    
    const courses = await Course2.find({ cur: cur?.name })
    
    const fCourse = differenceBy(grade, courses, 'COURSENO')
    
    const kickCourse = await user?.kickCourse as any

    for(let i=0; i<kickCourse.length; i++){
        const kick = await Kick.findById(kickCourse[i]) as any
        await fCourse.push(kick)
    }

    for(let i=0; i<fCourse.length; i++){
        if(!(fCourse[i].GRADE === 'W' || fCourse[i].GRADE === 'P' || fCourse[i].GRADE === 'F' || fCourse[i].GRADE === '')){
                const course = await sCourse.findOne({ courseno: fCourse[i].COURSENO }) 
                newCredit = newCredit + Number((course as any)?.crelec) + Number((course as any)?.crelab)
        }
    }

    let isSuccess: string
    if(newCredit >= parent.credit){
         isSuccess = 'completed'
    }else{
         isSuccess = 'pending'
    }

    return isSuccess
}



