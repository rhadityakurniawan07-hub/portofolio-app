// apps/web/lib/portfolio.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseTechStack,
  parseDaftar,
  normalizeUrl,
  validateProjectInput,
  validateProfileInput,
  validateProfileUrls,
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

describe("parseDaftar", () => {
  it("split koma, trim, buang kosong, dedup", () => {
    assert.deepEqual(parseDaftar("Next.js,, Node.js , Next.js"), [
      "Next.js",
      "Node.js",
    ]);
  });
});

describe("validateProfileUrls", () => {
  it("kosong boleh, tanpa protokol tetap valid", () => {
    assert.deepEqual(validateProfileUrls({ github: "", telegram: "", whatsapp: "" }), []);
    assert.deepEqual(validateProfileUrls({ github: "github.com/fatih", telegram: "t.me/fatih", whatsapp: "" }), []);
  });
  it("menolak URL yang tidak valid", () => {
    const errs = validateProfileUrls({ github: "http://", telegram: "", whatsapp: "" });
    assert.ok(errs.some((e) => e.includes("GitHub")));
  });
  it("foto profil opsional tapi harus URL valid bila diisi", async () => {
    const { validateOptionalUrl } = await import("./portfolio.ts");
    assert.deepEqual(validateOptionalUrl("Foto Profil", ""), []);
    assert.deepEqual(validateOptionalUrl("Foto Profil", "example.com/foto.png"), []);
    assert.ok(validateOptionalUrl("Foto Profil", "http://").some((e) => e.includes("Foto Profil")));
  });
});
