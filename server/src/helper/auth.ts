import { CMU_AUTH_URL } from "../constants"
import axios from "axios"
import qs from 'qs'

export const getToken = async (code: string) => {
    
    const data: any = qs.stringify({
        "code": code,
        "redirect_uri": "https://curriculum-backend.onrender.com/auth/cmu/callback",
        "client_id": "YTpe2WucpMBnE0XScC770EA4WzZVFUh6Hsbt7G4V",
        "client_secret": "vAaGbFcQzURyhwjttvvD7JGFDFQnZEVFJpPAE43r",
        "grant_type": "authorization_code"
    })

    let config: any = {
        method: 'post',
        url: 'https://oauth.cmu.ac.th/v1/GetToken.aspx',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    }
    const response = await axios(config)
    return response.data
}

export const getData = async (token: string) => {
   
    let config: any = {
        method: 'get',
        url: 'https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    const response = await axios(config)
    return response.data
}