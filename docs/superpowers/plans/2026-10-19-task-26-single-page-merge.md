# Task 26: Gabungkan halaman `/projects`, `/about`, `/contact` menjadi satu halaman (`/`)

> Sumber: user — "tolong dihapus /projects, /about, /contact, dijadikan satu halaman aja."
> Status: DONE (selesai 2026-10-19, semua checklist terpenuhi).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS, Zustand 5 persist.

## Global Constraints

- Hanya buat komponen baru + rewrite page; jangan hapus fitur yang sudah berfungsi (misal proyek filter/modal masih wajip kerja).
- Simpan log state dan mekanisme akses milik masing-masing (ownerMode, PIN) supaya tidak hilang.
- Tanpa dependensi baru; verifikasi `bunx turbo run check-types lint --filter=web` menunjukkan PASS.
- Hasil akhir: 3 URL (/projects, /about, /contact) **dihapus**, navigasi hanya 1 halaman akt.

## Task

**Isi:**
- [•] Buat `apps/web/app/components/ProjectsSection.tsx`: ekstrak logika filter/search/sort/modal/delete dari `projects/page.tsx` (isi komponen internal, tanpa wrapper `container`).
- [•] Buat `apps/web/app/components/ContactSection.tsx`: ekstrak info kontak + form kirim pesan dari `contact/page.tsx`.
- [•] Rewrite `app/page.tsx` → rendering: HeroSection → AboutSection → ProfileCard → ProjectsSection → ContactSection.
- [•] Hapus file: `app/projects/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`.
- [•] Update Navbar: 3 link menjadi anchor (`#tentang-saya`, `#proyek`, `#kontak`); BERANDA→`/`.
- [•] Update link di HeroSection & ProfileCard (`/projects`, `/contact`) → anchor `#proyek`/`#kontak`; projects detail page link `/projects`→`#proyek`.
- [•] Verifikasi: typecheck + lint + build + curl routes (`/`, `/projects`, `/about`, `/contact` = 404) + screenshot page utama.

## Hasil Verifikasi (2026-10-19)

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

- Task ini **selesai 2026-10-19**. Semua checklist terpenuhi.
- 3 URL (/projects, /about, /contact) sudah dihapus, navigasi hanya 1 halaman akt (`/`).
- Urutan section di `/`: Hero → About → ProfileCard → Projects → Contact.