import { authCookieOptions } from "@/lib/jwt";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json<ApiResponse>(
    {
      success: true,
      message: "Logged out successfully",
    },
    { status: 200 }
  );

  const clearedCookie = {
    ...authCookieOptions,
    maxAge: 0,
  };

  response.cookies.set("token", "", clearedCookie);
  response.cookies.set("Token", "", clearedCookie);

  return response;
}