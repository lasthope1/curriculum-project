import mongoose from "mongoose";
import { IMajor } from "../types/types";

const majorSchema = new mongoose.Schema({
    mid: {type: String, required: true},
    fid: {type: String, required: true},
    name: {type: String, required: true},
    curriculum: [{type: mongoose.Types.ObjectId, ref: 'Curriculum'}]
})

export default mongoose.model<IMajor>('Maj', majorSchema)