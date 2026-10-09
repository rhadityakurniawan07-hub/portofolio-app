# Desain: Portfolio CMS Bertahap (Fase 1 — CRUD Lokal)

Tanggal: 2026-10-08
Status: Disetujui untuk eksekusi
Sumber: `PRD.md` — Personal Portfolio & Project Repository Web App

## 1. Ringkasan & Keputusan Kunci

Menyelesaikan PRD secara bertahap dengan risiko terkecil:

1. **Penyimpanan:** Zustand + `persist` ke localStorage dulu. Seed dari `apps/web/data/profile.ts`.
   `packages/database` (Prisma `Profile`/`Project`) tidak di-wiring pada Fase 1, schema tetap dijaga untuk migrasi.
2. **Mode Pemilik:** Toggle `Masuk/Keluar` seperti `Navbar.tsx` saat ini + PIN ringan via `NEXT_PUBLIC_OWNER_PIN` (default dev `1234`).
3. **Scope Fase 1:** CRUD dulu — Modal Ubah Profil, Modal Simpan/Edit Proyek, Hapus dengan konfirmasi, gating owner.
   Search fleksibel, counter `Menampilkan N proyek`, toast polish, dan audit responsif penuh masuk Fase 2.
4. **Pendekatan:** A Minimal — Modal custom reusable di `@repo/ui`, form controlled manual, tanpa dependensi baru.

## 2. Arsitektur

- `apps/web` (Next.js 16 App Router): satu-satunya app yang dikerjakan Fase 1. `apps/docs` tidak disentuh.
- `packages/ui`: tambah `Modal` base + `ProjectCard` agar dipakai ulang di Home dan `/projects`.
- `packages/database`: dorman di Fase 1. Tidak ada API Routes/Prisma Client di runtime web.
- State client:
  - `use-profile.ts`: `{ profile, updateProfile }`, persist key `portfolio-profile`.
  - `use-projects.ts`: `{ projects, addProject, updateProject, removeProject }`, persist key `portfolio-projects`, seed dari `recentProjects`.
  - `use-owner.ts`: `{ ownerMode, login(pin), logout }`, persist key `portfolio-owner` (hanya flag, bukan PIN).
- Styling tetap Tailwind dark-mode yang sudah ada. Ikon tetap `lucide-react`.

## 3. Komponen & Perubahan File

Baru:
- `apps/web/stores/use-profile.ts`
- `apps/web/stores/use-projects.ts`
- `apps/web/stores/use-owner.ts`
- `packages/ui/src/modal.tsx` (Modal base reusable; di-export dari `@repo/ui`)
- `apps/web/app/components/ProfileModal.tsx`
- `apps/web/app/components/ProjectModal.tsx` (mode `create`/`edit` via prop)
- `apps/web/app/components/DeleteConfirm.tsx`
- `apps/web/app/components/PinPrompt.tsx`
- `apps/web/app/components/ProjectCard.tsx`

Diubah:
- `app/components/Navbar.tsx`: toggle + PIN prompt + badge `MODE PEMILIK AKTIF` (pertahankan perilaku mobile/desktop).
- `app/components/HeroSection.tsx`: tombol `Ubah Profil` membuka `ProfileModal` (hanya saat owner), `Hubungi` tetap copy email.
- `app/page.tsx`: `Hero`, `Biodata`, `Stats`, `RecentProjects` membaca dari store; showcase ambil 2 terbaru.
- `app/projects/page.tsx`: grid dari store, tombol `+ Simpan Proyek Baru` + Edit/Hapus per kartu (gated owner).
- `app/components/QuickContacts.tsx`: feedback salin via toast-lite.
- `.env.example`: tambah `NEXT_PUBLIC_OWNER_PIN="1234"`.

Tidak disentuh: `apps/docs/*`, `turbo.json`, `prisma/schema.prisma`, config eslint/typescript.

## 4. Alur Data

1. Load: store hydrate dari localStorage; jika kosong/corrupt → fallback ke seed `profile.ts`.
2. Edit profil: `Ubah Profil` → `ProfileModal` prefill → validasi → `updateProfile` → persist → `HeroSection`, `BiodataTable`, stats re-render.
3. Proyek: `Simpan Proyek Baru` → `ProjectModal(create)` → `addProject` dengan `id: crypto.randomUUID()`.
   Edit → `ProjectModal(edit, initialValue)` → `updateProject`. Hapus → `DeleteConfirm` → `removeProject`.
4. Owner: klik `Masuk` → `PinPrompt` → bandingkan dengan env → sukses `ownerMode=true`, gagal pesan inline.
   Semua tombol Edit/Hapus dan pemicu modal di-render kondisional `ownerMode`.
5. Tech stack input: string koma-split → `string[]` trim, filter kosong, dedup.

## 5. Validasi & Error Handling

Profil wajib: Nama Lengkap, Peran Utama, Bio, Domisili, Email (format email), Availability.
Proyek wajib (sesuai PRD): Nama Proyek, Deskripsi, Teknologi (min 1 setelah split), Tahun.
Link proyek opsional, jika diisi harus URL valid (boleh tanpa protokol, dinormalisasi ke `https://`).

- PIN salah: error inline, tidak mengubah mode, rate-limit sederhana (misal maks 5x lalu jeda).
- Clipboard gagal: fallback execCommand/prompt + toast error.
- localStorage gagal/penuh: tangkap exception, pakai state in-memory + toast warning.
- Modal: `role=dialog aria-modal`, ESC + backdrop click untuk tutup, focus ke input pertama saat buka, kembalikan focus saat tutup.

## 6. Testing & Kriteria Sukses Fase 1

Perintah:
- `bun exec turbo run check-types --filter=web`
- `bun exec turbo run lint --filter=web`
- `bun exec turbo run build --filter=web`

Checklist manual:
1. Reload mempertahankan perubahan profil/proyek (persist terbukti).
2. Tanpa owner: tombol Edit/Hapus/modal tersembunyi; dengan owner + PIN benar: muncul dan berfungsi.
3. PIN salah ditolak dengan pesan jelas.
4. Modal create/edit/hapus tidak merusak layout desktop (≥1024px) dan mobile (≤390px).
5. `Ubah Profil` dan `Simpan Proyek Baru` sesuai field PRD bagian D.

Fase 2 (di luar spec ini): search judul/tech case-insensitive, counter, toast polish, audit responsif penuh, empty-state.
Fase 3 (nanti): ganti store dengan Prisma/Supabase via adapter tanpa mengubah komponen.

## 7. Risiko & Batasan

- Data hanya lokal per-browser; beda device tidak sinkron (diterima untuk Fase 1).
- PIN client-side bukan keamanan nyata, hanya gerbang UX — didokumentasikan eksplisit.
- `crypto.randomUUID()` butuh secure context; sediakan fallback counter bila tidak tersedia.
