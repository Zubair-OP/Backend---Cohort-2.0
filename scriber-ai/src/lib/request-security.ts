import type { NextRequest } from "next/server";

export type RateLimitRule = {
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const securityHeaderEntries: Array<[string, string]> = [
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()"],
  ["Cross-Origin-Opener-Policy", "same-origin"],
  ["Cross-Origin-Resource-Policy", "same-origin"],
];

export const protectedApiPrefixes = ["/api/auth", "/api/ai", "/api/resume"];

export const apiCacheHeaderEntries: Array<[string, string]> = [
  ["Cache-Control", "no-store, max-age=0"],
  ["Pragma", "no-cache"],
  ["Expires", "0"],
  ["Vary", "Cookie, Authorization"],
];

export function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    const trimmedIp = firstIp.trim();
    if (trimmedIp) {
      return trimmedIp;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  return "unknown";
}

export function isProtectedApiPath(pathname: string): boolean {
  return protectedApiPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export function getRateLimitRule(pathname: string): RateLimitRule | null {
  if (pathname.startsWith("/api/auth/login")) {
    return { limit: 5, windowMs: 60 * 1000 };
  }

  if (pathname.startsWith("/api/auth/register")) {
    return { limit: 3, windowMs: 60 * 60 * 1000 };
  }

  if (pathname.startsWith("/api/ai")) {
    return { limit: 20, windowMs: 60 * 1000 };
  }

  if (pathname.startsWith("/api/resume")) {
    return { limit: 60, windowMs: 60 * 1000 };
  }

  return null;
}

export function checkRateLimit(key: string, rule: RateLimitRule) {
  const now = Date.now();

  for (const [entryKey, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(entryKey);
    }
  }

  const existingEntry = rateLimitStore.get(key);

  if (!existingEntry || existingEntry.resetAt <= now) {
    const resetAt = now + rule.windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });

    return {
      allowed: true,
      remaining: rule.limit - 1,
      resetAt,
    };
  }

  const nextCount = existingEntry.count + 1;

  if (nextCount > rule.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existingEntry.resetAt,
    };
  }

  rateLimitStore.set(key, {
    count: nextCount,
    resetAt: existingEntry.resetAt,
  });

  return {
    allowed: true,
    remaining: rule.limit - nextCount,
    resetAt: existingEntry.resetAt,
  };
}

export function applySecurityHeaders(headers: Headers, includeApiCacheHeaders = false) {
  for (const [key, value] of securityHeaderEntries) {
    headers.set(key, value);
  }

  if (includeApiCacheHeaders) {
    for (const [key, value] of apiCacheHeaderEntries) {
      headers.set(key, value);
    }
  }
}
