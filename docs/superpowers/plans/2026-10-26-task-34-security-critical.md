# Task 34: Pengetatan Keamanan API Admin & Sesi Pemilik

> Sumber: audit keamanan setelah Task 33.
> Status: **DONE** (selesai 2026-10-26).

**Tech Stack:** Next.js 16 App Router (Route Handlers), React 19, Zustand 5 persist, Prisma/PostgreSQL.
**Tanpa dependensi baru:** memakai modul bawaan Node `crypto` (HMAC-SHA256).

## Ringkasan Masalah

| # | Temuan | Bukti | Dampak |
|---|---|---|---|
| 1 | Semua endpoint admin menerima request tanpa autentikasi | `apps/web/app/api/projects/route.ts`, `apps/web/app/api/projects/[id]/route.ts`, `apps/web/app/api/profile/route.ts` | Siapa pun bisa menambah, mengubah, dan menghapus profil/proyek |
| 2 | `GET /api/contact` terbuka dan mengembalikan 100 pesan terbaru | `apps/web/app/api/contact/route.ts` | Nama, email, dan isi pesan pengirim bocor ke publik |
| 3 | PIN pemilik dikirim ke browser | `apps/web/lib/portfolio.ts:90` (`NEXT_PUBLIC_OWNER_PIN`), `apps/web/stores/use-owner.ts:18-27` | PIN terlihat di bundle JS; login hanya kosmetik |
| 4 | Halaman `/admin` hanya dijaga di client | `apps/web/app/admin/page.tsx:19-25` | Penjagaan bisa dilewati; API tetap terbuka |

Catatan: `GET /api/profile` dan `GET /api/projects` tetap **publik** karena datanya untuk halaman portofolio. Yang dilindungi adalah seluruh operasi tulis dan inbox kontak.

## Global Constraints

- Tidak menambah dependensi (tanpa `jose`, `jsonwebtoken`, `next-auth`, dsb.).
- `POST /api/contact` dan `GET /api/projects` tetap dapat diakses publik.
- Jangan memakai prefix `NEXT_PUBLIC_` untuk `ADMIN_PIN` atau `ADMIN_SESSION_SECRET`.
- Jangan mencatat PIN, token, atau cookie ke log.
- Tidak mengubah tampilan/UX Task 30-33 selain alur login/logout.
- Verifikasi: `bunx turbo run check-types lint build --filter=web` harus PASS.

## Keputusan Desain

**Sesi cookie HttpOnly bertanda tangan HMAC (stateless).**

- Login: `POST /api/auth/login` memverifikasi PIN di server, lalu mengeset cookie `portfolio_admin`.
- Cookie: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` hanya di production, `Max-Age=8 jam`.
- Isi cookie: `exp.<hmac>`; tidak berisi PIN.
- Stateless: valid di semua instance serverless tanpa penyimpanan sesi.
- Verifikasi PIN dan tanda tangan memakai `crypto.timingSafeEqual`.
- Rate limit login: maksimal 5 percobaan / 10 menit per IP (in-memory).
- Alternatif token header ditolak karena token harus disimpan di client (rawan XSS).

**Env server-only:**

```env
ADMIN_PIN=
ADMIN_SESSION_SECRET=   # acak, minimal 32 karakter
```

`NEXT_PUBLIC_OWNER_PIN` dihapus dari `.env.example` dan README. Jika `ADMIN_SESSION_SECRET` kosong, login gagal terkontrol (500) dan verifikasi sesi selalu false; tidak ada default yang bisa ditebak.

## Rencana Implementasi

### Bagian 1: Fondasi auth server

- [x] Buat `apps/web/lib/auth-token.ts`: `createSessionToken`, `verifySessionToken`, `isValidPin`, `SESSION_COOKIE`, `SESSION_TTL_MS`.
- [x] Validasi `ADMIN_SESSION_SECRET` minimal 32 karakter.
- [x] Bandingkan PIN dan tanda tangan dengan `timingSafeEqual`.
- [x] Buat `apps/web/lib/auth.ts`: `isAdminRequest`, `requireAdmin`, `setSessionCookie`, `clearSessionCookie`.

### Bagian 2: Endpoint auth

- [x] `apps/web/app/api/auth/login/route.ts`: validasi body, rate limit 5/10 menit per IP, PIN salah -> 401, PIN benar -> cookie sesi + 200.
- [x] `apps/web/app/api/auth/logout/route.ts`: hapus cookie -> 200.
- [x] `apps/web/app/api/auth/session/route.ts`: `{ authenticated: boolean }`.

### Bagian 3: Proteksi endpoint

| Endpoint | Method | Akses setelah task |
|---|---|---|
| `/api/projects` | `GET` | Publik |
| `/api/projects` | `POST`, `PUT`, `DELETE` | Admin |
| `/api/projects/[id]` | `PUT`, `DELETE` | Admin |
| `/api/profile` | `GET` | Publik |
| `/api/profile` | `PUT` | Admin |
| `/api/contact` | `POST` | Publik (rate limit yang sudah ada) |
| `/api/contact` | `GET` | Admin |

- [x] `requireAdmin(req)` dipasang di awal setiap handler yang dilindungi.
- [x] Kedua route proyek (`route.ts` dan `[id]/route.ts`) sama-sama diproteksi.
- [x] `GET /api/contact` tanpa cookie -> 401; dengan cookie -> 200.
- [ ] (Opsional, belum dilakukan) Tolak request mutasi dengan `Origin` yang tidak cocok untuk mitigasi CSRF tambahan.

### Bagian 4: Migrasi UI admin dari PIN client ke sesi server

- [x] `apps/web/stores/use-owner.ts`: `login`/`logout` async ke API auth, `refresh` dari `/api/auth/session`.
- [x] `apps/web/app/components/PinPrompt.tsx`: `await login`, tombol nonaktif saat proses, error dari server.
- [x] `apps/web/app/admin/page.tsx`: `refresh()` saat mount, redirect bila tidak terautentikasi, logout async.
- [x] `apps/web/lib/portfolio.ts`: hapus `checkOwnerPin`.
- [x] Hapus seluruh referensi `NEXT_PUBLIC_OWNER_PIN`.

### Bagian 5: Env & dokumentasi

- [x] `.env.example`: hapus `NEXT_PUBLIC_OWNER_PIN`; tambah `ADMIN_PIN` dan `ADMIN_SESSION_SECRET`.
- [x] `apps/web/.env.local`: isi PIN dan secret lokal (tidak di-commit).
- [x] README: perbarui bagian Owner Mode dan Environment Variables.
- [x] Catat bahwa PIN tidak lagi dikirim ke browser.

### Bagian 6: Verifikasi & commit

- [x] Jalankan seluruh test, `check-types`, `lint`, dan `build`.
- [x] Uji manual login -> akses API -> logout.
- [x] Commit selektif file Task 34 + dokumen ini (tanpa `apps/web/data/profile.ts` yang sudah dimodifikasi sebelumnya).

## File yang Disentuh

**Baru:**

- `apps/web/lib/auth-token.ts`
- `apps/web/lib/auth.ts`
- `apps/web/app/api/auth/login/route.ts`
- `apps/web/app/api/auth/logout/route.ts`
- `apps/web/app/api/auth/session/route.ts`
- `apps/web/lib/auth.test.ts`
- `apps/web/lib/auth-server.test.ts`
- `apps/web/app/api/auth/auth-routes.test.ts`
- `apps/web/app/api/security.test.ts`

**Modifikasi:**

- `apps/web/app/api/projects/route.ts`
- `apps/web/app/api/projects/[id]/route.ts`
- `apps/web/app/api/profile/route.ts`
- `apps/web/app/api/contact/route.ts`
- `apps/web/stores/use-owner.ts`
- `apps/web/app/components/PinPrompt.tsx`
- `apps/web/app/admin/page.tsx`
- `apps/web/lib/portfolio.ts`
- `apps/web/lib/portfolio.test.ts` (hapus test `checkOwnerPin`)
- `.env.example`
- `README.md`
- `apps/web/.env.local` (lokal, tidak di-commit)

## Hasil Verifikasi (2026-10-26)

| Pemeriksaan | Hasil |
|---|---|
| `bun test` | 43 pass, 0 fail (6 file) |
| `check-types` + `lint` | PASS (6 task sukses) |
| `build` | PASS (11 route, termasuk 3 route auth baru) |
| `POST /api/projects` tanpa sesi | 401 |
| `PUT/DELETE /api/projects` tanpa sesi | 401 |
| `PUT/DELETE /api/projects/[id]` tanpa sesi | 401 |
| `PUT /api/profile` tanpa sesi | 401 |
| `GET /api/contact` tanpa sesi | 401 |
| Login PIN salah | 401 |
| Login PIN benar | 200 + `Set-Cookie` HttpOnly |
| `GET /api/auth/session` dengan cookie | `{"authenticated":true}` |
| `GET /api/contact` dengan cookie | 200 |
| Logout | cookie dihapus; sesi menjadi false; `GET /api/contact` kembali 401 |
| Kebocoran secret/PIN di `.next/static` | 0 hit |
| `git grep NEXT_PUBLIC_OWNER_PIN` | kosong |

Integrasi diuji memakai `next start -p 3100` dari build terbaru. Dev server pengguna di port 3000 tidak disentuh.

## Catatan Implementasi

- PIN lokal diatur di `apps/web/.env.local` (tidak di-commit). Nilai contoh di `.env.example` hanya placeholder.
- `ADMIN_SESSION_SECRET` lokal dibuat acak 32 byte dan tidak masuk git.
- `ownerMode` di localStorage tidak lagi menjadi dasar otorisasi; semua API memeriksa cookie server.
- Rate limit login masih in-memory; cukup untuk first pass.
- `GET /api/profile` sengaja tetap publik untuk kebutuhan sinkronisasi data Task 35.

## Risiko & Catatan

- **Rate limit in-memory** tidak berbagi antar-instance serverless. Bisa dinaikkan ke Redis/DB di task terpisah.
- **`Secure` cookie** hanya di production; di `http://localhost` login tetap berjalan.
- **Env hilang**: tanpa `ADMIN_SESSION_SECRET`, login gagal (500) dan sesi selalu tidak valid.
- **CSRF**: `SameSite=Lax` sudah mengurangi risiko; pemeriksaan `Origin` belum dilakukan.
- Perubahan ini **tidak** memperbaiki sinkronisasi DB -> publik maupun kebocoran data lewat localStorage; itu Task 35.

## Di Luar Lingkup (Task 35+)

- Notifikasi WhatsApp/email untuk form kontak.
- Sinkronisasi profil & proyek dari database ke halaman publik.
- Pesan sukses form yang menyesatkan (`delivered: false`).
- URL WhatsApp tidak valid (`https://wa.me/62881-0123-09481`).
- `apps/web/public/__seed.html`.
- Duplikasi baris profil saat email diubah.
- `ProfileModal.tsx` yang tidak terpakai, honeypot, dan rate limit kontak.

## Acceptance Criteria

- [x] Tidak ada endpoint tulis (`projects`, `profile`) yang bisa diakses tanpa sesi admin.
- [x] `GET /api/contact` mengembalikan 401 tanpa sesi dan berfungsi dengan sesi.
- [x] PIN tidak lagi ada di bundle client maupun `NEXT_PUBLIC_*`.
- [x] Login/logout berfungsi dan sesi bertahan setelah refresh halaman.
- [x] `check-types`, `lint`, dan `build` PASS.
- [x] Tidak ada regresi pada halaman publik atau alur admin.
