# Task 10: Edit Semua Field Profil (PRD B.2 + D.1)

> Sumber: `PRD.md` — Personal Portfolio & Minimalist Profile Web App, bagian B.2 (atribut kartu) dan D.1 (modal).
> Status: BELUM dikerjakan. Urutan: 10 (setelah Task 1–9).
> Latar: modal saat ini hanya bisa mengubah Nama, Peran, Bio, Domisili, Email, Ketersediaan. Task ini membuka SEMUA atribut profil agar bisa diubah: Spesialisasi, Bahasa, kanal GitHub/Telegram/WhatsApp, status ketersediaan, dan Foto Profil (via link URL — opsi A; foto di hero selama ini paten inisial "FA").

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode Slate/Navy `#0F172A`, Zustand 5 persist.

## Global Constraints

- Bahasa/copy Indonesia persis seperti PRD.
- Dark mode presisi, tanpa backend (state lokal + localStorage).
- Validasi lama tetap berlaku (nama/peran/bio/domisili/email/availabilitas wajib, email format benar).
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS; `node --test apps/web/lib/portfolio.test.ts` tetap PASS.

## Task

**Files:**
- Modify: `apps/web/data/profile.ts` (tambah kolom `photoUrl: ""`)
- Modify: `apps/web/lib/portfolio.ts` (validasi URL opsional + parse daftar koma)
- Modify: `apps/web/lib/portfolio.test.ts` (test validasi baru)
- Modify: `apps/web/app/components/ProfileModal.tsx` (field baru)
- Modify: `apps/web/app/components/HeroSection.tsx` (tampilkan foto bila `photoUrl` ada, inisial bila kosong)
- Verify: `apps/web/app/components/ProfileCard.tsx` (sudah baca dari store, ikut berubah otomatis)

**Isi:**
- [ ] Helper `parseDaftar(input: string): string[]` (koma-split, trim, dedup — sama pola `parseTechStack`) + validasi URL opsional untuk GitHub/Telegram/WhatsApp (kosong boleh, isi harus URL valid)
- [ ] Modal tambah field: `Spesialisasi` (teks koma, bantuan: *Pisahkan dengan koma (,)*), `Penguasaan Bahasa` (teks koma), `GitHub`, `Telegram`, `WhatsApp` (URL input, opsional)
- [ ] Status ketersediaan jadi pilihan `Tersedia` / `Sibuk` (dropdown) yang memetakan ke `availabilityStatus` (`available` → titik hijau hero, selain itu abu-abu) + teks `availability` tetap input bebas
- [ ] Simpan via `updateProfile` yang sudah ada (bentuk data tidak berubah, hanya field yang dikirim bertambah) + error inline bila URL tidak valid
- [ ] Kartu profil + hero otomatis menampilkan hasil baru tanpa ubahan (sudah dari store); badge spesialisasi mengikuti jumlah yang disimpan
- [ ] Foto Profil via upload dari perangkat (bukan link): input file `accept="image/*"` di modal + pratinjau + tombol hapus; gambar otomatis diperkecil (maks 512px, JPEG) via helper `downscaleImage` di `apps/web/lib/photo.ts` agar hemat localStorage; hero render foto bila ada, inisial nama bila kosong/rusak (`onError` fallback)
