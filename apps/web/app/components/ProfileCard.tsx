"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Github, Send, Mail } from "lucide-react";
import { useProfileStore } from "@/stores/use-profile";
import { useOwnerStore } from "@/stores/use-owner";
import { ProfileModal } from "./ProfileModal";

export function ProfileCard() {
  const profile = useProfileStore((s) => s.profile);
  const ownerMode = useOwnerStore((s) => s.ownerMode);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      /* clipboard tidak tersedia, tetap tampilkan status */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section aria-labelledby="profil-heading">
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50">
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <h2 id="profil-heading" className="text-lg font-bold tracking-tight">
            • Informasi Profil
          </h2>
          {ownerMode && (
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Ubah Data
            </button>
          )}
        </div>

        <dl className="divide-y divide-gray-800 px-6">
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Nama Lengkap</dt>
            <dd className="text-sm text-foreground sm:flex-1">{profile.name}</dd>
          </div>
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Peran Utama</dt>
            <dd className="text-sm text-foreground sm:flex-1">{profile.role}</dd>
          </div>
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Spesialisasi</dt>
            <dd className="flex flex-wrap gap-1.5 sm:flex-1">
              {profile.specializations.map((badge: string) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800/50 px-2.5 py-0.5 text-xs font-medium text-gray-300"
                >
                  {badge}
                </span>
              ))}
            </dd>
          </div>
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Domisili</dt>
            <dd className="text-sm text-foreground sm:flex-1">{profile.location}</dd>
          </div>
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Ketersediaan</dt>
            <dd className="text-sm text-foreground sm:flex-1">• {profile.availability}</dd>
          </div>
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Email Resmi</dt>
            <dd className="flex items-center gap-2 text-sm text-foreground sm:flex-1">
              {profile.email}
              <button
                onClick={handleCopyEmail}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-foreground"
                aria-label={copied ? "Email disalin" : "Salin email"}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
              <span role="status" className="sr-only">
                {copied ? "Email disalin" : ""}
              </span>
            </dd>
          </div>
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Kanal & Repositori</dt>
<dd className="flex items-center gap-4 text-sm sm:flex-1">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                GitHub
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Hubungi
              </a>
              <a
                href={profile.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Telegram
              </a>
            </dd>
          </div>
        </dl>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-800 px-6 py-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">Ingin melihat hasil pengerjaan proyek?</p>
          <Link
            href="/projects"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Buka Koleksi Proyek →
          </Link>
        </div>
      </div>
      <ProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {copied && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-lg border border-green-500/30 bg-gray-950 px-4 py-2 text-sm font-medium text-green-400 shadow-2xl"
        >
          Email disalin ke clipboard
        </div>
      )}
    </section>
  );
}
