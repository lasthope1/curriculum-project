import mongoose  from "mongoose";
import { IUserCourse } from "../types/types";

// export interface IUserModel extends IUser, mongoose.Document {}

const gradeSchema = new mongoose.Schema<IUserCourse>({
    COURSENO: {type: String},
    name: {type: String},
    grade: {type: String},
    credit: {type: Number},
    status: {type: String}
})

export default mongoose.model<IUserCourse>('Grade', gradeSchema)