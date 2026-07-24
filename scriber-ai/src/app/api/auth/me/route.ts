import connectToDB from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import UserModel from "@/models/user.model";

export async function GET() {
  try {
    await connectToDB();

    const userId = await getCurrentUser();
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Session fetched successfully",
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.Mobile,
            plan: user.plan,
            subscriptionStatus: user.subscriptionStatus,
            currentPeriodEnd: user.currentPeriodEnd,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in auth me api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
}