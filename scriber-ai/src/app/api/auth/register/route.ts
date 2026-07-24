import connectToDB from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import { generateToken, getAuthCookieOptions } from "@/lib/jwt";
import { RegisterBody } from "@/types/user.types";

export async function POST(req: NextRequest) {
    try {
        await connectToDB()
    
    const data:RegisterBody = await req.json();

    const {email , password , Mobile , name} = data

    if(!email || !password || !name) return NextResponse.json<ApiResponse>({
        success:false,
        message:"Email, name, and password are required",
    }, 
    {
        status: 400
    })

    const normalizedEmail = email.toLowerCase().trim()
    const user = await UserModel.findOne({email: normalizedEmail})

    if(user) return NextResponse.json<ApiResponse>(
        {
            success: false,
            message: "User already exists"
        },
        {
            status: 409
        }
    )

    const createdUser = await UserModel.create({
        name,
        email: normalizedEmail,
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
                    plan: createdUser.plan,
                    subscriptionStatus: createdUser.subscriptionStatus,
                }
            }
        },
        {
            status: 201
        }
    )

    const cookieOptions = getAuthCookieOptions();

    response.cookies.set("token", token, cookieOptions);
    response.cookies.set("Token", token, cookieOptions);

    return response;
    } catch (error) 
    {
        console.log("Error in Register Api ",error)  
        return NextResponse.json<ApiResponse>(
            {
                success : false,
                message: "Something went wrong"
            },
            {status:500}
        )    
    }   
}