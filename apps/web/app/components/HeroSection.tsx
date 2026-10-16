"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, MapPin, MessageSquare, Github, Send, Briefcase, Code, Cpu } from "lucide-react";
import { useProfileStore } from "@/stores/use-profile";
import { useOwnerStore } from "@/stores/use-owner";
import { ProfileModal } from "./ProfileModal";

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const profile = useProfileStore((s) => s.profile);
  const ownerMode = useOwnerStore((s) => s.ownerMode);

  useEffect(() => {
    setImgError(false);
  }, [profile.photoUrl]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      /* clipboard tidak tersedia, tetap tampilkan status */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const infoRows = [
    { label: "FOKUS", value: "Full-Stack Web Development", icon: Cpu },
    { label: "STACK", value: profile.specializations.slice(0, 3).join(", "), icon: Code },
    { label: "CURRENTLY", value: profile.availability, icon: Briefcase },
  ];

  return (
    <section className="relative" aria-labelledby="hero-heading">
      <div className="editorial-grid-2">
        {/* Kolom Kiri - Konten Teks */}
        <div className="editorial-hero-left">
          {/* Label Monospace */}
          <p className="editorial-label">
            SOFTWARE ENGINEER
          </p>

          {/* Nama Bold Uppercase */}
          <h1 id="hero-heading" className="editorial-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-tight text-foreground mb-4">
            {profile.name.toUpperCase()}
          </h1>

          {/* Role */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-4 font-medium">
            {profile.role}
          </p>

          {/* Bio */}
          <p className="max-w-xl text-base text-muted-foreground mb-8 leading-relaxed">
            {profile.bio}
          </p>

          {/* Tombol Aksi */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              onClick={handleCopyEmail}
              className="btn-primary"
              aria-label={copied ? "Email disalin" : "Hubungi langsung"}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {copied ? "Disalin!" : "Hubungi Langsung"}
              <span role="status" className="sr-only">
                {copied ? "Email disalin" : ""}
              </span>
            </button>
            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.03 9 8v1.028c-3.707.213-6.456.937-7.992 2.546L12 21l-1.75-3.245" /></svg>
              WhatsApp
            </a>
            <Link
              href="/contact"
              className="btn-secondary"
            >
              Hubungi Saya
            </Link>
            <Link
              href="/projects"
              className="btn-secondary"
            >
              Lihat Portofolio
            </Link>
          </div>

          {/* Tabel Info Ringkas */}
          <div className="editorial-divider pt-8">
            <dl className="space-y-4">
              {infoRows.map((row, index) => (
                <div key={row.label} className="flex items-center gap-4 border-b border-gray-800/50 pb-4 last:border-0 last:pb-0">
                  <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground w-24 shrink-0">
                    {row.label}
                  </dt>
                  <dd className="flex items-center gap-2 text-sm text-foreground">
                    <row.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Sosmed */}
          <div className="editorial-divider pt-8 flex flex-wrap items-center gap-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.301 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 4.425-1.333 7.577-1.234 7.577-1.234.653 1.653.242 3.175.117 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.793.577C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
              <span className="font-mono text-xs">GitHub</span>
            </a>
            <a
              href={profile.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              aria-label="Telegram"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l4-4 4 4m0 0l-4 4m4-4H3" /></svg>
              Telegram
            </a>
            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.03 9 8v1.028c-3.707.213-6.456.937-7.992 2.546L12 21l-1.75-3.245" /></svg>
              WhatsApp
            </a>
            <Link
              href="/contact"
              className="btn-secondary"
            >
              Hubungi Saya
            </Link>
            <Link
              href="/projects"
              className="btn-secondary"
            >
              Lihat Portofolio
            </Link>
          </div>

          {ownerMode && (
            <button
              onClick={() => setProfileOpen(true)}
              className="mt-8 inline-flex items-center gap-2 rounded-md border border-gray-700 bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-gray-800 hover:text-foreground"
              aria-label="Ubah profil"
            >
              Ubah Profil (Pemilik)
            </button>
          )}
        </div>

        {/* Kolom Kanan - Foto Profil Persegi Besar */}
        <div className="relative flex justify-center lg:pl-8">
          <div className="relative aspect-square max-w-xs lg:max-w-md mx-auto">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-600/20 to-red-600/5 blur-2xl" />
            <div className="relative aspect-square rounded-xl border-2 border-red-600/50 bg-gray-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent" />
              {profile.photoUrl && !imgError ? (
                <img
                  src={profile.photoUrl}
                  alt={`Foto profil ${profile.name}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-7xl lg:text-9xl font-bold text-red-600/20 uppercase font-mono">
                  {(profile.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("") || "FA").toUpperCase()}
                </div>
              )}
            </div>
            <span className={`absolute bottom-3 right-3 h-4 w-4 rounded-full border-4 border-background ${
              (profile as { availabilityStatus?: string }).availabilityStatus === "available" ? "bg-green-500" : "bg-gray-500"
            }`} aria-label={profile.availability} />
          </div>
        </div>
      </div>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      {copied && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-md border border-green-500/30 bg-gray-950 px-4 py-2 text-sm font-medium text-green-400 shadow-2xl animate-slide-in"
        >
          Email disalin ke clipboard
        </div>
      )}
    </section>
  );
}