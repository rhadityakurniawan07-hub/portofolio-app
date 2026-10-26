import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@repo/database";
import { requireAdmin } from "@/lib/auth";
import {
  buildDeliveryResult,
  sendContactEmail,
  sendWhatsAppNotification,
} from "@/lib/contact-notify";

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
    const payload = { name, email, subject, message };

    // Database adalah sumber kebenaran: jangan klaim sukses bila pesan gagal disimpan.
    try {
      await prisma.contactMessage.create({
        data: payload,
      });
    } catch (dbErr) {
      console.error("[API] Gagal simpan ContactMessage ke DB:", dbErr);
      return NextResponse.json(
        {
          success: false,
          saved: false,
          error: "Pesan gagal disimpan. Coba lagi nanti.",
        },
        { status: 500 }
      );
    }

    const [emailResult, whatsappResult] = await Promise.allSettled([
      sendContactEmail(payload),
      sendWhatsAppNotification(payload),
    ]);

    const delivered = {
      email:
        emailResult.status === "fulfilled" && emailResult.value.ok === true,
      whatsapp:
        whatsappResult.status === "fulfilled" &&
        whatsappResult.value.ok === true,
    };

    if (emailResult.status === "fulfilled" && emailResult.value.error) {
      console.error("[CONTACT] Email:", emailResult.value.error);
    }
    if (whatsappResult.status === "fulfilled" && whatsappResult.value.error) {
      console.error("[CONTACT] WhatsApp:", whatsappResult.value.error);
    }

    return NextResponse.json(buildDeliveryResult(delivered), { status: 200 });
  } catch (error) {
    console.error("[API] POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pesan. Coba lagi nanti." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[API] GET /api/contact error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil riwayat pesan" },
      { status: 500 }
    );
  }
}