# rhaditya.me — Personal Portfolio

Portofolio pribadi **Muhammad Rhaditya Kurniawan** — Full-Stack Web Developer.

## 🚀 Quick Start

### Prasyarat
- **Node.js** 24+
- **Bun** 1.4+ (recommended) atau npm/pnpm

### Instalasi
```bash
# Install dependencies
bun install

# Atau dengan npm
npm install
```

### Development
```bash
# Jalankan semua apps (web + docs)
bunx turbo dev

# Atau hanya web app
bunx turbo dev --filter=web
```

### Build Production
```bash
# Build semua apps
bunx turbo run build

# Atau hanya web
bunx turbo run build --filter=web
```

## 📁 Struktur Project

```
portofolio-app/
├── apps/
│   ├── web/          # Portfolio utama (Next.js 16 App Router)
│   └── docs/         # Dokumentasi (Next.js)
├── packages/
│   ├── ui/           # Shared React components
│   ├── database/     # Prisma ORM + PostgreSQL
│   ├── eslint-config/
│   └── typescript-config/
├── turbo.json
└── package.json
```

## ✨ Fitur

- **Hero Section** — Foto profil, bio, status ketersediaan, quick actions
- **Profil Lengkap** — Tabel informasi, tech stack badges, kontak sosial
- **Koleksi Proyek** — Grid proyek dengan search, filter kategori/tech stack, sorting
- **Detail Proyek** — Halaman detail per proyek (`/projects/[id]`)
- **CMS Admin** — Owner mode untuk edit profil & CRUD proyek (database + cache localStorage)
- **Kontak** — Simpan pesan ke database, notifikasi email/WhatsApp, honeypot anti-spam
- **Backup/Restore** — Export/Import data JSON
- **Dark Mode** — Tema slate/navy `#0F172A`
- **Responsive** — Mobile-first, desktop 2-kolom

## 🔐 Owner Mode (CMS)

Aktifkan dengan tombol **Masuk** di navbar → masukkan PIN dari `ADMIN_PIN` di `.env.local`. Sesi disimpan sebagai cookie HttpOnly bertanda tangan; PIN tidak pernah dikirim ke browser.

Fitur:
- ✏️ Edit profil (nama, role, bio, lokasi, email, ketersediaan, links, foto)
- ➕ CRUD Proyek (judul, deskripsi, tech stack, link, tahun, kategori)
- 🗑️ Hapus proyek dengan konfirmasi
- 💾 Backup/Restore data JSON
- 📌 Badge `MODE PEMILIK AKTIF` saat aktif

## ⚙️ Environment Variables

Salin `.env.example` ke `.env` dan isi:

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/portofolio"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin (server-only — jangan pakai prefix NEXT_PUBLIC_)
ADMIN_PIN="123456"
# Buat dengan: openssl rand -hex 32 (minimal 32 karakter)
ADMIN_SESSION_SECRET=""

# Email kontak (Resend)
RESEND_API_KEY=""
CONTACT_TO_EMAIL="kamu@contoh.id"
CONTACT_FROM_EMAIL="Portofolio <onboarding@resend.dev>"

# WhatsApp kontak (pilih salah satu provider)
WHATSAPP_PROVIDER="callmebot" # atau "fonnte"
CALLMEBOT_PHONE="628xxxxxxxxxx"
CALLMEBOT_APIKEY=""
FONNTE_TOKEN=""
FONNTE_TARGET="628xxxxxxxxxx"
```

> ⚠️ **Jangan commit `ADMIN_PIN` / `ADMIN_SESSION_SECRET` asli** ke repo. Gunakan `.env.local` atau Vercel dashboard untuk production.

### Notifikasi kontak

Pesan **selalu disimpan ke database** lebih dulu. Setelah itu server mencoba mengirim email dan WhatsApp secara paralel. Jika env belum diisi atau provider gagal, pesan tetap tersimpan dan form menampilkan status jujur: "Pesan tersimpan, tetapi notifikasi belum terkirim."

- **Email**: isi `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, dan `CONTACT_FROM_EMAIL`.
- **WhatsApp CallMeBot**: set `WHATSAPP_PROVIDER="callmebot"`, lalu isi `CALLMEBOT_PHONE` dan `CALLMEBOT_APIKEY` setelah aktivasi di situs CallMeBot.
- **WhatsApp Fonnte**: set `WHATSAPP_PROVIDER="fonnte"`, lalu isi `FONNTE_TOKEN` dan `FONNTE_TARGET`.

Profil dan proyek yang tampil di halaman publik dibaca dari database; localStorage hanya dipakai sebagai cache. Jika database belum berisi profil, halaman memakai data seed.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 (dark mode `#0F172A`)
- **State**: Zustand 5 (persist localStorage)
- **Icons**: Lucide React
- **Database**: Prisma 5 + PostgreSQL (opsional)
- **Package Manager**: Bun 1.4+
- **Monorepo**: Turborepo 2

## 📦 Scripts

| Command | Deskripsi |
|---------|-----------|
| `bun install` | Install dependencies |
| `bunx turbo dev` | Dev server semua apps |
| `bunx turbo dev --filter=web` | Dev server hanya web |
| `bunx turbo run build` | Build semua |
| `bunx turbo run build --filter=web` | Build hanya web |
| `bunx turbo run check-types` | TypeScript check |
| `bunx turbo run lint` | ESLint check |
| `bun test` | Unit test (Node built-in) |

## 📄 License

MIT License — bebas digunakan dan dimodifikasi.

---

> **rhaditya.me** — Personal Portfolio & Project Repository
> Made with ❤️ by Muhammad Rhaditya Kurniawan