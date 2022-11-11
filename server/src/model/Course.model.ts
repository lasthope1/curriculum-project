import mongoose from "mongoose";
import { ICourse } from "../types/types";

const courseSchema = new mongoose.Schema<ICourse>({
    COURSENO: {type: String, required: true},
    name: {type: String, required: true},
    credit: {type: Number, required: true},
})

// export interface ICourseModel extends ICourse, mongoose.Document {}

export default mongoose.model<ICourse>('Course', courseSchema)