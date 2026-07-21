export interface Iuser {
    name: string,
    email: string,
    password: string,
    _id:string,
    createdAt?:Date,
    updatedAt?:Date,
    Mobile:string,
}

export interface RegisterBody {
    name:string,
    email:string,
    password:string,
    Mobile:string,
}

export interface LoginBody {
    email:string,
    password:string,
}

export interface JWTPayload {
    email?:string,
    userId:string
}