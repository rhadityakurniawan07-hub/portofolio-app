# Task 9: Verifikasi Acceptance PRD 1–4

> Sumber: `PRD.md` — Personal Portfolio & Minimalist Profile Web App, bagian 5.
> Status: BELUM dikerjakan. Urutan: 9 dari 9 (terakhir, setelah Task 1–8).

**Tech Stack:** Next.js 16 App Router, Node built-in test runner.

## Global Constraints

- Bahasa/copy Indonesia persis seperti PRD.
- Dark mode presisi, tanpa backend (state lokal + localStorage).

## Task

**Files:** Tidak ada perubahan kode (kecuali blocker).

**Isi:**
- [ ] `node --test apps/web/lib/portfolio.test.ts` → PASS
- [ ] `bunx turbo run check-types lint --filter=web` → PASS; `bunx turbo run build --filter=web` → PASS
- [ ] Manual: (1) dark bersih presisi, (2) pindah Data Diri ↔ Koleksi lancar, (3) kedua modal overlay tanpa merusak layout, (4) form menyimpan dinamis ke state + reload bertahan
