# Tasks - Portfolio Minimalist (PRD Baru)

> Sumber: `PRD.md` — Personal Portfolio & Minimalist Profile Web App.
> Status: task ditulis dulu, BELUM dikerjakan. Kerjakan berurutan 1 → 9.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode Slate/Navy `#0F172A`, Zustand 5 persist, lucide-react.

## Global Constraints

- Bahasa/copy Indonesia persis seperti PRD (contoh: `TERSEDIA UNTUK PROYEK`, `Buka Koleksi Proyek →`).
- Dark mode presisi, tanpa backend (state lokal + localStorage).
- Verifikasi per task: `bunx turbo run check-types --filter=web` harus PASS.

---

### Task 1: Navigation Header & Footer (PRD A)

**Files:**
- Modify: `apps/web/app/components/Navbar.tsx`
- Create: `apps/web/app/components/Footer.tsx`
- Modify: `apps/web/app/layout.tsx` (render Footer)

**Isi:**
- [ ] Brand `fatih.me` kiri + badge `• MODE PEMILIK AKTIF` (saat owner)
- [ ] Tab `Data Diri` (aktif) dan `Koleksi Proyek`
- [ ] Avatar user kanan atas
- [ ] Footer: `fatih.me © 2025`, badge `ARSIP PRIBADI`, `Full-Stack Engineer` • `Jakarta, ID`

---

### Task 2: Hero Section Centered (PRD B.1)

**Files:**
- Modify: `apps/web/app/components/HeroSection.tsx`

**Isi:**
- [ ] Layout centered (tengah), foto profil + indikator aktif
- [ ] Badge `• TERSEDIA UNTUK PROYEK` + `Sleman, D.I. Yogyakarta`
- [ ] Nama `Muhammad Fatih Al-Ghazali`, peran `Full-Stack Web Developer`
- [ ] Bio: *"Programmer yang berfokus mengembangkan aplikasi web fungsional, bersih, dan bermanfaat."*
- [ ] Tombol: `Hubungi Langsung` (hijau utama), `WhatsApp`, `Lihat Portofolio →`

---

### Task 3: Kartu Informasi Profil Single Card (PRD B.2)

**Files:**
- Modify: `apps/web/app/components/BiodataTable.tsx` (jadikan single card) dan/atau `QuickContacts.tsx` (gabung/kontak masuk kartu)
- Modify: `apps/web/app/page.tsx` (susun ulang section)

**Isi:**
- [ ] Satu kartu dengan header `• Informasi Profil` + tombol `Ubah Data` kanan
- [ ] Atribut: Nama, Peran, Spesialisasi (badge Next.js/Node.js/PostgreSQL/Tailwind), Domisili, Ketersediaan `• Terbuka untuk freelance & full-time`, Email `fatih@dev.id` + Salin, link `<> GitHub` + `Telegram`
- [ ] Footer kartu: *"Ingin melihat hasil pengerjaan proyek?"* + `Buka Koleksi Proyek →`

---

### Task 4: Halaman Koleksi Proyek (PRD C.1–C.2)

**Files:**
- Modify: `apps/web/app/projects/page.tsx`
- Modify: `apps/web/data/profile.ts` (seed 3 proyek contoh PRD)

**Isi:**
- [ ] Label `• ARSIP REPOSITORI PRIBADI`, judul `Daftar Proyek Saya`, deskripsi *"Koleksi dan arsip hasil pembuatan aplikasi & website pribadi."*
- [ ] Tombol `+ Simpan Proyek Baru`
- [ ] Search `Cari proyek berdasarkan judul atau teknologi (cth: Next.js, CLI)...` + filter dinamis judul/tech
- [ ] Counter `Menampilkan 3 proyek`
- [ ] Seed: `Aplikasi Manajemen Santri`, `Catatan & Task Manager CLI`, `Landing Page Evaluasi & Portofolio`

---

### Task 5: Kartu Proyek Grid 2 Kolom (PRD C.3)

**Files:**
- Modify: `apps/web/app/components/ProjectCard.tsx`, `apps/web/app/components/RecentProjects.tsx`

**Isi:**
- [ ] Grid 2 kolom; tanda `TAHUN 2024 • Online` / `TAHUN 2023 • CLI Package`
- [ ] Judul + ikon external link, sub-link URL (cth: `https://santri-app.demo.id`)
- [ ] Deskripsi, badges tech, ikon Edit & Hapus kanan atas, tombol `Buka Web Proyek`

---

### Task 6: Modal Ubah Informasi Diri (PRD D.1)

**Files:**
- Modify: `apps/web/app/components/ProfileModal.tsx`

**Isi:**
- [ ] Judul `Ubah Informasi Diri` + petunjuk *"Perbarui nama, deskripsi singkat, dan detail kontak di bawah secara langsung."*
- [ ] Field: Nama Lengkap, Peran Utama, Tagline/Bio (textarea), Domisili & Email (2 kolom), Status Ketersediaan
- [ ] Tombol `Batal` & `Simpan Perubahan` hijau; simpan dinamis ke state

---

### Task 7: Modal Simpan Proyek Baru (PRD D.2)

**Files:**
- Modify: `apps/web/app/components/ProjectModal.tsx`

**Isi:**
- [ ] Judul `Simpan Proyek Baru` + petunjuk *"Lengkapi parameter repositori atau aplikasi yang telah Anda selesaikan untuk disimpan ke arsip karya pribadi."*
- [ ] Field: `NAMA PROYEK *`, `DESKRIPSI SINGKAT PROYEK *`, `TEKNOLOGI / BAHASA PEMROGRAMAN *` (bantuan: *Pisahkan dengan koma (,)*), `TAUTAN WEB / LINK PROYEK`, `TANGGAL / TAHUN PEMBUATAN *`
- [ ] Tombol `Batal` & `Simpan ke Koleksi Proyek` hijau

---

### Task 8: Tema, Clipboard & State Dinamis (PRD 4)

**Files:**
- Modify: `apps/web/app/globals.css` (background `#0F172A`), store/helpers yang ada

**Isi:**
- [ ] Background dark Slate/Navy `#0F172A` konsisten
- [ ] Clipboard API tombol Salin + toast
- [ ] Filter array dinamis koleksi (didukung Task 4)
- [ ] Modal state via Zustand, persist localStorage tetap jalan

---

### Task 9: Verifikasi Acceptance PRD 1–4

**Files:** Tidak ada perubahan kode (kecuali blocker).

**Isi:**
- [ ] `node --test apps/web/lib/portfolio.test.ts` → PASS
- [ ] `bunx turbo run check-types lint --filter=web` → PASS; `bunx turbo run build --filter=web` → PASS
- [ ] Manual: (1) dark bersih presisi, (2) pindah Data Diri ↔ Koleksi lancar, (3) kedua modal overlay tanpa merusak layout, (4) form menyimpan dinamis ke state + reload bertahan
