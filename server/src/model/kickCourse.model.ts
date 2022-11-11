import mongoose  from "mongoose";
import { IKickCourse } from "../types/types";

// export interface IUserModel extends IUser, mongoose.Document {}

const kickSchema = new mongoose.Schema<IKickCourse>({
    COURSENO: {type: String},
    name: {type: String},
    grade: {type: String},
    credit: {type: Number},
    status: {type: String}
})

export default mongoose.model<IKickCourse>('Kick', kickSchema)