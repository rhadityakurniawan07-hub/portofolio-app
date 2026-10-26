# Task 35: Sinkronisasi Data Publik, Notifikasi Kontak, dan Perbaikan Form

> Sumber: daftar "Fungsional utama" setelah Task 34 selesai.
> Status: **DONE** (selesai 2026-10-26). Implementasi dan verifikasi utama sudah dikerjakan.

**Tech Stack:** Next.js 16 App Router, React 19, Zustand 5 persist, Prisma/PostgreSQL, Resend (email).

## Ringkasan Masalah

| # | Masalah | Bukti | Dampak |
|---|---|---|---|
| 4 | Data admin tidak sampai ke pengunjung | `apps/web/app/page.tsx:1` client component; `apps/web/stores/use-profile.ts` dan `use-projects.ts` membaca localStorage; tidak ada pemanggilan `GET /api/profile` atau `GET /api/projects` | Pengunjung melihat seed, bukan data yang disimpan ke database |
| 5 | Form kontak belum mengirim email/WA | `apps/web/app/api/contact/route.ts:78-99`; `RESEND_API_KEY` dan `CONTACT_TO_EMAIL` kosong | Pesan hanya masuk database; pemilik tidak mendapat notifikasi |
| 6 | Pesan sukses menyesatkan | `ContactForm.tsx:69-71` selalu menampilkan "Pesan terkirim!" walau server membalas `delivered: false` | Pengunjung mengira pesan terkirim padahal tidak |
| 7 | URL WhatsApp tidak valid | `apps/web/data/profile.ts:52` -> `https://wa.me/62881-0123-09481` | Tautan tidak membuka chat WhatsApp |
| 8 | Honeypot tidak berfungsi | Server memeriksa `body.honeypot` (`contact/route.ts:50-56`), tetapi `ContactForm.tsx:55-60` tidak mengirim field itu | Proteksi spam tidak pernah aktif |

## Ruang Lingkup

**Termasuk:**

- Hidrasi profil dan proyek dari database ke halaman publik dan halaman admin.
- Menjadikan database sebagai sumber kebenaran; localStorage hanya cache.
- Pengiriman notifikasi kontak via email dan/atau WhatsApp.
- Status pengiriman yang jujur di UI.
- Normalisasi dan validasi URL WhatsApp.
- Honeypot yang benar-benar dikirim form.

**Tidak termasuk:**

- Perbaikan keamanan API (sudah Task 34).
- Hapus `apps/web/public/__seed.html`.
- Duplikasi baris profil saat email berubah.
- Kode mati `ProfileModal.tsx`.
- Rate limit kontak berbasis Redis/DB.
- Notifikasi push, SMS, atau dashboard inbox.

## Temuan Teknis

- `page.tsx` masih `"use client"`, sehingga seluruh halaman dirender dari state client.
- `use-profile.ts` hanya punya `updateProfile` dan `resetProfile`; belum ada `replaceProfile`.
- `use-projects.ts` sudah punya `replaceProjects` (baris 30) tetapi tidak pernah dipanggil dari API.
- `ProfileEditPanel.save()` menyimpan ke localStorage lebih dulu, lalu `PUT /api/profile`; toast sukses tetap muncul walau DB gagal (`ProfileEditPanel.tsx:83-117`).
- `ProjectModal.save()` dan `ProjectsSection.handleDelete()` juga mengubah localStorage lebih dulu; kegagalan DB hanya menjadi toast tambahan.
- `GET /api/profile` mengembalikan `{ profile: PrismaProfile | null }`; `GET /api/projects` mengembalikan `{ projects: PrismaProject[] }`.
- Perbedaan bentuk data:
  - Prisma Profile: `fullName`, `skills`, `tagline`, `longBio`, `availabilityStatus`, dll.
  - App Profile: `name`, `specializations`, `bio`, `longBio`, `availabilityStatus`, dll.
  - Prisma Project: `id: string` (cuid), `projectUrl`, `createdAt`.
  - App Project: `id: number` (dipaksa string lewat cast), `projectUrl`, tanpa `createdAt`.
- Pengurutan proyek saat ini memakai `String(id).localeCompare` (`ProjectsSection.tsx:59-61`), tidak kronologis untuk id cuid.
- Foto profil/ tentang saya dapat berupa data URL base64; ukuran payload perlu diperhatikan saat dikirim ke publik.

## Keputusan Desain dan Pertanyaan Terbuka

### Rekomendasi utama

1. **Hidrasi client-side lebih dulu** (bukan SSR) karena `page.tsx` sudah client dan API publik sudah tersedia.
   - Tambah hook `usePortfolioData()` yang memanggil `GET /api/profile` dan `GET /api/projects` sekali saat mount.
   - Jika DB kosong atau gagal, pertahankan seed; jangan tampilkan halaman kosong.
   - Sembunyikan/placeholder section sampai data selesai dimuat agar pengunjung tidak melihat seed lalu berubah.
   - SSR bisa menjadi task terpisah jika SEO data dinamis dibutuhkan.

2. **Database sebagai sumber kebenaran saat menyimpan.**
   - Simpan ke DB lebih dulu; baru update store dan tampilkan sukses jika DB berhasil.
   - localStorage tetap dipakai sebagai cache agar halaman cepat terbuka.

3. **Notifikasi kontak bersifat best-effort.**
   - Pesan selalu disimpan ke DB.
   - Email/WA dikirim setelah DB berhasil; kegagalan notifikasi tidak membatalkan penyimpanan.
   - Respons memuat status per kanal, bukan sekadar `delivered: true/false`.

4. **Normalisasi WhatsApp di satu tempat.**
   - Helper `normalizeWhatsAppUrl()` dipakai di form admin, API `PUT /api/profile`, dan seed.
   - Semua tautan WhatsApp di UI memakai hasil normalisasi.

5. **Honeypot tetap memakai nama field `honeypot`** agar sesuai API yang sudah ada.

### Keputusan yang perlu dipilih sebelum implementasi

| Topik | Opsi | Rekomendasi |
|---|---|---|
| Kanal WhatsApp | CallMeBot (gratis, tidak resmi, hanya nomor pemilik), Fonnte (berbayar, lebih andal), Telegram (gratis, bukan WA) | CallMeBot untuk WA; Telegram sebagai fallback jika aktivasi gagal |
| Email | Resend dengan `onboarding@resend.dev` (hanya ke email terverifikasi) atau domain terverifikasi | Domain terverifikasi untuk production |
| Hidrasi data | Client fetch (cepat, minim perubahan) vs SSR/Server Component (HTML awal sudah berisi data) | Client fetch dulu; SSR opsional |
| Foto | Data URL base64 di DB vs URL file storage | Pertahankan data URL untuk sekarang; batasi ukuran |

**Perlu nomor WhatsApp tujuan dan pilihan provider sebelum Bagian 3 dikerjakan.**

## Rencana Implementasi

### Bagian 1: Mapper data DB -> App

- [x] Buat `apps/web/lib/mappers.ts`:
  - [x] `mapProfileRecord(record): Profile` -> `fullName -> name`, `skills -> specializations`, field lain dipetakan langsung.
  - [x] `mapProjectRecord(record): Project` -> pertahankan `id` string, `projectUrl`, `githubUrl`, `featured`.
  - [x] Fallback `tagline` ke `bio` bila kosong.
- [x] Ubah tipe `Project.id` menjadi `number | string` agar tidak perlu cast.
- [x] Tambah `createdAt?: string` pada tipe Project (atau simpan urutan dari API) untuk sorting kronologis.
- [x] Tambah unit test `mappers.test.ts`:
  - [x] mapping profil lengkap.
  - [x] mapping proyek dengan id string.
  - [x] data minimal/null tidak melempar error.

### Bagian 2: Hidrasi data publik dan admin

- [x] `apps/web/stores/use-profile.ts`: tambah `replaceProfile(profile: Profile)`.
- [x] Buat hook `apps/web/hooks/use-portfolio-data.ts`:
  - [x] `fetch("/api/profile", { cache: "no-store" })` dan `fetch("/api/projects", { cache: "no-store" })` paralel.
  - [x] Jika respons OK dan data ada: `replaceProfile(mapProfileRecord(...))`, `replaceProjects(mapProjectRecord(...))`.
  - [x] Jika gagal/kosong: biarkan seed, catat error tanpa menampilkan stack ke pengguna.
  - [x] Kembalikan `{ loading, error }`.
- [x] `apps/web/app/page.tsx`: panggil hook, tampilkan skeleton/placeholder sampai selesai (hindari flash seed).
- [x] `apps/web/app/admin/page.tsx`: panggil hook yang sama; tampilkan "Memuat data..." dan nonaktifkan tombol simpan sampai selesai.
- [x] `ProfileEditPanel.tsx`: setelah `PUT /api/profile` berhasil, baru `updateProfile` lokal dan tampilkan sukses. Jika DB gagal, jangan tutup/klaim sukses.
- [x] `ProjectModal.tsx`: `POST/PUT /api/projects` lebih dulu; baru `addProject`/`updateProject` lokal setelah berhasil.
- [x] `ProjectsSection.tsx`: `DELETE /api/projects` lebih dulu; baru `removeProject` lokal. Tampilkan error jika DB gagal.
- [x] Setelah simpan/hapus, panggil ulang hidrasi atau gunakan data respons agar state konsisten.
- [x] Pastikan pengunjung anonim tidak bisa memicu penulisan; hanya admin (sudah dijaga Task 34).

### Bagian 3: Pengiriman kontak (email dan WhatsApp)

- [x] Pindahkan logika pengiriman dari `contact/route.ts` ke `apps/web/lib/contact-notify.ts`.
- [x] `sendContactEmail(payload)`:
  - [x] Pakai Resend bila `RESEND_API_KEY` dan `CONTACT_TO_EMAIL` tersedia.
  - [x] Return `{ ok: boolean, error?: string }`, jangan melempar ke handler.
- [x] `sendWhatsAppNotification(payload)`:
  - [x] Implementasi sesuai provider yang dipilih.
  - [x] CallMeBot: env `CALLMEBOT_PHONE`, `CALLMEBOT_APIKEY`; URL `https://api.callmebot.com/whatsapp.php?phone=...&text=...&apikey=...`.
  - [x] Fonnte: env `FONNTE_TOKEN`, `FONNTE_TARGET`; endpoint `https://api.fonnte.com/send`.
  - [x] Potong pesan menjadi +/- 1.000 karakter; sertakan nama, email, subjek, isi.
  - [x] Return `{ ok: boolean, error?: string }`.
- [x] `POST /api/contact`:
  - [x] Simpan ke DB lebih dulu; jika gagal -> 500 dan jangan klaim sukses.
  - [x] Setelah DB sukses, jalankan `Promise.allSettled([sendContactEmail, sendWhatsAppNotification])`.
  - [x] Respons konsisten:
    ```json
    {
      "success": true,
      "saved": true,
      "delivered": { "email": true, "whatsapp": false },
      "message": "Pesan tersimpan. Notifikasi WhatsApp belum terkirim."
    }
    ```
  - [x] Jangan mengembalikan 502 hanya karena email gagal; DB sudah tersimpan.
  - [x] Jangan mencatat isi pesan lengkap ke log production.

### Bagian 4: Status sukses yang jujur di form

- [x] `ContactForm.tsx`:
  - [x] Status menjadi `"idle" | "success" | "partial" | "error"`.
  - [x] Baca `data.saved`, `data.delivered.email`, `data.delivered.whatsapp`, dan `data.message`.
  - [x] Jika ada minimal satu kanal terkirim -> sukses.
  - [x] Jika tersimpan tetapi tidak ada kanal terkirim -> `partial`, toast info: "Pesan tersimpan, tetapi notifikasi belum terkirim. Pemilik tetap dapat melihatnya di database."
  - [x] Jika `saved === false` atau HTTP error -> `error`, jangan kosongkan form.
  - [x] Kosongkan form hanya saat `success` atau `partial`.
- [x] Tampilkan status inline (bukan hanya toast) agar pengunjung tidak melewatkannya.

### Bagian 5: URL WhatsApp valid

- [x] `apps/web/data/profile.ts:52`: ubah menjadi `https://wa.me/62881012309481`.
- [x] Tambah `normalizeWhatsAppUrl(input: string): string` di `lib/portfolio.ts`:
  - [x] Ambil hanya digit.
  - [x] `08...` -> `628...`; `8...` -> `628...`; `62...` dibiarkan.
  - [x] Hasilkan `https://wa.me/<digit>` atau string kosong.
- [x] Tambah validasi: nomor 8-15 digit; tolak host selain `wa.me`.
- [x] `ProfileEditPanel.tsx`: gunakan helper untuk field WhatsApp sebelum validasi dan sebelum dikirim ke API.
- [x] `PUT /api/profile`: normalisasi `whatsapp` di server agar data lama/berbahaya tidak tersimpan.
- [x] Perbarui baris profil yang sudah ada di DB (lewat form admin atau script satu kali).
- [x] Pastikan `HeroSection`, `ContactSection`, dan `ProfileCard` memakai URL yang sudah dinormalisasi.

### Bagian 6: Honeypot

- [x] `ContactForm.tsx`: tambah state `honeypot: ""`.
- [x] Render input tersembunyi:
  - [x] `name="honeypot"`, `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`.
  - [x] Sembunyikan dengan posisi off-screen, bukan `display:none`.
- [x] Kirim `honeypot` di body JSON.
- [x] Server sudah memeriksa field ini; tambahkan test agar tidak regresi.
- [x] Pastikan pengguna normal tidak pernah mengisi field tersebut.

### Bagian 7: Env dan dokumentasi

- [x] `.env.example`: tambah komentar dan placeholder:
  - [x] `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
  - [x] `CALLMEBOT_PHONE`, `CALLMEBOT_APIKEY` atau variabel provider yang dipilih.
- [ ] `apps/web/.env.local`: isi nilai nyata (belum diisi; Resend/WA masih kosong).
- [x] README: jelaskan status pengiriman, setup Resend/WA, dan perilaku bila env kosong.
- [x] Catat bahwa pesan selalu tersimpan di DB walau notifikasi gagal.

### Bagian 8: Verifikasi dan commit

- [x] Unit test mapper, normalisasi WhatsApp, dan notifikasi (mock `fetch`).
- [x] Test route kontak: honeypot -> 400; valid -> 200 dengan `saved: true`.
- [x] Uji integrasi dengan DB:
  - [x] Memakai data DB yang sudah ada (profil dan proyek `iseng`).
  - [x] Buka `/` via Chrome headless -> data DB tampil, bukan seed.
  - [ ] Edit dari admin lewat UI -> refresh incognito -> perubahan tampil (belum diuji E2E UI; API PUT sudah diuji).
- [x] Uji kontak:
  - [x] Tanpa env email/WA -> `saved: true`, `delivered: false`, pesan jujur.
  - [ ] Dengan env -> email/WA diterima (belum diisi kredensial nyata).
  - [x] Honeypot terisi -> 400.
- [x] Periksa href WhatsApp menjadi `https://wa.me/62881012309481`.
- [x] `bun test`, `check-types`, `lint`, `build` PASS.
- [ ] Commit selektif file Task 35 + dokumen ini (belum di-commit).

## File yang Disentuh

**Baru:**

- `apps/web/lib/mappers.ts`
- `apps/web/lib/contact-notify.ts`
- `apps/web/hooks/use-portfolio-data.ts`
- `apps/web/lib/mappers.test.ts`
- `apps/web/lib/contact-notify.test.ts` (opsional)
- `apps/web/app/api/contact/contact.test.ts` (opsional)

**Modifikasi:**

- `apps/web/app/page.tsx`
- `apps/web/app/admin/page.tsx`
- `apps/web/stores/use-profile.ts`
- `apps/web/app/components/ProfileEditPanel.tsx`
- `apps/web/app/components/ProjectModal.tsx`
- `apps/web/app/components/ProjectsSection.tsx`
- `apps/web/app/components/ContactForm.tsx`
- `apps/web/app/api/contact/route.ts`
- `apps/web/app/api/profile/route.ts`
- `apps/web/app/api/projects/route.ts` (bila perlu bentuk respons)
- `apps/web/data/profile.ts`
- `apps/web/lib/portfolio.ts`
- `apps/web/lib/portfolio.test.ts`
- `.env.example`
- `README.md`

## Verifikasi

| Pemeriksaan | Cara | Ekspektasi |
|---|---|---|
| Profil publik dari DB | Ubah nama di DB, buka `/` incognito | Nama DB tampil, bukan seed |
| Proyek publik dari DB | Tambah proyek di DB/admin, buka `/` incognito | Proyek tampil |
| DB gagal | Matikan DB, buka `/` | Halaman tetap tampil dengan seed, tidak crash |
| Admin memuat DB | Buka `/admin` di browser baru | Form berisi data DB |
| Simpan profil gagal | Matikan DB, simpan | Error, tidak ada klaim sukses |
| Email/WA kosong | Kirim pesan | `partial`, pesan jujur |
| Email/WA terisi | Kirim pesan | Diterima, `success` |
| Honeypot | POST `honeypot: "bot"` | 400 |
| WhatsApp | Klik tautan | Membuka chat dengan nomor benar |
| Tipe/Lint/Build | `bunx turbo run check-types lint build --filter=web` | PASS |

## Risiko dan Catatan

- **Flash seed**: jika hidrasi client tanpa skeleton, pengunjung sempat melihat seed. Sembunyikan section sampai loading selesai.
- **Hydration overwrite**: jangan memanggil hidrasi berulang saat admin sedang mengedit; hanya saat mount atau setelah simpan.
- **Data URL besar**: foto base64 memperbesar payload API dan localStorage; pertimbangkan batas ukuran.
- **Resend sandbox**: `onboarding@resend.dev` hanya dapat mengirim ke email pemilik yang terverifikasi.
- **CallMeBot tidak resmi**: bergantung pada layanan pihak ketiga, rate limit tidak jelas, dan nomor harus diaktifkan.
- **DB kosong**: jangan menimpa seed dengan data kosong; hanya ganti jika ada baris.
- **`GET /api/profile` tetap publik**; data profil memang untuk ditampilkan. Jangan menambahkan data sensitif ke tabel profil.
- **Sorting proyek**: id cuid tidak kronologis; gunakan `createdAt` dari DB.

## Acceptance Criteria

- [x] Pengunjung melihat profil dan proyek dari database, bukan seed, setelah data tersedia.
- [x] Admin selalu memuat data dari database sebelum mengedit.
- [x] Penyimpanan hanya dianggap sukses jika DB berhasil.
- [x] Form kontak mengirim notifikasi email dan/atau WhatsApp sesuai env.
- [x] UI membedakan sukses penuh, tersimpan tanpa notifikasi, dan gagal.
- [x] Tautan WhatsApp valid dan membuka chat.
- [x] Honeypot terkirim dan memblokir request spam.
- [x] `bun test`, `check-types`, `lint`, dan `build` PASS.

## Hasil Implementasi

- 65 test PASS (node:test), check-types, lint, dan uild PASS.
- Halaman publik memuat profil/proyek dari GET /api/profile dan GET /api/projects; skeleton ditampilkan sampai data siap.
- Chrome headless membuktikan proyek DB iseng tampil dan href WhatsApp menjadi https://wa.me/62881012309481.
- Data WhatsApp lama di DB sudah diperbarui lewat PUT /api/profile dengan sesi admin.
- Notifikasi kontak dipisah ke lib/contact-notify.ts; mendukung Resend, CallMeBot, dan Fonnte. Respons memakai { success, saved, delivered: { email, whatsapp }, message }.
- POST /api/contact valid tanpa env menghasilkan saved: true, delivered: false; honeypot menghasilkan 400.
- Email/WA nyata belum diuji karena RESEND_API_KEY, CONTACT_TO_EMAIL, dan env WhatsApp masih kosong.
- Belum di-commit; perubahan ada di branch eat/task-35-functional-data-contact.
