# Task 32: Peningkatan UI/UX Halaman Portofolio

> Sumber: user — "Tolong bantu saya merapikan dan meningkatkan UI/UX halaman Portofolio ini…"
> Status: **DONE** (selesai 2026-10-22, semua bagian terimplementasi & terverifikasi).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 3.4, lucide-react 0.454, Zustand 5.

## Global Constraints

- **Jangan ubah Navbar** — user menyatakan navbar sudah benar dan tidak boleh diubah.
- **Jangan ubah struktur data** (`Project`, `Profile`) dan jangan ubah API route.
- **Tanpa dependensi baru**: `lucide-react` sudah terpasang. Toast memakai `ToastProvider` yang sudah ada (bukan sonner/react-hot-toast).
- **Jangan ubah urutan section**: Hero → About → ProfileCard → Projects → Contact.
- **Verifikasi**: `bunx turbo run check-types lint build --filter=web` harus PASS + smoke test route.
- **Catatan**: Bagian 2 (spacing) **direvisi oleh Task 31**: tanpa `border-t`, jarak `space-y-16 md:space-y-24` di `page.tsx`.

## File yang disentuh

- Modify: `apps/web/app/page.tsx` (vertical rhythm)
- Modify: `apps/web/app/components/HeroSection.tsx` (CTA hierarchy)
- Modify: `apps/web/app/components/AboutSection.tsx` (padding atas + tech badge berikon)
- Modify: `apps/web/app/components/ProfileCard.tsx` (padding atas + tech badge berikon)
- Modify: `apps/web/app/components/ProjectsSection.tsx` (padding atas)
- Modify: `apps/web/app/components/ProjectCard.tsx` (quick links + tombol detail)
- Modify: `apps/web/app/components/ContactSection.tsx` (padding atas)
- Modify: `apps/web/app/components/ContactForm.tsx` (tombol submit merah + spinner)
- Create: `apps/web/app/components/TechBadge.tsx` (badge teknologi dengan ikon, dipakai ulang)
- Modify: `apps/web/app/projects/[id]/page.tsx` (perbaiki urutan hooks agar tombol "KE HALAMAN DETAIL" aman)

---

## Bagian 1: Hero Section — hirarki CTA

**Masalah saat ini:** ada 4 tombol setara (`Hubungi Langsung`, `WhatsApp`, `Hubungi Saya`, `Lihat Portofolio`) dan 2 di antaranya **duplikat** di baris sosial (baris 145-156). Tidak ada aksi utama yang menonjol.

**Target:**
- **1 tombol utama (solid merah):** `Lihat Proyek` → `/#projects-heading` (class `btn-primary`, sudah `bg-red-600 hover:bg-red-700 text-white`).
- **Tombol sekunder (outline):** `Hubungi Langsung` (salin email), `WhatsApp`.
- **Hapus duplikat** `Hubungi Saya` + `Lihat Portofolio` dari baris sosial.
- `Lihat CV` dan `Tanya AI` **tidak diimplementasikan** karena belum ada file CV maupun fitur AI di repo; jangan membuat link mati.

**Perubahan `HeroSection.tsx` (blok tombol aksi):**

```tsx
{/* Tombol Aksi */}
<div className="flex flex-wrap items-center justify-center gap-3 mb-10">
  <Link href="/#projects-heading" className="btn-primary">
    <Code className="h-4 w-4" aria-hidden="true" />
    Lihat Proyek
  </Link>
  <button
    onClick={handleCopyEmail}
    className="btn-secondary"
    aria-label={copied ? "Email disalin" : "Hubungi langsung"}
  >
    <Mail className="h-4 w-4" aria-hidden="true" />
    {copied ? "Disalin!" : "Hubungi Langsung"}
    <span role="status" className="sr-only">
      {copied ? "Email disalin" : ""}
    </span>
  </button>
  <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-secondary">
    <MessageSquare className="h-4 w-4" aria-hidden="true" />
    WhatsApp
  </a>
</div>
```

**Perubahan baris sosial:** hanya sisakan tautan GitHub, Telegram, WhatsApp (hapus dua `Link` duplikat di akhir blok).

- [ ] Ganti blok tombol aksi sesuai snippet di atas.
- [ ] Hapus 2 `Link` duplikat (`Hubungi Saya`, `Lihat Portofolio`) di baris sosial.
- [ ] Bersihkan import yang tidak terpakai (`Send`, `Briefcase` bila tidak dipakai).

## Bagian 2: Layout spacing — hilangkan jarak kosong berlebih

> **REVISI (Task 31):** pendekatan `border-t + pt-12 md:pt-16` di bawah **dibatalkan**. Kondisi final: tanpa garis pemisah antar section, jarak `space-y-16 md:space-y-24` di `page.tsx`. Lihat `2026-10-21-task-31-section-spacing.md`.

**Masalah:** `page.tsx` memakai `space-y-24 md:space-y-32` (96/128px) **ditambah** `py-12 md:py-20` pada Projects/Contact → jarak ProfileCard → Projects mencapai ±208px di desktop.

**Target:** satu sumber ritme vertikal yang konsisten: **setiap section (kecuali Hero) punya `border-t` + `pt-12 md:pt-16`**, dan container halaman tanpa `space-y`. Hasil: jarak antar section = 48px mobile / 64px desktop, seragam.

**`page.tsx`:**

```tsx
<div className="max-w-6xl mx-auto px-4 md:px-8">
  <HeroSection />
  <AboutSection />
  <ProfileCard />
  <ProjectsSection />
  <ContactSection />
</div>
```

**`AboutSection.tsx`:** `<section className="editorial-section border-t border-gray-800 pt-12 md:pt-16" …>`

**`ProfileCard.tsx`:** `<section className="border-t border-gray-800 pt-12 md:pt-16" …>`

**`ProjectsSection.tsx`:** `className="border-t border-gray-800 pt-12 md:pt-16"` (hapus `py-12 md:py-20`)

**`ContactSection.tsx`:** `className="border-t border-gray-800 pt-12 md:pt-16"` (hapus `py-12 md:py-20`)

- [ ] Hapus `space-y-24 md:space-y-32` dari `page.tsx`.
- [ ] Terapkan `border-t border-gray-800 pt-12 md:pt-16` pada About, ProfileCard, Projects, Contact.
- [ ] Pastikan tidak ada padding bawah ganda pada Projects/Contact.

## Bagian 3: Kartu proyek — pills teknologi + quick links + tombol detail

**Kondisi saat ini:** pills teknologi **sudah ada** (`ProjectCard.tsx:43-49`); ikon external ada di header; tombol bawah masih `BUKA WEB PROYEK` (eksternal), bukan ke halaman detail. Link GitHub belum ada.

**Target:**
- Pertahankan pills teknologi.
- Tambah quick link **Live Demo** (`ExternalLink`) dan **GitHub Repository** (`Github`) di pojok kanan atas, hanya muncul bila URL tersedia.
- Ganti tombol bawah menjadi **`KE HALAMAN DETAIL`** → `/projects/${project.id}` (internal).

**`ProjectCard.tsx` (header kanan):**

```tsx
import { ExternalLink, Github, Pencil, Trash2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
// …
<div className="flex items-center gap-1">
  {canManage && (
    <>
      {/* tombol edit & hapus tetap seperti sekarang */}
    </>
  )}
  {project.projectUrl && (
    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer"
       className="rounded-md p-1.5 text-gray-400 hover:bg-white/5 hover:text-primary focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
       aria-label={`Live demo ${project.title}`} title="Live Demo">
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  )}
  {project.githubUrl && (
    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
       className="rounded-md p-1.5 text-gray-400 hover:bg-white/5 hover:text-primary focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
       aria-label={`Repository GitHub ${project.title}`} title="GitHub Repository">
      <Github className="h-4 w-4" aria-hidden="true" />
    </a>
  )}
</div>
```

**`ProjectCard.tsx` (footer):**

```tsx
<div className="mt-auto border-t border-gray-800 px-6 py-4">
  <Link
    href={`/projects/${project.id}`}
    className="inline-flex items-center gap-2 rounded-md bg-red-600 text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
  >
    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    Ke Halaman Detail
  </Link>
</div>
```

- [ ] Tambah import `Github`, `ArrowUpRight`, dan `Link` dari `next/link`.
- [ ] Tambah quick link Live Demo + GitHub (kondisional).
- [ ] Ganti tombol footer menjadi link internal `/projects/${project.id}`.
- [ ] Hapus tautan URL proyek duplikat di bawah judul bila dirasa redundan (opsional, jaga tetap rapi).

## Bagian 4: Tech stack berikon (shared component)

**Target:** badge teknologi di **Informasi Profil** menampilkan ikon. Dibuat komponen bersama agar AboutSection ikut konsisten.

**Create `apps/web/app/components/TechBadge.tsx`:**

```tsx
"use client";

import {
  Atom,
  Boxes,
  Braces,
  Code2,
  Database,
  FileCode2,
  Layers,
  Server,
  Wind,
  type LucideIcon,
} from "lucide-react";

const techIcons: Record<string, LucideIcon> = {
  "Next.js": Layers,
  React: Atom,
  "Node.js": Server,
  PostgreSQL: Database,
  Prisma: Boxes,
  "Tailwind CSS": Wind,
  TypeScript: Braces,
  JavaScript: FileCode2,
};

export function TechBadge({ name }: { name: string }) {
  const Icon = techIcons[name] ?? Code2;
  return (
    <span className="badge-pill">
      <Icon className="mr-1.5 h-3.5 w-3.5 text-primary" aria-hidden="true" />
      {name}
    </span>
  );
}
```

**`ProfileCard.tsx`** — ganti `span.badge-pill` pada `row.badges`:

```tsx
{row.badges.map((badge: string) => (
  <TechBadge key={badge} name={badge} />
))}
```

**`AboutSection.tsx`** — ganti badge specializations:

```tsx
{profile.specializations.map((tech) => (
  <TechBadge key={tech} name={tech} />
))}
```

- [ ] Buat `TechBadge.tsx`.
- [ ] Pakai di `ProfileCard.tsx` (baris SPESIALISASI).
- [ ] Pakai di `AboutSection.tsx` (badges tech stack).

## Bagian 5: Form kontak — loading + toast

**Kondisi saat ini:** `isSubmitting` + spinner + `showToast` **sudah ada** di `ContactForm.tsx:20,48,205-226` dan `Toast.tsx`. Yang kurang: tombol submit berwarna abu-abu (`bg-gray-900`) sehingga tidak terlihat sebagai aksi utama.

**Target:**
- Tombol submit → merah (`bg-red-600 hover:bg-red-700 text-white`) dengan spinner `Loader2`.
- Tambah `aria-busy={isSubmitting}`.
- Tetap pakai `showToast` yang sudah ada.

**Snippet tombol:**

```tsx
<button
  type="submit"
  disabled={isSubmitting}
  aria-busy={isSubmitting}
  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-red-600 text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
>
  {isSubmitting ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      Mengirim...
    </>
  ) : (
    <>
      <Send className="h-4 w-4" aria-hidden="true" />
      Kirim Pesan
    </>
  )}
</button>
```

- [ ] Ganti blok tombol submit sesuai snippet.
- [ ] Hapus import ikon yang tidak terpakai (`Mail`, `AlertCircle`, `CheckCircle`) dan SVG inline spinner lama.
- [ ] Pastikan toast sukses/gagal tetap muncul.

## Bagian 6: Perbaikan bug hooks di halaman detail proyek

`apps/web/app/projects/[id]/page.tsx` memanggil `useState` **setelah** early return (`if (!project) return`), melanggar Rules of Hooks dan bisa memicu error saat pindah dari proyek yang tidak ada. Karena tombol "KE HALAMAN DETAIL" sekarang mengarah ke sini, perbaiki:

- [ ] Pindahkan `const [modalOpen, setModalOpen] = useState(false)` dan `const [deleteId, setDeleteId] = useState(...)` ke **atas**, sebelum `useMemo`/early return.

## Bagian 7: Verifikasi & commit

- [ ] `bunx turbo run check-types --filter=web` → PASS
- [ ] `bunx turbo run lint --filter=web` → PASS
- [ ] `bunx turbo run build --filter=web` → PASS
- [ ] Smoke test: `GET /` 200, `GET /admin` 200, `GET /projects/<id>valid` 200.
- [ ] Cek visual: hirarki CTA jelas, jarak antar section konsisten, quick link muncul, badge berikon, tombol kirim merah + spinner + toast.
- [ ] Commit selektif file task ini.

## Catatan

- Bagian 2 (spacing) **direvisi oleh Task 31**: tanpa `border-t`, jarak `space-y-16 md:space-y-24` di `page.tsx`.
- Tidak menambah dependensi; toast memakai `ToastProvider` internal.
- `Lihat CV` / `Tanya AI` tidak dibuat karena belum ada aset/fitur — sebutkan ke user bila ingin ditambahkan.

## Hasil Verifikasi (2026-10-22)

| Perintah / Cek | Hasil |
|---|---|
| `check-types` | PASS (3 successful, 3 total) |
| `lint` | PASS (3 successful, 3 total) |
| `build` | PASS (compiled successfully, 8 routes) |
| `GET /` | 200 |
| `GET /admin` | 200 |
| `GET /projects/1` | 200 |
| Duplikat tombol `Lihat Portofolio` di Hero | 0 (dihapus) |
| Tombol submit form kontak `bg-red-600` | ada (1) |

**Catatan implementasi:**
- `Lihat CV` dan `Tanya AI` tidak dibuat karena belum ada file CV / fitur AI.
- Toast memakai `ToastProvider` internal (bukan sonner/react-hot-toast) sesuai constraint.
- Bug hooks di `projects/[id]/page.tsx` diperbaiki (useState dipindah sebelum early return).
