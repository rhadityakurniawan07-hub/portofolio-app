# User Tasks - Portfolio App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyelesaikan 10 task portfolio (setup → database → komponen UI → modal → integrasi API) sesuai daftar pengguna.

**Architecture:** `apps/web` (Next.js 16 App Router) untuk UI + API Routes; `packages/database` (Prisma + PostgreSQL) untuk persistensi; `packages/ui` untuk komponen reusable. Task 2–6, 8–10 sebagian besar sudah dikerjakan Fase 1 (dengan localStorage); Task 3, 7, 11 (database/API) belum.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode, Zustand 5 persist, Prisma 5 + PostgreSQL, Zod 3, lucide-react, Node built-in test runner.

**Spec:** `PRD.md` + `docs/superpowers/specs/2026-10-08-portfolio-cms-design.md`

## Global Constraints

- Bahasa UI Indonesia sesuai PRD.
- `apps/docs/*`, `turbo.json` tidak disentuh.
- Semua perintah dari repo root; catatan env: `bun exec turbo` tidak jalan di mesin ini, pakai `bunx turbo`.
- Verifikasi per task: `bunx turbo run check-types --filter=web` harus PASS.

---

### Task 2: Project Setup & Environment Configuration — ✅ Selesai (verifikasi saja)

**Status:** Selesai di Fase 1. Task ini hanya verifikasi ulang.

**Files:**
- Verify: `package.json`, `turbo.json`, `bun.lock`, `.env.example`, `apps/web/package.json`

**Interfaces:**
- Consumes: tidak ada.
- Produces: workspace bun + turbo berjalan; `NEXT_PUBLIC_OWNER_PIN` tersedia di `.env.example`.

- [ ] **Step 1: Verifikasi install bersih**

Run: `bun install --frozen-lockfile`
Expected: `131 packages installed` tanpa error (memperbaiki junction `node_modules/turbo` yang pernah rusak).

- [ ] **Step 2: Verifikasi toolchain**

Run: `bunx turbo run check-types --filter=web`
Expected: PASS (`Tasks: 3 successful, 3 total`).

- [ ] **Step 3: Tanpa commit (tidak ada perubahan kode)**

Jika `git status --short` bersih, task selesai tanpa commit.

---

### Task 3: Database Schema & Migration Setup — ⏳ Belum (schema ada, migrasi belum)

**Status:** Schema `Profile`/`Project` sudah ada di `packages/database/prisma/schema.prisma`; migrasi + generate belum dijalankan.

**Files:**
- Verify: `packages/database/prisma/schema.prisma`
- Create (via prisma CLI): `packages/database/prisma/migrations/*`

**Interfaces:**
- Consumes: `DATABASE_URL` dari `.env` (lihat `.env.example`).
- Produces: tabel `profiles` + `projects` di PostgreSQL; Prisma Client ter-generate.

- [ ] **Step 1: Siapkan database lokal**

Salin `.env.example` menjadi `.env` dan isi `DATABASE_URL` PostgreSQL lokal, contoh:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/portofolio?schema=public"
```

- [ ] **Step 2: Jalankan migrasi + generate**

Run dari repo root:
```bash
bunx --cwd packages/database prisma migrate dev --name init
bunx --cwd packages/database prisma generate
```
Expected: migrasi `init` tercatat di `packages/database/prisma/migrations/`, tidak ada error koneksi.

- [ ] **Step 3: Commit hasil migrasi**

```bash
git add packages/database/prisma/migrations
git commit -m "feat(database): migrasi awal profiles dan projects"
```

---

### Task 4: UI Component - Header, Navbar, & Card Statistik — ✅ Selesai (verifikasi saja)

**Status:** Selesai di Fase 1 (Navbar + owner gating + `StatCard` + stats dinamis).

**Files:**
- Verify: `apps/web/app/components/Navbar.tsx`, `packages/ui/src/stat-card.tsx`, `apps/web/app/page.tsx`

**Interfaces:**
- Consumes: `useOwnerStore` (Task 2 Fase 1).
- Produces: badge `MODE PEMILIK AKTIF`, tab Data Diri/Koleksi Proyek, kartu `Hasil Kerja` = jumlah proyek store.

- [ ] **Step 1: Verifikasi visual + type-check**

Run: `bunx turbo run check-types lint --filter=web`
Expected: PASS.

- [ ] **Step 2: Manual check**

`bunx turbo dev --filter=web`: tab aktif sesuai route, badge hanya saat owner, kartu Hasil Kerja berubah mengikuti jumlah proyek. Tanpa commit bila bersih.

---

### Task 5: UI Component - Section Profil & Kontak Cepat — ✅ Selesai (verifikasi saja)

**Status:** Selesai di Fase 1 (`HeroSection`, `BiodataTable`, `QuickContacts` membaca store).

**Files:**
- Verify: `apps/web/app/components/HeroSection.tsx`, `BiodataTable.tsx`, `QuickContacts.tsx`

**Interfaces:**
- Consumes: `useProfileStore`.
- Produces: hero, tabel biodata + badge spesialisasi, 4 kartu kontak + toast salin.

- [ ] **Step 1: Verifikasi type-check + lint**

Run: `bunx turbo run check-types lint --filter=web`
Expected: PASS.

- [ ] **Step 2: Manual check persist**

Ubah profil (butuh owner, lihat Task 6), reload → perubahan bertahan (bukti `portfolio-profile` di localStorage). Tanpa commit bila bersih.

---

### Task 6: Feature - Modal Edit Informasi Diri — ✅ Selesai (verifikasi saja)

**Status:** Selesai di Fase 1 (`ProfileModal.tsx` 6 field sesuai PRD D.1 + validasi + gating owner).

**Files:**
- Verify: `apps/web/app/components/ProfileModal.tsx`, `apps/web/lib/portfolio.ts` (`validateProfileInput`)

**Interfaces:**
- Consumes: `useProfileStore.updateProfile`, `validateProfileInput`, `Modal`.
- Produces: profil terupdate di store + persist.

- [ ] **Step 1: Jalankan unit test validasi**

Run: `node --test apps/web/lib/portfolio.test.ts`
Expected: PASS (`pass 6, fail 0`).

- [ ] **Step 2: Manual check**

Tanpa owner tombol Ubah tersembunyi; dengan owner: email salah → error inline `Email tidak valid`; simpan benar → hero/biodata langsung berubah. Tanpa commit bila bersih.

---

### Task 7: API Integration - Get & Update Profile Data — ⏳ Belum

**Status:** Belum. Prasyarat: Task 3 (migrasi) selesai. Saat ini profil 100% localStorage.

**Files:**
- Create: `apps/web/app/api/profile/route.ts`
- Modify: `apps/web/stores/use-profile.ts` (tambah `loadFromApi`), `apps/web/app/components/ProfileModal.tsx` (simpan via API bila tersedia, fallback lokal)

**Interfaces:**
- Consumes: `prisma` dari `@repo/database`, `Profile` model Prisma.
- Produces: `GET /api/profile` → profil JSON; `PUT /api/profile` → profil terupdate; store tetap kompatibel (bentuk `profileData`).

- [ ] **Step 1: Buat API route profil**

```ts
// apps/web/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@repo/database";

export async function GET() {
  const profile = await prisma.profile.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!profile) return NextResponse.json({ profile: null });
  return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { name, role, bio, location, email, availability } = body;
  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Nama dan Email wajib diisi" }, { status: 400 });
  }
  const existing = await prisma.profile.findUnique({ where: { email: email.trim() } });
  const profile = existing
    ? await prisma.profile.update({ where: { id: existing.id }, data: { fullName: name, role, tagline: bio, location, email, availability } })
    : await prisma.profile.create({ data: { fullName: name, role, tagline: bio, location, email, availability, skills: [], languages: [] } });
  return NextResponse.json({ profile });
}
```

- [ ] **Step 2: Wire store + modal (dengan fallback lokal)**

Di `use-profile.ts` tambah `loadFromApi` yang `fetch("/api/profile")` dan pakai hasilnya bila ada, bila fetch gagal tetap pakai seed lokal (try/catch, jangan lempar error ke UI). Di `ProfileModal.save`, setelah validasi lokal lolos, `PUT` ke `/api/profile`; bila gagal (DB belum siap), tetap `updateProfile(form)` lokal + toast warning.

- [ ] **Step 3: Verifikasi**

Run: `bunx turbo run check-types lint --filter=web`
Expected: PASS. Manual: `curl http://localhost:3000/api/profile` → JSON profil; edit via modal → reload → data dari DB.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/api/profile/route.ts apps/web/stores/use-profile.ts apps/web/app/components/ProfileModal.tsx
git commit -m "feat(web): integrasi API get dan update profil"
```

---

### Task 8: UI Component - Page Koleksi Proyek & Search Bar — ⚠️ Sebagian (search belum)

**Status:** Halaman + tombol + counter selesai Fase 1; search bar masih pajangan. Implementasi search sudah direncanakan di `docs/superpowers/plans/2026-10-09-portfolio-fase-2-search-polish.md` Task 1 — kerjakan dari sana.

**Files:**
- Verify: `apps/web/app/projects/page.tsx`
- Lihat: plan Fase 2 Task 1 untuk implementasi search.

- [ ] **Step 1: Verifikasi kondisi kini**

Run: `bunx turbo run check-types --filter=web`
Expected: PASS. Buka `/projects`: input search ada tapi mengetik tidak menyaring (konfirmasi scope sisa).

- [ ] **Step 2: Eksekusi plan Fase 2 Task 1**

Ikuti `docs/superpowers/plans/2026-10-09-portfolio-fase-2-search-polish.md` Task 1 (query state + `useMemo` filter + counter + empty state). Commit mengikuti langkah di sana, bukan di sini.

---

### Task 9: UI Component - Card Proyek & Ringkasan Proyek Terkini — ✅ Selesai (verifikasi saja)

**Status:** Selesai di Fase 1 (`ProjectCard.tsx` + `RecentProjects.tsx` 2 terbaru dari store).

**Files:**
- Verify: `apps/web/app/components/ProjectCard.tsx`, `RecentProjects.tsx`

**Interfaces:**
- Consumes: `useProjectsStore((s) => s.projects)`.
- Produces: kartu (tahun • kategori, tech badges, status) + showcase 2 terbaru di home.

- [ ] **Step 1: Verifikasi type-check + lint**

Run: `bunx turbo run check-types lint --filter=web`
Expected: PASS.

- [ ] **Step 2: Manual check**

Tambah proyek via `/projects` (owner) → kartu muncul + `RecentProjects` di home ikut update + reload bertahan. Tanpa commit bila bersih.

---

### Task 10: Feature - Modal Simpan / Tambah Proyek Baru — ✅ Selesai (verifikasi saja)

**Status:** Selesai di Fase 1 (`ProjectModal.tsx` create/edit + `DeleteConfirm.tsx` + validasi, 5 field PRD D.2).

**Files:**
- Verify: `apps/web/app/components/ProjectModal.tsx`, `DeleteConfirm.tsx`, `apps/web/lib/portfolio.ts` (`validateProjectInput`, `parseTechStack`, `normalizeUrl`)

**Interfaces:**
- Consumes: `useProjectsStore.addProject/updateProject/removeProject`, helpers validasi, `Modal`.
- Produces: proyek baru/terupdate/terhapus di store + persist.

- [ ] **Step 1: Jalankan unit test**

Run: `node --test apps/web/lib/portfolio.test.ts`
Expected: PASS (`pass 6, fail 0`).

- [ ] **Step 2: Manual check**

Form kosong → error 4 required; tech `a, b, a` → tersimpan `["a","b"]`; link `example.com` → tersimpan `https://example.com`; hapus → konfirmasi dulu. Tanpa commit bila bersih.

---

### Task 11: API Integration - CRUD Projects — ⏳ Belum

**Status:** Belum. Prasyarat: Task 3 (migrasi) selesai. Saat ini proyek 100% localStorage.

**Files:**
- Create: `apps/web/app/api/projects/route.ts` (GET + POST)
- Create: `apps/web/app/api/projects/[id]/route.ts` (PUT + DELETE)
- Modify: `apps/web/stores/use-projects.ts` (load + mutasi via API dengan fallback lokal)

**Interfaces:**
- Consumes: `prisma` dari `@repo/database`, `Project` model Prisma, `validateProjectInput`.
- Produces: `GET/POST /api/projects`, `PUT/DELETE /api/projects/[id]`; store tetap berbentuk `Project[]` seperti kini.

- [ ] **Step 1: Buat route koleksi**

```ts
// apps/web/app/api/projects/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { validateProjectInput, parseTechStack } from "@/lib/portfolio";

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const body = await req.json();
  const techStack = Array.isArray(body.techStack) ? body.techStack : parseTechStack(body.tech ?? "");
  const errs = validateProjectInput({ title: body.title ?? "", description: body.description ?? "", techStack, year: body.year ?? "", link: body.link ?? "" });
  if (errs.length > 0) return NextResponse.json({ errors: errs }, { status: 400 });
  const created = await prisma.project.create({
    data: { title: body.title, description: body.description, techStack, link: body.link ?? "", year: body.year, category: body.category ?? "Online" },
  });
  return NextResponse.json({ project: created }, { status: 201 });
}
```

- [ ] **Step 2: Buat route item + wire store**

`apps/web/app/api/projects/[id]/route.ts` dengan `PUT` (validasi sama, `prisma.project.update`) dan `DELETE` (`prisma.project.delete`, 404 bila tidak ada). Di `use-projects.ts`: `addProject/updateProject/removeProject` jadi async — coba `fetch` API dulu, bila gagal fallback ke logika lokal yang ada sekarang (bungkus try/catch per aksi).

- [ ] **Step 3: Verifikasi**

Run: `bunx turbo run check-types lint --filter=web`
Expected: PASS. Manual: `curl -X POST http://localhost:3000/api/projects -H "Content-Type: application/json" -d '{"title":"Tes","description":"Tes","techStack":["Next.js"],"year":"2026"}'` → `201`; tampil di `/projects`; hapus via UI → hilang + reload tetap hilang.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/api/projects/route.ts "apps/web/app/api/projects/[id]/route.ts" apps/web/stores/use-projects.ts
git commit -m "feat(web): integrasi API CRUD projects"
```

---

## Self-Review

1. **Spec coverage:** 10 task pengguna terpetakan semua — 2, 4, 5, 6, 9, 10 selesai Fase 1 (langkah verifikasi), 8 sebagian (merujuk plan Fase 2), 3, 7, 11 belum (langkah implementasi konkret). Tidak ada gap.
2. **Placeholder scan:** tidak ada `TBD/TODO/implement later` — langkah berisi perintah aktual, kode route aktual, dan kriteria Expected konkret.
3. **Type consistency:** bentuk `Project`/`profileData` dipertahankan di semua task API agar store dan komponen Fase 1 tidak berubah kontrak; `number | string` id dari Fase 1 dihormati (Prisma `cuid()` string cocok dengan cabang string).
