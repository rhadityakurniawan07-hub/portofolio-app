export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactEnv = {
  [key: string]: string | undefined;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  WHATSAPP_PROVIDER?: string;
  CALLMEBOT_PHONE?: string;
  CALLMEBOT_APIKEY?: string;
  FONNTE_TOKEN?: string;
  FONNTE_TARGET?: string;
};

export type NotifyResult = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
};

export type DeliveryChannels = {
  email: boolean;
  whatsapp: boolean;
};

export type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit
) => Promise<Response>;

export async function sendContactEmail(
  payload: ContactPayload,
  env: ContactEnv = process.env,
  fetchImpl: FetchLike = fetch
): Promise<NotifyResult> {
  const apiKey = env.RESEND_API_KEY?.trim();
  const to = env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !to) {
    return {
      ok: false,
      skipped: true,
      error: "Email belum dikonfigurasi (RESEND_API_KEY / CONTACT_TO_EMAIL)",
    };
  }

  const from =
    env.CONTACT_FROM_EMAIL?.trim() || "Portofolio <onboarding@resend.dev>";

  try {
    const res = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        replyTo: payload.email,
        subject: `[Portofolio] ${payload.subject} — dari ${payload.name}`,
        text: `Nama: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Resend gagal (${res.status})${detail ? `: ${detail}` : ""}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Gagal mengirim email",
    };
  }
}

export function buildWhatsAppText(payload: ContactPayload): string {
  const text = `Pesan baru dari ${payload.name} (${payload.email})\nSubjek: ${payload.subject}\n\n${payload.message}`;
  return text.length > 1000 ? `${text.slice(0, 997)}...` : text;
}

export async function sendWhatsAppNotification(
  payload: ContactPayload,
  env: ContactEnv = process.env,
  fetchImpl: FetchLike = fetch
): Promise<NotifyResult> {
  const provider = env.WHATSAPP_PROVIDER?.trim().toLowerCase();
  if (!provider) {
    return {
      ok: false,
      skipped: true,
      error: "WhatsApp belum dikonfigurasi (WHATSAPP_PROVIDER)",
    };
  }

  if (provider === "callmebot") {
    const phone = (env.CALLMEBOT_PHONE ?? "").replace(/\D/g, "");
    const apiKey = env.CALLMEBOT_APIKEY?.trim();
    if (!phone || !apiKey) {
      return {
        ok: false,
        skipped: true,
        error: "CallMeBot belum dikonfigurasi (CALLMEBOT_PHONE / CALLMEBOT_APIKEY)",
      };
    }

    try {
      const url = new URL("https://api.callmebot.com/whatsapp.php");
      url.searchParams.set("phone", phone);
      url.searchParams.set("text", buildWhatsAppText(payload));
      url.searchParams.set("apikey", apiKey);
      const res = await fetchImpl(url);
      return res.ok
        ? { ok: true }
        : { ok: false, error: `CallMeBot gagal (${res.status})` };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Gagal mengirim WhatsApp",
      };
    }
  }

  if (provider === "fonnte") {
    const token = env.FONNTE_TOKEN?.trim();
    const target = env.FONNTE_TARGET?.trim();
    if (!token || !target) {
      return {
        ok: false,
        skipped: true,
        error: "Fonnte belum dikonfigurasi (FONNTE_TOKEN / FONNTE_TARGET)",
      };
    }

    try {
      const res = await fetchImpl("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target,
          message: buildWhatsAppText(payload),
        }),
      });
      return res.ok
        ? { ok: true }
        : { ok: false, error: `Fonnte gagal (${res.status})` };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Gagal mengirim WhatsApp",
      };
    }
  }

  return {
    ok: false,
    skipped: true,
    error: `Provider WhatsApp tidak dikenal: ${provider}`,
  };
}

export function buildDeliveryResult(delivered: DeliveryChannels) {
  const anyDelivered = delivered.email || delivered.whatsapp;
  return {
    success: true as const,
    saved: true as const,
    delivered,
    message: anyDelivered
      ? "Pesan terkirim. Kami akan membalas segera."
      : "Pesan tersimpan, tetapi notifikasi belum terkirim. Pemilik tetap dapat melihatnya di database.",
  };
}
