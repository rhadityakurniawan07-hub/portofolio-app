"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@repo/ui/modal";
import { useProfileStore } from "@/stores/use-profile";
import { useToast } from "@/components/Toast";
import { parseDaftar, normalizeUrl, validateProfileInput, validateProfileUrls, validateOptionalUrl } from "@/lib/portfolio";
import { downscaleImage } from "@/lib/photo";

export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const { showToast } = useToast();
  const [form, setForm] = useState(profile);
  const [specInput, setSpecInput] = useState(profile.specializations.join(", "));
  const [langInput, setLangInput] = useState(profile.languages.join(", "));
  const [photoBusy, setPhotoBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileRefAbout = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(profile);
      setSpecInput(profile.specializations.join(", "));
      setLangInput(profile.languages.join(", "));
      setErrors([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const photoValue = (form.photoUrl ?? "").trim();
  const aboutPhotoValue = (form.aboutPhotoUrl ?? "").trim();

  const handlePhotoFile = async (f: File | undefined, key: "photoUrl" | "aboutPhotoUrl" = "photoUrl") => {
    if (!f) return;
    setPhotoBusy(true);
    setErrors((prev) => prev.filter((e) => !e.startsWith("Foto:"))); // hapus error foto lama
    try {
      const dataUrl = await downscaleImage(f);
      setForm((prev) => ({ ...prev, [key]: dataUrl }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal membaca foto";
      setErrors((prev) => [...prev, `Foto: ${msg}`]);
      showToast(`Foto: ${msg}`, "error");
    } finally {
      setPhotoBusy(false);
    }
  };

  const save = () => {
    const errs = [
      ...validateProfileInput({
        fullName: form.name,
        role: form.role,
        bio: form.bio,
        location: form.location,
        email: form.email,
        availability: form.availability,
      }),
      ...validateProfileUrls({ github: form.github, telegram: form.telegram, whatsapp: form.whatsapp }),
      ...(photoValue.startsWith("data:") ? [] : validateOptionalUrl("Foto Profil", photoValue)),
      ...(aboutPhotoValue.startsWith("data:") ? [] : validateOptionalUrl("Foto Tentang Saya", aboutPhotoValue)),
    ];
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    try {
      updateProfile({
        ...form,
        specializations: parseDaftar(specInput),
        languages: parseDaftar(langInput),
        github: form.github.trim() ? normalizeUrl(form.github) : form.github,
        telegram: form.telegram.trim() ? normalizeUrl(form.telegram) : form.telegram,
        whatsapp: form.whatsapp.trim() ? normalizeUrl(form.whatsapp) : form.whatsapp,
        photoUrl: photoValue.startsWith("data:") ? photoValue : photoValue ? normalizeUrl(photoValue) : "",
        aboutPhotoUrl: aboutPhotoValue.startsWith("data:") ? aboutPhotoValue : aboutPhotoValue ? normalizeUrl(aboutPhotoValue) : "",
      });
    } catch {
      setErrors([
        "Gagal menyimpan ke penyimpanan browser. Penyimpanan mungkin penuh — hapus foto lama atau gunakan foto yang lebih kecil, lalu coba lagi.",
      ]);
      showToast("Gagal menyimpan: penyimpanan browser mungkin penuh", "error");
      return;
    }
    setErrors([]);
    showToast("Profil berhasil diperbarui", "success");
    onClose();
  };

  const field = "w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2.5 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="UBAH INFORMASI DIRI"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            BATAL
          </button>
          <button onClick={save} className="btn-primary">
            SIMPAN PERUBAHAN
          </button>
        </>
      }
    >
      <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1 text-left">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
          Perbarui nama, deskripsi singkat, dan detail kontak di bawah secara langsung.
        </p>
<div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-photo">FOTO PROFIL</label>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-700 bg-gray-900 text-xl font-bold text-primary/30" aria-hidden="true">
              {photoValue ? (
                <img src={photoValue} alt="" className="h-full w-full object-cover" />
              ) : (
                (form.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("") || "FA").toUpperCase()
              )}
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-2">
              <label
                htmlFor="pf-photo"
                className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-gray-800 focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 focus-within:ring-offset-black ${
                  photoBusy ? "pointer-events-none opacity-50" : ""
                }`}
              >
                {photoBusy ? "Memproses..." : "Pilih Foto"}
              </label>
              <input
                ref={fileRef}
                id="pf-photo"
                type="file"
                accept="image/*"
                disabled={photoBusy}
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handlePhotoFile(file);
                  }
                  e.target.value = "";
                }}
              />
              {photoValue && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, photoUrl: "" })}
                  className="text-xs font-medium text-muted-foreground hover:text-red-400 transition-colors"
                >
                  Hapus Foto
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">JPG/PNG dari perangkat — otomatis diperkecil agar hemat penyimpanan</p>
          </div>
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-about-photo">FOTO TENTANG SAYA</label>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-700 bg-gray-900 text-xl font-bold text-primary/30" aria-hidden="true">
              {aboutPhotoValue ? (
                <img src={aboutPhotoValue} alt="" className="h-full w-full object-cover" />
              ) : (
                (form.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("") || "FA").toUpperCase()
              )}
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-2">
              <label
                htmlFor="pf-about-photo"
                className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-gray-800 focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 focus-within:ring-offset-black ${
                  photoBusy ? "pointer-events-none opacity-50" : ""
                }`}
              >
                {photoBusy ? "Memproses..." : "Pilih Foto"}
              </label>
              <input
                ref={fileRefAbout}
                id="pf-about-photo"
                type="file"
                accept="image/*"
                disabled={photoBusy}
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handlePhotoFile(file, "aboutPhotoUrl");
                  }
                  e.target.value = "";
                }}
              />
              {aboutPhotoValue && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, aboutPhotoUrl: "" })}
                  className="text-xs font-medium text-muted-foreground hover:text-red-400 transition-colors"
                >
                  Hapus Foto
                </button>
              )}
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Foto aktivitas untuk section Tentang Saya</p>
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-name">NAMA LENGKAP</label>
          <input id="pf-name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-role">PERAN UTAMA</label>
          <input id="pf-role" className={field} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-bio">TAGLINE / BIO SINGKAT</label>
          <textarea id="pf-bio" rows={3} className={field} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-longbio">TENTANG SAYA (BIO PANJANG)</label>
          <textarea id="pf-longbio" rows={6} className={field} value={form.longBio} onChange={(e) => setForm({ ...form, longBio: e.target.value })} placeholder="Ceritakan tentang diri Anda, pengalaman, keahlian, dll..." />
          <p className="mt-1 text-xs text-muted-foreground">Bio panjang untuk section 'Tentang Saya'</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-loc">DOMISILI</label>
            <input id="pf-loc" className={field} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-email">SUREL / EMAIL</label>
            <input id="pf-email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-avail">STATUS KETERSEDIAAN</label>
            <input id="pf-avail" className={field} value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-status">STATUS AKTIF</label>
            <select
              id="pf-status"
              className={field}
              value={form.availabilityStatus}
              onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value })}
            >
              <option value="available">Tersedia</option>
              <option value="busy">Sibuk</option>
            </select>
          </div>
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-spec">SPESIALISASI</label>
          <input
            id="pf-spec"
            className={field}
            value={specInput}
            onChange={(e) => setSpecInput(e.target.value)}
            placeholder="Next.js, Node.js"
            aria-describedby="pf-spec-help"
          />
          <p id="pf-spec-help" className="mt-1 text-xs text-muted-foreground">Pisahkan dengan koma (,)</p>
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-lang">PENGUASAAN BAHASA</label>
          <input
            id="pf-lang"
            className={field}
            value={langInput}
            onChange={(e) => setLangInput(e.target.value)}
            placeholder="Indonesia, English"
            aria-describedby="pf-lang-help"
          />
          <p id="pf-lang-help" className="mt-1 text-xs text-muted-foreground">Pisahkan dengan koma (,)</p>
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-github">GITHUB</label>
          <input id="pf-github" className={field} value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/..." />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-telegram">TELEGRAM</label>
            <input id="pf-telegram" className={field} value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} placeholder="https://t.me/..." />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pf-wa">WHATSAPP</label>
            <input id="pf-wa" className={field} value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="https://wa.me/..." />
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