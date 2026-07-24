import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import { LoginBody } from "@/types/user.types";
import connectToDB from "@/lib/mongodb";
import UserModel from "@/models/user.model";
import { authCookieOptions, generateToken } from "@/lib/jwt";


export async function POST(req: NextRequest) {
    try {
        await connectToDB()
        const data: LoginBody = await req.json()
        const { email, password } = data

        if (!email || !password) return NextResponse.json<ApiResponse>(
            {
                success: false,
                message: "Email and password are required",
            },
            {
                status: 400
            }
        )

        const normalizedEmail = email.toLowerCase().trim()
        const user = await UserModel.findOne({ email: normalizedEmail }).select("+password")
        if (!user) return NextResponse.json<ApiResponse>(
            {
                success: false,
                message: "Invalid credentials",
            },
            { status: 401 }
        )

        const isPasswordValid = await user.ComparePassword(password)
        if (!isPasswordValid) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: "Invalid credentials",
                },
                {
                    status: 401
                }
            )
        }

        const token = generateToken({ userId: user._id.toString() })

        const response = NextResponse.json<ApiResponse>(
            {
                success: true,
                message: "User logged in successfully",
                data: {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        mobile: user.Mobile,
                    }
                }
            },
            {
                status: 200
            }
        )

        response.cookies.set("token", token, {
            ...authCookieOptions,
        })
        response.cookies.set("Token", token, {
            ...authCookieOptions,
        })

        return response



    } catch (error) {
        console.log('Error in Login', error)
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                message: "Something went wrong"
            },
            {
                status: 500
            }
        )
    }
}