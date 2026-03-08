import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common";
import { userMiddleware } from "./middleware";
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common"

const app=express();

app.post('/signup',(req,res)=>{

    //zod validation
    const data=CreateUserSchema.safeParse(req.body);
    if(!data.success){
        return res.json({message:"Incorrect Inputs"});
    }
    //db call
    res.json({
        userId:123
    })
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