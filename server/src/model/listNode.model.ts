import mongoose from "mongoose";
import { IList } from "../types/types";

const listSchema = new mongoose.Schema<IList>({
    name: {type: String, required: true},
    credit: {type: Number, required: true},
    keep_over_credit: {type: Boolean, required: true},
    filter: {type: mongoose.Types.ObjectId, ref: 'Filter'},
    courses: [{type: mongoose.Types.ObjectId, ref: 'Course'}],
    reRef: [{type: mongoose.Types.ObjectId, ref: 'Cat'}],
    type: {type: String},
    cut: {type: String}
})

// export interface IListModel extends IList, mongoose.Document {}

export default mongoose.model<IList>('List', listSchema)