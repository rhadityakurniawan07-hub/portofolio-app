# Task 13: Footer Menempel di Bawah (Tidak Mengambang)

> Sumber: laporan pemilik — footer tampil mengambang di tengah halaman saat konten pendek (lihat screenshot), seharusnya menempel di bawah viewport.
> Status: BELUM dikerjakan.

**Tech Stack:** Next.js 16 App Router, Tailwind 3.

## Global Constraints

- Tidak mengubah tampilan footer (isi dan gaya tetap).
- Berlaku untuk semua halaman (`/` dan `/projects`, pendek maupun panjang).
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS.

## Task

**Files:**
- Modify: `apps/web/app/layout.tsx` (body jadi flex column + `main` flex-1)

**Isi:**
- [ ] `body`: tambah `flex min-h-screen flex-col` (pertahankan class yang ada)
- [ ] `main`: tambah `flex-1` agar mendorong footer ke bawah saat konten pendek
- [ ] Manual: buka `/` dan `/projects` di viewport tinggi — footer selalu di bawah; konten panjang tetap normal (footer setelah konten)
