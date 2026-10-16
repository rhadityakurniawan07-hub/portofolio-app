"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Github, Send, Mail, MessageSquare } from "lucide-react";
import { useProfileStore } from "@/stores/use-profile";
import { useOwnerStore } from "@/stores/use-owner";
import { ProfileModal } from "./ProfileModal";

const iconMap = {
  github: Github,
  send: Send,
  mail: Mail,
  messageSquare: MessageSquare,
} as const;

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

  const infoRows = [
    { label: "NAMA LENGKAP", value: profile.name },
    { label: "PERAN UTAMA", value: profile.role },
    { label: "SPESIALISASI", badges: profile.specializations },
    { label: "DOMISILI", value: profile.location },
    { label: "KETERSEDIAAN", value: profile.availability },
    { label: "EMAIL RESMI", value: profile.email, copyable: true },
    { label: "KANAL & REPOSITORI", links: [
      { label: "GitHub", href: profile.github, icon: "github" as const },
      { label: "Telegram", href: profile.telegram, icon: "send" as const },
      { label: "WhatsApp", href: profile.whatsapp, icon: "mail" as const },
    ]},
  ];

  return (
    <section aria-labelledby="profil-heading">
      <div className="editorial-card">
        <div className="editorial-card-header">
          <h2 id="profil-heading" className="editorial-card-title">
            • INFORMASI PROFIL
          </h2>
          {ownerMode && (
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary"
            >
              UBAH DATA
            </button>
          )}
        </div>

        <table className="w-full border-collapse" aria-labelledby="profil-heading">
          <tbody>
            {infoRows.map((row, index) => (
              <tr key={row.label} className={index > 0 ? 'border-t border-gray-800' : ''}>
                <th
                  scope="row"
                  className="w-40 py-4 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground font-medium"
                >
                  {row.label}
                </th>
                <td className="py-4">
                  {row.badges ? (
                    <div className="flex flex-wrap gap-1.5">
                      {row.badges.map((badge: string) => (
                        <span
                          key={badge}
                          className="badge-pill"
                        >
                          {badge}
                        </span>
                      ))}
                  </div>
                ) : row.links ? (
                  <div className="flex flex-wrap items-center gap-3">
                    {row.links.map((link) => {
                      const Icon = iconMap[link.icon];
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {link.label}
                        </a>
                      );
                    })}
                  </div>
                ) : row.copyable ? (
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{row.value}</span>
                    <button
                      onClick={handleCopyEmail}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/5 hover:text-foreground focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
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
                  </div>
                ) : (
                  <span className="text-foreground">{row.value}</span>
                )}
              </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="editorial-divider px-6 py-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-muted-foreground">Ingin melihat hasil pengerjaan proyek?</p>
          <Link
            href="/projects"
            className="btn-primary"
          >
            BUKA KOLEKSI PROYEK
          </Link>
        </div>
      </div>
      <ProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
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