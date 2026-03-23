import express from "express"
import cors from "cors"
import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcrypt";
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
app.use(cors());


app.get('/test',(req,res)=>{
    res.send("hello hiiiiiii");
})

app.post('/signup',async(req,res)=>{

    //zod validation
    const parseData=CreateUserSchema.safeParse(req.body);
    if(!parseData.success){
        return res.status(403).json({message:"Incorrect Inputs"});
    }

    //hash password
    const password=parseData.data.password;
    const hashPassword=await bcrypt.hash(password,10);


    //create user
    try {
        const user=await prisma.user.create({ 
            data:{
                email:parseData.data.email,
                password:hashPassword,
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
        return res.status(403).json({message:"Incorrect Inputs"});
    }


    //find user
    const user=await prisma.user.findUnique({
        where:{
            email:parseData.data.email
        }
    })
    if(!user){
        return res.status(403).json({
            message:"User not found"
        })
    }

    
    //compare the hash password
    const password=parseData.data.password;
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if (!isPasswordValid) {
        return res.status(403).json({
            message: "Incorrect password"
        });
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
        return res.status(403).json({
            message:"Room already exist"
        })
    }
    
})


//get last messages
app.get('/chat/:roomId',async(req,res)=>{
    try {
       const roomId=Number(req.params.roomId);
        const messages=await prisma.chat.findMany({
            where:{
                roomId:roomId
            },
            orderBy:{
                id:"desc"
            },
            take:500 //return only latest 500 messages
        });
        res.json({
            messages
        }); 
    } catch (error) {
        res.json({error})
    }
    
})


//give the slug, this endpoint return the roomId
app.get('/room/:slug',async(req,res)=>{
    const slug=req.params.slug;
    const room=await prisma.room.findFirst({
        where:{
            slug:slug
        }
    });
    if (!room) {
        return res.status(404).json({
            message: "Room not found"
        });
    }
    res.json({room});
})


app.listen(3001);