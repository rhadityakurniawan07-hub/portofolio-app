'use client'

import { useEffect, useRef, useState } from 'react'
import { useProfileStore } from '@/stores/use-profile'
import { useToast } from '@/components/Toast'
import { parseDaftar, normalizeUrl, validateProfileInput, validateProfileUrls, validateOptionalUrl } from '@/lib/portfolio'
import { downscaleImage } from '@/lib/photo'

export function ProfileEditPanel() {
  const profile = useProfileStore((s) => s.profile)
  const updateProfile = useProfileStore((s) => s.updateProfile)
  const { showToast } = useToast()
  const [form, setForm] = useState(profile)
  const [specInput, setSpecInput] = useState(profile.specializations.join(', '))
  const [langInput, setLangInput] = useState(profile.languages.join(', '))
  const [photoBusy, setPhotoBusy] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const fileRefAbout = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setForm(profile)
    setSpecInput(profile.specializations.join(', '))
    setLangInput(profile.languages.join(', '))
    setErrors([])
  }, [profile.name, profile.specializations, profile.languages])

  const photoValue = (form.photoUrl ?? '').trim()
  const aboutPhotoValue = (form.aboutPhotoUrl ?? '').trim()

  const handlePhotoFile = async (f: File | undefined, key: 'photoUrl' | 'aboutPhotoUrl' = 'photoUrl') => {
    if (!f) return
    setPhotoBusy(true)
    setErrors((prev) => prev.filter((e) => !e.startsWith('Foto:')))
    try {
      const dataUrl = await downscaleImage(f)
      setForm((prev) => ({ ...prev, [key]: dataUrl }))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal membaca foto'
      setErrors((prev) => [...prev, `Foto: ${msg}`])
      showToast(`Foto: ${msg}`, 'error')
    } finally {
      setPhotoBusy(false)
    }
  }

  const save = async () => {
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
      ...(photoValue.startsWith('data:') ? [] : validateOptionalUrl('Foto Profil', photoValue)),
      ...(aboutPhotoValue.startsWith('data:') ? [] : validateOptionalUrl('Foto Tentang Saya', aboutPhotoValue)),
    ]
    if (errs.length > 0) {
      setErrors(errs)
      return
    }
    try {
      updateProfile({
        ...form,
        specializations: parseDaftar(specInput),
        languages: parseDaftar(langInput),
        github: form.github.trim() ? normalizeUrl(form.github) : form.github,
        telegram: form.telegram.trim() ? normalizeUrl(form.telegram) : form.telegram,
        whatsapp: form.whatsapp.trim() ? normalizeUrl(form.whatsapp) : form.whatsapp,
        photoUrl: photoValue.startsWith('data:') ? photoValue : photoValue ? normalizeUrl(photoValue) : '',
        aboutPhotoUrl: aboutPhotoValue.startsWith('data:') ? aboutPhotoValue : aboutPhotoValue ? normalizeUrl(aboutPhotoValue) : '',
      })
    } catch {
      setErrors([
        'Gagal menyimpan ke penyimpanan browser. Penyimpanan mungkin penuh — hapus foto lama atau gunakan foto yang lebih kecil, lalu coba lagi.',
      ])
      showToast('Gagal menyimpan: penyimpanan browser mungkin penuh', 'error')
      return
    }
    // Persist ke database (Prisma) — tidak menggantikan localStorage, hanya lapisan tambahan
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.name,
          role: form.role,
          bio: form.bio,
          longBio: form.longBio,
          location: form.location,
          email: form.email,
          availability: form.availability,
          availabilityStatus: form.availabilityStatus,
          phone: form.phone,
          photoUrl: photoValue.startsWith('data:') ? photoValue : photoValue ? normalizeUrl(photoValue) : '',
          aboutPhotoUrl: aboutPhotoValue.startsWith('data:') ? aboutPhotoValue : aboutPhotoValue ? normalizeUrl(aboutPhotoValue) : '',
          github: form.github.trim() ? normalizeUrl(form.github) : form.github,
          linkedin: form.linkedin,
          twitter: form.twitter,
          whatsapp: form.whatsapp.trim() ? normalizeUrl(form.whatsapp) : form.whatsapp,
          telegram: form.telegram.trim() ? normalizeUrl(form.telegram) : form.telegram,
          specializations: parseDaftar(specInput),
          languages: parseDaftar(langInput),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        showToast('Gagal simpan ke database: ' + (data.error || 'Status ' + res.status), 'error')
      }
    } catch {
      showToast('Gagal kirim ke database (cek koneksi)', 'error')
    }
setErrors([])
      showToast('Data masih diperbarui', 'success')
    }

  const field = 'w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2.5 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black'

  return (
    <div className="mb-12">
      <h2 className="mb-4 text-2xl font-bold">Ubah Biodata</h2>
      <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-6">
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-photo">FOTO PROFIL</label>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-700 bg-gray-900 text-xl font-bold text-primary/30" aria-hidden="true">
              {photoValue ? (
                <img src={photoValue} alt="" className="h-full w-full object-cover" />
              ) : (
                (form.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("") || "FA").toUpperCase()
              )}
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-2">
              <label htmlFor="pe-photo" className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-gray-800 focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 focus-within:ring-offset-black ${photoBusy ? "pointer-events-none opacity-50" : ""}`}>
                {photoBusy ? "Memproses..." : "Pilih Foto"}
              </label>
              <input ref={fileRef} id="pe-photo" type="file" accept="image/*" disabled={photoBusy} className="sr-only" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { await handlePhotoFile(file) }; e.target.value = "" }} />
              {photoValue && (
                <button type="button" onClick={() => setForm({ ...form, photoUrl: "" })} className="text-xs font-medium text-muted-foreground hover:text-red-400 transition-colors">Hapus foto (kembali ke inisial)</button>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">JPG/PNG dari perangkat — otomatis diperkecil agar hemat penyimpanan</p>
          </div>
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-about-photo">FOTO TENTANG SAYA</label>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-700 bg-gray-900 text-xl font-bold text-primary/30" aria-hidden="true">
              {aboutPhotoValue ? (
                <img src={aboutPhotoValue} alt="" className="h-full w-full object-cover" />
              ) : (
                (form.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("") || "FA").toUpperCase()
              )}
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-2">
              <label htmlFor="pe-about-photo" className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-gray-800 focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 focus-within:ring-offset-black ${photoBusy ? "pointer-events-none opacity-50" : ""}`}>
                {photoBusy ? "Memproses..." : "Pilih Foto"}
              </label>
              <input ref={fileRefAbout} id="pe-about-photo" type="file" accept="image/*" disabled={photoBusy} className="sr-only" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { await handlePhotoFile(file, "aboutPhotoUrl") }; e.target.value = "" }} />
              {aboutPhotoValue && (
                <button type="button" onClick={() => setForm({ ...form, aboutPhotoUrl: "" })} className="text-xs font-medium text-muted-foreground hover:text-red-400 transition-colors">Hapus foto (kembali ke inisial)</button>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Foto aktivitas untuk section Tentang Saya</p>
          </div>
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-name">NAMA LENGKAP</label>
          <input id="pe-name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-role">PERAN UTAMA</label>
          <input id="pe-role" className={field} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-bio">TAGLINE / BIO SINGKAT</label>
          <textarea id="pe-bio" rows={3} className={field} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-longbio">SIAPA SAYA (BIO PANJANG)</label>
          <textarea id="pe-longbio" rows={6} className={field} value={form.longBio} onChange={(e) => setForm({ ...form, longBio: e.target.value })} placeholder="Ceritakan tentang diri Anda, pengalaman, keahlian, dll..." />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-loc">DOMISILI</label>
            <input id="pe-loc" className={field} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-email">SUREL / EMAIL</label>
            <input id="pe-email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-avail">STATUS KETERSEDIAAN</label>
            <input id="pe-avail" className={field} value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-status">STATUS AKTIF</label>
            <select id="pe-status" className={field} value={form.availabilityStatus} onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value })}>
              <option value="available">Tersedia</option>
              <option value="busy">Sibuk</option>
            </select>
          </div>
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-spec">SPESIALISASI</label>
          <input id="pe-spec" className={field} value={specInput} onChange={(e) => setSpecInput(e.target.value)} placeholder="Next.js, Node.js" aria-describedby="pe-spec-help" />
          <p id="pe-spec-help" className="mt-1 text-xs text-muted-foreground">Pisahkan dengan koma (,)</p>
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-lang">PENGUASAAN BAHASA</label>
          <input id="pe-lang" className={field} value={langInput} onChange={(e) => setLangInput(e.target.value)} placeholder="Indonesia, English" aria-describedby="pe-lang-help" />
          <p id="pe-lang-help" className="mt-1 text-xs text-muted-foreground">Pisahkan dengan koma (,)</p>
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-telegram">TELEGRAM</label>
          <input id="pe-telegram" className={field} value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} placeholder="https://t.me/..." />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pe-wa">WHATSAPP</label>
          <input id="pe-wa" className={field} value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="https://wa.me/..." />
        </div>
        {errors.length > 0 && (
          <ul className="space-y-1 text-sm text-red-400">
            {errors.map((e) => (
              <li key={e}>• {e}</li>
            ))}
          </ul>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">SIMPAN PERUBAHAN</button>
        </div>
      </div>
    </div>
  )
}