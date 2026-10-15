import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  subject: z.string().min(5, "Subjek minimal 5 karakter"),
  message: z.string().min(20, "Pesan minimal 20 karakter"),
  honeypot: z.string().optional(),
});

const ipRateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; resetAt?: number } {
  const now = Date.now();
  const record = ipRateLimit.get(ip);

  if (!record || now > record.resetAt) {
    ipRateLimit.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return { allowed: true };
  }

  if (record.count >= 5) {
    return { allowed: false, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true };
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetAt! - Date.now()) / 1000 / 60);
      return NextResponse.json(
        { error: `Terlalu banyak permintaan. Coba lagi dalam ${retryAfter} menit.` },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot check
    if (body.honeypot) {
      return NextResponse.json(
        { error: "Spam terdeteksi" },
        { status: 400 }
      );
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // TODO: Integrate with email service (Resend, Nodemailer, EmailJS, etc.)
    // For now, log the contact form submission
    console.log("[CONTACT] New submission:", { name, email, subject, message });

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      { success: true, message: "Pesan terkirim. Kami akan membalas segera." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pesan. Coba lagi nanti." },
      { status: 500 }
    );
  }
}