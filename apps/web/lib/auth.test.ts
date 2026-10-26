import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  SESSION_TTL_MS,
  createSessionToken,
  isValidPin,
  verifySessionToken,
} from "./auth-token.ts";

const SECRET = "s".repeat(48);
const PIN = "246810";

beforeEach(() => {
  process.env.ADMIN_SESSION_SECRET = SECRET;
  process.env.ADMIN_PIN = PIN;
});

describe("createSessionToken", () => {
  it("membuat token bertanda tangan yang valid sebelum kedaluwarsa", () => {
    const now = 1_700_000_000_000;
    const token = createSessionToken(now);

    assert.match(token, /^\d+\.[a-f0-9]{64}$/);
    assert.equal(verifySessionToken(token, now + SESSION_TTL_MS - 1), true);
  });

  it("melempar error bila secret kurang dari 32 karakter", () => {
    process.env.ADMIN_SESSION_SECRET = "pendek";

    assert.throws(() => createSessionToken(), /ADMIN_SESSION_SECRET/);
  });
});

describe("verifySessionToken", () => {
  it("menolak token yang sudah kedaluwarsa", () => {
    const now = 1_700_000_000_000;
    const token = createSessionToken(now);

    assert.equal(verifySessionToken(token, now + SESSION_TTL_MS), false);
  });

  it("menolak token yang diubah", () => {
    const now = 1_700_000_000_000;
    const token = createSessionToken(now);
    const tampered = `${token.slice(0, -1)}${token.endsWith("0") ? "1" : "0"}`;

    assert.equal(verifySessionToken(tampered, now), false);
  });

  it("menolak token yang ditandatangani dengan secret berbeda", () => {
    const now = 1_700_000_000_000;
    const token = createSessionToken(now);
    process.env.ADMIN_SESSION_SECRET = "t".repeat(48);

    assert.equal(verifySessionToken(token, now), false);
  });

  it("menolak token kosong atau format salah", () => {
    for (const token of [undefined, "", "abc", "123", "123.zzz", ".abc"]) {
      assert.equal(verifySessionToken(token), false);
    }
  });

  it("menolak token bila secret tidak dikonfigurasi", () => {
    const token = createSessionToken();
    delete process.env.ADMIN_SESSION_SECRET;

    assert.equal(verifySessionToken(token), false);
  });
});

describe("isValidPin", () => {
  it("menerima PIN yang cocok dan mengabaikan spasi di tepi", () => {
    assert.equal(isValidPin(` ${PIN} `), true);
  });

  it("menolak PIN yang salah", () => {
    assert.equal(isValidPin("000000"), false);
  });

  it("menolak bila ADMIN_PIN belum dikonfigurasi", () => {
    delete process.env.ADMIN_PIN;

    assert.equal(isValidPin(PIN), false);
  });
});
