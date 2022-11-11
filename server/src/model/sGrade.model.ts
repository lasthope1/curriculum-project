import mongoose from "mongoose";
import { IsGrade } from "../types/types";

const sgSchema = new mongoose.Schema<IsGrade>({
    STUDENT_ID: {type: String, required: true},
    YEAR: {type: String, required: true},
    SEMESTER: {type: String, required: true},
    COURSENO: {type: String, required: true},
    GRADE: {type: String, required: true},
},{collection: 'sourceGrade'})

export default mongoose.model<IsGrade>('sGrade', sgSchema)
