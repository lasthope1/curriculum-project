import mongoose from "mongoose";
import { ICurriculum } from "../types/types";

const curriculumSchema = new mongoose.Schema<ICurriculum>({
    mid: {type: String, required: true},
    curId: {type: String, required: true},
    name: {type: String, required: true},
    cat: [{type: mongoose.Types.ObjectId, ref: 'Cat'}],
    fe:{type: mongoose.Types.ObjectId, ref: 'Cat'}
})

export default mongoose.model<ICurriculum>('Cur', curriculumSchema)

