import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import {
  applySecurityHeaders,
  checkRateLimit,
  getClientIdentifier,
  getRateLimitRule,
  isProtectedApiPath,
} from "@/lib/request-security";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  applySecurityHeaders(response.headers, pathname.startsWith("/api"));

  if (!pathname.startsWith("/api")) {
    return response;
  }

  if (!isProtectedApiPath(pathname)) {
    return response;
  }

  const rule = getRateLimitRule(pathname);

  if (!rule) {
    return response;
  }

  const clientId = getClientIdentifier(request);
  const limitKey = `${pathname}:${clientId}`;
  const result = checkRateLimit(limitKey, rule);

  response.headers.set("X-RateLimit-Limit", String(rule.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));

  if (!result.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
    const limitedResponse = NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Too many requests",
      },
      { status: 429 }
    );

    applySecurityHeaders(limitedResponse.headers, true);
    limitedResponse.headers.set("Retry-After", String(retryAfterSeconds));
    limitedResponse.headers.set("X-RateLimit-Limit", String(rule.limit));
    limitedResponse.headers.set("X-RateLimit-Remaining", "0");
    limitedResponse.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));

    return limitedResponse;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
