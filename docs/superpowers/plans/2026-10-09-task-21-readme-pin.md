# Task 21: README + PIN Production

> Sumber: saran audit — README masih template Turborepo; PIN default `1234` tidak aman untuk production.
> Status: BELUM dikerjakan.

**Tech Stack:** Markdown, Next.js env.

## Global Constraints

- Jangan commit PIN asli ke repo (gunakan env/Vercel dashboard untuk production).
- Verifikasi: tidak ada kode berubah (kecuali `.env.example` bila perlu).

## Task

**Files:**
- Modify: `apps/web/README.md` (atau root `README.md`): cara jalan (`bun install`, `bunx turbo dev --filter=web`), PIN owner, struktur folder, fitur
- Verify: `.env.example` (`NEXT_PUBLIC_OWNER_PIN` jelas bertanda contoh)

**Isi:**
- [ ] README: judul web, prasyarat (Node 24+, Bun 1.4), perintah dev/build, cara ganti PIN, ringkasan fitur + batasan (data lokal, PIN hanya gerbang UX)
- [ ] Ganti PIN di komputermu via `.env` lokal (jangan commit); pastikan login dengan PIN baru bisa, PIN lama ditolak
