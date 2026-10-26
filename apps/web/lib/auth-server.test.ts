import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, createSessionToken } from "./auth-token.ts";
import {
  clearSessionCookie,
  isAdminRequest,
  requireAdmin,
  setSessionCookie,
} from "./auth.ts";

const SECRET = "s".repeat(48);

beforeEach(() => {
  process.env.ADMIN_SESSION_SECRET = SECRET;
  process.env.ADMIN_PIN = "246810";
});

function requestWithCookie(cookie?: string): NextRequest {
  return new NextRequest("http://localhost/api/test", {
    headers: cookie ? { cookie } : undefined,
  });
}

describe("requireAdmin", () => {
  it("mengembalikan 401 tanpa cookie sesi", () => {
    const res = requireAdmin(requestWithCookie());

    assert.equal(res?.status, 401);
  });

  it("mengembalikan 401 untuk token yang tidak valid", () => {
    const res = requireAdmin(
      requestWithCookie(`${SESSION_COOKIE}=token-palsu`)
    );

    assert.equal(res?.status, 401);
  });

  it("mengembalikan null untuk sesi yang valid", () => {
    const token = createSessionToken();
    const res = requireAdmin(
      requestWithCookie(`${SESSION_COOKIE}=${token}`)
    );

    assert.equal(res, null);
  });
});

describe("isAdminRequest", () => {
  it("true hanya untuk token valid", () => {
    const token = createSessionToken();

    assert.equal(
      isAdminRequest(requestWithCookie(`${SESSION_COOKIE}=${token}`)),
      true
    );
    assert.equal(isAdminRequest(requestWithCookie()), false);
  });
});

describe("cookie sesi", () => {
  it("setSessionCookie memasang cookie HttpOnly", () => {
    const res = setSessionCookie(NextResponse.json({ ok: true }));
    const header = res.headers.get("set-cookie") ?? "";

    assert.match(header, new RegExp(`${SESSION_COOKIE}=`));
    assert.match(header, /HttpOnly/i);
    assert.match(header, /SameSite=lax/i);
    assert.match(header, /Path=\//i);
  });

  it("clearSessionCookie mengosongkan cookie", () => {
    const res = clearSessionCookie(NextResponse.json({ ok: true }));
    const header = res.headers.get("set-cookie") ?? "";

    assert.match(header, new RegExp(`${SESSION_COOKIE}=;`));
    assert.match(header, /Max-Age=0/i);
  });
});
