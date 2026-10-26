import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST as createMessage } from "./route";

function contactRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validMessage = {
  name: "Rhaditya",
  email: "rhaditya@example.com",
  subject: "Diskusi proyek",
  message: "Saya ingin berdiskusi tentang pembuatan website portofolio.",
};

describe("POST /api/contact", () => {
  it("menolak request yang mengisi honeypot", async () => {
    const res = await createMessage(
      contactRequest({ ...validMessage, honeypot: "bot" })
    );
    const data = await res.json();

    assert.equal(res.status, 400);
    assert.match(data.error, /Spam/i);
  });
});
