# Task 20: Migrasi Database + API (Jangka Panjang)

> Sumber: saran audit — data masih lokal per-browser; perlu sinkron antar perangkat.
> Status: SELESAI. Prasyarat: PostgreSQL jalan + `DATABASE_URL` di `.env`.

**Tech Stack:** Prisma 5, PostgreSQL, Next.js Route Handlers, Zod 3.

## Global Constraints

- Store tetap kompatibel (bentuk `Profile`/`Project` tidak berubah kontrak ke komponen).
- Fallback localStorage saat API/DB mati (aplikasi tetap jalan offline).
- Verifikasi: `bunx turbo run check-types lint --filter=web` harus PASS.

## Task

**Files:**
- Modify: `packages/database/prisma/schema.prisma` (tambah kolom yang kurang: github/telegram/whatsapp/photoUrl/status proyek — lalu `prisma migrate dev`)
- Create: `apps/web/app/api/profile/route.ts` (GET + PUT)
- Create: `apps/web/app/api/projects/route.ts` (GET + POST), `apps/web/app/api/projects/[id]/route.ts` (PUT + DELETE)
- Modify: `apps/web/stores/use-profile.ts`, `apps/web/stores/use-projects.ts` (sumber API + fallback lokal)

**Isi:**
- [ ] Schema lengkap → `prisma migrate dev --name lengkap` → `prisma generate`
- [ ] 5 endpoint dengan validasi (pakai helper `validate*` yang ada) + status HTTP benar (400/404/200/201)
- [ ] Store coba API dulu, gagal → fallback lokal; manual `curl` tiap endpoint
