import connectToDB from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import { generateToken } from "@/lib/jwt";
import { RegisterBody } from "@/types/user.types";

export async function POST(req: NextRequest) {
    try {
        await connectToDB()
    
    const data:RegisterBody = await req.json();

    const {email , password , Mobile , name} = data

    if(!email || !password || !name) return NextResponse.json<ApiResponse>({
        success:false,
        message:"All fields are required",
    }, 
    {
        status: 400
    })

    const user = await UserModel.findOne({email})

    if(user) return NextResponse.json<ApiResponse>(
        {
            success: false,
            message: "User already exists",
            error: "User already exists"
        },
        {
            status: 409
        }
    )

    const createdUser = await UserModel.create({
        name,
        email,
        password,
        Mobile
    })

    const token = generateToken({userId:createdUser._id.toString()})

    const response = NextResponse.json<ApiResponse>(
        {
            success: true,
            message: "User created successfully",
            data : {
                user : {
                    _id : createdUser._id,
                    name : createdUser.name,
                    email : createdUser.email,
                    mobile : createdUser.Mobile,
                }
            }
        },
        {
            status: 201
        }
    )

    response.cookies.set("token", token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 });
    response.cookies.set("Token", token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 });

    return response;
    } catch (error) 
    {
        console.log("Error in Register Api ",error)  
        return NextResponse.json<ApiResponse>(
            {
                success : false,
                message: "Something Went Wrong",
                error : String(error)
            },
            {status:500}
        )    
    }   
}