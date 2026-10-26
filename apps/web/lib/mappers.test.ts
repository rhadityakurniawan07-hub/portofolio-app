import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mapProfileRecord, mapProjectRecord } from "./mappers.ts";

const profileRecord = {
  id: "profile-1",
  fullName: "Muhammad Rhaditya",
  role: "Full-Stack Web Developer",
  tagline: "Next.js • Node.js",
  bio: "Bio singkat",
  longBio: null,
  location: "Bekasi",
  email: "rhaditya@example.com",
  availability: "Terbuka",
  availabilityStatus: "available",
  phone: null,
  photoUrl: null,
  aboutPhotoUrl: null,
  github: "https://github.com/rhaditya",
  linkedin: null,
  twitter: null,
  whatsapp: "https://wa.me/62881012309481",
  telegram: null,
  skills: ["Next.js", "Node.js"],
  languages: ["Indonesia"],
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-02T00:00:00.000Z"),
};

const projectRecord = {
  id: "cmproject123",
  title: "Portofolio",
  description: "Website portofolio",
  techStack: ["Next.js", "Tailwind CSS"],
  projectUrl: null,
  githubUrl: null,
  year: "2026",
  category: "Online",
  status: "Production",
  featured: true,
  createdAt: new Date("2026-02-03T04:05:06.000Z"),
  updatedAt: new Date("2026-02-04T00:00:00.000Z"),
};

describe("mapProfileRecord", () => {
  it("memetakan fullName dan skills ke tipe Profile aplikasi", () => {
    const profile = mapProfileRecord(profileRecord);

    assert.equal(profile.name, "Muhammad Rhaditya");
    assert.equal(profile.role, "Full-Stack Web Developer");
    assert.equal(profile.tagline, "Next.js • Node.js");
    assert.deepEqual(profile.specializations, ["Next.js", "Node.js"]);
    assert.deepEqual(profile.languages, ["Indonesia"]);
    assert.equal(profile.whatsapp, "https://wa.me/62881012309481");
  });

  it("mengubah field opsional null menjadi string kosong", () => {
    const profile = mapProfileRecord(profileRecord);

    assert.equal(profile.longBio, "");
    assert.equal(profile.phone, "");
    assert.equal(profile.photoUrl, "");
    assert.equal(profile.aboutPhotoUrl, "");
    assert.equal(profile.linkedin, "");
    assert.equal(profile.telegram, "");
  });

  it("memakai bio sebagai fallback tagline", () => {
    const profile = mapProfileRecord({ ...profileRecord, tagline: "" });

    assert.equal(profile.tagline, "Bio singkat");
  });

  it("menormalkan tautan WhatsApp lama dari database", () => {
    const profile = mapProfileRecord({
      ...profileRecord,
      whatsapp: "https://wa.me/+62 881-0123-09481",
    });

    assert.equal(profile.whatsapp, "https://wa.me/62881012309481");
  });
});

describe("mapProjectRecord", () => {
  it("mempertahankan id string dan createdAt dari database", () => {
    const project = mapProjectRecord(projectRecord);

    assert.equal(project.id, "cmproject123");
    assert.equal(project.title, "Portofolio");
    assert.deepEqual(project.techStack, ["Next.js", "Tailwind CSS"]);
    assert.equal(project.createdAt, "2026-02-03T04:05:06.000Z");
    assert.equal(project.featured, true);
  });

  it("mengubah projectUrl dan githubUrl null menjadi string kosong", () => {
    const project = mapProjectRecord(projectRecord);

    assert.equal(project.projectUrl, "");
    assert.equal(project.githubUrl, "");
  });

  it("menerima createdAt berupa string ISO dari respons JSON API", () => {
    const project = mapProjectRecord({
      ...projectRecord,
      createdAt: "2026-02-03T04:05:06.000Z",
    } as unknown as typeof projectRecord);

    assert.equal(project.createdAt, "2026-02-03T04:05:06.000Z");
  });
});
