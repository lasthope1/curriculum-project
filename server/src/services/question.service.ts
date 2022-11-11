import mongoose from "mongoose";
import Question from '../model/Question.model'
import { IQuestion } from "../types/types";

export const createQuestion = async(_:any, {question, choice, answer}: IQuestion) => {
    const ques = new Question({
        question: question,
        choice: choice,
        answer: answer
    })
    
    return await ques?.save()
}

export const questionbyId = async(_: any, {id}: IQuestion) => {

    return await Question.findById(id)
}

export const allQuestion = async () => {

    return await Question.find()
}

export const createQ = async(question: string, choice: string[], answer: string) => {
    const ques = new Question({
        question: question,
        choice: choice,
        answer: answer
    })

    return await ques.save()
}

export const updateQuestion = async (_: any, {id, question, choice, answer}: IQuestion) => {
    const ques = await Question.findByIdAndUpdate(id, {
        question: question,
        choice: choice,
        answer: answer
    }, {new: true})

   return await ques
}

export const question = async (parent: any) => {
    
   return await Question.findById(parent.question)
}
