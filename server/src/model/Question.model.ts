import mongoose from "mongoose";
import { IQuestion } from '../types/types'

const questionSchema = new mongoose.Schema<IQuestion>({
    question: {type: String, required: true},
    choice: [{type: String, required: true}],
    answer: {type: String, required: true}
})

// export interface IQuestionModel extends IQuestion, mongoose.Document {}

export default mongoose.model<IQuestion>('Question', questionSchema)