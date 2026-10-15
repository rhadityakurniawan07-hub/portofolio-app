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
- **CMS Modal** — Owner mode untuk edit profil & CRUD proyek (persist localStorage)
- **Backup/Restore** — Export/Import data JSON
- **Dark Mode** — Tema slate/navy `#0F172A`
- **Responsive** — Mobile-first, desktop 2-kolom

## 🔐 Owner Mode (CMS)

Aktifkan dengan tombol **Masuk** di navbar → PIN: `1234` (default, ganti via `NEXT_PUBLIC_OWNER_PIN` di `.env`).

Fitur:
- ✏️ Edit profil (nama, role, bio, lokasi, email, ketersediaan, links, foto)
- ➕ CRUD Proyek (judul, deskripsi, tech stack, link, tahun, kategori)
- 🗑️ Hapus proyek dengan konfirmasi
- 💾 Backup/Restore data JSON
- 📌 Badge `MODE PEMILIK AKTIF` saat aktif

## ⚙️ Environment Variables

Salin `.env.example` ke `.env` dan isi:

```bash
# Database (opsional - untuk Task 20)
DATABASE_URL="postgresql://user:pass@localhost:5432/portofolio"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Owner PIN (ganti untuk production!)
NEXT_PUBLIC_OWNER_PIN="1234"
```

> ⚠️ **Jangan commit PIN asli** ke repo. Gunakan `.env` lokal atau Vercel dashboard untuk production.

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