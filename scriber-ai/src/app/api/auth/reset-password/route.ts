import crypto from "crypto";
import connectToDB from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import { ResetPasswordBody } from "@/types/user.types";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body: ResetPasswordBody = await req.json();
    const token = body.token?.trim();
    const password = body.password;

    if (!token || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Token and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await UserModel.findOne({
      passwordResetTokenHash: resetTokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Reset token is invalid or expired",
        },
        { status: 400 }
      );
    }

    user.password = password;
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in reset password api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}