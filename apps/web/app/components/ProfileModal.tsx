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

  const handlePhotoFile = async (f: File | undefined) => {
    if (!f) return;
    setPhotoBusy(true);
    setErrors((prev) => prev.filter((e) => !e.startsWith("Foto:"))); // hapus error foto lama
    try {
      const dataUrl = await downscaleImage(f);
      setForm((prev) => ({ ...prev, photoUrl: dataUrl }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal membaca foto";
      setErrors((prev) => [...prev, `Foto: ${msg}`]);
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
    ];
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    updateProfile({
      ...form,
      specializations: parseDaftar(specInput),
      languages: parseDaftar(langInput),
      github: form.github.trim() ? normalizeUrl(form.github) : form.github,
      telegram: form.telegram.trim() ? normalizeUrl(form.telegram) : form.telegram,
      whatsapp: form.whatsapp.trim() ? normalizeUrl(form.whatsapp) : form.whatsapp,
      photoUrl: photoValue.startsWith("data:") ? photoValue : photoValue ? normalizeUrl(photoValue) : "",
    });
    setErrors([]);
    showToast("Profil berhasil diperbarui", "success");
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
      <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1 text-left">
        <p className="text-sm text-muted-foreground">
          Perbarui nama, deskripsi singkat, dan detail kontak di bawah secara langsung.
        </p>
        <div>
          <span className="text-sm font-medium" id="pf-photo-label">Foto Profil</span>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-700 bg-gray-900 text-xl font-bold text-primary/30" aria-hidden="true">
              {photoValue ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoValue} alt="" className="h-full w-full object-cover" />
              ) : (
                (form.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("") || "FA").toUpperCase()
              )}
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-labelledby="pf-photo-label"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handlePhotoFile(file);
                  }
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={photoBusy}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-800 disabled:opacity-50 whitespace-nowrap"
              >
                {photoBusy ? "Memproses..." : "Pilih Foto"}
              </button>
              {photoValue && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, photoUrl: "" })}
                  className="text-xs font-medium text-muted-foreground hover:text-red-400"
                >
                  Hapus foto (kembali ke inisial)
                </button>
              )}
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">JPG/PNG dari perangkat — otomatis diperkecil agar hemat penyimpanan</p>
        </div>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium" htmlFor="pf-avail">Status Ketersediaan</label>
            <input id="pf-avail" className={field} value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="pf-status">Status Aktif</label>
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
          <label className="text-sm font-medium" htmlFor="pf-spec">Spesialisasi</label>
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
          <label className="text-sm font-medium" htmlFor="pf-lang">Penguasaan Bahasa</label>
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
          <label className="text-sm font-medium" htmlFor="pf-github">GitHub</label>
          <input id="pf-github" className={field} value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/..." />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium" htmlFor="pf-telegram">Telegram</label>
            <input id="pf-telegram" className={field} value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} placeholder="https://t.me/..." />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="pf-wa">WhatsApp</label>
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
