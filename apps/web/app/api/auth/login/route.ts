import { NextRequest, NextResponse } from "next/server";
import { isValidPin, setSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = await checkRateLimit(`login:${ip}`, MAX_ATTEMPTS, WINDOW_MS);

    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil(((rateLimit.resetAt ?? Date.now()) - Date.now()) / 1000 / 60);
      return NextResponse.json(
        { error: "Terlalu banyak percobaan. Coba lagi nanti." },
        { status: 429, headers: { "Retry-After": String(retryAfter * 60) } }
      );
    }

    const body = await req.json().catch(() => null);
    const pin = typeof body?.pin === "string" ? body.pin : "";

    if (!isValidPin(pin)) {
      return NextResponse.json({ error: "PIN salah" }, { status: 401 });
    }

    return setSessionCookie(NextResponse.json({ authenticated: true }));
  } catch (error) {
    console.error("[API] POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Gagal memproses login" },
      { status: 500 }
    );
  }
}
