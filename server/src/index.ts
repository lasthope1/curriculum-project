import mongoose from "mongoose";
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault, UserInputError } from "apollo-server-core";
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache'
import depthLimit from 'graphql-depth-limit'
import express, {Request, Response, NextFunction} from 'express'
import { createServer} from "http";
import schema from './graphql/schema'
import cookieParser from 'cookie-parser'
import { verify } from "jsonwebtoken";
import { ADMIN_TOKEN, ADVISOR_TEST_TOKEN, ADVISOR_TOKEN, CMU_AUTH_URL, PORT, USER_TOKEN } from "./constants";
import cors from 'cors'
import { getData, getToken } from './helper/auth';
import { sign } from "jsonwebtoken"
import { studentGrade } from './grade/getGrade'
import { createUserOauth, findById, findUser } from './services/user.service';
import { createQ } from './services/question.service';
import Info from './model/sInfo.model'
import { hashId } from './helper/getData';
import { createAdOauth, findAd } from './services/advisor.service';

mongoose.connect('mongodb+srv://superuser:tHd3hGis5LAA3Yge@cluster0.gxnkxvr.mongodb.net/project?retryWrites=true&w=majority')
        .then(() => {
            console.log("DB CONNECTED")
            startServer()
        })

const startServer = async() => {
    
    const app = express()

    app.use(cookieParser())

    app.use((req: Request, res: Response, next: NextFunction) => {
         
        // const userToken = req.headers['user-token'] as string
        
        const userToken = req.cookies['user-token']
        const adminToken = req.cookies['admin-token']
        const advisorToken = req.cookies['advisor-token']
        const advisorTestToken = req.cookies['advisor-test-token']
        try {
            // const adminData = verify(adminToken, ADMIN_TOKEN) as any
            // (req as any).adminId = adminData.adminId
            // (req as any).userRole = data.userRole
            const userData = verify(userToken, USER_TOKEN) as any
            (req as any).userId = userData.userId
        } catch{}

        try {
            const adminData = verify(adminToken, ADMIN_TOKEN) as any
            (req as any).adminId = adminData.adminId
            // (req as any).userRole = data.userRole
        } catch{}

        try {
            const advisorData = verify(advisorToken, ADVISOR_TOKEN) as any
            (req as any).advisorId = advisorData.advisorId
        } catch{}

        try {
            const advisorTestData = verify(advisorTestToken, ADVISOR_TEST_TOKEN) as any
            (req as any).advisorTestId = advisorTestData.advisorT
        } catch{}

        next()
    })

    app.get('/', (req: Request, res: Response) => {
        res.send('<a href="/auth/cmu">Authenticate with CMU</a>')
    })

    app.get('/auth/cmu', async (req: Request, res: Response) => {
        try {
            res.redirect(CMU_AUTH_URL);
        } catch (error: any) {
            res.sendStatus (500);
            console.log (error.message);
        }
    });

    app.get('/auth/cmu/callback', async(req: Request, res: Response) => {
        
        try {
            
            const code = req.query.code as string
            const token = await getToken(code)
            const data = await getData(token.access_token) 
            
            if(data.organization_code === '06'){

                // check advisor or student or admin

                if(data.itaccounttype_id === 'StdAcc'){

                    const info = await Info.findOne({ student_id: data.student_id})
                    // console.log(info)

                    if(info?.major_id === '08' || info?.major_id === '10'){

                        const user = await findUser(data.cmuitaccount)

                        if(!user){
                            const newUser = await createUserOauth(data.firstname_EN, data.cmuitaccount, 'noPassword', 'god', data.student_id, data.organization_code)

                            const question = await createQ('what is your Educational plan', ['Normal Educational Plan', 'Cooperative Educational Plan'], 'normal')
                            await newUser.updateOne({ question: question.id })
                            await newUser.save()

                            const userToken = sign({ userId: newUser?.id }, USER_TOKEN, {
                                expiresIn: "20min"})
                        
                            res.cookie("user-token", userToken, {
                                httpOnly:true,
                                expires: new Date(Date.now() + 20 * 60000),
                                secure:true,
                                sameSite:'none'
                                // domain: '.vercel.app'
                            })
                            
                            // res.redirect('http://localhost:4000/Student')
                            res.redirect('https://curriculum-project-frontend.vercel.app/Student')
                            
                            // return res.status(200)
                            //         .json({userT : userToken})
                            //         .redirect('https://curriculum-project-frontend.vercel.app/Student')
                    
                        } else {

                            await user?.updateOne({ email: data.cmuitaccount })
                            await user?.save()
                    
                            const userToken = sign({ userId: user?.id }, USER_TOKEN, {
                                expiresIn: "20min"})
                        
                            res.cookie("user-token", userToken, {
                                httpOnly:true,
                                expires: new Date(Date.now() + 20 * 60000),
                                secure:true,
                                sameSite:'none'
                                // domain: '.vercel.app'
                            })   
                            
                            // res.redirect('http://localhost:4000/Student')
                            res.redirect('https://curriculum-project-frontend.vercel.app/Student')

                            // return res.status(200)
                            //         .json({userT : userToken})
                            //         .redirect('https://curriculum-project-frontend.vercel.app/Student')
                    
                        }

                    } else{
                        res.redirect('https://curriculum-project-frontend.vercel.app/ErrorPage')
                    }

                } else {
                    
                    const a = await findAd(data.cmuitaccount)
                    
                    if(!a){
                        const newA = await createAdOauth(data.firstname_EN, data.cmuitaccount, data.cmuitaccount_name, data.itaccounttype_id)
                        await newA.save()

                        const advisorToken = sign({ advisorId: newA.id }, ADVISOR_TOKEN, {
                            expiresIn: "20min"})
                    
                        res.cookie("advisor-token", advisorToken, {
                            httpOnly:true,
                            expires: new Date(Date.now() + 20 * 60000),
                            secure:true,
                            sameSite:'none'
                        })

                        res.redirect('https://curriculum-project-frontend.vercel.app/Advisor')
                    }else{
                        a.updateOne({email: data.cmuitaccount})

                        const advisorToken = sign({ advisorId: a.id }, ADVISOR_TOKEN, {
                            expiresIn: "20min"})
                    
                        res.cookie("advisor-token", advisorToken, {
                            httpOnly:true,
                            expires: new Date(Date.now() + 20 * 60000),
                            secure:true,
                            sameSite:'none'
                        })
                        res.redirect('https://curriculum-project-frontend.vercel.app/Advisor')
                    }
                    
                }

            } else {
                res.redirect('https://curriculum-project-frontend.vercel.app/ErrorPage')
            }

        } catch (error: any) {
            res.sendStatus (500);
            console.log (error.message);
        }
    })

    app.get('/profile', async(req: Request, res: Response) => {

        const user = await findById((req as any).userId)

        res.send(`Hi ${user?.fullname}`)
    })

    app.get('/advisor', async(req: Request, res: Response) => {

        const a = await findById((req as any).advisorId)

        res.send(`Hi ${a?.fullname}`)
    })

    app.get('/out/fac', (req: Request, res: Response) => {
        
        res.send('Your Faculty is out of our scope')
    })

    app.get('/out/major', async (req: Request, res: Response) => {
        
        res.send('Your Major is out of our scope')
    })

    const apolloServer = new ApolloServer({
        schema,
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
        context: ({req, res}) => ({req, res})
    })
    
    await apolloServer.start()

    const corsOptions = { origin: true, credentials: true };

    apolloServer.applyMiddleware({ 
        app, 
        cors: corsOptions,
        path: '/graphql' 
    })

    const httpServer = createServer(app)

    httpServer.listen({ port: PORT }, (): void => {
        console.log(`\n🚀 GraphQL is now running on http://localhost:${PORT}/graphql`)
    })

}