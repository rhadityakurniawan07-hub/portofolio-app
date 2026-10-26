import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { SESSION_COOKIE, createSessionToken } from "@/lib/auth-token";
import { POST as login } from "./login/route";
import { POST as logout } from "./logout/route";
import { GET as session } from "./session/route";

const SECRET = "s".repeat(48);
const PIN = "246810";

beforeEach(() => {
  process.env.ADMIN_SESSION_SECRET = SECRET;
  process.env.ADMIN_PIN = PIN;
});

function loginRequest(pin: string, ip: string): NextRequest {
  return new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({ pin }),
  });
}

function requestWithSession(path: string): NextRequest {
  const token = createSessionToken();
  return new NextRequest(`http://localhost${path}`, {
    headers: { cookie: `${SESSION_COOKIE}=${token}` },
  });
}

describe("POST /api/auth/login", () => {
  it("menolak PIN yang salah tanpa memasang cookie", async () => {
    const res = await login(loginRequest("000000", "10.0.0.1"));

    assert.equal(res.status, 401);
    assert.equal(res.headers.get("set-cookie"), null);
  });

  it("menolak body yang tidak berisi PIN", async () => {
    const req = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "10.0.0.2" },
      body: JSON.stringify({}),
    });

    const res = await login(req);

    assert.equal(res.status, 401);
  });

  it("menerima PIN yang benar dan memasang cookie HttpOnly", async () => {
    const res = await login(loginRequest(PIN, "10.0.0.3"));
    const header = res.headers.get("set-cookie") ?? "";

    assert.equal(res.status, 200);
    assert.match(header, new RegExp(`${SESSION_COOKIE}=`));
    assert.match(header, /HttpOnly/i);
  });

  it("membatasi 5 percobaan per IP", async () => {
    const ip = "10.0.0.4";

    for (let i = 0; i < 5; i++) {
      const res = await login(loginRequest("000000", ip));
      assert.equal(res.status, 401);
    }

    const blocked = await login(loginRequest(PIN, ip));
    assert.equal(blocked.status, 429);
  });

  it("mengembalikan 500 bila secret sesi belum dikonfigurasi", async () => {
    process.env.ADMIN_SESSION_SECRET = "";
    const originalError = console.error;
    console.error = () => {};

    try {
      const res = await login(loginRequest(PIN, "10.0.0.5"));
      assert.equal(res.status, 500);
    } finally {
      console.error = originalError;
    }
  });
});

describe("POST /api/auth/logout", () => {
  it("menghapus cookie sesi", async () => {
    const res = await logout();
    const header = res.headers.get("set-cookie") ?? "";

    assert.equal(res.status, 200);
    assert.match(header, /Max-Age=0/i);
  });
});

describe("GET /api/auth/session", () => {
  it("false tanpa cookie, true dengan sesi valid", async () => {
    const anonymous = await session(
      new NextRequest("http://localhost/api/auth/session")
    );
    assert.deepEqual(await anonymous.json(), { authenticated: false });

    const authenticated = await session(
      requestWithSession("/api/auth/session")
    );
    assert.deepEqual(await authenticated.json(), { authenticated: true });
  });
});
