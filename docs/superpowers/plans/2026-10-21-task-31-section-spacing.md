# Task 31: Jarak Antar Section di Halaman Utama (Revisi)

> Sumber: user — "task 31 itu hanya diberi garis saja bukan menambahkan jarak... sekarang diberi jarak sedikit saja, jangan terlalu jauh dan jangan terlalu pendek, dan jangan diberi garis seperti sebelumnya."
> Status: **DONE — REVISI** (selesai 2026-10-22).

**Tech Stack:** Next.js 16 App Router, Tailwind CSS 3.4, React 19.

## Keputusan Final

- **Tidak memakai garis pemisah** (`border-t`) antar section.
- **Jarak** antar section: `space-y-16` (64px) di mobile, `space-y-24` (96px) di desktop.
- Jarak diatur **satu sumber** di container halaman (`page.tsx`), bukan padding per-section.
- Urutan section tidak berubah: Hero → About → ProfileCard → Projects → Contact.

> Catatan: ini menggantikan dua pendekatan sebelumnya yang tidak sesuai:
> 1. `space-y-24 md:space-y-32` (96/128px) — terlalu jauh.
> 2. `border-t + pt-12 md:pt-16` per section — memakai garis dan jarak tidak konsisten.

## File yang disentuh

- Modify: `apps/web/app/page.tsx`
- Modify: `apps/web/app/components/AboutSection.tsx`
- Modify: `apps/web/app/components/ProfileCard.tsx`
- Modify: `apps/web/app/components/ProjectsSection.tsx`
- Modify: `apps/web/app/components/ContactSection.tsx`

## Perubahan

- [•] `page.tsx`: container inner menjadi `max-w-6xl mx-auto px-4 md:px-8 space-y-16 md:space-y-24`.
- [•] `AboutSection.tsx`: `<section className="editorial-section">` (hapus `border-t border-gray-800 pt-12 md:pt-16`).
- [•] `ProfileCard.tsx`: `<section aria-labelledby="profil-heading">` (hapus border + padding atas).
- [•] `ProjectsSection.tsx`: `<section aria-labelledby="projects-heading">` (hapus border + padding atas).
- [•] `ContactSection.tsx`: `<section id="kontak" aria-labelledby="contact-heading">` (hapus border + padding atas).
- [•] Pastikan tidak ada sisa class `border-t border-gray-800 pt-12` di level section.

## Verifikasi

| Perintah / Cek | Hasil |
|---|---|
| `check-types` | PASS |
| `lint` | PASS |
| `build` | PASS (8 routes) |
| Garis pemisah antar section | tidak ada |
| Jarak antar section | 64px mobile / 96px desktop |

## Catatan

- Garis (`border-t`) masih boleh ada **di dalam komponen** (mis. header kartu, footer kartu, tabel) — yang dihapus hanya garis pemisah **antar section**.
- `space-y-16 md:space-y-24` dipilih setelah 48/64px terasa terlalu dekat; masih bisa dinaikkan/diturunkan bila perlu.
