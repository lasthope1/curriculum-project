import mongoose from 'mongoose'
import Cur from '../model/Curriculum.model'
import Cat from '../model/catNode.model'
import { ICurriculum, ICat } from '../types/types'

export const aCur = async (_: any, {id}: ICurriculum) => {
    
    return await Cur.findById(id)
}

export const aCurs = async (_: any) => {
    
    return await Cur.find()
}

export const cAcu = async (_: any, {name, cat, fe, curId}: ICurriculum) => {
    
    const curriculum = new Cur({
        id: new mongoose.Types.ObjectId(),
        name: name,
        cat: cat,
        fe: fe,
        curId: curId
    })

    return await curriculum.save()
}

export const uAcu = async (_: any, {id, name, cat, fe, curId}: ICurriculum) => {
    
    const curriculum = await Cur.findByIdAndUpdate(id, {
        name: name,
        cat: cat,
        fe: fe,
        curId: curId
    }, {new: true})

    return await curriculum?.save()
}

export const acurCat = async (parent: any) => {
    
    const cat = [] as ICat[]
    
    for(let i=0; i<parent.cat.length; i++) {
        const node = await Cat.findById(parent.cat[i]) as ICat
        await cat.push(node)
    }

    return await cat
}

export const acurFe = async (parent: any) => {
    
    const fe = await Cat.findById(parent.fe)

    return await fe
}

