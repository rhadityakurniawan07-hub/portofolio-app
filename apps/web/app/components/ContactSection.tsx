"use client";

import { Mail, MapPin, MessageSquare, Github } from "lucide-react";
import { useProfileStore } from "@/stores/use-profile";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  const profile = useProfileStore((s) => s.profile);

  return (
    <section className="border-t border-gray-800 pt-12 md:pt-16" id="kontak" aria-labelledby="contact-heading">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <p className="mb-2 text-xs font-mono uppercase tracking-wider text-primary">HUBUNGI SAYA</p>
          <h2 id="contact-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">Hubungi Saya</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Tertarik kerja sama, punya proyek, atau hanya ingin menyapa? Kirim pesan lewat form di bawah atau hubungi lewat kontak di bawah.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <aside className="lg:pr-8 space-y-8">
            <div className="border-t border-gray-800 pt-8">
              <h3 className="font-mono text-xs uppercase tracking-wider text-primary mb-4">INFORMASI KONTAK</h3>
              <dl className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md border border-gray-700 bg-gray-900/50 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</dt>
                    <dd className="text-foreground"><a href={`mailto:${profile.email}`} className="text-primary hover:underline">{profile.email}</a></dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md border border-gray-700 bg-gray-900/50 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">Lokasi</dt>
                    <dd className="text-foreground">{profile.location}</dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <h3 className="font-mono text-xs uppercase tracking-wider text-primary mb-4">KANAL & REPOSITORI</h3>
              <div className="flex flex-wrap gap-4">
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                    <Github className="h-5 w-5" aria-hidden="true" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile.telegram && (
                  <a href={profile.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors" aria-label="Telegram">
                    <MessageSquare className="h-5 w-5" aria-hidden="true" />
                    <span>Telegram</span>
                  </a>
                )}
                {profile.whatsapp && (
                  <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors" aria-label="WhatsApp">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </aside>

          <section>
            <h3 className="font-mono text-xs uppercase tracking-wider text-primary mb-6">KIRIM PESAN</h3>
            <ContactForm />
          </section>
        </div>
      </div>
    </section>
  );
}