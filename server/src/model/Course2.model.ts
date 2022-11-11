import mongoose from "mongoose";
import { ICourse2 } from "../types/types";

const course2Schema = new mongoose.Schema<ICourse2>({
    COURSENO: {type: String, required: true},
    name: {type: String, required: true},
    credit: {type: Number, required: true},
    cur: {type: String, required: true}
})

// export interface ICourseModel extends ICourse, mongoose.Document {}

export default mongoose.model<ICourse2>('Course2', course2Schema)