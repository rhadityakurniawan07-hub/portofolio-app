# Task 8: Tema, Clipboard & State Dinamis (PRD 4)

> Sumber: `PRD.md` — Personal Portfolio & Minimalist Profile Web App, bagian 4.
> Status: BELUM dikerjakan. Urutan: 8 dari 9.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode Slate/Navy `#0F172A`, Zustand 5 persist, lucide-react.

## Global Constraints

- Bahasa/copy Indonesia persis seperti PRD.
- Dark mode presisi, tanpa backend (state lokal + localStorage).
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS.

## Task

**Files:**
- Modify: `apps/web/app/globals.css` (background `#0F172A`), store/helpers yang ada

**Isi:**
- [ ] Background dark Slate/Navy `#0F172A` konsisten
- [ ] Clipboard API tombol Salin + toast
- [ ] Filter array dinamis koleksi (didukung Task 4)
- [ ] Modal state via Zustand, persist localStorage tetap jalan
