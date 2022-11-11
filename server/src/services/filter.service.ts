import mongoose from "mongoose";
import Filter from '../model/Filter.model'
import Question from '../model/Question.model'
import { IFilter } from "../types/types";

export const createFilter = async(_:any, {question, activation}: IFilter) => {
    const filter = new Filter({
        question: question,
        activation: activation
    })

    return await filter?.save()
}

export const filterbyId = async(_: any, {id}: IFilter) => {

    return await Filter.findById(id)
}

export const allFilter = async () => {

    return await Filter.find()
}

// export const question = async(parent: any) => {
//     const question = await Question.findById(parent.question)

//     return await question?.save()
// }
