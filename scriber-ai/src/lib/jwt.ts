import jwt from "jsonwebtoken"
import { JWTPayload } from "../types/user.types";

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw new Error("JWT_SECRET is not configured")
    }

    return secret
}

export const generateToken = (payload: JWTPayload): string =>{
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: '1h',
        algorithm: 'HS256'
    })
}


export const verifyToken = (token: string): JWTPayload => {
    return jwt.verify(token, getJwtSecret(), {
        algorithms: ['HS256']
    }) as JWTPayload;
}

export const authCookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60,
}