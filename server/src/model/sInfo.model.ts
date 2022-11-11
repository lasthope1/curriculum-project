import mongoose from "mongoose";
import { IInfo } from "../types/types";

const studentInfo = new mongoose.Schema<IInfo>({
    student_id: {type: String, required: true},
    major_id: {type: String, required: true},
    curriculum_id: {type: String, required: true},
    major_name_th: {type: String, required: true},
    semester_admit: {type: String, required: true},
    year_admit: {type: String, required: true},
    study_time_id: {type: String, required: true},
    adviser_id: {type: String, required: true},
    adviser_name: {type: String, required: true},
    adviser_cmu_account: {type: String, required: true}

},{collection: 'studentInfo'})

export default mongoose.model<IInfo>('Info', studentInfo)