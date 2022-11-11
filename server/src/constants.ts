import dotenv from 'dotenv'
dotenv.config()

export const ADMIN_TOKEN = 'ngrligrogrogmriogrng'
export const USER_TOKEN = 'flkgndlkgwdfml;e'
export const ADVISOR_TOKEN = 'klcndbfudjhvkdfkuegfyeghfukhejfje'
export const ADVISOR_TEST_TOKEN = 'ndjfkheiofjoidkfl;la;vdjkvb'
export const CMU_AUTH_URL=`https://oauth.cmu.ac.th/v1/Authorize.aspx?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.CALLBACK_URL}&scope=cmuitaccount.basicinfo&state=xyz`
export const CMU_DATA_URL="https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo"
export const PORT = process.env.PORT || 3000