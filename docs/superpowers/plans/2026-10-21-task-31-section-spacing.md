# Task 31: Tambah spacing antar section di halaman utama

> Sumber: user — "tambahkan jarak (margin-bottom / spacing) yang cukup dan lega antar section di halaman utama agar antarmuka tidak terlalu menempel padat"
> Status: DONE (selesai 2026-10-22, semua checklist terpenuhi).

**Tech Stack:** Next.js 16 App Router, Tailwind CSS, React 19.

## Global Constraints

- **Jangan ubah tampilan section itu sendiri**: Hero, About, ProfileCard, Projects, Contact tetap sama (warna, layout, konten).
- **Hanya ubah spacing/jarak antar section** di `apps/web/app/page.tsx`.
- **Jangan ubah section order**: Hero → About → ProfileCard → Projects → Contact (dari Task 26).
- **Tanpa dependensi baru**: gunakan Tailwind spacing utility (`space-y-*`, `mb-*`, `py-*`).
- **Verifikasi**: `bunx turbo run check-types lint build --filter=web` menunjukkan PASS.

## Task

### Bagian 1: Tambah spacing antar section

- [•] Baca `apps/web/app/page.tsx` penuh.
- [•] Saat ini container inner punya class `space-y-16` (jarak 64px antar section).
- [•] Ubah class inner container dari `space-y-16` menjadi spacing yang lebih lega, misal:
  - [•] Opsi A: `space-y-24 md:space-y-32` (96px desktop / 96px mobile) — **dipilih**
  - [ ] Opsi B: `space-y-20 md:space-y-40` (80px mobile / 160px desktop)
  - [ ] Opsi C: tambah `pt-*` / `pb-*` pada tiap section child (misal `mb-20 md:mb-32`)
- [•] Pilih opsi yang paling seimbang tanpa membuat halaman terlalu panjang (perhatikan viewport mobile).

### Bagian 2: Verifikasi visual

- [•] Jalankan `bunx turbo run check-types lint build --filter=web` → PASS.
- [•] Jalankan dev server, buka `/` di browser:
  - [•] Jarak antara Hero dan About terasa lega (tidak menempel).
  - [•] Jarak antara About dan ProfileCard lega.
  - [•] Jarak antara ProfileCard dan Projects lega.
  - [•] Jarak antara Projects dan Contact lega.
  - [•] Tidak ada overflow horizontal atau layout yang rusak di mobile.
  - [•] Tidak ada perubahan pada konten section (teks, gambar, tombol tetap sama).

### Bagian 3: Git commit

- [•] Commit perubahan `apps/web/app/page.tsx` dengan pesan deskriptif.

## Hasil Verifikasi (2026-10-22)

| Perintah | Hasil |
|---|---|
| `check-types` | PASS (3 successful, 3 total) |
| `lint` | PASS (3 successful, 3 total) |
| `build` | PASS (compiled successfully, 8 routes) |
| `GET /` | 200 |
| `GET /admin` | 200 |
| `GET /api/contact` | 200 |
| `GET /projects` | 404 |
| `GET /about` | 404 |
| `GET /contact` | 404 |

## Catatan

- Task ini **selesai 2026-10-22**. Semua checklist terpenuhi.
- Opsi A (`space-y-24 md:space-y-32`) dipilih — lega tapi tidak berlebihan.
- Hanya class Tailwind di `apps/web/app/page.tsx` yang diubah, section itu sendiri tidak diubah.