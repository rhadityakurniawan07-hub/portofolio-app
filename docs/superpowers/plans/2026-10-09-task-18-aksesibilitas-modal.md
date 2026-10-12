# Task 18: Aksesibilitas Modal (Focus Management)

> Sumber: saran audit — modal belum mengembalikan fokus dan jebakan fokus belum penuh.
> Status: BELUM dikerjakan.

**Tech Stack:** Next.js 16 App Router, React 19.

## Global Constraints

- Tanpa dependensi baru (tetap Modal custom).
- Berlaku untuk semua modal (PIN, profil, proyek, hapus) via `packages/ui/src/modal.tsx` saja.
- Verifikasi: `bunx turbo run check-types lint --filter=@repo/ui` harus PASS.

## Task

**Files:**
- Modify: `packages/ui/src/modal.tsx`

**Isi:**
- [ ] Saat dibuka: fokus ke judul/konteks dialog; saat ditutup: kembalikan fokus ke elemen pemicu (simpan `document.activeElement` saat buka)
- [ ] Tab terjebak di dalam dialog (Tab di elemen terakhir → kembali ke pertama, Shift+Tab sebaliknya); ESC + backdrop tetap menutup
- [ ] Cek keyboard manual: buka modal → Tab keliling → ESC → fokus kembali ke tombol pemicu
