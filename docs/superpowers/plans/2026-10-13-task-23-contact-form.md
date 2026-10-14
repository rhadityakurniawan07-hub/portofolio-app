# Task 23: Contact Form

> Sumber: saran pengembangan — form kontak nyata menggantikan mailto/link WhatsApp.
> Status: BELUM dikerjakan.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode `#0F172A`, React Hook Form (opsional, bisa pakai state manual), validasi Zod (opsional).

## Global Constraints

- Route: `/contact` (page terpisah) + link di Hero & ProfileCard
- Kirim ke email via API Route (`/api/contact`) → Resend/Nodemailer/EmailJS (pilih satu)
- Validasi client-side + server-side
- Tanpa dependensi berat; `react-hook-form` + `zod` OK kalau perlu
- Verifikasi: `bunx turbo run check-types --filter=web` harus PASS

## Task

**Files:**
- Create: `apps/web/app/contact/page.tsx`
- Create: `apps/web/app/api/contact/route.ts`
- Modify: `apps/web/app/components/HeroSection.tsx` (tambah link "Hubungi Saya" ke `/contact`)
- Modify: `apps/web/app/components/ProfileCard.tsx` (tambah link "Hubungi Saya" ke `/contact`)
- Create/Modify: `apps/web/app/components/ContactForm.tsx` (reusable)

**Isi:**
- [ ] Halaman `/contact`:
  - Form: Nama, Email, Subjek, Pesan (required)
  - Validasi client: email format, minimal chars
  - Submit → POST ke `/api/contact` → loading state → toast success/error
  - Honeypot field anti-spam
- [ ] API Route `/api/contact`:
  - Validasi server (Zod)
  - Kirim email (Resend API gratis 3k/bulan, atau Nodemailer SMTP)
  - Rate limit sederhana (IP-based, in-memory)
  - Return JSON `{ success: true }` atau `{ error: "..." }`
- [ ] Link di Hero: "Hubungi Langsung" → `/contact` (bukan mailto)
- [ ] Link di ProfileCard: "Hubungi Saya" → `/contact`
- [ ] Komponen `ContactForm` reusable (bisa dipakai di halaman lain nanti)
- [ ] Responsive, accessible (label, aria, focus visible)