import Cat from '../model/catNode.model'
import List from '../model/listNode.model'
import { ICat } from '../types/types'

export const ucatbyID = async(_: any, {id}: ICat) => {

    return await Cat.findById(id)
}

export const urefCat = async (parent: any) => {
    
    const cat = [] as ICat[]

    for(let i=0; i<parent.refCat.length; i++){
        const node = await Cat.findById(parent.refCat[i])
        await cat.push(node as ICat)
    }

    return cat
}

export const urefList = async (parent: any) => {
    const list = []

    for(let i = 0; i<parent.refList.length; i++) {
        await list.push(await List.findById(parent.refList[i]))
    }
    // console.log(list)
    return list
}