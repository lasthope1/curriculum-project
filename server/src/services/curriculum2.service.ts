import mongoose from 'mongoose'
import Cur from '../model/Curriculum.model'
import Cat from '../model/catNode.model'
import User from '../model/User.model'
import { ICat, ICurriculum } from '../types/types'

export const uCur = async (_: any, {id}: ICurriculum) => {
        
    return await Cur.findById(id)
}

export const uCurs = async (_: any) => {
    
    return await Cur.find()
}

export const cUcu = async (_: any, {name, cat}: ICurriculum) => {
    
    const curriculum = new Cur({
        id: new mongoose.Types.ObjectId(),
        name: name,
        cat: cat
    })

    return await curriculum.save()
}

export const uUcu = async (_: any, {id, name, cat}: ICurriculum) => {
    
    const curriculum = await Cur.findByIdAndUpdate(id, {
        name: name,
        cat: cat
    }, {new: true})

    return await curriculum?.save()
}

export const ucurCat = async (parent: any) => {
    
    const cat = [] as ICat[]
    
    for(let i=0; i<parent.cat.length; i++) {
        const node = await Cat.findById(parent.cat[i]) as ICat
        await cat.push(node)
    }

    return await cat
}
