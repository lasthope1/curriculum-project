import { ADVISOR_TEST_TOKEN } from '../constants'
import Ad from '../model/advisor.model'
import User from '../model/User.model'
import Info from '../model/sInfo.model'
import { createAd, findAd } from '../services/advisor.service'
import { IAdvisor, IInfo, ISInfo, IUser } from '../types/types'
import { sign } from "jsonwebtoken";
import { findById } from '../services/user.service'

export const aRegister = async (_: any, {fullname, email, cmu_name, role}: IAdvisor, {req, res}: any) => {
    const a = await findAd(email)

    if(a){
        return 'User exist'
    }

    const newA = await createAd(fullname, email, cmu_name, role)

    return 'User successfully create'
}

export const aLogin = async (_: any, {email}: IAdvisor, {req, res}: any) => {
    const a = await findAd(email)

    if(!a){
        return 'Please Register'
    }

    const advisorTestToken = sign({ advisorT: a.id }, ADVISOR_TEST_TOKEN, {
        expiresIn: "20min"})

    res.cookie("advisor-test-token", advisorTestToken, {
        expires: new Date(Date.now() + 20 * 60000)
    })

    return 'Login Successfully'
}

export const ad = async (_: any, ___: any, {req, res}: any) => {
    if(!req.advisorId){
        return null
    }

    const a = await Ad.findById(req.advisorId)

    return await a
}

export const stu = async (_: any, ___: any, {req, res}: any) => {
    
    const a = await Ad.findById(req.advisorId)
    const advisie = await Info.find({adviser_cmu_account: a?.cmu_name})

    return await advisie
}

export const gradeStatus = async (parent: any, ___: any, {req, res}: any) => {

    const user = await User.findOne({ sid: parent.student_id })

    if(user?.isGrad){
        if(user.isGrad === 'true'){
             return 'Graduated'
        } else{
            return 'Not Graduated'
        }
    } else{
        return 'Processing'
    }
}