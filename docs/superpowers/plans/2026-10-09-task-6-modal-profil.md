# Task 6: Modal Ubah Informasi Diri (PRD D.1)

> Sumber: `PRD.md` — Personal Portfolio & Minimalist Profile Web App, bagian D.1.
> Status: BELUM dikerjakan. Urutan: 6 dari 9.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode Slate/Navy `#0F172A`, Zustand 5 persist.

## Global Constraints

- Bahasa/copy Indonesia persis seperti PRD.
- Dark mode presisi, tanpa backend (state lokal + localStorage).
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS.

## Task

**Files:**
- Modify: `apps/web/app/components/ProfileModal.tsx`

**Isi:**
- [ ] Judul `Ubah Informasi Diri` + petunjuk *"Perbarui nama, deskripsi singkat, dan detail kontak di bawah secara langsung."*
- [ ] Field: Nama Lengkap, Peran Utama, Tagline/Bio (textarea), Domisili & Email (2 kolom), Status Ketersediaan
- [ ] Tombol `Batal` & `Simpan Perubahan` hijau; simpan dinamis ke state
