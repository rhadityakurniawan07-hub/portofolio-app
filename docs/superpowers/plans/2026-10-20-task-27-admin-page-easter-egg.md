# Task 27: Buat halaman admin (page 2) dengan login disembunyikan (Easter egg)

> Sumber: user — "buat task page 2 untuk admin, jadi untuk loginnya tersebut di sembunyikan jangan di luar seperti itu jadi untuk loginnya di buat Easter egg seperti itu"
> Status: DONE (selesai 2026-10-20, semua checklist terpenuhi).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS, Zustand 5 persist, Prisma/PostgreSQL.

## Global Constraints

- **Jangan ubah tampilan publik**: halaman utama (`/`) tetap sama, navbar tetap hanya `rhaditya.me` + `MASUK`.
- **Login disembunyikan (Easter egg)**: tidak ada tombol/login yang terlihat di luar. Akses halaman admin hanya melalui interaksi tersembunyi (misal: double-klik logo `rhaditya.me`, atau kombinasi keyboard).
- **Gunakan kembali infrastruktur yang ada** (jangan buat ulang):
  - `useOwnerStore` (PIN, persisted) — `apps/web/stores/use-owner.ts`
  - `PinPrompt` — `apps/web/app/components/PinPrompt.tsx`
  - `ProfileEditPanel` (edit profil: foto/data) — `apps/web/app/components/ProfileEditPanel.tsx`
  - `ProjectsSection` (manage projects: add/edit/delete) — `apps/web/app/components/ProjectsSection.tsx`
  - API: `/api/profile` (GET/PUT), `/api/projects` (GET/POST)
- Tanpa dependensi baru; verifikasi `bunx turbo run check-types lint build --filter=web` menunjukkan PASS.

## Task

**Isi:**
- [•] Buat task doc di `docs/superpowers/plans/2026-10-20-task-27-admin-page-easter-egg.md` (file ini).
- [•] Buat halaman admin: `apps/web/app/admin/page.tsx` (page 2) — dashboard untuk:
  - [•] Mengubah foto (Hero + About) — reuse `ProfileEditPanel`
  - [•] Mengubah data profil (nama, email, bio, dll) — reuse `ProfileEditPanel`
  - [•] Mengelola proyek (tambah/edit/hapus) — reuse `ProjectsSection`
- [•] Tambahkan mekanisme Easter egg activation di `Navbar.tsx` (double-klik logo `rhaditya.me` → buka `PinPrompt`).
- [•] Pastikan akses `/admin` membutuhkan owner mode (PIN) — redirect ke `/` jika belum login.
- [•] Verifikasi: typecheck + lint + build + curl route (`/` = 200, `/admin` = 200, navbar tidak ada tombol MASUK) — PASS.

## Hasil Verifikasi (2026-10-20)

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

- Task ini **selesai 2026-10-20**. Semua checklist terpenuhi.
- Login disembunyikan (Easter egg): double-klik logo `rhaditya.me` → `PinPrompt` → PIN benar → redirect ke `/admin`.
- Tombol "Keluar" di header admin adalah satu-satunya yang memanggil `logout()`.
- Badge "ADMIN" muncul di Navbar saat `ownerMode: true`.