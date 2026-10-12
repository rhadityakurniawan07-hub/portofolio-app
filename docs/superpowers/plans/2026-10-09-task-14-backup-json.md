# Task 14: Backup Export/Import JSON

> Sumber: saran audit — seluruh data (profil, proyek, foto) hanya di localStorage; HP hilang/cache dihapus = data lenyap permanen.
> Status: BELUM dikerjakan.

**Tech Stack:** Next.js 16 App Router, React 19, Zustand 5 persist.

## Global Constraints

- Hanya tampil dalam mode pemilik (gated `ownerMode`).
- Format JSON berversi agar import bisa divalidasi (`{ version: 1, profile, projects }`).
- Tanpa dependensi baru. Verifikasi: `bunx turbo run check-types --filter=web` harus PASS.

## Task

**Files:**
- Create: `apps/web/lib/backup.ts` (export/import + validasi bentuk)
- Modify: `apps/web/app/components/ProfileCard.tsx` atau Navbar (tombol Export/Import)

**Isi:**
- [ ] `exportBackup()` baca state kedua store → unduh `portofolio-backup-YYYY-MM-DD.json` via Blob
- [ ] `importBackup(file)` validasi bentuk + versi → tulis ke kedua store (konfirmasi dulu via `DeleteConfirm`-style, karena menimpa)
- [ ] Tombol Export/Import hanya saat owner; error file rusak tampil inline
