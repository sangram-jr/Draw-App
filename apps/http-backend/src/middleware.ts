import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "./config";


interface customRequest extends Request{
    userId?:string
}

export function userMiddleware(req:customRequest,res:Response,next:NextFunction){
    const authHeader=req.headers.authorization ;
    if(!authHeader){
        return res.json({message:"token not found"})
    }
    const token=authHeader.split(" ")[1];
    if(!token){
        return res.json({message:"token not splited form Bearer token"})
    }
    const verifyToken=jwt.verify(token,JWT_SECRET) as JwtPayload;
    if(verifyToken){
        
        req.userId=verifyToken.userId;
        next();
    }else{
        return res.status(403).json({message:"Unothorized"});
    }
}