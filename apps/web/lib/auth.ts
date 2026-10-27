import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSessionToken,
  isValidPin,
  verifySessionToken,
} from "./auth-token";

export { isValidPin };

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function isAdminRequest(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  if (isAdminRequest(req)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function setSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(),
    ...COOKIE_OPTIONS,
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return res;
}

export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
  return res;
}

export function isTrustedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");
  const allowed = new Set<string>();

  if (host) allowed.add(`http://${host}`);
  if (host) allowed.add(`https://${host}`);
  if (process.env.NEXT_PUBLIC_APP_URL) allowed.add(process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ""));

  if (origin) return allowed.has(origin.replace(/\/$/, ""));
  if (referer) {
    try {
      return allowed.has(new URL(referer).origin);
    } catch {
      return false;
    }
  }
  return false;
}
