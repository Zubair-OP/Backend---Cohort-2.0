import crypto from "crypto";
import connectToDB from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import { ForgotPasswordBody } from "@/types/user.types";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body: ForgotPasswordBody = await req.json();
    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: "If the account exists, a reset link has been generated",
        },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetTokenHash = resetTokenHash;
    user.passwordResetExpiresAt = new Date(Date.now() + 1000 * 60 * 15);
    await user.save({ validateBeforeSave: false });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Reset token generated successfully",
        data: {
          ...(process.env.NODE_ENV !== "production" ? { resetToken } : {}),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in forgot password api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}