import express from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import "dotenv/config";
import { JWT_SECRET } from "@repo/backend-common/config";
import { userMiddleware } from "./middleware";
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common/types"
import {prisma} from "@repo/db/db"


//To extract the req.userId type from the middleware.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}



const app=express();
app.use(express.json());


app.get('/test',(req,res)=>{
    res.send("hello hiiiiiii");
})

app.post('/signup',async(req,res)=>{

    //zod validation
    const parseData=CreateUserSchema.safeParse(req.body);
    if(!parseData.success){
        return res.json({message:"Incorrect Inputs"});
    }

    //todo:hash password

    //create user
    try {
        const user=await prisma.user.create({
            data:{
                email:parseData.data.email,
                password:parseData.data.password,
                name:parseData.data.name
            }
        })
        res.json({
            userId:user.id
        })
    } catch (error) {
        return res.status(411).json({
            message:"Email already exist"
        })
    }
    
})



app.post('/signin',async(req,res)=>{
    
    //zod validation
    const parseData=SigninSchema.safeParse(req.body);
    if(!parseData.success){
        return res.json({message:"Incorrect Inputs"});
    }

    //Todo: compare the hash password


    //find user
    const user=await prisma.user.findFirst({
        where:{
            email:parseData.data.email,
            password:parseData.data.password
        }
    })
    if(!user){
        return res.status(403).json({
            message:"Not Authorized"
        })
    }

    //generate token
    const token=jwt.sign({
        userId:user.id,
    },JWT_SECRET);

    res.json({token});
})


app.post('/room',userMiddleware,async(req,res)=>{

    //zod validation
    const parseData=CreateRoomSchema.safeParse(req.body);
    if(!parseData.success){
        return res.json({message:"Incorrect Inputs"});
    }

    //create room
    const userId=req.userId!;
    try {
        const room=await prisma.room.create({
            data:{
                slug:parseData.data.slug,
                adminId:userId
            }
        })
        res.json({
            roomId:room.id
        })
    } catch (error) {
        return res.status(411).json({
            message:"Room already exist"
        })
    }
    
})


app.listen(3001);