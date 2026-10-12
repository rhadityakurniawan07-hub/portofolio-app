# Task 16: Toast Aksi Simpan/Hapus

> Sumber: saran audit — baru salin email yang punya toast; simpan/hapus proyek tanpa konfirmasi visual.
> Status: BELUM dikerjakan.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3.

## Global Constraints

- Pakai pola toast yang sudah ada (fixed bottom, `role="status"`, hilang ±2 detik) — tanpa dependensi baru.
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS.

## Task

**Files:**
- Create: `apps/web/app/components/Toast.tsx` (komponen toast reusable: `Toast({ message })`)
- Modify: `apps/web/app/components/ProjectModal.tsx` (toast `Proyek disimpan`), `DeleteConfirm.tsx` atau pemanggilnya (toast `Proyek dihapus`), `ProfileModal.tsx` (toast `Profil diperbarui`)

**Isi:**
- [ ] Komponen `Toast` reusable gantikan toast inline di HeroSection/ProfileCard (jangan duplikasi)
- [ ] Tiap aksi tulis → toast hijau muncul ±2 detik; tidak mengganggu layout
