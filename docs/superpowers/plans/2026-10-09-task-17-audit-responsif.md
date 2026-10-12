# Task 17: Audit Responsif Formal

> Sumber: saran audit + acceptance PRD #1 — belum pernah dicek sistematis di layar kecil dan desktop.
> Status: BELUM dikerjakan.

**Tech Stack:** Next.js 16 App Router, Tailwind 3.

## Global Constraints

- Hanya ubah class yang terbukti rusak; tanpa refactor di luar temuan.
- Verifikasi: `bunx turbo run check-types lint --filter=web` harus PASS.

## Task

**Files:**
- Modify: hanya file yang terbukti rusak (kandidat: `app/page.tsx`, `app/projects/page.tsx`, `app/components/*.tsx`, `packages/ui/src/modal.tsx`)

**Isi:**
- [ ] Cek `390×844`: `/`, `/projects`, semua modal (PIN, profil, proyek, hapus) — catat yang rusak
- [ ] Cek `1280×800`: grid, modal tengah, footer bawah
- [ ] Perbaiki temuan saja (pola: `max-h-[90vh] overflow-y-auto` modal, `min-w-0`/`break-words` teks panjang)
- [ ] Tanpa temuan = tanpa commit kode (cukup laporan)
