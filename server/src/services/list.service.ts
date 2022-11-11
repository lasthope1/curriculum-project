import mongoose from "mongoose";
import List from  '../model/listNode.model'
import Filter from '../model/Filter.model'
import Course from '../model/Course.model'
import User from '../model/User.model'
import Grade from '../model/userCourse.model'
import Question from '../model/Question.model'
import Kick from '../model/kickCourse.model'
import sGrade from '../model/sGrade.model'
import sCourse from '../model/sCourse.model'
import { ICat, IFilter, IList } from "../types/types";
import { studentGrade } from "../grade/getGrade";
import Cat from '../model/catNode.model'
import Info from '../model/sInfo.model'
import Cur from '../model/Curriculum.model'
import { hashId } from "../helper/getData";
import Course2 from '../model/Course2.model'
import { differenceBy, uniqBy } from "lodash"


export const createList = async(_:any, {name, credit, keep_over_credit, filter, courses}: IList) => {
    const list = new List({
        name: name,
        credit: credit,
        keep_over_credit: keep_over_credit,
        filter: filter,
        courses: courses
    })

    return await list?.save()
}

export const updateList = async (_:any, {id, name, credit, keep_over_credit, filter, courses}: IList) => {
    const list = await List.findByIdAndUpdate(id, {
        name: name,
        credit: credit,
        keep_over_credit: keep_over_credit,
        filter: filter,
        courses: courses
    }, {new: true})

    return await list?.save()
}

export const pushList = async (_: any, {id, pcourses}: any) => {
    const list = await List.findById(id)
    for(let i=0; i<pcourses.length; i++){
        await list?.courses?.push(pcourses[i])
        await list?.save()
    }
 
    return await list
}

export const cloneList = async (_: any, {id, cid}: any) => {
    const oldList = await List.findById(cid)
    const newList = await List.findById(id)

    for(let i=0; i<(oldList as any)?.courses?.length; i++){
        await newList?.courses?.push((oldList as any)?.courses[i])
        await newList?.save()
    }

    return await newList
}

export const addByCouse = async (_: any, {id, name, credit, keep_over_credit, filter, courses}: IList) => {
    const list = new List({
        name: name,
        credit: credit,
        keep_over_credit: keep_over_credit,
        filter: filter
    })

    for(let i=0; i<(courses as any).length; i++){
        const course = await Course.findOne({ COURSENO: (courses as any)[i] })
        await list.courses?.push(course?.id)
    }

    return await list.save()
}   

export const listbyId = async(_: any, {id}: IList) => {

    return await List.findById(id)
}

export const allList = async () => {

    return await List.find()
}

export const filterList = async (parent: any) => {
    return await Filter.findById(parent.filter)
}

export const courses = async (parent: any, _: any, {req, res}: any) => {
    
    const courses = []
    let realCourse = [] 
    // const id: string = '610610578'
    // const path: string = `src/grade/${id}.csv`
    // const grade = await studentGrade(path)

    const user = await User.findById(req.userId)
    const uQuestion = await Question.findById(user?.question)

    const encode_id = await hashId((user as any)?.sid)
    const grade = await sGrade.find({ STUDENT_ID: encode_id })

    const info = await Info.findOne({ student_id: user?.sid })
    const cur = await Cur.findOne({ mid: info?.major_id, curId: info?.curriculum_id })
    
    let newCredit: number = 0

    if(parent.reRef.length < 2) {
        
        const parent_node = await Cat.findById(parent.reRef[0])
        console.log("1", parent_node)
        
        if(parent_node?.root === 'GE') {

            const listCourse = []
            // push listCourse in array
            // check sGrade and listCourse
            // check different and add status

            for(let c = 0; c<parent.courses.length; c++){
                const course = await Course.findById(parent.courses[c])
                const curCourse = await Course2.findOne({ COURSENO: course?.COURSENO, cur: cur?.name })
                if(!curCourse){
                    const newCurCourse = new Course2({
                        COURSENO: course?.COURSENO,
                        name: course?.name,
                        credit: course?.credit,
                        cur: cur?.name
                    })
                    await newCurCourse.save()
                }
                await listCourse.push(course)
            }

            const dCourse = differenceBy(listCourse, grade, 'COURSENO')

            for(let i = 0; i<listCourse.length; i++) {
                let upGrade: number
                // Check grade + course
                for(let j = 0; j<grade.length; j++) {
                    if(grade[j].COURSENO === listCourse[i]?.COURSENO){
                            if(grade[j].GRADE === 'W') {
                                const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
                                await dCourse.push(cc)
                            }else if(grade[j].GRADE === 'F' ){
                                const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
                                await dCourse.push(cc)
                                await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
                            }else if(grade[j].GRADE === '') { 
                                const cc = new Grade({
                                    COURSENO: grade[j].COURSENO,
                                    name: listCourse[i]?.name,
                                    grade: grade[j].GRADE,
                                    credit: listCourse[i]?.credit,
                                    status: 'inprocess'
                                })
                                await cc.save()
                                await user?.userCourse.push(cc.id)
                                await user?.save()
                                await courses.push(cc)
                            }else if(grade[j].GRADE === 'P') { 
                                const cc = new Grade({
                                    COURSENO: grade[j].COURSENO,
                                    name: listCourse[i]?.name,
                                    grade: grade[j].GRADE,
                                    credit: listCourse[i]?.credit,
                                    status: 'inprocess'
                                })
                                await cc.save()
                                await user?.userCourse.push(cc.id)
                                await user?.save()
                                await courses.push(cc)
                            } else if(grade[j].GRADE === 'S') {
                                const cc = new Grade({
                                    COURSENO: grade[j].COURSENO,
                                    name: listCourse[i]?.name,
                                    grade: grade[j].GRADE,
                                    credit: listCourse[i]?.credit,
                                    status: 'completed'
                                })
                                await cc.save()
                                await user?.userCourse.push(cc.id)
                                await user?.save()
                                await courses.push(cc)
                                await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit }})
                                newCredit = newCredit + Number(listCourse[i]?.credit)
                            }else {
                                
                                if(newCredit < parent.credit){

                                    if(grade[j].GRADE === 'A'){
                                        upGrade = (Number(listCourse[i]?.credit) * 4)
                                        // console.log('A')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'B+'){
                                        upGrade = (Number(listCourse[i]?.credit) * 3.5)
                                        // console.log('B+')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'B'){
                                        upGrade = (Number(listCourse[i]?.credit) * 3)
                                        // console.log('B')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'C+'){
                                        upGrade = (Number(listCourse[i]?.credit) * 2.5)
                                        // console.log('C+')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'C'){
                                        upGrade = (Number(listCourse[i]?.credit) * 2)
                                        // console.log('C')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'D+'){
                                        upGrade = (Number(listCourse[i]?.credit) * 1.5)
                                        // console.log('D+')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'D'){
                                        upGrade = (Number(listCourse[i]?.credit) * 1)
                                        // console.log('D')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    }
                                    const cc = new Grade({
                                        COURSENO: grade[j].COURSENO,
                                        name: listCourse[i]?.name,
                                        grade: grade[j].GRADE,
                                        credit: listCourse[i]?.credit,
                                        status: 'completed'
                                    })
                                    await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit}})
                                    await cc.save()
                                    await user?.userCourse.push(cc.id)
                                    await user?.save()
                                    await courses.push(cc)
                                    await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit}})
                                    newCredit = newCredit + Number(listCourse[i]?.credit)
                                } else {

                                    if(parent.keep_over_credit === false){
                                        
                                        if(grade[j].GRADE === 'A'){
                                            upGrade = (Number(listCourse[i]?.credit) * 4)
                                            // console.log('A')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3.5)
                                            // console.log('B+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3)
                                            // console.log('B')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2.5)
                                            // console.log('C+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2)
                                            // console.log('C')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1.5)
                                            // console.log('D+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1)
                                            // console.log('D')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        }
                                        const cc = new Kick({
                                            COURSENO: grade[j].COURSENO,
                                            name: listCourse[i]?.name,
                                            grade: grade[j].GRADE,
                                            credit: listCourse[i]?.credit,
                                            status: 'completed'
                                        })
                                        await cc.save()
                                        await user?.kickCourse.push(cc.id)
                                        await user?.updateOne({ $inc: {fe_credit: listCourse[i]?.credit }})
                                        await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
                                        await user?.save()
                                    } else {
                                        if(grade[j].GRADE === 'A'){
                                            upGrade = (Number(listCourse[i]?.credit) * 4)
                                            // console.log('A')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3.5)
                                            // console.log('B+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3)
                                            // console.log('B')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2.5)
                                            // console.log('C+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2)
                                            // console.log('C')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1.5)
                                            // console.log('D+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1)
                                            // console.log('D')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        }
                                        const cc = new Grade({
                                            COURSENO: grade[j].COURSENO,
                                            name: listCourse[i]?.name,
                                            grade: grade[j].GRADE,
                                            credit: listCourse[i]?.credit,
                                            status: 'completed'
                                        })
                                        await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit }})
                                        await cc.save()
                                        await user?.userCourse.push(cc.id)
                                        await user?.save()
                                        await courses.push(cc)
                                        await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
                                        newCredit = newCredit + Number(listCourse[i]?.credit)
                                    }
                                }
                                
                            }
                        }
                    }
                }
            
            for(let i=0; i<dCourse.length; i++){
                const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
                const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
                const cc = new Grade({
                    COURSENO: dCourse[i]?.COURSENO,
                    name: sC?.title_long_en,
                    grade: sG?.GRADE,
                    credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
                    status: 'pending'
                })
                await courses.push(cc)
            }

            realCourse = uniqBy(courses, 'COURSENO')

        } else {         
            
            const listCourse = []

            for(let c = 0; c<parent.courses.length; c++){
                const course = await Course.findById(parent.courses[c])
                const curCourse = await Course2.findOne({ COURSENO: course?.COURSENO, cur: cur?.name })
                if(!curCourse){
                    const newCurCourse = new Course2({
                        COURSENO: course?.COURSENO,
                        name: course?.name,
                        credit: course?.credit,
                        cur: cur?.name
                    })
                    await newCurCourse.save()
                }
                await listCourse.push(course)
            }

            const dCourse = differenceBy(listCourse, grade, 'COURSENO')

            for(let i = 0; i<listCourse.length; i++) {
                let upGrade: number
                // Check grade + course
                for(let j = 0; j<grade.length; j++) {
                    if(grade[j].COURSENO === listCourse[i]?.COURSENO) {
                            if(grade[j].GRADE === 'W'){
                                const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
                                await dCourse.push(cc)
                            } else if(grade[j].GRADE === 'F' ) {
                                const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
                                await dCourse.push(cc)
                                await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
                            }else if(grade[j].GRADE === '') { 
                                const cc = new Grade({
                                    COURSENO: grade[j].COURSENO,
                                    name: listCourse[i]?.name,
                                    grade: grade[j].GRADE,
                                    credit: listCourse[i]?.credit,
                                    status: 'inprocess'
                                })
                                await cc.save()
                                await user?.userCourse.push(cc.id)
                                await user?.save()
                                await courses.push(cc)
                            }else if(grade[j].GRADE === 'P') { 
                                const cc = new Grade({
                                    COURSENO: grade[j].COURSENO,
                                    name: listCourse[i]?.name,
                                    grade: grade[j].GRADE,
                                    credit: listCourse[i]?.credit,
                                    status: 'inprocess'
                                })
                                await cc.save()
                                await user?.userCourse.push(cc.id)
                                await user?.save()
                                await courses.push(cc)
                            }else if(grade[j].GRADE === 'S') {
                                const cc = new Grade({
                                    COURSENO: grade[j].COURSENO,
                                    name: listCourse[i]?.name,
                                    grade: grade[j].GRADE,
                                    credit: listCourse[i]?.credit,
                                    status: 'completed'
                                })
                                await cc.save()
                                await user?.userCourse.push(cc.id)
                                await user?.save()
                                await courses.push(cc)
                                await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit }})
                                newCredit = newCredit + Number(listCourse[i]?.credit)
                            }else {
                                
                                if(newCredit < parent.credit){

                                    if(grade[j].GRADE === 'A'){
                                        upGrade = (Number(listCourse[i]?.credit) * 4)
                                        // console.log('A')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'B+'){
                                        upGrade = (Number(listCourse[i]?.credit) * 3.5)
                                        // console.log('B+')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'B'){
                                        upGrade = (Number(listCourse[i]?.credit) * 3)
                                        // console.log('B')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'C+'){
                                        upGrade = (Number(listCourse[i]?.credit) * 2.5)
                                        // console.log('C+')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'C'){
                                        upGrade = (Number(listCourse[i]?.credit) * 2)
                                        // console.log('C')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'D+'){
                                        upGrade = (Number(listCourse[i]?.credit) * 1.5)
                                        // console.log('D+')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'D'){
                                        upGrade = (Number(listCourse[i]?.credit) * 1)
                                        // console.log('D')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    }
                                    const cc = new Grade({
                                        COURSENO: grade[j].COURSENO,
                                        name: listCourse[i]?.name,
                                        grade: grade[j].GRADE,
                                        credit: listCourse[i]?.credit,
                                        status: 'completed'
                                    })
                                    await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit}})
                                    await cc.save()
                                    await user?.userCourse.push(cc.id)
                                    await user?.save()
                                    await courses.push(cc)
                                    await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit}})
                                    newCredit = newCredit + Number(listCourse[i]?.credit)
                                } else {

                                    if(parent.keep_over_credit === false){
                                        
                                        if(grade[j].GRADE === 'A'){
                                            upGrade = (Number(listCourse[i]?.credit) * 4)
                                            // console.log('A')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3.5)
                                            // console.log('B+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3)
                                            // console.log('B')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2.5)
                                            // console.log('C+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2)
                                            // console.log('C')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1.5)
                                            // console.log('D+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1)
                                            // console.log('D')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        }
                                        const cc = new Kick({
                                            COURSENO: grade[j].COURSENO,
                                            name: listCourse[i]?.name,
                                            grade: grade[j].GRADE,
                                            credit: listCourse[i]?.credit,
                                            status: 'completed'
                                        })
                                        await cc.save()
                                        await user?.kickCourse.push(cc.id)
                                        await user?.updateOne({ $inc: {fe_credit: listCourse[i]?.credit }})
                                        await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
                                        await user?.save()
                                    } else {
                                        if(grade[j].GRADE === 'A'){
                                            upGrade = (Number(listCourse[i]?.credit) * 4)
                                            // console.log('A')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3.5)
                                            // console.log('B+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3)
                                            // console.log('B')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2.5)
                                            // console.log('C+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2)
                                            // console.log('C')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1.5)
                                            // console.log('D+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1)
                                            // console.log('D')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        }
                                        const cc = new Grade({
                                            COURSENO: grade[j].COURSENO,
                                            name: listCourse[i]?.name,
                                            grade: grade[j].GRADE,
                                            credit: listCourse[i]?.credit,
                                            status: 'completed'
                                        })
                                        await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit }})
                                        await cc.save()
                                        await user?.userCourse.push(cc.id)
                                        await user?.save()
                                        await courses.push(cc)
                                        await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
                                        newCredit = newCredit + Number(listCourse[i]?.credit)
                                    }
                                }
                                
                            }
                    }
                }
            }
        
            for(let i=0; i<dCourse.length; i++){
                const sC = await sCourse.findOne({ courseno:dCourse[i]?.COURSENO })
                const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
                const cc = new Grade({
                    COURSENO: dCourse[i]?.COURSENO,
                    name: sC?.title_long_en,
                    grade: sG?.GRADE,
                    credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
                    status: 'pending'
                })
                await courses.push(cc)
            }

            realCourse = uniqBy(courses, 'COURSENO')
            
        }
    } else {
        let parent_id: any

        for(let i=0; i<parent.reRef.length; i++) {
            const node = await Cat.findById(parent.reRef[i])
            const nFilter = await Filter.findById(node?.filter)
            
            if(nFilter?.activation === uQuestion?.answer){
                parent_id = node?.id
            }
        }

        const parent_node = await Cat.findById(parent_id)
        console.log("2", parent_node)

        if(parent_node?.root === 'GE') {

            const listCourse = []

            for(let c = 0; c<parent.courses.length; c++){
                const course = await Course.findById(parent.courses[c])
                const curCourse = await Course2.findOne({ COURSENO: course?.COURSENO, cur: cur?.name })
                if(!curCourse){
                    const newCurCourse = new Course2({
                        COURSENO: course?.COURSENO,
                        name: course?.name,
                        credit: course?.credit,
                        cur: cur?.name
                    })
                    await newCurCourse.save()
                }
                await listCourse.push(course)
            }
    
            const dCourse = differenceBy(listCourse, grade, 'COURSENO')

            for(let i = 0; i<listCourse.length; i++) {
                let upGrade: number
                // Check grade + course
                for(let j = 0; j<grade.length; j++) {
                    if(grade[j].COURSENO === listCourse[i]?.COURSENO){
                            if(grade[j].GRADE === 'W') {
                                const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
                                await dCourse.push(cc)
                            }
                            if(grade[j].GRADE === 'F' ) {
                                const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
                                await dCourse.push(cc)
                                await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
                            }else if(grade[j].GRADE === '') { 
                                const cc = new Grade({
                                    COURSENO: grade[j].COURSENO,
                                    name: listCourse[i]?.name,
                                    grade: grade[j].GRADE,
                                    credit: listCourse[i]?.credit,
                                    status: 'inprocess'
                                })
                                await cc.save()
                                await user?.userCourse.push(cc.id)
                                await user?.save()
                                await courses.push(cc)
                            }else if(grade[j].GRADE === 'P') { 
                                const cc = new Grade({
                                    COURSENO: grade[j].COURSENO,
                                    name: listCourse[i]?.name,
                                    grade: grade[j].GRADE,
                                    credit: listCourse[i]?.credit,
                                    status: 'inprocess'
                                })
                                await cc.save()
                                await user?.userCourse.push(cc.id)
                                await user?.save()
                                await courses.push(cc)
                            }else if(grade[j].GRADE === 'S') {
                                const cc = new Grade({
                                    COURSENO: grade[j].COURSENO,
                                    name: listCourse[i]?.name,
                                    grade: grade[j].GRADE,
                                    credit: listCourse[i]?.credit,
                                    status: 'completed'
                                })
                                await cc.save()
                                await user?.userCourse.push(cc.id)
                                await user?.save()
                                await courses.push(cc)
                                await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit }})
                                newCredit = newCredit + Number(listCourse[i]?.credit)
                            }else {
                                
                                if(newCredit < parent.credit){

                                    if(grade[j].GRADE === 'A'){
                                        upGrade = (Number(listCourse[i]?.credit) * 4)
                                        // console.log('A')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'B+'){
                                        upGrade = (Number(listCourse[i]?.credit) * 3.5)
                                        // console.log('B+')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'B'){
                                        upGrade = (Number(listCourse[i]?.credit) * 3)
                                        // console.log('B')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'C+'){
                                        upGrade = (Number(listCourse[i]?.credit) * 2.5)
                                        // console.log('C+')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'C'){
                                        upGrade = (Number(listCourse[i]?.credit) * 2)
                                        // console.log('C')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'D+'){
                                        upGrade = (Number(listCourse[i]?.credit) * 1.5)
                                        // console.log('D+')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'D'){
                                        upGrade = (Number(listCourse[i]?.credit) * 1)
                                        // console.log('D')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    }
                                    const cc = new Grade({
                                        COURSENO: grade[j].COURSENO,
                                        name: listCourse[i]?.name,
                                        grade: grade[j].GRADE,
                                        credit: listCourse[i]?.credit,
                                        status: 'completed'
                                    })
                                    await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit}})
                                    await cc.save()
                                    await user?.userCourse.push(cc.id)
                                    await user?.save()
                                    await courses.push(cc)
                                    await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit}})
                                    newCredit = newCredit + Number(listCourse[i]?.credit)
                                } else {

                                    if(parent.keep_over_credit === false){
                                        
                                        if(grade[j].GRADE === 'A'){
                                            upGrade = (Number(listCourse[i]?.credit) * 4)
                                            // console.log('A')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3.5)
                                            // console.log('B+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3)
                                            // console.log('B')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2.5)
                                            // console.log('C+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2)
                                            // console.log('C')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1.5)
                                            // console.log('D+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1)
                                            // console.log('D')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        }
                                        const cc = new Kick({
                                            COURSENO: grade[j].COURSENO,
                                            name: listCourse[i]?.name,
                                            grade: grade[j].GRADE,
                                            credit: listCourse[i]?.credit,
                                            status: 'completed'
                                        })
                                        await cc.save()
                                        await user?.kickCourse.push(cc.id)
                                        await user?.updateOne({ $inc: {fe_credit: listCourse[i]?.credit }})
                                        await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
                                        await user?.save()
                                    } else {
                                        if(grade[j].GRADE === 'A'){
                                            upGrade = (Number(listCourse[i]?.credit) * 4)
                                            // console.log('A')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3.5)
                                            // console.log('B+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3)
                                            // console.log('B')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2.5)
                                            // console.log('C+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2)
                                            // console.log('C')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1.5)
                                            // console.log('D+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1)
                                            // console.log('D')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        }
                                        const cc = new Grade({
                                            COURSENO: grade[j].COURSENO,
                                            name: listCourse[i]?.name,
                                            grade: grade[j].GRADE,
                                            credit: listCourse[i]?.credit,
                                            status: 'completed'
                                        })
                                        await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit }})
                                        await cc.save()
                                        await user?.userCourse.push(cc.id)
                                        await user?.save()
                                        await courses.push(cc)
                                        await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
                                        newCredit = newCredit + Number(listCourse[i]?.credit)
                                    }
                                }
                                
                            }
                    }
                }
            }
            
            for(let i=0; i<dCourse.length; i++){
                const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
                const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
                const cc = new Grade({
                    COURSENO: dCourse[i]?.COURSENO,
                    name: sC?.title_long_en,
                    grade: sG?.GRADE,
                    credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
                    status: 'pending'
                })
                await courses.push(cc)
            }

            realCourse = uniqBy(courses, 'COURSENO')

        } else {
            
            const listCourse = []

            for(let c = 0; c<parent.courses.length; c++){
                const course = await Course.findById(parent.courses[c])
                const curCourse = await Course2.findOne({ COURSENO: course?.COURSENO, cur: cur?.name })
                if(!curCourse){
                    const newCurCourse = new Course2({
                        COURSENO: course?.COURSENO,
                        name: course?.name,
                        credit: course?.credit,
                        cur: cur?.name
                    })
                    await newCurCourse.save()
                }
                await listCourse.push(course)
            }

            const dCourse = differenceBy(listCourse, grade, 'COURSENO')

            for(let i = 0; i<listCourse.length; i++) {
                let upGrade: number
                // Check grade + course
                for(let j = 0; j<grade.length; j++) {
                    if(grade[j].COURSENO === listCourse[i]?.COURSENO) {
                            if(grade[j].GRADE === 'W') {
                                const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
                                await dCourse.push(cc)
                            }else if(grade[j].GRADE === 'F' ) {
                                const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
                                await dCourse.push(cc)
                                await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
                            }else if(grade[j].GRADE === '') { 
                                const cc = new Grade({
                                    COURSENO: grade[j].COURSENO,
                                    name: listCourse[i]?.name,
                                    grade: grade[j].GRADE,
                                    credit: listCourse[i]?.credit,
                                    status: 'inprocess'
                                })
                                await cc.save()
                                await user?.userCourse.push(cc.id)
                                await user?.save()
                                await courses.push(cc)
                            }else if(grade[j].GRADE === 'P') { 
                                const cc = new Grade({
                                    COURSENO: grade[j].COURSENO,
                                    name: listCourse[i]?.name,
                                    grade: grade[j].GRADE,
                                    credit: listCourse[i]?.credit,
                                    status: 'inprocess'
                                })
                                await cc.save()
                                await user?.userCourse.push(cc.id)
                                await user?.save()
                                await courses.push(cc)
                            }else if(grade[j].GRADE === 'S') {
                                const cc = new Grade({
                                    COURSENO: grade[j].COURSENO,
                                    name: listCourse[i]?.name,
                                    grade: grade[j].GRADE,
                                    credit: listCourse[i]?.credit,
                                    status: 'completed'
                                })
                                await cc.save()
                                await user?.userCourse.push(cc.id)
                                await user?.save()
                                await courses.push(cc)
                                await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit }})
                                newCredit = newCredit + Number(listCourse[i]?.credit)
                            }else {
                                
                                if(newCredit < parent.credit){

                                    if(grade[j].GRADE === 'A'){
                                        upGrade = (Number(listCourse[i]?.credit) * 4)
                                        // console.log('A')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'B+'){
                                        upGrade = (Number(listCourse[i]?.credit) * 3.5)
                                        // console.log('B+')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'B'){
                                        upGrade = (Number(listCourse[i]?.credit) * 3)
                                        // console.log('B')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'C+'){
                                        upGrade = (Number(listCourse[i]?.credit) * 2.5)
                                        // console.log('C+')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'C'){
                                        upGrade = (Number(listCourse[i]?.credit) * 2)
                                        // console.log('C')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'D+'){
                                        upGrade = (Number(listCourse[i]?.credit) * 1.5)
                                        // console.log('D+')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    } else if(grade[j].GRADE === 'D'){
                                        upGrade = (Number(listCourse[i]?.credit) * 1)
                                        // console.log('D')
                                        // console.log(course?.name)
                                        // console.log(upGrade)
                                        await user?.updateOne({ $inc: {upgrade: upGrade }})
                                    }
                                    const cc = new Grade({
                                        COURSENO: grade[j].COURSENO,
                                        name: listCourse[i]?.name,
                                        grade: grade[j].GRADE,
                                        credit: listCourse[i]?.credit,
                                        status: 'completed'
                                    })
                                    await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit}})
                                    await cc.save()
                                    await user?.userCourse.push(cc.id)
                                    await user?.save()
                                    await courses.push(cc)
                                    await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit}})
                                    newCredit = newCredit + Number(listCourse[i]?.credit)
                                } else {

                                    if(parent.keep_over_credit === false){
                                        
                                        if(grade[j].GRADE === 'A'){
                                            upGrade = (Number(listCourse[i]?.credit) * 4)
                                            // console.log('A')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3.5)
                                            // console.log('B+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3)
                                            // console.log('B')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2.5)
                                            // console.log('C+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2)
                                            // console.log('C')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1.5)
                                            // console.log('D+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1)
                                            // console.log('D')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        }
                                        const cc = new Kick({
                                            COURSENO: grade[j].COURSENO,
                                            name: listCourse[i]?.name,
                                            grade: grade[j].GRADE,
                                            credit: listCourse[i]?.credit,
                                            status: 'completed'
                                        })
                                        await cc.save()
                                        await user?.kickCourse.push(cc.id)
                                        await user?.updateOne({ $inc: {fe_credit: listCourse[i]?.credit }})
                                        await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
                                        await user?.save()
                                    } else {
                                        if(grade[j].GRADE === 'A'){
                                            upGrade = (Number(listCourse[i]?.credit) * 4)
                                            // console.log('A')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3.5)
                                            // console.log('B+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'B'){
                                            upGrade = (Number(listCourse[i]?.credit) * 3)
                                            // console.log('B')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2.5)
                                            // console.log('C+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'C'){
                                            upGrade = (Number(listCourse[i]?.credit) * 2)
                                            // console.log('C')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D+'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1.5)
                                            // console.log('D+')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        } else if(grade[j].GRADE === 'D'){
                                            upGrade = (Number(listCourse[i]?.credit) * 1)
                                            // console.log('D')
                                            // console.log(course?.name)
                                            // console.log(upGrade)
                                            await user?.updateOne({ $inc: {upgrade: upGrade }})
                                        }
                                        const cc = new Grade({
                                            COURSENO: grade[j].COURSENO,
                                            name: listCourse[i]?.name,
                                            grade: grade[j].GRADE,
                                            credit: listCourse[i]?.credit,
                                            status: 'completed'
                                        })
                                        await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit }})
                                        await cc.save()
                                        await user?.userCourse.push(cc.id)
                                        await user?.save()
                                        await courses.push(cc)
                                        await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
                                        newCredit = newCredit + Number(listCourse[i]?.credit)
                                    }
                                }
                                
                            }
                    }
                }
            }

            for(let i=0; i<dCourse.length; i++){
                const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
                const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
                const cc = new Grade({
                    COURSENO: dCourse[i]?.COURSENO,
                    name: sC?.title_long_en,
                    grade: sG?.GRADE,
                    credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
                    status: 'pending'
                })
                await courses.push(cc)
            }

            realCourse = uniqBy(courses, 'COURSENO')
         
        }
    }

    return realCourse
}

// export const courses = async (parent: any, _: any, {req, res}: any) => {
    
//     const courses = []
    
//     // const id: string = '610610578'
//     // const path: string = `src/grade/${id}.csv`
//     // const grade = await studentGrade(path)

//     const user = await User.findById(req.userId)
//     const uQuestion = await Question.findById(user?.question)

//     const encode_id = await hashId((user as any)?.sid)
//     const grade = await sGrade.find({ STUDENT_ID: encode_id })

//     const info = await Info.findOne({ student_id: user?.sid})
//     const cur = await Cur.findOne({ mid: info?.major_id, curId: info?.curriculum_id })
    
//     let newCredit: number = 0

//     if(parent.reRef.length < 2) {
        
//         const parent_node = await Cat.findById(parent.reRef[0])
//         console.log("1", parent_node)
        
//         if(parent_node?.root === 'GE') {

//             const listCourse = []
//             // push listCourse in array
//             // check sGrade and listCourse
//             // check different and add status

//             for(let c = 0; c<parent.courses.length; c++){
//                 const course = await Course.findById(parent.courses[c])
//                 const curCourse = await Course2.findOne({ COURSENO: course?.COURSENO, cur: cur?.name })
//                 if(!curCourse){
//                     const newCurCourse = new Course2({
//                         COURSENO: course?.COURSENO,
//                         name: course?.name,
//                         credit: course?.credit,
//                         cur: cur?.name
//                     })
//                     await newCurCourse.save()
//                 }
//                 await listCourse.push(course)
//             }

//             for(let i = 0; i<listCourse.length; i++) {
//                 let upGrade: number
//                 // Check grade + course
//                 for(let j = 0; j<grade.length; j++) {
//                     if(grade[j].COURSENO === listCourse[i]?.COURSENO) {
//                         if(!(grade[j].GRADE === 'W')) {
//                             if(grade[j].GRADE === 'F' ) {
//                                 await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                             }else if(grade[j].GRADE === '') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'P') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             } else if(grade[j].GRADE === 'S') {
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'completed'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                                 await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit }})
//                                 newCredit = newCredit + Number(listCourse[i]?.credit)
//                             }else {
                                
//                                 if(newCredit < parent.credit){

//                                     if(grade[j].GRADE === 'A'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 4)
//                                         // console.log('A')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                         // console.log('B+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3)
//                                         // console.log('B')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                         // console.log('C+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2)
//                                         // console.log('C')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                         // console.log('D+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1)
//                                         // console.log('D')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     }
//                                     const cc = new Grade({
//                                         COURSENO: grade[j].COURSENO,
//                                         name: listCourse[i]?.name,
//                                         grade: grade[j].GRADE,
//                                         credit: listCourse[i]?.credit,
//                                         status: 'completed'
//                                     })
//                                     await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit}})
//                                     await cc.save()
//                                     await user?.userCourse.push(cc.id)
//                                     await user?.save()
//                                     await courses.push(cc)
//                                     await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit}})
//                                     newCredit = newCredit + Number(listCourse[i]?.credit)
//                                 } else {

//                                     if(parent.keep_over_credit === false){
                                        
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Kick({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await cc.save()
//                                         await user?.kickCourse.push(cc.id)
//                                         await user?.updateOne({ $inc: {fe_credit: listCourse[i]?.credit }})
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         await user?.save()
//                                     } else {
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Grade({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit }})
//                                         await cc.save()
//                                         await user?.userCourse.push(cc.id)
//                                         await user?.save()
//                                         await courses.push(cc)
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         newCredit = newCredit + Number(listCourse[i]?.credit)
//                                     }
//                                 }
                                
//                             }
//                         }
//                     }
//                 }
//             }

//             const dCourse = differenceBy(listCourse, grade, 'COURSENO')
//             if(parent.type === 'require'){
//                 for(let i=0; i<dCourse.length; i++){
//                     const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
//                     const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
//                     const cc = new Grade({
//                         COURSENO: dCourse[i]?.COURSENO,
//                         name: sC?.title_long_en,
//                         grade: sG?.GRADE,
//                         credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
//                         status: 'pending'
//                     })
//                     await courses.push(cc)
//                 }
//             }else{
//                 for(let i=0; i<dCourse.length; i++){
//                     const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
//                     const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
//                     const cc = new Grade({
//                         COURSENO: dCourse[i]?.COURSENO,
//                         name: sC?.title_long_en,
//                         grade: sG?.GRADE,
//                         credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
//                         status: 'pending'
//                     })
//                     await courses.push(cc)
//                 }
//             }

//         } else {         
            
//             const listCourse = []

//             for(let c = 0; c<parent.courses.length; c++){
//                 const course = await Course.findById(parent.courses[c])
//                 const curCourse = await Course2.findOne({ COURSENO: course?.COURSENO, cur: cur?.name })
//                 if(!curCourse){
//                     const newCurCourse = new Course2({
//                         COURSENO: course?.COURSENO,
//                         name: course?.name,
//                         credit: course?.credit,
//                         cur: cur?.name
//                     })
//                     await newCurCourse.save()
//                 }
//                 await listCourse.push(course)
//             }

//             for(let i = 0; i<listCourse.length; i++) {
//                 let upGrade: number
//                 // Check grade + course
//                 for(let j = 0; j<grade.length; j++) {
//                     if(grade[j].COURSENO === listCourse[i]?.COURSENO) {
//                         if(!(grade[j].GRADE === 'W')) {
//                             if(grade[j].GRADE === 'F' ) {
//                                 await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                             }else if(grade[j].GRADE === '') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'P') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'S') {
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'completed'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                                 await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit }})
//                                 newCredit = newCredit + Number(listCourse[i]?.credit)
//                             }else {
                                
//                                 if(newCredit < parent.credit){

//                                     if(grade[j].GRADE === 'A'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 4)
//                                         // console.log('A')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                         // console.log('B+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3)
//                                         // console.log('B')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                         // console.log('C+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2)
//                                         // console.log('C')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                         // console.log('D+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1)
//                                         // console.log('D')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     }
//                                     const cc = new Grade({
//                                         COURSENO: grade[j].COURSENO,
//                                         name: listCourse[i]?.name,
//                                         grade: grade[j].GRADE,
//                                         credit: listCourse[i]?.credit,
//                                         status: 'completed'
//                                     })
//                                     await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit}})
//                                     await cc.save()
//                                     await user?.userCourse.push(cc.id)
//                                     await user?.save()
//                                     await courses.push(cc)
//                                     await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit}})
//                                     newCredit = newCredit + Number(listCourse[i]?.credit)
//                                 } else {

//                                     if(parent.keep_over_credit === false){
                                        
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Kick({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await cc.save()
//                                         await user?.kickCourse.push(cc.id)
//                                         await user?.updateOne({ $inc: {fe_credit: listCourse[i]?.credit }})
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         await user?.save()
//                                     } else {
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Grade({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit }})
//                                         await cc.save()
//                                         await user?.userCourse.push(cc.id)
//                                         await user?.save()
//                                         await courses.push(cc)
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         newCredit = newCredit + Number(listCourse[i]?.credit)
//                                     }
//                                 }
                                
//                             }
//                         }
//                     }
//                 }
//             }

//             const dCourse = differenceBy(listCourse, grade, 'COURSENO')
//             if(parent.type === 'require'){
//                 for(let i=0; i<dCourse.length; i++){
//                     const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
//                     const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
//                     const cc = new Grade({
//                         COURSENO: dCourse[i]?.COURSENO,
//                         name: sC?.title_long_en,
//                         grade: sG?.GRADE,
//                         credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
//                         status: 'pending'
//                     })
//                     await courses.push(cc)
//                 }
//             }else{
//                 for(let i=0; i<dCourse.length; i++){
//                     const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
//                     const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
//                     const cc = new Grade({
//                         COURSENO: dCourse[i]?.COURSENO,
//                         name: sC?.title_long_en,
//                         grade: sG?.GRADE,
//                         credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
//                         status: 'pending'
//                     })
//                     await courses.push(cc)
//                 }
//             }
//         }
//     } else {
//         let parent_id: any

//         for(let i=0; i<parent.reRef.length; i++) {
//             const node = await Cat.findById(parent.reRef[i])
//             const nFilter = await Filter.findById(node?.filter)
            
//             if(nFilter?.activation === uQuestion?.answer){
//                 parent_id = node?.id
//             }
//         }

//         const parent_node = await Cat.findById(parent_id)
//         console.log("2", parent_node)

//         if(parent_node?.root === 'GE') {

//             const listCourse = []

//             for(let c = 0; c<parent.courses.length; c++){
//                 const course = await Course.findById(parent.courses[c])
//                 const curCourse = await Course2.findOne({ COURSENO: course?.COURSENO, cur: cur?.name })
//                 if(!curCourse){
//                     const newCurCourse = new Course2({
//                         COURSENO: course?.COURSENO,
//                         name: course?.name,
//                         credit: course?.credit,
//                         cur: cur?.name
//                     })
//                     await newCurCourse.save()
//                 }
//                 await listCourse.push(course)
//             }
            
//             for(let i = 0; i<listCourse.length; i++) {
//                 let upGrade: number
//                 // Check grade + course
//                 for(let j = 0; j<grade.length; j++) {
//                     if(grade[j].COURSENO === listCourse[i]?.COURSENO) {
//                         if(!(grade[j].GRADE === 'W')) {
//                             if(grade[j].GRADE === 'F' ) {
//                                 await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                             }else if(grade[j].GRADE === '') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'P') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'S') {
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'completed'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                                 await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit }})
//                                 newCredit = newCredit + Number(listCourse[i]?.credit)
//                             }else {
                                
//                                 if(newCredit < parent.credit){

//                                     if(grade[j].GRADE === 'A'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 4)
//                                         // console.log('A')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                         // console.log('B+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3)
//                                         // console.log('B')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                         // console.log('C+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2)
//                                         // console.log('C')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                         // console.log('D+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1)
//                                         // console.log('D')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     }
//                                     const cc = new Grade({
//                                         COURSENO: grade[j].COURSENO,
//                                         name: listCourse[i]?.name,
//                                         grade: grade[j].GRADE,
//                                         credit: listCourse[i]?.credit,
//                                         status: 'completed'
//                                     })
//                                     await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit}})
//                                     await cc.save()
//                                     await user?.userCourse.push(cc.id)
//                                     await user?.save()
//                                     await courses.push(cc)
//                                     await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit}})
//                                     newCredit = newCredit + Number(listCourse[i]?.credit)
//                                 } else {

//                                     if(parent.keep_over_credit === false){
                                        
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Kick({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await cc.save()
//                                         await user?.kickCourse.push(cc.id)
//                                         await user?.updateOne({ $inc: {fe_credit: listCourse[i]?.credit }})
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         await user?.save()
//                                     } else {
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Grade({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit }})
//                                         await cc.save()
//                                         await user?.userCourse.push(cc.id)
//                                         await user?.save()
//                                         await courses.push(cc)
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         newCredit = newCredit + Number(listCourse[i]?.credit)
//                                     }
//                                 }
                                
//                             }
//                         }
//                     }
//                 }
//             }

//             const dCourse = differenceBy(listCourse, grade, 'COURSENO')
//             if(parent.type === 'require'){
//                 for(let i=0; i<dCourse.length; i++){
//                     const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
//                     const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
//                     const cc = new Grade({
//                         COURSENO: dCourse[i]?.COURSENO,
//                         name: sC?.title_long_en,
//                         grade: sG?.GRADE,
//                         credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
//                         status: 'pending'
//                     })
//                     await courses.push(cc)
//                 }
//             }else{
//                 for(let i=0; i<dCourse.length; i++){
//                     const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
//                     const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
//                     const cc = new Grade({
//                         COURSENO: dCourse[i]?.COURSENO,
//                         name: sC?.title_long_en,
//                         grade: sG?.GRADE,
//                         credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
//                         status: 'pending'
//                     })
//                     await courses.push(cc)
//                 }
//             }

//         } else {
            
//             const listCourse = []

//             for(let c = 0; c<parent.courses.length; c++){
//                 const course = await Course.findById(parent.courses[c])
//                 const curCourse = await Course2.findOne({ COURSENO: course?.COURSENO, cur: cur?.name })
//                 if(!curCourse){
//                     const newCurCourse = new Course2({
//                         COURSENO: course?.COURSENO,
//                         name: course?.name,
//                         credit: course?.credit,
//                         cur: cur?.name
//                     })
//                     await newCurCourse.save()
//                 }
//                 await listCourse.push(course)
//             }

//             for(let i = 0; i<listCourse.length; i++) {
//                 let upGrade: number
//                 // Check grade + course
//                 for(let j = 0; j<grade.length; j++) {
//                     if(grade[j].COURSENO === listCourse[i]?.COURSENO) {
//                         if(!(grade[j].GRADE === 'W')) {
//                             if(grade[j].GRADE === 'F' ) {
//                                 await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                             }else if(grade[j].GRADE === '') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'P') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'S') {
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'completed'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                                 await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit }})
//                                 newCredit = newCredit + Number(listCourse[i]?.credit)
//                             }else {
                                
//                                 if(newCredit < parent.credit){

//                                     if(grade[j].GRADE === 'A'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 4)
//                                         // console.log('A')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                         // console.log('B+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3)
//                                         // console.log('B')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                         // console.log('C+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2)
//                                         // console.log('C')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                         // console.log('D+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1)
//                                         // console.log('D')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     }
//                                     const cc = new Grade({
//                                         COURSENO: grade[j].COURSENO,
//                                         name: listCourse[i]?.name,
//                                         grade: grade[j].GRADE,
//                                         credit: listCourse[i]?.credit,
//                                         status: 'completed'
//                                     })
//                                     await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit}})
//                                     await cc.save()
//                                     await user?.userCourse.push(cc.id)
//                                     await user?.save()
//                                     await courses.push(cc)
//                                     await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit}})
//                                     newCredit = newCredit + Number(listCourse[i]?.credit)
//                                 } else {

//                                     if(parent.keep_over_credit === false){
                                        
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Kick({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await cc.save()
//                                         await user?.kickCourse.push(cc.id)
//                                         await user?.updateOne({ $inc: {fe_credit: listCourse[i]?.credit }})
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         await user?.save()
//                                     } else {
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Grade({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit }})
//                                         await cc.save()
//                                         await user?.userCourse.push(cc.id)
//                                         await user?.save()
//                                         await courses.push(cc)
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         newCredit = newCredit + Number(listCourse[i]?.credit)
//                                     }
//                                 }
                                
//                             }
//                         }
//                     }
//                 }
//             }

//             const dCourse = differenceBy(listCourse, grade, 'COURSENO')
//             if(parent.type === 'require'){
//                 for(let i=0; i<dCourse.length; i++){
//                     const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
//                     const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
//                     const cc = new Grade({
//                         COURSENO: dCourse[i]?.COURSENO,
//                         name: sC?.title_long_en,
//                         grade: sG?.GRADE,
//                         credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
//                         status: 'pending'
//                     })
//                     await courses.push(cc)
//                 }
//             }else{
//                 for(let i=0; i<dCourse.length; i++){
//                     const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
//                     const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
//                     const cc = new Grade({
//                         COURSENO: dCourse[i]?.COURSENO,
//                         name: sC?.title_long_en,
//                         grade: sG?.GRADE,
//                         credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
//                         status: 'pending'
//                     })
//                     await courses.push(cc)
//                 }
//             }

//         }
//     }

//     return courses
// }


export const reRef = async (parent: any) => {
    const node = [] as ICat[]
    
    for(let i=0; i<parent.reRef.length; i++){
        const edon = await Cat.findById(parent.reRef[i]) as ICat
        await node.push(edon)
    }

    return await node
}

export const newCredit = async (parent: any, _: any, {req, res}: any) => {
   
    const user = await User.findById(req.userId)

    let newCredit: number = 0
   
    // const id: string = '610610578'
    // const path: string = `src/grade/${id}.csv`
    // const grade = await studentGrade(path)

    const encode_id = await hashId((user as any)?.sid)
    const grade = await sGrade.find({ STUDENT_ID: encode_id })
   
    for(let i=0; i<parent.courses.length; i++){
        const course = await Course.findById(parent.courses[i])
        for(let j=0; j<grade.length; j++){
            if(grade[j].COURSENO === course?.COURSENO){
                if(!(grade[j].GRADE === 'W' || grade[j].GRADE === 'P' || grade[j].GRADE === 'F' || grade[j].GRADE === '')){
                    if(newCredit < parent.credit){
                            newCredit = newCredit + Number(course?.credit)
                    } else {
                            if(parent.keep_over_credit === true){
                                newCredit = newCredit + Number(course?.credit)
                            }
                    }
                         
                }
            }
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

export const isSuccess = async (parent: any, _: any, {req, res}: any) => {
    
    const user = await User.findById(req.userId)

    let newCredit: number = 0
   
    // const id: string = '610610578'
    // const path: string = `src/grade/${id}.csv`
    // const grade = await studentGrade(path)

    const encode_id = await hashId((user as any)?.sid)
    const grade = await sGrade.find({ STUDENT_ID: encode_id })
   
    for(let i=0; i<parent.courses.length; i++){
        const course = await Course.findById(parent.courses[i])
        for(let j=0; j<grade.length; j++){
            if(grade[j].COURSENO === course?.COURSENO){
                if(!(grade[j].GRADE === 'W' || grade[j].GRADE === 'P' || grade[j].GRADE === 'F' || grade[j].GRADE === '')){
                    if(newCredit < parent.credit){
                            newCredit = newCredit + Number(course?.credit)
                    } else {
                            if(parent.keep_over_credit === true){
                                newCredit = newCredit + Number(course?.credit)
                            }
                    }
                         
                }
            }
        }
   }

//    console.log(newCredit)

   let isSuccess: string
   if(newCredit >= parent.credit){
        isSuccess = 'completed'
   }else{
        isSuccess = 'pending'
   }

   return isSuccess   
}