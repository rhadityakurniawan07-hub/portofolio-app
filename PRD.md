# Product Requirement Document (PRD) — Personal Portfolio & Minimalist Profile Web App

## 1. Ringkasan Produk
Aplikasi web portofolio pribadi berbasis *dark mode* yang dirancang untuk menampilkan profil pengembang, informasi biodata terstruktur, serta repositori/katalog proyek interaktif[cite: 7, 9]. Dilengkapi fitur Content Management System (CMS) internal berbasis dialog modal untuk memperbarui informasi data diri dan menambah/mengedit koleksi proyek secara *real-time*[cite: 8, 10].

---

## 2. Tujuan & Sasaran
* **Tujuan Utama:** Menyediakan platform portofolio yang bersih, responsif, dan mudah dikelola tanpa perlu menyunting kode sumber secara manual[cite: 7, 8, 9, 10].
* **Sasaran Pengguna:**
  * **Pengunjung / Rekruter:** Melihat kualifikasi teknis, biodata, kontak cepat, serta katalog proyek[cite: 7, 9].
  * **Pemilik Website (Admin):** Mengubah informasi profil dan mengelola daftar proyek melalui antarmuka modal interaktif[cite: 8, 10].

---

## 3. Spesifikasi Antarmuka & Fitur Utama

### A. Navigation Header & Footer
* **Logo & Status Mode:** Brand `fatih .me` di sebelah kiri dengan badge `• MODE PEMILIK AKTIF`[cite: 7, 9].
* **Tab Navigasi Utama:** Pilihan menu `Data Diri` (aktif) dan `Koleksi Proyek`[cite: 7, 9].
* **Avatar User:** Ikon profil di sudut kanan atas[cite: 7, 9].
* **Footer:** Menampilkan label hak cipta `fatih.me © 2025`, badge `ARSIP PRIBADI`, serta peran `Full-Stack Engineer` • `Jakarta, ID`[cite: 7, 9].

---

### B. Halaman 1: Data Diri (Profile View)
1. **Hero Section (Centered Layout):**
   * Foto profil visual melingkar/persegi dengan indikator status aktif[cite: 7].
   * Badge status ketersediaan: `• TERSEDIA UNTUK PROYEK` - `Sleman, D.I. Yogyakarta`[cite: 7].
   * Display Nama Lengkap: `Muhammad Fatih Al-Ghazali`[cite: 7].
   * Sub-title Peran: `Full-Stack Web Developer`[cite: 7].
   * Bio Singkat: *"Programmer yang berfokus mengembangkan aplikasi web fungsional, bersih, dan bermanfaat."*[cite: 7]
   * Tombol Aksi Cepat: `Hubungi Langsung` (CTA Hijau Utama), `WhatsApp`, dan `Lihat Portofolio →`[cite: 7].

2. **Kartu Informasi Profil (Single Card Container):**
   * **Header Kartu:** Judul `• Informasi Profil` dengan tombol pemicu `Ubah Data` di pojok kanan[cite: 7].
   * **Atribut Data Diri:**
     * *Nama Lengkap:* Muhammad Fatih Al-Ghazali[cite: 7]
     * *Peran Utama:* Full-Stack Web Developer[cite: 7]
     * *Spesialisasi:* Badge teknologi (`Next.js`, `Node.js`, `PostgreSQL`, `Tailwind CSS`)[cite: 7]
     * *Domisili:* Sleman, D.I. Yogyakarta[cite: 7]
     * *Ketersediaan:* `• Terbuka untuk freelance & full-time`[cite: 7]
     * *Email Resmi:* `fatih@dev.id` + tombol `Salin` instan[cite: 7]
     * *Kanal & Repositori:* Tautan cepat `<> GitHub` dan `Telegram`[cite: 7]
   * **Footer Kartu (Call-to-Action):** Teks *"Ingin melihat hasil pengerjaan proyek?"* dengan tombol `Buka Koleksi Proyek →`[cite: 7].

---

### C. Halaman 2: Koleksi Proyek (Repository View)
1. **Header & Kontrol Koleksi:**
   * Label Kategori `• ARSIP REPOSITORI PRIBADI`[cite: 9].
   * Judul Utama `Daftar Proyek Saya` & Deskripsi *"Koleksi dan arsip hasil pembuatan aplikasi & website pribadi."*[cite: 9]
   * Tombol Aksi Utama: `+ + Simpan Proyek Baru` (Pemicu Modal Proyek)[cite: 9].

2. **Fitur Pencarian & Counter:**
   * Bar pencarian: `Cari proyek berdasarkan judul atau teknologi (cth: Next.js, CLI)...`[cite: 9]
   * Indikator statistik: `Menampilkan 3 proyek`[cite: 9].

3. **Komponen Kartu Proyek (Grid 2 Kolom):**
   * Tanda Tahun & Type (cth: `TAHUN 2024 • Online`, `TAHUN 2023 • CLI Package`)[cite: 9].
   * Judul Proyek + Ikon External Link (cth: `Aplikasi Manajemen Santri`, `Catatan & Task Manager CLI`, `Landing Page Evaluasi & Portofolio`)[cite: 9].
   * Sub-link URL Proyek (cth: `https://santri-app.demo.id`)[cite: 9].
   * Deskripsi Singkat Fungsi Aplikasi[cite: 9].
   * Badges Tech Stack (React, Node.js, Express, TypeScript, SQLite, HTML5, Tailwind CSS)[cite: 9].
   * Action Icons (Edit & Hapus) di pojok kanan atas kartu[cite: 9].
   * Tombol Utama Kartu: `Buka Web Proyek`[cite: 9].

---

### D. Modul CMS (Dialog Modal Overlay)

#### 1. Modal: "Ubah Informasi Diri"
* **Judul & Petunjuk:** `Ubah Informasi Diri` — *"Perbarui nama, deskripsi singkat, dan detail kontak di bawah secara langsung."*[cite: 8]
* **Form Field:**
  * `Nama Lengkap` (Text Input)[cite: 8]
  * `Peran Utama` (Text Input)[cite: 8]
  * `Tagline / Bio Singkat` (Textarea)[cite: 8]
  * `Domisili` & `Surel / Email` (2 Kolom Input)[cite: 8]
  * `Status Ketersediaan` (Text Input)[cite: 8]
* **Tombol Aksi:** `Batal` & `Simpan Perubahan` (Warna Hijau)[cite: 8].

#### 2. Modal: "Simpan Proyek Baru"
* **Judul & Petunjuk:** `Simpan Proyek Baru` — *"Lengkapi parameter repositori atau aplikasi yang telah Anda selesaikan untuk disimpan ke arsip karya pribadi."*[cite: 10]
* **Form Field:**
  * `NAMA PROYEK *` (Text Input)[cite: 10]
  * `DESKRIPSI SINGKAT PROYEK *` (Textarea)[cite: 10]
  * `TEKNOLOGI / BAHASA PEMROGRAMAN *` (Input dengan teks bantuan: *Pisahkan dengan koma (,)*)[cite: 10]
  * `TAUTAN WEB / LINK PROYEK` (URL Input)[cite: 10]
  * `TANGGAL / TAHUN PEMBUATAN *` (Text Input)[cite: 10]
* **Tombol Aksi:** `Batal` & `Simpan ke Koleksi Proyek` (Warna Hijau)[cite: 10].

---

## 4. Spesifikasi Teknis & Keamanan

* **Frontend Framework:** Next.js (App Router) / React[cite: 7].
* **Styling & UI Library:** Tailwind CSS (Dark Mode Slate/Navy `#0F172A`) & Lucide Icons / Heroicons[cite: 7].
* **State Management:** React Hook Form & Zustand / Context API untuk manajemen state modal dan data lokal[cite: 8, 10].
* **Fitur Interaktif Tambahan:** 
  * Clipboard API untuk tombol `Salin` email[cite: 7].
  * Filter array dinamis pada halaman koleksi proyek berdasarkan input judul/teknologi[cite: 9].

---

## 5. Kriteria Keberhasilan (Acceptance Criteria)
1. Antarmuka teridentifikasi bersih dan presisi pada mode tampilan gelap[cite: 7, 9].
2. Pengguna dapat berpindah halaman dari `Data Diri` ke `Koleksi Proyek` secara lancar[cite: 7, 9].
3. Klik tombol `Ubah Data` atau `+ Simpan Proyek Baru` berhasil menampilkan dialog modal overlay tanpa mengganggu layout latar belakang[cite: 7, 8, 9, 10].
4. Form input pada modal dapat menyimpan perubahan data secara dinamis ke dalam state[cite: 8, 10].