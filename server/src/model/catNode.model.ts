import mongoose from "mongoose";
import { ICat } from '../types/types'

const catSchema = new mongoose.Schema<ICat>({
    name: {type: String, required: true},
    credit: {type: Number, required: true},
    keep_over_credit: {type: Boolean, required: true},
    filter: {type: mongoose.Types.ObjectId, ref: 'Filter'},
    refCat: [{type: mongoose.Types.ObjectId, ref: 'Cat'}],
    refList: [{type: mongoose.Types.ObjectId, ref: 'List'}],
    refCourse: [{type: mongoose.Types.ObjectId, ref: 'Course'}],
    root: {type: String}
})

// export interface ICatModel extends ICat, mongoose.Document {}

export default mongoose.model<ICat>('Cat', catSchema)