# Task 1: Navigation Header & Footer (PRD A)

> Sumber: `PRD.md` — Personal Portfolio & Minimalist Profile Web App, bagian A.
> Status: BELUM dikerjakan. Urutan: 1 dari 9.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode Slate/Navy `#0F172A`, lucide-react.

## Global Constraints

- Bahasa/copy Indonesia persis seperti PRD.
- Dark mode presisi, tanpa backend (state lokal + localStorage).
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS.

## Task

**Files:**
- Modify: `apps/web/app/components/Navbar.tsx`
- Create: `apps/web/app/components/Footer.tsx`
- Modify: `apps/web/app/layout.tsx` (render Footer)

**Isi:**
- [ ] Brand `fatih.me` kiri + badge `• MODE PEMILIK AKTIF` (saat owner)
- [ ] Tab `Data Diri` (aktif) dan `Koleksi Proyek`
- [ ] Avatar user kanan atas
- [ ] Footer: `fatih.me © 2025`, badge `ARSIP PRIBADI`, `Full-Stack Engineer` • `Jakarta, ID`
