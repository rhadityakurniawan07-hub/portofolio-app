import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "portfolio_admin";
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const MIN_SECRET_LENGTH = 32;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error("ADMIN_SESSION_SECRET wajib diisi minimal 32 karakter");
  }
  return secret;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function createSessionToken(now = Date.now()): string {
  const expiresAt = now + SESSION_TTL_MS;
  const secret = getSessionSecret();
  return `${expiresAt}.${sign(String(expiresAt), secret)}`;
}

export function verifySessionToken(
  token: string | undefined,
  now = Date.now()
): boolean {
  if (!token) return false;

  const [expiresAtRaw, signature] = token.split(".");
  if (!expiresAtRaw || !signature) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return false;

  let secret: string;
  try {
    secret = getSessionSecret();
  } catch {
    return false;
  }

  return safeEqual(signature, sign(expiresAtRaw, secret));
}

export function isValidPin(input: string): boolean {
  const expected = (process.env.ADMIN_PIN ?? "").trim();
  if (!expected) return false;
  return safeEqual(input.trim(), expected);
}
