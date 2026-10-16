# Task 22: Project Detail Page

> Sumber: saran pengembangan — halaman detail proyek terpisah dari kartu ringkas.
> Status: SELESAI.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode `#0F172A`, Zustand 5 persist.

## Global Constraints

- Route: `/projects/[id]` (dynamic route)
- Data dari `useProjectsStore` (lokal) — nanti bisa diganti API
- Tanpa dependensi baru
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS

## Task

**Files:**
- Create: `apps/web/app/projects/[id]/page.tsx`
- Modify: `apps/web/app/components/ProjectCard.tsx` (link ke detail page)
- Modify: `apps/web/app/projects/page.tsx` (ubah external link behavior)

**Isi:**
- [ ] Dynamic route `/projects/[id]` menampilkan detail proyek:
  - Judul, kategori, tahun, status, deskripsi panjang
  - Tech stack badges
  - Link project URL + GitHub (buka di tab baru)
  - Screenshot placeholder (nanti Task terpisah untuk upload gambar)
  - Tombol "Kembali ke Koleksi"
- [ ] `ProjectCard` → tombol "Buka Web Proyek" tetap buka external, tambah tombol "Detail" (atau klik kartu) → `/projects/[id]`
- [ ] `projects/page.tsx` → klik kartu (area non-action) → navigate ke detail page
- [ ] Empty state / 404 kalau id tidak ditemukan
- [ ] Responsive mobile & desktop