import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import { userMiddleware } from "./middleware";
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common/types"
import {prisma} from "@repo/db/db"

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
    //db call
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
        return res.status(403).json({
            message:"Email already exist"
        })
    }
    
})



app.post('/signin',(req,res)=>{
    
    //zod validation
    const data=SigninSchema.safeParse(req.body);
    if(!data.success){
        return res.json({message:"Incorrect Inputs"});
    }

    const userId=1;
    const token=jwt.sign({
        userId,
    },JWT_SECRET);
    res.json({token});
})


app.post('/room',userMiddleware,(req,res)=>{

    //zod validation
    const data=SigninSchema.safeParse(req.body);
    if(!data.success){
        return res.json({message:"Incorrect Inputs"});
    }


    //db call
    res.json({
        roomId:123
    })
})


app.listen(3001);