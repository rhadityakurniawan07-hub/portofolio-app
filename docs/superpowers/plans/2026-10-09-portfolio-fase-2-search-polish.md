# Portfolio Fase 2 (Search + Polish) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyelesaikan sisa PRD yang belum dikerjakan Fase 1: pencarian proyek judul/teknologi, toast salin email visual, audit responsif, dan bersih-bersih minor.

**Architecture:** Hanya `apps/web` yang diubah; search sebagai derived state (`useMemo`) dari `useProjectsStore` tanpa mengubah store; toast memakai pola `useState` + `setTimeout` yang sudah ada; tanpa dependensi baru.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode, Zustand 5 (read-only di task ini), lucide-react, Node built-in test runner.

**Spec:** `PRD.md` (bagian C.2 pencarian & counter, acceptance criteria 1–4) + `docs/superpowers/specs/2026-10-08-portfolio-cms-design.md` (bagian "Fase 2 (di luar spec ini)").

## Global Constraints

- Tanpa dependensi baru (tidak tambah Radix / RHF / Zod / vitest / sonner).
- Bahasa UI Indonesia (contoh: `Menampilkan N proyek`, `Tidak ada proyek yang cocok`, `Hapus pencarian`, `Email disalin`).
- `packages/database` (Prisma) tetap tidak di-wiring; `apps/docs/*`, `turbo.json`, `prisma/schema.prisma` tidak disentuh.
- Semua perintah dari repo root; verifikasi per task: `bunx turbo run check-types --filter=web` harus PASS (catatan env: `bun exec turbo` tidak jalan di mesin ini, pakai `bunx turbo`).
- Search case-insensitive, cocok sebagian (substring), mencakup `title` + setiap entri `techStack`.

---

### Task 1: Search + filter + counter + empty state

**Files:**
- Modify: `apps/web/app/projects/page.tsx` (satu-satunya file).

**Interfaces:**
- Consumes: `useProjectsStore((s) => s.projects)` (bentuk `Project[]` dari `@/data/profile`, tidak berubah).
- Produces: halaman `/projects` dengan `visible: Project[]` terfilter; tidak ada interface baru untuk task lain.

- [ ] **Step 1: Tambah state query + derived filter**

Tambah import `useMemo` di baris import React yang sudah ada:
```tsx
import { useMemo, useState } from "react";
```
Setelah baris `const [deleteId, ...] = useState<number | string | null>(null);` tambah:
```tsx
const [query, setQuery] = useState("");
const q = query.trim().toLowerCase();
const visible = useMemo(
  () =>
    q === ""
      ? projects
      : projects.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.techStack.some((t) => t.toLowerCase().includes(q))
        ),
  [projects, q]
);
```

- [ ] **Step 2: Jadikan input pencarian controlled**

Ubah `<input type="search" ... />` yang sekarang uncontrolled menjadi:
```tsx
<input
  type="search"
  placeholder="Cari proyek (judul, teknologi)..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  className="w-full rounded-lg border border-gray-700 bg-gray-900/50 pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
  aria-label="Cari proyek"
/>
```

- [ ] **Step 3: Counter + grid + empty state pakai `visible`**

Ganti `<p className="text-sm text-muted-foreground">Menampilkan {projects.length} proyek</p>` menjadi:
```tsx
<p className="text-sm text-muted-foreground" role="status">
  {q === ""
    ? `Menampilkan ${projects.length} proyek`
    : `Menampilkan ${visible.length} dari ${projects.length} proyek untuk "${query.trim()}"`}
</p>
```
Ganti kondisi empty-state `projects.length === 0` menjadi dua cabang:
```tsx
{visible.length === 0 && q !== "" && (
  <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
    <p className="text-muted-foreground">Tidak ada proyek yang cocok untuk &quot;{query.trim()}&quot;.</p>
    <button
      onClick={() => setQuery("")}
      className="mt-3 rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-800"
    >
      Hapus pencarian
    </button>
  </div>
)}
{projects.length === 0 && (
  <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center text-muted-foreground">
    Belum ada proyek. Klik &quot;Simpan Proyek Baru&quot; untuk menambahkan.
  </div>
)}
```
Ganti `{projects.map((project) => (` menjadi `{visible.map((project) => (`.

- [ ] **Step 4: Run type-check**

Run: `bunx turbo run check-types --filter=web`
Expected: PASS (`Tasks: 3 successful, 3 total`).

- [ ] **Step 5: Manual check search**

Jalankan `bunx turbo dev --filter=web`, buka `/projects`: ketik `cli` → hanya kartu ber-tech CLI yang tampil + counter berubah; ketik `xyz-tidak-ada` → empty state + tombol Hapus pencarian mengosongkan query; hapus query → semua kartu kembali.

- [ ] **Step 6: Commit**

```bash
git add apps/web/app/projects/page.tsx
git commit -m "feat(web): pencarian proyek judul dan tech stack"
```

---

### Task 2: Toast visual salin email

**Files:**
- Modify: `apps/web/app/components/QuickContacts.tsx`
- Modify: `apps/web/app/components/HeroSection.tsx`

**Interfaces:**
- Consumes: state `copied` + `setTimeout(..., 2000)` yang sudah ada di kedua file (tidak diubah).
- Produces: tidak ada interface baru.

- [ ] **Step 1: Toast visual di QuickContacts**

Ganti blok sr-only yang ditambah Task 7 Fase 1:
```tsx
{contact.copyable && (
  <span role="status" className="sr-only">
    {copied === contact.label ? "Email disalin" : ""}
  </span>
)}
```
menjadi toast global di bawah `</div>` penutup grid (masih di dalam `<section>`, setelah `contacts.map` selesai):
```tsx
{copied && (
  <div
    role="status"
    className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-lg border border-green-500/30 bg-gray-950 px-4 py-2 text-sm font-medium text-green-400 shadow-2xl"
  >
    Email disalin ke clipboard
  </div>
)}
```
Toast muncul/hilang mengikuti `copied` yang sudah di-reset `setTimeout(..., 2000)` — tanpa state baru.

- [ ] **Step 2: Status aksesibilitas di tombol Hubungi HeroSection**

Di dalam `<button onClick={handleCopyEmail} ...>` setelah `{copied ? "Disalin!" : "Hubungi"}` tambah:
```tsx
<span role="status" className="sr-only">
  {copied ? "Email disalin" : ""}
</span>
```

- [ ] **Step 3: Run type-check + lint**

Run: `bunx turbo run check-types lint --filter=web`
Expected: PASS (`Tasks: 6 successful, 6 total`).

- [ ] **Step 4: Manual check toast**

Klik ikon salin di kartu Email → toast hijau muncul di bawah tengah ±2 detik lalu hilang; klik Hubungi di hero → teks jadi `Disalin!` (perilaku lama tetap).

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/components/QuickContacts.tsx apps/web/app/components/HeroSection.tsx
git commit -m "feat(web): toast visual salin email"
```

---

### Task 3: Bersih-bersih minor

**Files:**
- Modify: `apps/web/app/components/HeroSection.tsx`
- Modify: `apps/web/app/components/ProfileModal.tsx`

**Interfaces:**
- Consumes: tidak ada yang baru.
- Produces: tidak ada interface baru.

- [ ] **Step 1: Hapus import mati**

Ubah baris:
```tsx
import { Mail, MapPin, Github, Linkedin, Twitter, ExternalLink } from "lucide-react";
```
menjadi:
```tsx
import { Mail, MapPin, Github, Linkedin, Twitter } from "lucide-react";
```
(`ExternalLink` tidak dipakai di file ini — sudah diverifikasi via grep.)

- [ ] **Step 2: Sinkronkan form ProfileModal setiap dibuka**

Setelah `const [errors, setErrors] = useState<string[]>([]);` tambah:
```tsx
useEffect(() => {
  if (open) {
    setForm(profile);
    setErrors([]);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [open ]);
```
Dan ubah import `import { useState } from "react";` menjadi `import { useEffect, useState } from "react";`.
Alasan: `useState(profile)` hanya membaca sekali saat mount; tanpa ini, perubahan profil dari sesi sebelumnya tidak tercermin saat modal dibuka ulang.

- [ ] **Step 3: Run type-check + lint**

Run: `bunx turbo run check-types lint --filter=web`
Expected: PASS. Jika lint protes `exhaustive-deps` atas `[open]`, komentar disable di atas sudah menanganinya; jika rule tidak ada, hapus baris komentar itu dan ulangi lint.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/components/HeroSection.tsx apps/web/app/components/ProfileModal.tsx
git commit -m "chore(web): hapus import mati dan sinkron form profil"
```

---

### Task 4: Audit responsif (acceptance PRD #1)

**Files:**
- Modify: hanya file yang terbukti rusak saat audit (dilaporkan dulu sebelum diubah; kandidat: `app/page.tsx`, `app/projects/page.tsx`, `app/components/*.tsx`, `packages/ui/src/modal.tsx`).

**Interfaces:**
- Consumes: tidak ada yang baru.
- Produces: tidak ada interface baru.

- [ ] **Step 1: Audit viewport mobile 390px**

Run: `bunx turbo dev --filter=web`, buka DevTools responsive `390×844`, kunjungi `/` dan `/projects`, buka tiap modal (PIN, Ubah Profil, Simpan Proyek, Hapus). Catat yang rusak (teks terpotong, tombol bertumpuk, modal overflow, grid 1 kolom tidak terjadi). Expected: grid proyek 1 kolom, modal muat penuh dengan scroll dalam bila konten tinggi.

- [ ] **Step 2: Audit viewport desktop 1280px**

Ulangi Step 1 pada `1280×800`. Expected: grid home 3 kolom stats / 2 kolom showcase, grid projects 3 kolom, modal max-w-lg di tengah.

- [ ] **Step 3: Perbaiki yang rusak saja**

Hanya ubah class Tailwind yang terbukti rusak di Step 1–2 (contoh pola: tambah `max-h-[90vh] overflow-y-auto` pada kontainer modal di `packages/ui/src/modal.tsx` bila modal tidak bisa di-scroll di 390px; tambah `min-w-0`/`break-words` pada judul proyek bila overflow). Jangan refactor di luar temuan.

- [ ] **Step 4: Run type-check + lint**

Run: `bunx turbo run check-types lint --filter=web`
Expected: PASS.

- [ ] **Step 5: Commit (termasuk bila tanpa perubahan)**

Jika ada perbaikan:
```bash
git add -A
git commit -m "fix(web): responsif mobile dan desktop"
```
Jika nihil temuan, tetap catat di pesan commit kosong? Tidak — tanpa perubahan tidak perlu commit; tulis `AUDIT BERSIH` di laporan akhir.

---

### Task 5: Verifikasi akhir acceptance PRD 1–4

**Files:** Tidak ada perubahan kode (kecuali perbaikan blocker bila ditemukan).

**Interfaces:** Tidak ada.

- [ ] **Step 1: Full automated verification**

Run: `node --test apps/web/lib/portfolio.test.ts`
Expected: PASS (`pass 6, fail 0`).

Run: `bunx turbo run check-types lint --filter=web --force`
Expected: PASS.

Run: `bunx turbo run build --filter=web --force`
Expected: PASS (route `/` dan `/projects` ter-generate).

- [ ] **Step 2: Checklist manual 4 acceptance PRD**

1. Responsif desktop + mobile (hasil Task 4).
2. Modal Ubah Profil & Simpan Proyek terbuka tanpa merusak layout utama.
3. Salin email memberi toast (hasil Task 2).
4. Search `/projects` menyaring judul maupun tech stack, misal: `next` cocok via tech, `e-commerce` cocok via judul (hasil Task 1).

- [ ] **Step 3: Laporkan hasil**

Tulis ringkasan per kriteria (LOLOS/GAGAL + bukti). Jika ada GAGAL, stop — buat task perbaikan baru, jangan lanjut ke finishing.

---

## Self-Review

1. **Spec coverage:** PRD C.2 (search + counter) → Task 1. Acceptance #3 (toast) → Task 2. Acceptance #1 (responsif) → Task 4. Acceptance #2 + #4 → Task 5 checklist. Cleanup minor → Task 3. Tidak ada gap; migrasi Prisma/Supabase eksplisit di luar scope (Fase 3).
2. **Placeholder scan:** tidak ada `TBD/TODO/implement later` — semua langkah berisi kode/perintah aktual termasuk fallback bila lint protes dan bila audit nihil temuan.
3. **Type consistency:** `visible: Project[]` berasal dari `projects` tanpa konversi tipe; `editingId: number | string | null` dan signature store `number | string` dari Fase 1 tidak berubah; `role="status"` konsisten di kedua toast.
