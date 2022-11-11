import { IList } from "../types/types"
import List from '../model/listNode.model'

export const fList = async (parent: any) => {
    const list = [] as IList[]
    for(let i=0; i<parent.refList.length; i++){
        const node = await List.findById(parent.refList[i]) as IList
        await list.push(node)
    }

    return list
}