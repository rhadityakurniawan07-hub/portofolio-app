"use client";
import { useEffect, useState } from "react";
import { Modal } from "@repo/ui/modal";
import { useProfileStore } from "@/stores/use-profile";
import { parseDaftar, normalizeUrl, validateProfileInput, validateProfileUrls, validateOptionalUrl } from "@/lib/portfolio";

export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [form, setForm] = useState(profile);
  const [specInput, setSpecInput] = useState(profile.specializations.join(", "));
  const [langInput, setLangInput] = useState(profile.languages.join(", "));
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setForm(profile);
      setSpecInput(profile.specializations.join(", "));
      setLangInput(profile.languages.join(", "));
      setErrors([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
      ...validateOptionalUrl("Foto Profil", form.photoUrl),
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
      photoUrl: form.photoUrl.trim() ? normalizeUrl(form.photoUrl) : "",
    });
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
      <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <p className="text-sm text-muted-foreground">
          Perbarui nama, deskripsi singkat, dan detail kontak di bawah secara langsung.
        </p>
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
          <label className="text-sm font-medium" htmlFor="pf-photo">Foto Profil (URL)</label>
          <input
            id="pf-photo"
            className={field}
            value={form.photoUrl}
            onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
            placeholder="https://..."
            aria-describedby="pf-photo-help"
          />
          <p id="pf-photo-help" className="mt-1 text-xs text-muted-foreground">Opsional — kosongkan untuk memakai inisial</p>
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
