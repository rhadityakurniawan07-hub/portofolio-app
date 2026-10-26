import { NextRequest, NextResponse } from "next/server";
import { isValidPin, setSessionCookie } from "@/lib/auth";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isAllowed(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) return false;

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    if (!isAllowed(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan. Coba lagi nanti." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const pin = typeof body?.pin === "string" ? body.pin : "";

    if (!isValidPin(pin)) {
      return NextResponse.json({ error: "PIN salah" }, { status: 401 });
    }

    loginAttempts.delete(ip);
    return setSessionCookie(NextResponse.json({ authenticated: true }));
  } catch (error) {
    console.error("[API] POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Gagal memproses login" },
      { status: 500 }
    );
  }
}
