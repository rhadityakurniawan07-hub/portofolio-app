// apps/web/lib/portfolio.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseTechStack,
  normalizeUrl,
  validateProjectInput,
  validateProfileInput,
  checkOwnerPin,
} from "./portfolio.ts";

describe("parseTechStack", () => {
  it("split koma, trim, buang kosong, dedup", () => {
    assert.deepEqual(parseTechStack("Next.js, Node.js,, Next.js ,  "), [
      "Next.js",
      "Node.js",
    ]);
  });
});

describe("normalizeUrl", () => {
  it("tambah https bila tanpa protokol, kosong tetap kosong", () => {
    assert.equal(normalizeUrl("example.com/x"), "https://example.com/x");
    assert.equal(normalizeUrl("https://example.com/x"), "https://example.com/x");
    assert.equal(normalizeUrl(""), "");
  });
});

describe("validateProjectInput", () => {
  it("tolak title/deskripsi/tech/year kosong", () => {
    const errs = validateProjectInput({
      title: "",
      description: "",
      techStack: [],
      year: "",
      link: "bukan url",
    });
    assert.ok(errs.length >= 4);
  });
  it("terima input valid", () => {
    const errs = validateProjectInput({
      title: "E-Commerce",
      description: "Full-stack shop",
      techStack: ["Next.js"],
      year: "2024",
      link: "",
    });
    assert.deepEqual(errs, []);
  });
});

describe("validateProfileInput", () => {
  it("tolak email format salah", () => {
    const errs = validateProfileInput({
      fullName: "A",
      role: "Dev",
      bio: "Bio",
      location: "Sleman",
      email: "bukan-email",
      availability: "Tersedia",
    });
    assert.ok(errs.some((e) => e.toLowerCase().includes("email")));
  });
});

describe("checkOwnerPin", () => {
  it("PIN salah ditolak", () => {
    assert.equal(checkOwnerPin("0000"), false);
  });
});
