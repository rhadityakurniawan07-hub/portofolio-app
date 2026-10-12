// apps/web/lib/backup.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildBackup, parseBackup } from "./backup.ts";
import { profileData } from "../data/profile.ts";

describe("buildBackup", () => {
  it("bungkus profil dan proyek dengan versi 1", () => {
    const b = buildBackup(profileData, []);
    assert.equal(b.version, 1);
    assert.equal(b.profile.name, profileData.name);
    assert.deepEqual(b.projects, []);
    assert.ok(typeof b.exportedAt === "string");
  });
});

describe("parseBackup", () => {
  it("tolak bukan objek dan versi asing", () => {
    assert.equal(parseBackup(null).ok, false);
    assert.equal(parseBackup({ version: 2 }).ok, false);
  });
  it("tolak profil/proyek rusak", () => {
    assert.equal(parseBackup({ version: 1, profile: {}, projects: [] }).ok, false);
    assert.equal(
      parseBackup({ version: 1, profile: { name: "A", email: "a@b.c" }, projects: [{ title: 1 }] }).ok,
      false
    );
  });
  it("terima hasil buildBackup", () => {
    const b = buildBackup(profileData, []);
    const r = parseBackup(JSON.parse(JSON.stringify(b)));
    assert.equal(r.ok, true);
  });
});
