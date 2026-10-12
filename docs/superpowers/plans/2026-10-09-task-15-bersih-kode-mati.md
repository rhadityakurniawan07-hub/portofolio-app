# Task 15: Bersih-bersih Kode Mati

> Sumber: saran audit — sisa layout lama yang tak terpakai sejak single-card.
> Status: BELUM dikerjakan.

**Tech Stack:** Next.js 16 App Router, TypeScript.

## Global Constraints

- Tidak mengubah perilaku/fitur apa pun; hanya hapus yang terbukti tak terpakai (grep 0 pemakai).
- Verifikasi: `bunx turbo run check-types lint --filter=web` harus PASS.

## Task

**Files:**
- Modify: `apps/web/data/profile.ts` (hapus `statsData`, `StatData`, `biodataFields`, `BiodataField` bila 0 pemakai — verifikasi ulang via grep sebelum hapus)
- Delete: `packages/ui/src/stat-card.tsx` (bila 0 pemakai)

**Isi:**
- [ ] Grep pemakaian tiap kandidat di seluruh repo; hapus hanya yang 0 pemakai
- [ ] Type-check + lint hijau setelah hapus
