# Task 24: Project Filtering & Sorting

> Sumber: saran pengembangan — filter kategori + tech stack + sorting di halaman Koleksi Proyek.
> Status: BELUM dikerjakan.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode `#0F172A`, Zustand 5 persist.

## Global Constraints

- Hanya client-side (data dari `useProjectsStore`)
- Tanpa dependensi baru
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS

## Task

**Files:**
- Modify: `apps/web/app/projects/page.tsx`
- Create: `apps/web/app/components/ProjectFilters.tsx` (reusable)
- Modify: `apps/web/app/components/ProjectCard.tsx` (kalau perlu)

**Isi:**
- [ ] Filter Kategori (dropdown/multi-select):
  - Online / CLI Package (sesuai `project.category`)
  - Semua / Pilih multiple
- [ ] Filter Tech Stack (multi-select):
  - Ambil unique tech stack dari semua proyek
  - Checkbox + search di dalam dropdown
- [ ] Search existing (judul/tech) → tetap jalan, combine dengan filter
- [ ] Sorting (dropdown):
  - Terbaru (default, by `createdAt`/`id`)
  - Terlama
  - A-Z (judul)
  - Kategori
- [ ] UI: Toolbar di atas grid (responsive: mobile collapse, desktop horizontal)
- [ ] Counter update: `Menampilkan X dari Y proyek (filter: ...)`
- [ ] Clear all filters button
- [ ] Persist filter ke localStorage (optional, session saja)

**UI Placement:** Di `projects/page.tsx`, di antara header dan counter, sebelum grid.