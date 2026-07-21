import jwt from "jsonwebtoken"
import { JWTPayload } from "../types/user.types";

export const generateToken = (payload: JWTPayload): string =>{
    return jwt.sign(payload,process.env.JWT_SECRET!,{
        expiresIn:'1h'
    })
}


export const verifyToken = (token:string) =>{
    return jwt.verify(token,process.env.JWT_SECRET!)
}