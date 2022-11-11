import mongoose from 'mongoose'
import Fac from '../model/Faculty.model'
import Maj from '../model/Major.model'
import { IFaculty, IMajor } from '../types/types'

export const fa = async (_: any, {id}: IFaculty) => {
    
    return await Fac.findById(id)
}

export const fas = async (_: any) => {
    
    return await Fac.find()
}

export const cFa = async (_: any, { fid, name, major}: IFaculty) => {
    
    const faculty = new Fac({
        id: new mongoose.Types.ObjectId(),
        fid: fid,
        name: name,
        major: major
    })

    return await faculty.save()
}

export const uFa = async (_: any, {id, fid, name, major}: IFaculty) => {
    
    const faculty = await Fac.findByIdAndUpdate(id, {
        fid: fid,
        name: name,
        major: major
    }, {new: true})

    return await faculty?.save()
}

export const major = async (parent: any) => {
    const major = [] as IMajor[]
    
    for(let i=0; i<parent.major.length; i++) {
        const node = await Maj.findById(parent.major[i]) as IMajor
        await major.push(node)
    }

    return await major
}