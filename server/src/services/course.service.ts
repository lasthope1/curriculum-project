import mongoose from "mongoose";
import Course from '../model/Course.model'
import { ICourse } from "../types/types";

export const createCourse = async (_: any, {COURSENO, name, credit}: ICourse) => {
    const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        COURSENO: COURSENO,
        name: name,
        credit: credit
    })

    return await course.save()
}

export const coursebyId = async (_: any, {id}: ICourse) => {

    return await Course.findById(id)
}

export const allCourse = async () => {
    
    return await Course.find()
}

export const updateCourse = async (_: any, {id, COURSENO, name, credit}: ICourse ) => {
    const course = await Course.findByIdAndUpdate(id, {
        COURSENO: COURSENO,
        name: name,
        credit: credit
    }, {new: true})

    return await course?.save()
}

export const deleteCourse = async (_: any, {id}: ICourse) => {
    const course = await Course.findByIdAndDelete(id)

    return "Delete"
}