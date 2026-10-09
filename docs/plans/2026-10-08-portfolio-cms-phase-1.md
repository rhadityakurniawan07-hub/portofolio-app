# Portfolio CMS Fase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementasi CRUD lokal bertahap (Modal Ubah Profil + Simpan/Edit/Hapus Proyek + PIN owner) dengan Zustand + localStorage.

**Architecture:** `apps/web` saja yang diubah; pure helpers di `apps/web/lib/` diuji via `node --test`; 3 Zustand store persist; 1 Modal base di `@repo/ui`; komponen CRUD gated `ownerMode`.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3 dark-mode, Zustand 5 persist, lucide-react, Node built-in test runner (tanpa deps baru).

**Spec:** `docs/specs/2026-10-08-portfolio-cms-design.md`

## Global Constraints

- Tanpa dependensi baru di Fase 1 (tidak tambah Radix / RHF / Zod / vitest).
- Bahasa UI Indonesia sesuai PRD (contoh: `Ubah Profil`, `Simpan ke Koleksi Proyek`, `Batal`, `MODE PEMILIK AKTIF`).
- `packages/database` (Prisma) tidak di-wiring di Fase 1.
- `apps/docs/*`, `turbo.json`, `prisma/schema.prisma` tidak disentuh.
- Semua perintah dijalankan dari repo root `C:\Users\RADIT\project\portofolio-app` (atau setara di mesin eksekutor).
- Verifikasi per task: `bun exec turbo run check-types --filter=web` harus PASS.

---

### Task 1: Pure helpers + unit test Node

**Files:**
- Create: `apps/web/lib/portfolio.ts`
- Create: `apps/web/lib/portfolio.test.ts`

**Interfaces:**
- Consumes: tidak ada (task pertama).
- Produces:
  - `parseTechStack(input: string): string[]`
  - `normalizeUrl(input: string): string`
  - `validateProfileInput(v: { fullName: string; role: string; bio: string; location: string; email: string; availability: string }): string[]`
  - `validateProjectInput(v: { title: string; description: string; techStack: string[]; year: string; link?: string }): string[]`
  - `checkOwnerPin(input: string): boolean`
  - `newProjectId(): string`

- [ ] **Step 1: Write the failing test**

```ts
// apps/web/lib/portfolio.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseTechStack,
  normalizeUrl,
  validateProjectInput,
  validateProfileInput,
  checkOwnerPin,
} from "./portfolio.ts";

describe("parseTechStack", () => {
  it("split koma, trim, buang kosong, dedup", () => {
    assert.deepEqual(parseTechStack("Next.js, Node.js,, Next.js ,  "), [
      "Next.js",
      "Node.js",
    ]);
  });
});

describe("normalizeUrl", () => {
  it("tambah https bila tanpa protokol, kosong tetap kosong", () => {
    assert.equal(normalizeUrl("example.com/x"), "https://example.com/x");
    assert.equal(normalizeUrl("https://example.com/x"), "https://example.com/x");
    assert.equal(normalizeUrl(""), "");
  });
});

describe("validateProjectInput", () => {
  it("tolak title/deskripsi/tech/year kosong", () => {
    const errs = validateProjectInput({
      title: "",
      description: "",
      techStack: [],
      year: "",
      link: "bukan url",
    });
    assert.ok(errs.length >= 4);
  });
  it("terima input valid", () => {
    const errs = validateProjectInput({
      title: "E-Commerce",
      description: "Full-stack shop",
      techStack: ["Next.js"],
      year: "2024",
      link: "",
    });
    assert.deepEqual(errs, []);
  });
});

describe("validateProfileInput", () => {
  it("tolak email format salah", () => {
    const errs = validateProfileInput({
      fullName: "A",
      role: "Dev",
      bio: "Bio",
      location: "Sleman",
      email: "bukan-email",
      availability: "Tersedia",
    });
    assert.ok(errs.some((e) => e.toLowerCase().includes("email")));
  });
});

describe("checkOwnerPin", () => {
  it("PIN salah ditolak", () => {
    assert.equal(checkOwnerPin("0000"), false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test apps/web/lib/portfolio.test.ts`
Expected: FAIL with `Cannot find module './portfolio.ts'` (file belum ada).

- [ ] **Step 3: Write minimal implementation**

```ts
// apps/web/lib/portfolio.ts
export function parseTechStack(input: string): string[] {
  const seen = new Set<string>();
  for (const part of input.split(",")) {
    const t = part.trim();
    if (t && !seen.has(t)) seen.add(t);
  }
  return [...seen];
}

export function normalizeUrl(input: string): string {
  const v = input.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

function isValidUrl(v: string): boolean {
  if (!v.trim()) return true;
  try {
    new URL(normalizeUrl(v));
    return true;
  } catch {
    return false;
  }
}

export function validateProfileInput(v: {
  fullName: string;
  role: string;
  bio: string;
  location: string;
  email: string;
  availability: string;
}): string[] {
  const errs: string[] = [];
  if (!v.fullName.trim()) errs.push("Nama Lengkap wajib diisi");
  if (!v.role.trim()) errs.push("Peran Utama wajib diisi");
  if (!v.bio.trim()) errs.push("Bio wajib diisi");
  if (!v.location.trim()) errs.push("Domisili wajib diisi");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    errs.push("Email tidak valid");
  if (!v.availability.trim()) errs.push("Status Ketersediaan wajib diisi");
  return errs;
}

export function validateProjectInput(v: {
  title: string;
  description: string;
  techStack: string[];
  year: string;
  link?: string;
}): string[] {
  const errs: string[] = [];
  if (!v.title.trim()) errs.push("Nama Proyek wajib diisi");
  if (!v.description.trim()) errs.push("Deskripsi wajib diisi");
  if (v.techStack.length === 0) errs.push("Teknologi minimal 1");
  if (!v.year.trim()) errs.push("Tahun wajib diisi");
  if (v.link && !isValidUrl(v.link)) errs.push("Tautan Web tidak valid");
  return errs;
}

export function checkOwnerPin(input: string): boolean {
  const expected = (process.env.NEXT_PUBLIC_OWNER_PIN ?? "1234").trim();
  return input.trim() === expected;
}

export function newProjectId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `local-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test apps/web/lib/portfolio.test.ts`
Expected: PASS (7 tests, 0 fail). Jika `checkOwnerPin("0000")` gagal karena env kebetulan `0000`, set `NEXT_PUBLIC_OWNER_PIN=1234` lalu ulangi.

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib/portfolio.ts apps/web/lib/portfolio.test.ts
git commit -m "feat(web): tambah portfolio helpers dan unit test"
```

---

### Task 2: Zustand stores persist + seed

**Files:**
- Create: `apps/web/stores/use-profile.ts`
- Create: `apps/web/stores/use-projects.ts`
- Create: `apps/web/stores/use-owner.ts`

**Interfaces:**
- Consumes: `profileData`, `recentProjects` dari `@/data/profile`; `checkOwnerPin` dari `@/lib/portfolio`.
- Produces:
  - `useProfileStore(): { profile: typeof profileData; updateProfile(p: Partial<typeof profileData>): void; resetProfile(): void }`
  - `useProjectsStore(): { projects: Project[]; addProject(p: Omit<Project, "id">): void; updateProject(id: number | string, p: Partial<Project>): void; removeProject(id: number | string): void; resetProjects(): void }`
  - `useOwnerStore(): { ownerMode: boolean; failedAttempts: number; login(pin: string): string | null; logout(): void }` (`login` return `null` sukses, string error bila gagal.)

- [ ] **Step 1: Write the stores (no new test file; verification via type-check)**

```ts
// apps/web/stores/use-profile.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { profileData } from "@/data/profile";

export type Profile = typeof profileData;

interface ProfileState {
  profile: Profile;
  updateProfile: (p: Partial<Profile>) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: profileData,
      updateProfile: (p) =>
        set((s) => ({ profile: { ...s.profile, ...p } })),
      resetProfile: () => set({ profile: profileData }),
    }),
    { name: "portfolio-profile" }
  )
);
```

```ts
// apps/web/stores/use-projects.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { recentProjects, type Project } from "@/data/profile";
import { newProjectId } from "@/lib/portfolio";

interface ProjectsState {
  projects: Project[];
  addProject: (p: Omit<Project, "id">) => void;
  updateProject: (id: Project["id"], p: Partial<Project>) => void;
  removeProject: (id: Project["id"]) => void;
  resetProjects: () => void;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: recentProjects as Project[],
      addProject: (p) =>
        set((s) => ({
          projects: [{ ...p, id: newProjectId() as unknown as number } as Project, ...s.projects],
        })),
      updateProject: (id, p) =>
        set((s) => ({
          projects: s.projects.map((x) => (x.id === id ? { ...x, ...p } : x)),
        })),
      removeProject: (id) =>
        set((s) => ({ projects: s.projects.filter((x) => x.id !== id) })),
      resetProjects: () => set({ projects: recentProjects as Project[] }),
    }),
    { name: "portfolio-projects" }
  )
);
```

```ts
// apps/web/stores/use-owner.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { checkOwnerPin } from "@/lib/portfolio";

interface OwnerState {
  ownerMode: boolean;
  failedAttempts: number;
  login: (pin: string) => string | null;
  logout: () => void;
}

export const useOwnerStore = create<OwnerState>()(
  persist(
    (set, get) => ({
      ownerMode: false,
      failedAttempts: 0,
      login: (pin) => {
        if (get().failedAttempts >= 5) return "Terlalu banyak percobaan. Coba lagi nanti.";
        if (checkOwnerPin(pin)) {
          set({ ownerMode: true, failedAttempts: 0 });
          return null;
        }
        set({ failedAttempts: get().failedAttempts + 1 });
        return "PIN salah";
      },
      logout: () => set({ ownerMode: false }),
    }),
    { name: "portfolio-owner", partialize: (s) => ({ ownerMode: s.ownerMode }) as OwnerState }
  )
);
```

Catatan: tipe `Project.id` di `apps/web/data/profile.ts` saat ini `number`; store memakai `newProjectId()` string — cast di atas disengaja agar Fase 1 jalan tanpa migrasi tipe. Fase 3 (Prisma `cuid()`) akan merapikan tipe ke `string`.

- [ ] **Step 2: Run type-check to verify it passes**

Run: `bun exec turbo run check-types --filter=web`
Expected: PASS. Jika gagal pada `partialize` typing, ganti opsi persist menjadi `{ name: "portfolio-owner" }` saja (persist seluruh state) lalu ulangi.

- [ ] **Step 3: Manual smoke (tanpa commit dulu)**

Buka `apps/web/stores/use-profile.ts` pastikan import `@/data/profile` resolve (alias `@/*` → `./*` di `apps/web/tsconfig.json` sudah mencakup `@/data/*` dan `@/lib/*` perlu diverifikasi: `@/lib/*` sudah ada di paths).

- [ ] **Step 4: Commit**

```bash
git add apps/web/stores/use-profile.ts apps/web/stores/use-projects.ts apps/web/stores/use-owner.ts
git commit -m "feat(web): tambah zustand stores profile projects owner persist"
```

---

### Task 3: Modal base reusable di @repo/ui

**Files:**
- Create: `packages/ui/src/modal.tsx`
- Test: type-check + lint paket ui (tidak ada test runner baru).

**Interfaces:**
- Consumes: `react` saja.
- Produces: `Modal(props: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }): JSX.Element | null`

- [ ] **Step 1: Write minimal implementation**

```tsx
// packages/ui/src/modal.tsx
"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    firstRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
      <div className="relative w-full max-w-lg rounded-xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-foreground"
            aria-label="Tutup dialog"
          >
            ✕
          </button>
        </div>
        <div ref={firstRef as unknown as React.RefObject<HTMLDivElement>} tabIndex={-1}>
          {children}
        </div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
```

Dipakai via `import { Modal } from "@repo/ui/modal"` (didukung `exports` `"./*": "./src/*.tsx"` di `packages/ui/package.json`, pola sama seperti `@repo/ui/stat-card` yang dipakai `app/page.tsx`).

- [ ] **Step 2: Run type-check + lint untuk paket ui**

Run: `bun exec turbo run check-types --filter=@repo/ui`
Expected: PASS. Lalu `bun exec turbo run lint --filter=@repo/ui`, PASS dengan 0 warning.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/modal.tsx
git commit -m "feat(ui): tambah Modal base reusable"
```

---

### Task 4: PIN owner + gating Navbar

**Files:**
- Create: `apps/web/app/components/PinPrompt.tsx`
- Modify: `apps/web/app/components/Navbar.tsx` (ganti `useState` owner lokal → `useOwnerStore`, tambah `PinPrompt`, pertahankan badge `MODE PEMILIK AKTIF` + menu mobile)
- Modify: `.env.example` (tambah `NEXT_PUBLIC_OWNER_PIN`)

**Interfaces:**
- Consumes: `useOwnerStore` dari Task 2; `Modal` dari Task 3.
- Produces: `PinPrompt(props: { open: boolean; onClose: () => void }): JSX.Element | null`

- [ ] **Step 1: Write PinPrompt**

```tsx
// apps/web/app/components/PinPrompt.tsx
"use client";
import { useState } from "react";
import { Modal } from "@repo/ui/modal";
import { useOwnerStore } from "@/stores/use-owner";

export function PinPrompt({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const login = useOwnerStore((s) => s.login);

  const submit = () => {
    const err = login(pin);
    if (err) {
      setError(err);
      return;
    }
    setPin("");
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Masuk Mode Pemilik"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-800"
          >
            Batal
          </button>
          <button
            onClick={submit}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Masuk
          </button>
        </>
      }
    >
      <label className="block text-sm font-medium" htmlFor="owner-pin">
        PIN Pemilik
      </label>
      <input
        id="owner-pin"
        type="password"
        inputMode="numeric"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
        placeholder="••••"
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </Modal>
  );
}
```

- [ ] **Step 2: Modify Navbar (ganti state lokal dengan store)**

Di `apps/web/app/components/Navbar.tsx`: hapus `const [ownerMode, setOwnerMode] = useState(false)`, ganti dengan:
```tsx
const ownerMode = useOwnerStore((s) => s.ownerMode);
const logout = useOwnerStore((s) => s.logout);
const [pinOpen, setPinOpen] = useState(false);
```
Tombol Masuk/Keluar: bila `ownerMode` panggil `logout()`, bila belum buka `setPinOpen(true)`. Render `<PinPrompt open={pinOpen} onClose={() => setPinOpen(false)} />` di akhir `<header>`. Pertahankan badge `MODE PEMILIK AKTIF` dan menu mobile apa adanya.

- [ ] **Step 3: Update .env.example**

Tambah baris: `NEXT_PUBLIC_OWNER_PIN="1234"` di bawah `NEXT_PUBLIC_APP_URL`.

- [ ] **Step 4: Run verification**

Run: `bun exec turbo run check-types --filter=web`
Expected: PASS. Manual: klik Masuk → PIN `1234` → badge muncul; PIN salah → pesan `PIN salah`; reload → mode pemilik persist.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/components/PinPrompt.tsx apps/web/app/components/Navbar.tsx .env.example
git commit -m "feat(web): owner mode toggle dengan PIN ringan"
```

---

### Task 5: Modal Ubah Profil + wiring Hero/Biodata

**Files:**
- Create: `apps/web/app/components/ProfileModal.tsx`
- Modify: `apps/web/app/components/HeroSection.tsx` (baca store, tombol Ubah Profil gated owner)
- Modify: `apps/web/app/components/BiodataTable.tsx` (baca store, bukan `biodataFields` statis)
- Modify: `apps/web/app/page.tsx` (stats `Hasil Kerja` dihitung dari jumlah projects store)

**Interfaces:**
- Consumes: `useProfileStore`, `useOwnerStore`, `Modal`, `validateProfileInput`.
- Produces: `ProfileModal(props: { open: boolean; onClose: () => void })`.

- [ ] **Step 1: Write ProfileModal (field sesuai PRD D.1)**

Field: Nama Lengkap, Peran Utama, Tagline/Bio (textarea), Domisili, Email, Status Ketersediaan — grid 2 kolom untuk Domisili+Email.

```tsx
// apps/web/app/components/ProfileModal.tsx
"use client";
import { useState } from "react";
import { Modal } from "@repo/ui/modal";
import { useProfileStore } from "@/stores/use-profile";
import { validateProfileInput } from "@/lib/portfolio";

export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState<string[]>([]);

  const save = () => {
    const errs = validateProfileInput({
      fullName: form.name,
      role: form.role,
      bio: form.bio,
      location: form.location,
      email: form.email,
      availability: form.availability,
    });
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    updateProfile(form);
    setErrors([]);
    onClose();
  };

  const field = "w-full rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2.5 text-sm focus:border-primary focus:outline-none";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ubah Informasi Diri"
      footer={
        <>
          <button onClick={onClose} className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-800">
            Batal
          </button>
          <button onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Simpan Perubahan
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="pf-name">Nama Lengkap</label>
          <input id="pf-name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="pf-role">Peran Utama</label>
          <input id="pf-role" className={field} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="pf-bio">Tagline / Bio Singkat</label>
          <textarea id="pf-bio" rows={3} className={field} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium" htmlFor="pf-loc">Domisili</label>
            <input id="pf-loc" className={field} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="pf-email">Surel / Email</label>
            <input id="pf-email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="pf-avail">Status Ketersediaan</label>
          <input id="pf-avail" className={field} value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
        </div>
        {errors.length > 0 && (
          <ul className="space-y-1 text-sm text-red-400">
            {errors.map((e) => (
              <li key={e}>• {e}</li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
```

- [ ] **Step 2: Wire HeroSection + BiodataTable + stats**

`HeroSection.tsx`: ganti `import { profileData }` → `useProfileStore((s) => s.profile)`; `ownerMode` dari `useOwnerStore`; tombol `Ubah Profil` hanya render bila owner, onClick buka `ProfileModal` (state lokal `open`). `BiodataTable.tsx`: bangun rows dari `profile` store (Nama, Peran, Spesialisasi badges, Domisili, Ketersediaan, Bahasa) — jangan pakai `biodataFields` statis lagi. `page.tsx`: stats `Hasil Kerja` value = `${projects.length}+` dari `useProjectsStore`, dua kartu lain tetap dari `statsData`.

- [ ] **Step 3: Run verification**

Run: `bun exec turbo run check-types --filter=web`
Expected: PASS. Manual: tanpa owner tombol Ubah tersembunyi; dengan owner edit nama → reload → nama bertahan; email salah → error inline.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/components/ProfileModal.tsx apps/web/app/components/HeroSection.tsx apps/web/app/components/BiodataTable.tsx apps/web/app/page.tsx
git commit -m "feat(web): modal ubah profil dengan persist lokal"
```

---

### Task 6: CRUD Proyek (ProjectModal + DeleteConfirm + ProjectCard + pages)

**Files:**
- Create: `apps/web/app/components/ProjectModal.tsx`
- Create: `apps/web/app/components/DeleteConfirm.tsx`
- Create: `apps/web/app/components/ProjectCard.tsx`
- Modify: `apps/web/app/projects/page.tsx` (grid dari store, tombol gated owner)
- Modify: `apps/web/app/components/RecentProjects.tsx` (2 terbaru dari store)

**Interfaces:**
- Consumes: `useProjectsStore`, `useOwnerStore`, `Modal`, `parseTechStack`, `normalizeUrl`, `validateProjectInput`.
- Produces:
  - `ProjectModal(props: { open: boolean; onClose: () => void; editingId?: number | string | null })`
  - `DeleteConfirm(props: { open: boolean; title: string; onCancel: () => void; onConfirm: () => void })`
  - `ProjectCard(props: { project: Project; onEdit: () => void; onDelete: () => void; canManage: boolean })`

- [ ] **Step 1: Write DeleteConfirm + ProjectCard**

```tsx
// apps/web/app/components/DeleteConfirm.tsx
"use client";
import { Modal } from "@repo/ui/modal";

export function DeleteConfirm({ open, title, onCancel, onConfirm }: { open: boolean; title: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Hapus Proyek"
      footer={
        <>
          <button onClick={onCancel} className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-800">
            Batal
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
            Hapus
          </button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Yakin hapus <span className="font-semibold text-foreground">{title}</span>? Tindakan ini tidak bisa dibatalkan.
      </p>
    </Modal>
  );
}
```

```tsx
// apps/web/app/components/ProjectCard.tsx
"use client";
import { ExternalLink, Pencil, Trash2, CheckCircle } from "lucide-react";
import type { Project } from "@/data/profile";

export function ProjectCard({ project, onEdit, onDelete, canManage }: { project: Project; onEdit: () => void; onDelete: () => void; canManage: boolean }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-primary/30">
            {project.year} • {project.category}
          </span>
          <div className="flex items-center gap-2">
            {canManage && (
              <>
                <button onClick={onEdit} className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-foreground" aria-label={`Edit ${project.title}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={onDelete} className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-red-400" aria-label={`Hapus ${project.title}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label={`Buka ${project.title}`}>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        <h3 className="text-xl font-bold">{project.title}</h3>
        <p className="line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((t) => (
            <span key={t} className="rounded-full border border-gray-700 bg-gray-800/50 px-2 py-0.5 text-xs text-gray-300">
              {t}
            </span>
          ))}
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400 ring-1 ring-green-500/30">
          <CheckCircle className="h-3 w-3" /> {project.status}
        </span>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Write ProjectModal (create/edit sesuai PRD D.2)**

Field PRD: Nama Proyek*, Deskripsi*, Teknologi koma*, Tautan Web, Tahun*. Saat `editingId` ada → prefill dari store; simpan via `addProject` atau `updateProject`; link dinormalisasi via `normalizeUrl`.

```tsx
// apps/web/app/components/ProjectModal.tsx
"use client";
import { useEffect, useState } from "react";
import { Modal } from "@repo/ui/modal";
import { useProjectsStore } from "@/stores/use-projects";
import { parseTechStack, normalizeUrl, validateProjectInput } from "@/lib/portfolio";

export function ProjectModal({ open, onClose, editingId }: { open: boolean; onClose: () => void; editingId?: number | string | null }) {
  const projects = useProjectsStore((s) => s.projects);
  const addProject = useProjectsStore((s) => s.addProject);
  const updateProject = useProjectsStore((s) => s.updateProject);
  const editing = editingId != null ? projects.find((p) => p.id === editingId) : undefined;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [link, setLink] = useState("");
  const [year, setYear] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setTitle(editing?.title ?? "");
      setDescription(editing?.description ?? "");
      setTech(editing?.techStack.join(", ") ?? "");
      setLink(editing?.projectUrl ?? "");
      setYear(editing?.year ?? "");
      setErrors([]);
    }
  }, [open, editing?.title, editing?.description, editing?.techStack, editing?.projectUrl, editing?.year]);

  const save = () => {
    const techStack = parseTechStack(tech);
    const errs = validateProjectInput({ title, description, techStack, year, link });
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    if (editing) {
      updateProject(editing.id, { title, description, techStack, year, projectUrl: normalizeUrl(link) });
    } else {
      addProject({
        title,
        description,
        techStack,
        year,
        category: "Online",
        status: "Production",
        projectUrl: normalizeUrl(link),
        githubUrl: "",
        featured: false,
      } as unknown as Parameters<typeof addProject>[0]);
    }
    onClose();
  };

  const field = "w-full rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2.5 text-sm focus:border-primary focus:outline-none";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Ubah Proyek" : "Simpan Proyek Baru"}
      footer={
        <>
          <button onClick={onClose} className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-800">
            Batal
          </button>
          <button onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            {editing ? "Simpan Perubahan" : "Simpan ke Koleksi Proyek"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="pj-title">Nama Proyek *</label>
          <input id="pj-title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="pj-desc">Deskripsi Singkat Proyek *</label>
          <textarea id="pj-desc" rows={3} className={field} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="pj-tech">Teknologi / Bahasa (pisahkan koma) *</label>
          <input id="pj-tech" className={field} value={tech} onChange={(e) => setTech(e.target.value)} placeholder="Next.js, Node.js" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium" htmlFor="pj-link">Tautan Web / Link Proyek</label>
            <input id="pj-link" className={field} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="pj-year">Tanggal / Tahun Pembuatan *</label>
            <input id="pj-year" className={field} value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
          </div>
        </div>
        {errors.length > 0 && (
          <ul className="space-y-1 text-sm text-red-400">
            {errors.map((e) => (
              <li key={e}>• {e}</li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
```

- [ ] **Step 3: Wire pages (`"use client"`, gated owner)**

`apps/web/app/projects/page.tsx` jadi client component: baca `projects` + `removeProject` dari store, `ownerMode` dari store; state `modalOpen`, `editingId`, `deleteId`; tombol `+ Simpan Proyek Baru` hanya bila owner; grid render `ProjectCard` (sebelumnya placeholder `Menampilkan 0 proyek` dihapus). `RecentProjects.tsx`: ganti `recentProjects` statis → `useProjectsStore((s) => s.projects).slice(0, 2)`.

- [ ] **Step 4: Run verification**

Run: `bun exec turbo run check-types --filter=web`
Expected: PASS. Manual: tambah proyek → muncul di grid + reload bertahan; edit prefill benar; hapus minta konfirmasi; tanpa owner tombol Edit/Hapus tersembunyi.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/components/ProjectModal.tsx apps/web/app/components/DeleteConfirm.tsx apps/web/app/components/ProjectCard.tsx apps/web/app/projects/page.tsx apps/web/app/components/RecentProjects.tsx
git commit -m "feat(web): CRUD proyek lokal dengan modal dan konfirmasi hapus"
```

---

### Task 7: Toast salin email + verifikasi akhir Fase 1

**Files:**
- Modify: `apps/web/app/components/QuickContacts.tsx` (toast `Disalin!` sudah ada via ikon Check; tambah `role=status` agar eksplisit)
- Test: full `check-types`, `lint`, `build` untuk `web`.

**Interfaces:**
- Consumes: semua task sebelumnya.
- Produces: Fase 1 selesai, siap Fase 2 (search/counter/polish).

- [ ] **Step 1: Tambah aksesibilitas toast**

Di `QuickContacts.tsx`, pada tombol salin yang sudah ada, pastikan ada `<span role="status" className="sr-only">{copied === contact.label ? "Email disalin" : ""}</span>` di dalam card Email agar screen reader mengumumkan. Tidak ubah styling.

- [ ] **Step 2: Run full verification**

Run: `bun exec turbo run check-types --filter=web`
Expected: PASS.

Run: `bun exec turbo run lint --filter=web`
Expected: PASS, 0 warning.

Run: `bun exec turbo run build --filter=web`
Expected: PASS (Next.js build selesai tanpa error).

- [ ] **Step 3: Manual acceptance Fase 1**

1. Reload mempertahankan profil + proyek.
2. Tanpa owner: tidak ada tombol Ubah/Edit/Hapus/Simpan.
3. PIN salah → `PIN salah`; PIN `1234` (atau env) → badge `MODE PEMILIK AKTIF`.
4. Modal create/edit/hapus tidak merusak layout desktop dan mobile.
5. Field modal sesuai PRD D (profil 6 field, proyek 5 field dengan 4 required).

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/components/QuickContacts.tsx
git commit -m "feat(web): aksesibilitas toast salin email"
```

---

## Self-Review

1. **Spec coverage:** Ringkasan §1 (4 keputusan) → Task 1-2 (storage), Task 4 (PIN), Task 5-6 (CRUD), Task 7 (toast-lite). Arsitektur §2 → Task 2-3. File §3 → Task 2-7 lengkap. Alur §4 → Task 5-6. Validasi §5 → Task 1 + dipakai Task 5-6. Testing §6 → Task 7. Risiko §7 (lokal-only, PIN UX, randomUUID fallback) → diimplementasi di Task 1-2. Tidak ada gap.
2. **Placeholder scan:** tidak ada `TBD/TODO/implement later/handle edge cases` — semua langkah berisi kode/perintah aktual.
3. **Type consistency:** `Project.id` tetap `number | string` di semua signature (`editingId`, `onEdit/onDelete`, store) agar cocok dengan `data/profile.ts` (number) dan `newProjectId()` (string). `Modal` signature konsisten di Task 3-6. `login(pin): string | null` konsisten Task 2 dan Task 4.
