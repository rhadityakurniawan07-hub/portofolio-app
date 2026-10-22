# Task 30: P2 - Nice to Have (Admin UX + SEO + Contact DB)

> Sumber: user — "P2 - Nice to have"
> Status: **TASK DOC SAJA, BELUM DIKERJAKAN** (user meminta: buat task dulu, jangan dikerjakan)

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS, Zustand 5 persist, Prisma/PostgreSQL.

## Global Constraints

- **Jangan ubah tampilan publik (`/`)**: section layout, warna, spacing, navbar tetap sama.
- **Jangan ubah perilaku yang sudah berfungsi**: admin page, ProfileEditPanel, ProjectsSection, ProfileModal, ProjectModal, DeleteConfirm, Easter egg login tetap bekerja seperti sekarang.
- **Tanpa dependensi baru**: gunakan yang sudah ada (Prisma, Next metadata API, Zustand).
- **Verifikasi**: `bunx turbo run check-types lint build --filter=web` menunjukkan PASS.

## Task

### Bagian 1: Indikator visual "mode admin aktif"

- [ ] Baca `apps/web/app/admin/page.tsx` penuh.
- [ ] Tambahkan badge/label kecil di header admin (misal: `[ADMIN MODE]` atau status pill) yang menunjukkan user sedang login sebagai owner.
- [ ] Pastikan badge ini tidak mengganggu layout existing.

### Bagian 2: `<title>` / meta tag khusus untuk `/admin`

- [ ] Baca `apps/web/app/layout.tsx` penuh — cari `metadata` atau `generateMetadata`.
- [ ] Tambahkan override metadata untuk route `/admin`:
  - [ ] `<title>`: "Admin — Rhaditya.me" atau serupa.
  - [ ] `<meta name="robots" content="noindex, nofollow">` agar halaman admin tidak di-crawl mesin pencari.
- [ ] Pastikan metadata halaman utama (`/`) tetap sama.

### Bagian 3: Simpan pesan kontak ke database

- [ ] Baca `packages/database/prisma/schema.prisma` penuh.
- [ ] Tambah model `ContactMessage` di Prisma schema:
  - [ ] Field: `id` (String, `@id @default(cuid())`), `name` (String), `email` (String), `subject` (String), `message` (String), `createdAt` (DateTime, `@default(now())`).
- [ ] Buat migration: `prisma migrate dev --name add_contact_message` (atau `prisma migrate deploy`).
- [ ] Baca `apps/web/app/api/contact/route.ts` penuh.
- [ ] Setelah validasi dan rate-limit, tambahkan `prisma.contactMessage.create({...})` sebelum mengirim email (atau sebagai alternatif simpan ke DB).
- [ ] Tambahkan `GET` handler di `app/api/contact/route.ts` (opsional, untuk lihat pesan masuk di admin).
- [ ] Pastikan behavior existing (Resend email, dev fallback `console.log`) tetap berjalan.

### Bagian 4: Verifikasi

- [ ] Jalankan `bunx turbo run check-types lint build --filter=web` → PASS.
- [ ] Jalankan dev server, buka `/admin`:
  - [ ] Badge "mode admin" muncul.
  - [ ] Title browser berubah jadi "Admin — ..." (bisa dilihat di tab).
- [ ] Kirim pesan kontak, lalu cek database `ContactMessage` tabel terisi.
- [ ] Pastikan tidak ada error di console, tampilan publik (`/`) tetap sama.

## Catatan

- Task ini **baru dibuat, belum dikerjakan**. Implementasi akan dilakukan setelah konfirmasi user.
- Urutan eksekusi: Bagian 1 (indikator admin) → Bagian 2 (meta tag) → Bagian 3 (contact DB, paling besar).
- Bagian 3 butuh Prisma migration dan restart dev server, jadi dikerjakan terakhir.