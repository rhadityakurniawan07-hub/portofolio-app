// apps/web/lib/portfolio.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseTechStack,
  parseDaftar,
  normalizeUrl,
  normalizeWhatsAppUrl,
  validateProjectInput,
  validateProfileInput,
  validateProfileUrls,
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

describe("parseDaftar", () => {
  it("split koma, trim, buang kosong, dedup", () => {
    assert.deepEqual(parseDaftar("Next.js,, Node.js , Next.js"), [
      "Next.js",
      "Node.js",
    ]);
  });
});

describe("normalizeWhatsAppUrl", () => {
  it("membersihkan spasi dan tanda hubung pada wa.me", () => {
    assert.equal(
      normalizeWhatsAppUrl("https://wa.me/62881-0123-09481"),
      "https://wa.me/62881012309481"
    );
  });
  it("mengubah nomor lokal 08 menjadi format internasional 62", () => {
    assert.equal(
      normalizeWhatsAppUrl("0812-3456-7890"),
      "https://wa.me/6281234567890"
    );
  });
  it("mengubah nomor tanpa awalan 0 menjadi format 62", () => {
    assert.equal(
      normalizeWhatsAppUrl("81234567890"),
      "https://wa.me/6281234567890"
    );
  });
  it("kosong tetap kosong", () => {
    assert.equal(normalizeWhatsAppUrl("   "), "");
  });
});

describe("validateProfileUrls", () => {
  it("kosong boleh, tanpa protokol tetap valid", () => {
    assert.deepEqual(validateProfileUrls({ github: "", telegram: "", whatsapp: "" }), []);
    assert.deepEqual(validateProfileUrls({ github: "github.com/fatih", telegram: "t.me/fatih", whatsapp: "" }), []);
    assert.deepEqual(
      validateProfileUrls({ github: "", telegram: "", whatsapp: "62881012309481" }),
      []
    );
  });
  it("menolak URL yang tidak valid", () => {
    const errs = validateProfileUrls({ github: "http://", telegram: "", whatsapp: "" });
    assert.ok(errs.some((e) => e.includes("GitHub")));
  });
  it("menolak tautan WhatsApp yang bukan wa.me atau nomornya tidak valid", () => {
    const errs = validateProfileUrls({
      github: "",
      telegram: "",
      whatsapp: "https://example.com/chat",
    });
    assert.ok(errs.some((e) => e.includes("WhatsApp")));

    const badNumber = validateProfileUrls({
      github: "",
      telegram: "",
      whatsapp: "https://wa.me/abc",
    });
    assert.ok(badNumber.some((e) => e.includes("WhatsApp")));
  });
  it("foto profil opsional tapi harus URL valid bila diisi", async () => {
    const { validateOptionalUrl } = await import("./portfolio.ts");
    assert.deepEqual(validateOptionalUrl("Foto Profil", ""), []);
    assert.deepEqual(validateOptionalUrl("Foto Profil", "example.com/foto.png"), []);
    assert.ok(validateOptionalUrl("Foto Profil", "http://").some((e) => e.includes("Foto Profil")));
  });
});
