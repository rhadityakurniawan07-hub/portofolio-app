# Task 7: Modal Simpan Proyek Baru (PRD D.2)

> Sumber: `PRD.md` — Personal Portfolio & Minimalist Profile Web App, bagian D.2.
> Status: BELUM dikerjakan. Urutan: 7 dari 9.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode Slate/Navy `#0F172A`, Zustand 5 persist.

## Global Constraints

- Bahasa/copy Indonesia persis seperti PRD.
- Dark mode presisi, tanpa backend (state lokal + localStorage).
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS.

## Task

**Files:**
- Modify: `apps/web/app/components/ProjectModal.tsx`

**Isi:**
- [ ] Judul `Simpan Proyek Baru` + petunjuk *"Lengkapi parameter repositori atau aplikasi yang telah Anda selesaikan untuk disimpan ke arsip karya pribadi."*
- [ ] Field: `NAMA PROYEK *`, `DESKRIPSI SINGKAT PROYEK *`, `TEKNOLOGI / BAHASA PEMROGRAMAN *` (bantuan: *Pisahkan dengan koma (,)*), `TAUTAN WEB / LINK PROYEK`, `TANGGAL / TAHUN PEMBUATAN *`
- [ ] Tombol `Batal` & `Simpan ke Koleksi Proyek` hijau
