# Task 28: Hubungkan admin panel ke database (P0 - Data Persistence ke Prisma)

> Sumber: user — "Hubungkan ProfileEditPanel ke PUT /api/profile (simpan ke DB)" + "Hubungkan ProjectsSection admin ke POST/PUT/DELETE /api/projects"
> Status: DONE (selesai 2026-10-21, semua checklist terpenuhi).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS, Zustand 5 persist, Prisma/PostgreSQL.

## Global Constraints

- **Jangan ubah tampilan publik**: halaman utama (`/`) tetap sama, navbar tetap sama.
- **Jangan ubah fitur yang sudah berfungsi**: ProfileEditPanel, ProjectsSection, ProfileModal, DeleteConfirm, ProjectModal sudah bekerja ke localStorage. Tugas ini hanya tambahkan layer persistensi ke DB, bukan ganti.
- **Tanpa dependensi baru**: gunakan `fetch` bawaan Next.js ke route API yang sudah ada.
- **Verifikasi**: `bunx turbo run check-types lint build --filter=web` menunjukkan PASS.

## Task

### Bagian 1: Profil ke database (PUT /api/profile)

- [•] Baca `apps/web/app/api/profile/route.ts` penuh — konfirmasi `PUT` handler menerima `photoUrl`, `aboutPhotoUrl`, dan field profil lainnya, lalu tulis ke Prisma.
- [•] Baca `apps/web/app/components/ProfileEditPanel.tsx` penuh — cari fungsi `save()`.
- [•] Modifikasi `save()` agar setelah `updateProfile(...)` (Zustand/localStorage) juga memanggil `PUT /api/profile` dengan body `form` (termasuk `photoUrl`, `aboutPhotoUrl`).
- [•] Tangani error: jika API gagal, tampilkan toast error, tapi jangan rollback Zustand (biar data lokal tetap ada).
- [•] Pastikan `photoUrl`/`aboutPhotoUrl` yang dikirim adalah data URL (jika ada) atau URL teks biasa — sesuai dengan yang diharapkan route.

### Bagian 2: Proyek ke database (POST /api/projects)

- [•] Baca `apps/web/app/api/projects/route.ts` penuh — konfirmasi `POST` handler ada dan menerima `title`, `description`, `techStack`, `projectUrl`, `githubUrl`, `year`, `category`, `status`, `featured`.
- [•] Baca `apps/web/app/components/ProjectsSection.tsx` penuh — cari `addProject` (tambah) dan `updateProject` (edit) dari `useProjectsStore`.
- [•] Modifikasi `addProject`: setelah Zustand update, panggil `POST /api/projects` dengan body proyek baru.
- [•] Modifikasi `updateProject`: setelah Zustand update, panggil `PUT /api/projects` — **perhatikan: route PUT belum ada, perlu dibuat dulu**.
- [•] Buat `PUT` handler di `apps/web/app/api/projects/route.ts`: terima `id` (dari URL) dan body, lalu `prisma.project.update({ where: { id }, data: {...} })`.
- [•] Buat `DELETE` handler di `apps/web/app/api/projects/route.ts`: terima `id` (dari URL), lalu `prisma.project.delete({ where: { id } })`.
- [•] Modifikasi `removeProject` (delete): setelah Zustand update, panggil `DELETE /api/projects/${id}`.
- [•] Tangani error: jika API gagal, tampilkan toast error, tapi jangan rollback Zustand.

### Bagian 3: Verifikasi

- [•] Jalankan `bunx turbo run check-types lint build --filter=web` → PASS.
- [•] Jalankan dev server, buka `/admin`, edit profil (termasuk foto), simpan, lalu cek `localStorage` dan `curl http://localhost:3000/api/profile` untuk konfirmasi data tersimpan di DB.
- [•] Tambah/edit/hapus proyek di admin, lalu cek `curl http://localhost:3000/api/projects` untuk konfirmasi perubahan di DB.
- [•] Pastikan tampilan publik (`/`) tetap sama, tidak ada error di console.

## Hasil Verifikasi (2026-10-21)

| Perintah | Hasil |
|---|---|
| `check-types` | PASS (3 successful, 3 total) |
| `lint` | PASS (3 successful, 3 total) |
| `build` | PASS (compiled successfully, 8 routes) |
| `GET /` | 200 |
| `GET /admin` | 200 |
| `GET /api/profile` | 200 |
| `GET /api/projects` | 200 |
| `GET /projects` | 404 |
| `GET /about` | 404 |
| `GET /contact` | 404 |
| `PUT /api/profile` | 200 (profil dibuat di DB, id `cmvhhnbtq0000o26knvyvaq96`) |
| `POST /api/projects` | 201 (proyek dibuat di DB, id `cmvhhu3et0001o26k0m9b9k55`) |
| `PUT /api/projects?id=...` | 200 (proyek diperbarui, `featured: true`, techStack bertambah React) |
| `DELETE /api/projects?id=...` | 200 (proyek di=DB, `{"ok":true}`) |

## Catatan

- Semua API endpoints (GET/POST/PUT/DELETE) **terbukti berfungsi** dengan data nyata ke PostgreSQL.
- `DELETE /api/profile?id=...` mengembalikan 405 (Method Not Allowed) — perilaku yang diharapkan, route `/api/profile` hanya punya handler GET dan PUT.
- Pola implementasi: **localStorage dulu, database sebagai lapisan tambahan** — data tetap tersimpan di browser meski API gagal.
- Test data dibuat dan di DB lalu di DB (profile + project) untuk verifikasi, kemudian di DB.