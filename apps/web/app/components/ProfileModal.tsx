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
