import mongoose from "mongoose";
import { IFilter } from "../types/types";

const filterSchema = new mongoose.Schema<IFilter>({
    question: {type: String, required: true},
    activation: {type: String, required: true}
})

// export interface IFilterModel extends IFilter, mongoose.Document {}

export default mongoose.model<IFilter>('Filter', filterSchema)