import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildDeliveryResult,
  buildWhatsAppText,
  sendContactEmail,
  sendWhatsAppNotification,
  type ContactEnv,
} from "./contact-notify.ts";

const payload = {
  name: "Rhaditya",
  email: "rhaditya@example.com",
  subject: "Halo dari portofolio",
  message: "Saya ingin berdiskusi tentang pembuatan website portofolio.",
};

type Call = { url: string; init?: RequestInit };
type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

function recorder(status = 200): { calls: Call[]; fetchImpl: FetchLike } {
  const calls: Call[] = [];
  return {
    calls,
    fetchImpl: async (input, init) => {
      calls.push({ url: String(input), init });
      return new Response("{}", { status });
    },
  };
}

const emailEnv: ContactEnv = {
  RESEND_API_KEY: "re_test",
  CONTACT_TO_EMAIL: "owner@example.com",
  CONTACT_FROM_EMAIL: "Portofolio <halo@example.com>",
};

describe("sendContactEmail", () => {
  it("melewati pengiriman bila env email belum diisi", async () => {
    const { calls, fetchImpl } = recorder();
    const result = await sendContactEmail(payload, {}, fetchImpl);

    assert.equal(result.ok, false);
    assert.equal(result.skipped, true);
    assert.equal(calls.length, 0);
  });

  it("mengirim email ke Resend dengan tujuan dan reply-to yang benar", async () => {
    const { calls, fetchImpl } = recorder();
    const result = await sendContactEmail(payload, emailEnv, fetchImpl);

    assert.equal(result.ok, true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://api.resend.com/emails");
    const body = JSON.parse(String(calls[0].init?.body));
    assert.deepEqual(body.to, ["owner@example.com"]);
    assert.equal(body.replyTo, "rhaditya@example.com");
    assert.match(body.subject, /Halo dari portofolio/);
  });

  it("mengembalikan ok false saat Resend menolak", async () => {
    const { fetchImpl } = recorder(500);
    const result = await sendContactEmail(payload, emailEnv, fetchImpl);

    assert.equal(result.ok, false);
    assert.equal(result.skipped, undefined);
    assert.match(result.error ?? "", /Resend|gagal/i);
  });
});

describe("sendWhatsAppNotification", () => {
  it("melewati pengiriman bila provider WhatsApp belum diatur", async () => {
    const { calls, fetchImpl } = recorder();
    const result = await sendWhatsAppNotification(payload, {}, fetchImpl);

    assert.equal(result.ok, false);
    assert.equal(result.skipped, true);
    assert.equal(calls.length, 0);
  });

  it("mengirim pesan CallMeBot dengan nomor dan API key", async () => {
    const { calls, fetchImpl } = recorder();
    const result = await sendWhatsAppNotification(
      payload,
      {
        WHATSAPP_PROVIDER: "callmebot",
        CALLMEBOT_PHONE: "+62 881-0123-09481",
        CALLMEBOT_APIKEY: "123456",
      },
      fetchImpl
    );

    assert.equal(result.ok, true);
    assert.equal(calls.length, 1);
    const url = new URL(calls[0].url);
    assert.equal(url.hostname, "api.callmebot.com");
    assert.equal(url.searchParams.get("phone"), "62881012309481");
    assert.equal(url.searchParams.get("apikey"), "123456");
    assert.match(url.searchParams.get("text") ?? "", /Rhaditya/);
  });

  it("mengirim pesan Fonnte dengan token dan target", async () => {
    const { calls, fetchImpl } = recorder();
    const result = await sendWhatsAppNotification(
      payload,
      {
        WHATSAPP_PROVIDER: "fonnte",
        FONNTE_TOKEN: "token-abc",
        FONNTE_TARGET: "62881012309481",
      },
      fetchImpl
    );

    assert.equal(result.ok, true);
    const body = JSON.parse(String(calls[0].init?.body));
    assert.equal(body.target, "62881012309481");
    assert.match(body.message, /Rhaditya/);
    assert.equal(
      new Headers(calls[0].init?.headers).get("Authorization"),
      "token-abc"
    );
  });
});

describe("buildWhatsAppText", () => {
  it("membatasi pesan agar tidak melebihi 1000 karakter", () => {
    const text = buildWhatsAppText({ ...payload, message: "x".repeat(2000) });

    assert.ok(text.length <= 1000);
    assert.match(text, /Rhaditya/);
  });
});

describe("buildDeliveryResult", () => {
  it("menandai sukses bila minimal satu kanal terkirim", () => {
    const result = buildDeliveryResult({ email: true, whatsapp: false });

    assert.equal(result.success, true);
    assert.equal(result.saved, true);
    assert.match(result.message, /terkirim/i);
  });

  it("memakai pesan jujur bila tersimpan tetapi tidak ada notifikasi terkirim", () => {
    const result = buildDeliveryResult({ email: false, whatsapp: false });

    assert.equal(result.success, true);
    assert.equal(result.saved, true);
    assert.match(result.message, /tersimpan/i);
    assert.match(result.message, /belum terkirim/i);
  });
});
