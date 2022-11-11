import Course from '../model/Course.model'
import Cat from '../model/catNode.model'
import { ICourse, ICat } from '../types/types'

export const alist = async (parent: any) => {
    const courses = [] as ICourse[]

    for(let i=0; i<parent.courses.length; i++) {
        const course = await Course.findById(parent.courses[i]) as ICourse
        await courses.push(course)
    }

    return await courses
}

export const reRef2 = async (parent: any) => {
    const node = [] as ICat[]
    
    for(let i=0; i<parent.reRef.length; i++){
        const edon = await Cat.findById(parent.reRef[i]) as ICat
        await node.push(edon)
    }

    return await node
}