import mongoose from 'mongoose'
import Maj from '../model/Major.model'
import Cur from '../model/Curriculum.model'
import { ICurriculum, IMajor } from '../types/types'

export const ma = async (_: any, {id}: IMajor) => {
    
    return await Maj.findById(id)
}

export const mas = async (_: any) => {
    
    return await Maj.find()
}

export const cMa = async (_: any, {mid, fid, name, curriculum}: IMajor) => {
    
    const major = new Maj({
        id: new mongoose.Types.ObjectId(),
        mid: mid,
        fid: fid,
        name: name,
        curriculum: curriculum
    })

    return await major.save()
}

export const uMa = async (_: any, {id, mid, fid, name, curriculum}: IMajor) => {
    
    const major = await Maj.findByIdAndUpdate(id, {
        mid: mid,
        fid: fid,
        name: name,
        curriculum: curriculum
    }, {new: true})

    return await major?.save()
}

export const curriculum = async (parent: any) => {
    
    const curriculum = [] as ICurriculum[]
    
    for(let i=0; i<parent.curriculum.length; i++) {
        const node = await Cur.findById(parent.curriculum[i]) as ICurriculum
        await curriculum.push(node)
    }

    return await curriculum
}