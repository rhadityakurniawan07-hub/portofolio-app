# Task 12: Kosongkan Seed Proyek Contoh

> Sumber: permintaan pemilik — koleksi proyek harus kosong sejak awal agar diisi karya sendiri, bukan contoh.
> Status: BELUM dikerjakan.

**Tech Stack:** Next.js 16 App Router, Zustand 5 persist.

## Global Constraints

- Proyek buatan user (id string di localStorage) tidak boleh hilang.
- Halaman `/projects` dalam keadaan kosong harus menampilkan empty-state yang sudah ada.
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS.

## Task

**Files:**
- Modify: `apps/web/data/profile.ts` (seed `recentProjects` jadi array kosong)

**Isi:**
- [ ] `recentProjects` = `[]` (hapus 3 proyek contoh Santri/CLI/Landing)
- [ ] Merge store versi 1 otomatis berlaku: seed lama ber-id number dibuang, proyek user ber-id string dipertahankan → pengguna lama yang kembali melihat koleksi kosong + karya sendiri
- [ ] Empty-state `Belum ada proyek...` tampil saat kosong; counter `Menampilkan 0 proyek`
