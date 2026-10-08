"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, Github, Copy, Check, ExternalLink } from "lucide-react";
import { profileData } from "@/data/profile";

interface ContactItem {
  label: string;
  value: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  copyable?: boolean;
  external?: boolean;
}

const contacts: ContactItem[] = [
  {
    label: "Email",
    value: profileData.email,
    href: `mailto:${profileData.email}`,
    icon: Mail,
    copyable: true,
  },
  {
    label: "WhatsApp",
    value: "Chat via WhatsApp",
    href: profileData.whatsapp,
    icon: MessageSquare,
    external: true,
  },
  {
    label: "Telegram",
    value: "Chat via Telegram",
    href: profileData.telegram,
    icon: Send,
    external: true,
  },
  {
    label: "GitHub",
    value: "github.com/rhaditya",
    href: profileData.github,
    icon: Github,
    external: true,
  },
];

export function QuickContacts() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="space-y-6" aria-labelledby="contacts-heading">
      <h2 id="contacts-heading" className="text-2xl font-bold tracking-tight">
        Aksi Cepat & Kontak
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target={contact.external ? "_blank" : undefined}
            rel={contact.external ? "noopener noreferrer" : undefined}
            className="group flex flex-col gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-5 transition-all duration-200 hover:border-gray-700 hover:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-primary">
                <contact.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              {contact.copyable && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCopy(contact.value, contact.label);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-foreground"
                  aria-label={copied === contact.label ? "Disalin" : `Salin ${contact.label}`}
                >
                  {copied === contact.label ? (
                    <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">{contact.label}</span>
              <span className="text-sm text-foreground truncate">{contact.value}</span>
            </div>
            {contact.external && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                Buka
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}