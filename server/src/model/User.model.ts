import mongoose  from "mongoose";
import { IUser } from "../types/types";

// export interface IUserModel extends IUser, mongoose.Document {}

const userSchema = new mongoose.Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    question: {type: mongoose.Types.ObjectId, ref: 'Question'},
    userCourse: [{type: mongoose.Types.ObjectId, ref: 'Grade'}],
    kickCourse: [{type: mongoose.Types.ObjectId, ref: 'Kick'}],
    ge_credit: {type: Number},
    fs_credit: {type: Number},
    fe_credit: {type: Number},
    // parent_ge: [String],
    // parent_fs: [String],
    sid: {type: String, required: true},
    fid: {type: String, required: true},
    upgrade: {type: Number},
    downgrade: {type: Number},
    tree_check: {type: [Boolean]},
    fe_upgrade: {type: Number},
    fe_downgrade: {type: Number},
    gpa: {type: String},
    isGrad: {type: String}
})

export default mongoose.model<IUser>('User', userSchema)