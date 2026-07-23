import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import { LoginBody } from "@/types/user.types";
import connectToDB from "@/lib/mongodb";
import UserModel from "@/models/user.model";
import { generateToken } from "@/lib/jwt";


export async function POST(req: NextRequest) {
    try {
        await connectToDB()
        const data: LoginBody = await req.json()
        const { email, password } = data

        if (!email || !password) return NextResponse.json<ApiResponse>(
            {
                success: false,
                message: "All fields are required",
            },
            {
                status: 400
            }
        )

        const user = await UserModel.findOne({ email })
        if (!user) return NextResponse.json<ApiResponse>(
            {
                success: false,
                message: "User not found",
            },
            {
                status: 404
            }
        )

        const isPasswordValid = user.ComparePassword(password)
        if (!isPasswordValid) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: "Incorrect password",
                },
                {
                    status: 401
                }
            )
        }

        const token = generateToken({ userId: user._id.toString() })

        let response = NextResponse.json<ApiResponse>(
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
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60
        })
        response.cookies.set("Token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60
        })

        return response



    } catch (error) {
        console.log('Error in Login', error)
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                message: "Something went wrong",
                error: String(error)
            },
            {
                status: 500
            }
        )
    }
}