import mongoose from "mongoose";
import { IAdvisor } from "../types/types";

const advisorSchema = new mongoose.Schema<IAdvisor>({
    fullname: {type: String, required: true},
    email: {type: String, required: true},
    cmu_name: {type: String, required: true},
    role: {type: String, required: true},
})

export default mongoose.model<IAdvisor>('Ad', advisorSchema)