import mongoose from "mongoose";
import { IFaculty } from "../types/types";

const facultySchema = new mongoose.Schema<IFaculty>({
    fid: {type: String, required: true},
    name: {type: String, required: true},
    major: [{type: mongoose.Types.ObjectId, ref: 'Major'}]
})

export default mongoose.model<IFaculty>('Fac', facultySchema)