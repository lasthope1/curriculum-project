import mongoose from "mongoose";
import { IsCourse } from "../types/types";

const scSchema = new mongoose.Schema<IsCourse>({
    courseno: {type: String, required: true},
    courseno_en: {type: String, required: true},
    title_long_en: {type: String, required: true},
    crelec: {type: String, required: true},
    crelab: {type: String, required: true}
},{collection: 'src_courses'})

export default mongoose.model('sCourse', scSchema)