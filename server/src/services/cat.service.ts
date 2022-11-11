import mongoose from "mongoose";
import User from '../model/User.model'
import Cat from  '../model/catNode.model'
import List from '../model/listNode.model'
import Course from '../model/Course.model'
import Filter from '../model/Filter.model'
import Question from '../model/Question.model'
import Grade from '../model/userCourse.model'
import { ICat, IFilter, ICourse, IUserCourse, IUser } from "../types/types";
import { findById } from "./user.service";

export const createCat = async(_:any, {name, credit, keep_over_credit, refCat, refList, refCourse, filter}: ICat) => {
    const cat = new Cat({
        name: name,
        credit: credit,
        keep_over_credit: keep_over_credit,
        refCat: refCat,
        refList: refList,
        refCourse: refCourse,
        filter: filter
    })

    return await cat?.save()
}

export const catbyId = async(_: any, {id}: ICat) => {

    return await Cat.findById(id)
}

export const allCat = async () => {

    return await Cat.find()
}

export const updateCat = async(_:any, {id, name, credit, keep_over_credit, refCat, refList, refCourse, filter}: ICat)=> {
    const cat = await Cat.findByIdAndUpdate(id, {
        name: name,
        credit: credit,
        keep_over_credit: keep_over_credit,
        refCat: refCat,
        refList: refList,
        refCourse: refCourse,
        filter: filter
    }, {new: true})

    return await cat?.save()
}

// export const addCat = async () => {
//     const cat = []
//     for(let i = 0; i<refCat.length; i++) {
//         await cat.push(await Cat.findById(parent.refCat[i]))
//     }

// }

export const filterCat = async (parent: any) => {
    return await Filter.findById(parent.filter)
}

export const refCat = async (parent: any, _: any, {req, res}: any) => {
    
    const cat = [] as ICat[]

    // Get Question
    const user = await findById(req.userId)
    const question = await Question.findById(user?.question)
    // Add Filter
    for(let i = 0; i<parent.refCat.length; i++) {
        if(parent.refCat.length>1 && !(parent.name == 'Major')){
            const node = await Cat.findById(parent.refCat[i])
            const filter = await Filter.findOne({ question: node?.name})
            //console.log(filter)
            await node?.updateOne({ filter: filter}, {new: true})
            await node?.save()
        }
    }
    // Cutting Data
    for(let i = 0; i<parent.refCat.length; i++) {
        const node = await Cat.findById(parent.refCat[i])
        
        if((node?.filter)){
            const filter = await Filter.findById(node.filter)
            console.log(filter?.activation)
            if(filter?.activation === question?.answer){
                console.log(`${filter?.activation} === ${question?.answer}`)
                // const node = await Cat.findById(parent.refCat[i])
                await cat.push(node as ICat)
            }else{
                console.log(`${filter?.activation} !== ${question?.answer}`)
            }
        }else{
            console.log('no filter')
            const edon = await Cat.findById(parent.refCat[i])
            await cat.push(edon as ICat)
        }

    }

    // const parent_node = await Cat.findById(parent.id)

    // if(parent_node?.root === 'GE'){
    //     await user?.parent_ge.push(parent_node.id)
    //     await user?.save()
    // } else {
    //     await user?.parent_fs.push(parent_node?.id)
    //     await user?.save()
    // }

    return await cat
}

// export const refList = async (parent: any, _: any, {req, res}: any) => {
//     const list = []
    
//     for(let i = 0; i<parent.refList.length; i++) {
//         const listNode = await List.findById(parent.refList[i])
//         if(listNode?.credit === 0){
//             const newCredit = parent.credit
//             const cat = await Cat.findById(parent.id) as any
//             for(let j=0; j<cat?.refList?.length; j++){
//                 const sib = await List.findById(cat.refList[i])
//                 if(!(sib?.id === listNode.id)){
//                     newCredit-(sib as any)?.credit
//                 }
//             }
//             const newList = new List({
//                 name: listNode.name,
//                 credit: newCredit,
//                 keep_over_credit: listNode.keep_over_credit,
//                 courses: listNode.courses,
//                 reRef: listNode.reRef
//             })
//             list.push(newList)
//         } else {
//             list.push(listNode)
//         }
//     }
//     // console.log(list)
//     return list
// }

export const refList = async (parent: any, _: any, {req, res}: any) => {
    const list = []
    
    for(let i = 0; i<parent.refList.length; i++) {
        const listNode = await List.findById(parent.refList[i])
        if(listNode?.cut === 'true'){
            let newCredit = parent.credit
            const cat = await Cat.findById(parent.id) as any
            if(cat?.refList?.length>1){
                const newList = new List({
                    name: listNode.name,
                    credit: listNode.credit,
                    keep_over_credit: listNode.keep_over_credit,
                    courses: listNode.courses,
                    reRef: listNode.reRef,
                    type: listNode.type
                })
                list.push(newList)
            }else{
                const newList = new List({
                    name: listNode.name,
                    credit: newCredit,
                    keep_over_credit: listNode.keep_over_credit,
                    courses: listNode.courses,
                    reRef: listNode.reRef,
                    type: listNode.type
                })
                list.push(newList)
            }
            
            // for(let j=0; j<cat?.refList?.length; j++){
            //     const sib = await List.findById(cat.refList[j])
            //     if(!(sib?.id === listNode.id)){
            //         newCredit = newCredit-(sib as any)?.credit
            //     }
            // }
        } else {
            list.push(listNode)
        }
    }
    // console.log(list)
    return list
}

export const refCourse = async (parent: any) => {
    const course = []

    for(let i = 0; i<parent.refCourse.length; i++) {
        await course.push(await Course.findById(parent.refCourse[i]))
    }
    // console.log(course)
    return course
}

// export const refPath = async (parent: any) => {
//      const path = []

//      for(let i = 0; i<parent.refPath.length; i++) {
//         const cat = await Cat.findById(parent.refPath[i])
//         console.log(cat?.name)
//         path.push(cat?.name)
//      }

//      return path
// }

// export async function getData() {
    
// }

// export const ref = async (parent: any) => {
//     const data: IData = {
//                     refCat: [], 
//                     refList:[], 
//                     refCourse:[]
//                 }


//     for (let i = 0; i<parent.refList.length; i++) {
//         const list = await List.findById(parent.refList[i])
//         await data.refList.push(list as any)
//     }
  
    
//     return data

// }

// export const parent_id = async (parent: any, _: any, {req, res}: any) => {
    
//     const user = await User.findById(req.userId)
//     console.log(user?.email)
//     const cat = await Cat.findById(parent.id)
//     console.log(cat?.name)
    
//     if(cat?.root === 'GE') {
//         await user?.parent_ge.push(parent.id)
//         await user?.save()
        
//         return 'GE'
        
//     } else {
//         await user?.parent_fs.push(parent.id)
//         await user?.save()
        
//         return 'FS'
//     }
// }
