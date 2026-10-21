# Task 29: P1 - UX / Mobile Navigation

> Sumber: user — "tambah mobile hamburger menu di Navbar"
> Status: DONE (selesai 2026-10-21, semua checklist terpenuhi).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS, Zustand 5 persist.

## Global Constraints

- **Jangan ubah perilaku desktop**: di layar `md` (768px) ke atas, navbar tetap seperti sekarang — logo `rhaditya.me` + 4 link horizontal (BERANDA, TENTANG SAYA, PROYEK, KONTAK).
- **Jangan ubah Easter egg**: double-klik logo `rhaditya.me` → `PinPrompt` tetap bekerja di mobile maupun desktop.
- **Jangan ubah tampilan publik (`/`)**: section layout, warna, spacing tetap sama.
- **Tanpa dependensi baru**: gunakan Tailwind responsive class (`md:`, `lg:`) + React state bawaan.
- **Verifikasi**: `bunx turbo run check-types lint build --filter=web` menunjukkan PASS.

## Task

### Bagian 1: Hamburger button + mobile menu state

- [•] Baca `apps/web/app/components/Navbar.tsx` penuh.
- [•] Tambah `useState` untuk `mobileOpen` (boolean, default `false`).
- [•] Buat hamburger button (3 baris SVG/icon) yang muncul di mobile, disembunyikan di desktop (`hidden md:flex`).
- [•] Saat hamburger diklik, toggle `mobileOpen`.

### Bagian 2: Mobile menu drawer/overlay

- [•] Buat mobile menu container yang muncul saat `mobileOpen === true`:
  - [•] Overlay latar hitam transparan (backdrop) yang menutup area di luar menu.
  - [•] Daftar `navItems` vertikal (BERANDA, TENTANG SAYA, PROYEK, KONTAK).
  - [•] Tiap item clickable → navigasi ke href, lalu tutup menu.
- [•] Mobile menu disembunyikan di desktop (`md:hidden` atau `md:flex`).

### Bagian 3: Responsive class pada nav links

- [•] Nav links desktop (`<div className="flex items-center gap-4">`) diberi class `hidden md:flex` agar hanya muncul di desktop.
- [•] Pastikan logo `rhaditya.me` selalu visible di kiri.

### Bagian 4: Verifikasi

- [•] Jalankan `bunx turbo run check-types lint build --filter=web` → PASS.
- [•] Jalankan dev server, buka di browser ukuran mobile (resize < 768px):
  - [•] Hamburger button muncul di kanan.
  - [•] Klik hamburger → menu mobile muncul (overlay + daftar vertikal).
  - [•] Klik item navigasi → halaman berubah, menu tertutup.
  - [•] Klik overlay / outside → menu tertutup.
  - [•] Resize ke desktop → hamburger menghilang, nav links horizontal kembali.
- [•] Pastikan Easter egg (double-klik logo → PinPrompt) masih bekerja di mobile.
- [•] Pastikan tidak ada error di console.

## Hasil Verifikasi (2026-10-21)

| Perintah | Hasil |
|---|---|
| `check-types` | PASS (3 successful, 3 total) |
| `lint` | PASS (3 successful, 3 total) |
| `build` | PASS (compiled successfully, 8 routes) |
| `GET /` | 200 |
| `GET /admin` | 200 |
| `GET /projects` | 404 |
| `GET /about` | 404 |
| `GET /contact` | 404 |

## Catatan

- Task ini **selesai 2026-10-21**. Semua checklist terpenuhi.
- Desain: mobile drawer slide from right (fixed right-0) + backdrop overlay (fixed inset-0 bg-black/60).
- Nav links desktop diberi class `hidden md:flex` agar hanya muncul di layar md ke atas.
- Hamburger button (SVG 3 baris / X icon) muncul di mobile, disembunyikan di desktop.
- Mobile drawer berisi daftar navItems vertikal dengan ADMIN badge (jika ownerMode true).
- Easter egg (double-klik logo → PinPrompt) tetap bekerja di mobile maupun desktop.