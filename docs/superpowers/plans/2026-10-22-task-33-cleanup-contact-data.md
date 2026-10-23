# Task 33: Perapian Route Lama, Data Kontak Asli & Ketahanan Simpan Profil

> Sumber: pekerjaan yang menumpuk di working tree tanpa nomor task.
> Status: **DONE** (selesai 2026-10-22).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS, Zustand 5 persist.

## Global Constraints

- **Jangan ubah Navbar** dan jangan ubah fitur Task 32.
- Tidak menambah dependensi.
- `apps/web/public/__seed.html` adalah artefak tes lokal → **tidak di-commit**.
- Verifikasi: `bunx turbo run check-types lint build --filter=web` harus PASS.

## File yang disentuh

- Modify: `apps/web/data/profile.ts`
- Modify: `apps/web/app/components/ProfileModal.tsx`
- Modify: `apps/web/app/globals.css`
- Delete: `apps/web/app/contact/page.tsx`
- Delete: `apps/web/app/projects/page.tsx`

## Bagian 1: Data kontak asli

- [•] `apps/web/data/profile.ts`: `email` dari `fatih@dev.id` → `rhadityakurniawan07@gmail.com`.
- [•] `apps/web/data/profile.ts`: `phone` dari `+62 8xx-xxxx-xxxx` → `+62 881-0123-09481`.
- [•] `apps/web/data/profile.ts`: `github` → `https://github.com/rhadityakurniawan07-hub`.
- [•] `apps/web/data/profile.ts`: `whatsapp` → `https://wa.me/62881012309481` (hanya digit, format `wa.me` valid).
- [•] `linkedin`, `twitter`, `telegram` di-set `""` (belum ada username final).
- [•] Tautan sosial kosong **disembunyikan** (bukan link rusak): `HeroSection`, `ContactSection`, dan filter daftar link di `ProfileCard`.

## Bagian 2: Hapus route lama yang sudah digabung ke landing page

- [•] Hapus `apps/web/app/contact/page.tsx` (kontak sekarang ada di `/#kontak`).
- [•] Hapus `apps/web/app/projects/page.tsx` (proyek sekarang ada di `/#projects-heading`).
- [•] Pastikan tidak ada link yang mengarah ke `/contact` atau `/projects` (sudah dicek: tidak ada).

## Bagian 3: Ketahanan simpan profil (localStorage penuh)

- [•] `ProfileModal.tsx`: bungkus `updateProfile(...)` dengan `try/catch`.
- [•] Saat gagal: tampilkan `errors` + `toast` error, jangan tutup modal, jangan tampilkan toast sukses.
- [•] Hapus state `longBioInput` yang tidak terpakai.

## Bagian 4: Perbaikan lebar foto hero/editorial

- [•] `globals.css`: `.editorial-hero-photo` tambah `w-full` (dua definisi, keduanya diperbarui).

## Bagian 5: Verifikasi & commit

- [•] `check-types` → PASS
- [•] `lint` → PASS
- [•] `build` → PASS
- [•] `apps/web/public/__seed.html` di-unstage (tidak ikut commit).
- [•] Commit selektif 5 file task ini + dokumen ini.

## Hasil Verifikasi (2026-10-22)

| Perintah | Hasil |
|---|---|
| `check-types` | PASS (3 successful, 3 total) |
| `lint` | PASS (3 successful, 3 total) |
| `build` | PASS (8 routes) |
| Referensi `/contact` & `/projects` | tidak ada yang tersisa |

## Catatan

- `github` sudah memakai akun asli; `linkedin`, `twitter`, `telegram` masih kosong sehingga otomatis **tidak ditampilkan** sampai username final diisi.
- `__seed.html` dibiarkan di disk sebagai utilitas tes lokal, tetapi tidak masuk git.
- Saran lanjutan (mailto/WhatsApp/tel + notifikasi Resend) belum termasuk task ini — bisa dibuat Task 34.
