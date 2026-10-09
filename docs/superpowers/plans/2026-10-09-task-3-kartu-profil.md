# Task 3: Kartu Informasi Profil Single Card (PRD B.2)

> Sumber: `PRD.md` — Personal Portfolio & Minimalist Profile Web App, bagian B.2.
> Status: BELUM dikerjakan. Urutan: 3 dari 9.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode Slate/Navy `#0F172A`, Zustand 5 persist, lucide-react.

## Global Constraints

- Bahasa/copy Indonesia persis seperti PRD.
- Dark mode presisi, tanpa backend (state lokal + localStorage).
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS.

## Task

**Files:**
- Modify: `apps/web/app/components/BiodataTable.tsx` (jadikan single card) dan/atau `QuickContacts.tsx` (gabung/kontak masuk kartu)
- Modify: `apps/web/app/page.tsx` (susun ulang section)

**Isi:**
- [ ] Satu kartu dengan header `• Informasi Profil` + tombol `Ubah Data` kanan
- [ ] Atribut: Nama, Peran, Spesialisasi (badge Next.js/Node.js/PostgreSQL/Tailwind), Domisili, Ketersediaan `• Terbuka untuk freelance & full-time`, Email `fatih@dev.id` + Salin, link `<> GitHub` + `Telegram`
- [ ] Footer kartu: *"Ingin melihat hasil pengerjaan proyek?"* + `Buka Koleksi Proyek →`
