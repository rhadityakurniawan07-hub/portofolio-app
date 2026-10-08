# Product Requirement Document (PRD) — Personal Portfolio & Project Repository Web App

## 1. Ringkasan Produk
Membuat aplikasi web portofolio pribadi modern berorientasi *dark-mode* yang menyajikan informasi profil pengembang (*Full-Stack Web Developer*), statistik hasil kerja, serta repositori proyek interaktif. Sistem dilengkapi dengan fitur manajemen konten bawaan (*CMS/Mode Pemilik*) berbasis dialog modal untuk mengedit data diri dan menambah/mengubah koleksi proyek secara langsung.

---

## 2. Tujuan & Sasaran
* **Tujuan Utama:** Menjadi *showcase* karya rekayasa perangkat lunak yang responsif, terstruktur, dan transparan bagi rekruter/klien, sekaligus menyediakan dasbor manajemen portofolio pribadi yang efisien.
* **Sasaran Pengguna:**
  * **Pengunjung Publik / Rekruter / Klien:** Melihat profil singkat, statistik kerja, tautan komunikasi cepat, dan repositori proyek.
  * **Pemilik Akun (Admin):** Mengubah biodata diri, mengelola daftar proyek (CRUD), dan mengaktifkan/mengarahkan status ketersediaan kerja secara *real-time*.

---

## 3. Fitur Utama & Struktur Antarmuka (UI)

### A. Bilah Navigasi & Header Usabilitas
* **Indikator Mode:** Menampilkan badge `MODE PEMILIK AKTIF` saat admin sedang mengelola data.
* **Navigasi Tab:** Navigasi cepat antara `Data Diri` dan `Koleksi Proyek`.
* **Akses Profil:** Tombol avatar/profil pada sudut kanan atas.

### B. Halaman 1: Data Diri & Profil Utama
1. **Hero & Ringkasan Profil:**
   * Foto profil visual dengan indikator status ketersediaan (`Tersedia untuk Proyek` • *Sleman, D.I. Yogyakarta*).
   * Display Nama Lengkap (`Muhammad Fatih Al-Ghazali`), Bio Singkat, serta tombol `Ubah Profil` (Modal) dan `Hubungi`.
2. **Kartu Statistik Utama:**
   * **Hasil Kerja:** Menampilkan jumlah total proyek tuntas & terverifikasi.
   * **Fokus Teknis:** Menampilkan spesialisasi arsitektur (misal: *Web & Backend*).
   * **Status Komitmen:** Menampilkan ketersediaan kerja (*Freelance & Full-Time*).
3. **Biodata Lengkap (Tabel Ringkas):**
   * Menampilkan rincian Nama Lengkap, Peran Utama, Spesialisasi (*badge tech stack*: Next.js, Node.js, PostgreSQL, Tailwind CSS), Domisili, Ketersediaan, dan Penguasaan Bahasa.
4. **Aksi Cepat & Kontak:**
   * Widget salin surel instan (`fatih@dev.id` + tombol *Salin*).
   * Tautan langsung ke WhatsApp Chat, Telegram, dan Repositori GitHub Utama.
5. **Showcase Proyek Terkini:**
   * menampilkan 2 kartu proyek terbaru dengan ringkasan *tech stack*, deskripsi fungsionalitas, status produksi, dan tautan rincian.

---

### C. Halaman 2: Koleksi Proyek (Katalog Proyek Complete)
1. **Header & Kontrol Proyek:**
   * Judul & sub-judul arsip repositori pribadi.
   * Tombol pemicu `+ Simpan Proyek Baru` (Modal).
2. **Pencarian & Counter Data:**
   * Input pencarian cepat berdasarkan judul/teknologi (cth: *Next.js, CLI*).
   * Indikator jumlah data yang sedang ditampilkan (cth: *Menampilkan 3 proyek*).
3. **Kartu Proyek (Project Cards Grid):**
   * Tanda Tahun & Kategori (*Online / CLI Package*).
   * Judul Proyek dengan ikon tautan eksternal (`Buka Web Proyek`).
   * Deskripsi fungsionalitas aplikasi.
   * *Badge Tech Stack* (misal: React, Node.js, Express, TypeScript, SQLite, HTML5, Tailwind CSS).
   * Tombol aksi cepat: Edit (Ikon Pensil) & Hapus (Ikon Tong Sampah).

---

### D. Dialog Modal & Manajemen Data (Modul Pemilik)

#### 1. Modal: "Ubah Informasi Diri"
* **Form Field:**
  * Nama Lengkap (Text Input)
  * Peran Utama (Text Input)
  * Tagline / Bio Singkat (Textarea)
  * Domisili & Surel / Email (Grid 2 Kolom Input)
  * Status Ketersediaan (Text Input)
* **Aksi:** Tombol `Batal` & `Simpan Perubahan`.

#### 2. Modal: "Simpan Proyek Baru"
* **Form Field:**
  * **Nama Proyek \*** (Text Input)
  * **Deskripsi Singkat Proyek \*** (Textarea)
  * **Teknologi / Bahasa Pemrograman \*** (Text Input dengan pemisah koma)
  * **Tautan Web / Link Proyek** (URL Input)
  * **Tanggal / Tahun Pembuatan \*** (Text Input)
* **Aksi:** Tombol `Batal` & `Simpan ke Koleksi Proyek`.

---

## 4. Persyaratan Teknis & Arsitektur Kode

* **Frontend:** Next.js (App Router) / React dengan Tailwind CSS untuk styling *dark mode* konsisten.
* **Komponen UI:** Headless UI / Radix UI untuk komponen Modal Dialog dan Tooltip.
* **Icons:** Lucide Icons / Heroicons (Ikon Pensil, Hapus, Copy, External Link, Check Circle).
* **State Management & Form Handling:** React Hook Form / Zustand untuk menangani modal state dan penyimpanan data lokal/API.
* **Storage / Backend (Opsional):** Integration dengan Supabase / PostgreSQL via Prisma ORM untuk mengamankan data dan fitur penambahan proyek secara dinamis.

---

## 5. Kriteria Keberhasilan (Acceptance Criteria)
1. Seluruh tata letak halaman (profil & koleksi proyek) responsif dan cocok pada tampilan *desktop* maupun *mobile*.
2. Fungsi modal `Ubah Informasi Diri` dan `Simpan Proyek Baru` berjalan tanpa mengganggu layout halaman utama.
3. Fitur salin email instan pada widget kontak berfungsi memberikan respon balasan/toast ke pengguna.
4. Pencarian pada halaman koleksi proyek secara fleksibel dapat menyaring kartu proyek berdasarkan kata kunci judul maupun *tech stack*. 