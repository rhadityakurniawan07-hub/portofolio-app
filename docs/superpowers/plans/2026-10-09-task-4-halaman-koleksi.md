# Task 4: Halaman Koleksi Proyek (PRD C.1–C.2)

> Sumber: `PRD.md` — Personal Portfolio & Minimalist Profile Web App, bagian C.1–C.2.
> Status: BELUM dikerjakan. Urutan: 4 dari 9.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode Slate/Navy `#0F172A`, Zustand 5 persist, lucide-react.

## Global Constraints

- Bahasa/copy Indonesia persis seperti PRD.
- Dark mode presisi, tanpa backend (state lokal + localStorage).
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS.

## Task

**Files:**
- Modify: `apps/web/app/projects/page.tsx`
- Modify: `apps/web/data/profile.ts` (seed 3 proyek contoh PRD)

**Isi:**
- [ ] Label `• ARSIP REPOSITORI PRIBADI`, judul `Daftar Proyek Saya`, deskripsi *"Koleksi dan arsip hasil pembuatan aplikasi & website pribadi."*
- [ ] Tombol `+ Simpan Proyek Baru`
- [ ] Search `Cari proyek berdasarkan judul atau teknologi (cth: Next.js, CLI)...` + filter dinamis judul/tech
- [ ] Counter `Menampilkan 3 proyek`
- [ ] Seed: `Aplikasi Manajemen Santri`, `Catatan & Task Manager CLI`, `Landing Page Evaluasi & Portofolio`
