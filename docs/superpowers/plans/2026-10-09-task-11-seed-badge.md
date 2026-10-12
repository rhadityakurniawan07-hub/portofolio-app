# Task 11: Migrasi Seed Proyek Lama + Badge Hero Jujur

> Sumber: audit "yang kurang untuk web portofolio" — temuan prioritas tinggi nomor 1 (data proyek lama menempel) dan 2 (badge hero hardcoded).
> Status: SUDAH dikerjakan (commit `03535a1`). File ini dokumentasi susulan.
> Latar: pengunjung yang pernah buka versi lama tetap melihat 2 proyek contoh lama karena localStorage menimpa seed baru; badge hero selalu `• TERSEDIA UNTUK PROYEK` walau status diubah Sibuk.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode Slate/Navy `#0F172A`, Zustand 5 persist.

## Global Constraints

- Bahasa/copy Indonesia persis seperti PRD.
- Dark mode presisi, tanpa backend (state lokal + localStorage).
- Data buatan user tidak boleh hilang saat migrasi.
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS; `node --test apps/web/lib/portfolio.test.ts` tetap PASS.

## Task

**Files:**
- Modified: `apps/web/stores/use-projects.ts` (merge berversi)
- Modified: `apps/web/app/components/HeroSection.tsx` (badge dinamis)

**Isi:**
- [x] Store `portfolio-projects` versi 1 dengan fungsi `merge`: seed baru (Santri/CLI/Landing) selalu dipakai, seed lama ber-id number dibuang, proyek buatan user (id string) dipertahankan
- [x] Badge hero dinamis: status `available` → `• TERSEDIA UNTUK PROYEK` (sesuai PRD B.1); selain itu → teks `availability` versi kapital (titik hijau/abu sudah mengikuti sejak Task 10)
- [x] Verifikasi: test 10/10 PASS, check-types + lint sukses 0 warning, build sukses (1x gagal TS2869 `??` tak terjangkau — diperbaiki sebelum commit)
