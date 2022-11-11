import mongoose from 'mongoose'
import Ad from '../model/advisor.model'
import { IAdvisor } from '../types/types'

export const createAd = async (fullname: string, email: string, cmu_name: string, role: string) => {
    const user = new Ad({
        id: new mongoose.Types.ObjectId(),
        fullname: fullname,
        email: email,
        cmu_name: cmu_name,
        role: role
    })

    return await user.save()
}

export const createAdOauth = async (fullname: string, email: string, cmu_name: string, role: string) => {
    const user = new Ad({
        id: new mongoose.Types.ObjectId(),
        fullname: fullname,
        email: email,
        cmu_name: cmu_name,
        role: role
    })

    return await user.save()
}

export const findAd = async (email: string) => {
    const user = await Ad.findOne({email: email})

    return await user
}