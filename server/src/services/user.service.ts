import mongoose from "mongoose";
import User from '../model/User.model'
import bcrypt from 'bcrypt'
import { IUser } from "../types/types";

export const createUser = async (fullname: string, email: string, password: string, role: string) => {
    const user = new User({
        fullname: fullname,
        email: email,
        password: password,
        role: role
    })

    return await user.save()
}

export const createUserOauth = async (fullname: string, email: string, password: string, role: string, sid: string, fid: string) => {
    const user = new User({
        fullname: fullname,
        email: email,
        password: password,
        role: role,
        sid: sid,
        fid: fid
    })

    return await user.save()
}

export const findUser = async (email: string) => {
    const user = await User.findOne({email: email})

    return await user
}

export const findById = async (id: string) => {

    return await User.findById(id)
}

export const hashed = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10) 

    return hashedPassword
}

export const compare = async (email: string, password: string) => {
    const user = await User.findOne({email: email})

    return bcrypt.compare(password, user?.password as any)
}

export const userbyId = async (_: any, {id}: any) => {
    
    return await User.findById(id)
}

export const allUser = async () => {

    return await User.find()
}

