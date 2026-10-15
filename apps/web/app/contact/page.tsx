"use client";

import { ContactForm } from "@/components/ContactForm";
import { Mail, MapPin, MessageSquare, Send, Github } from "lucide-react";
import { useProfileStore } from "@/stores/use-profile";
import Link from "next/link";

export default function ContactPage() {
  const profile = useProfileStore((s) => s.profile);

  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <p className="mb-2 text-xs font-mono uppercase tracking-wider text-primary">
            HUBUNGI SAYA
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Hubungi Saya
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Tertarik kerja sama, punya proyek, atau hanya ingin menyapa? Kirim pesan lewat form di bawah atau hubungi lewat kontak di bawah.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Info Kontak */}
          <aside className="lg:pr-8 space-y-8">
            <div className="border-t border-gray-800 pt-8">
              <h2 className="font-mono text-xs uppercase tracking-wider text-primary mb-4">
                INFORMASI KONTAK
              </h2>
              <dl className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md border border-gray-700 bg-gray-900/50 flex items-center justify-center">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</dt>
                    <dd className="text-foreground"><a href={`mailto:${profile.email}`} className="text-primary hover:underline">{profile.email}</a></dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md border border-gray-700 bg-gray-900/50 flex items-center justify-center">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 20.828 6.343 16.657a2 2 0 010-2.828l4.243-4.243a2 2 0 012.828 0l4.242 4.242a2 2 0 002.828 0l4.242-4.242a2 2 0 000-2.828L15.485 3.143a2 2 0 00-2.828-2.828L10.828 2.5H10.172a2 2 0 00-2.828 0L4.757 7.243a2 2 0 000 2.828l4.242 4.243a2 2 0 002.828 0l4.242 4.242a2 2 0 000 2.828L13.243 21.657a2 2 0 01-2.828 0l-4.242 4.242a2 2 0 01-2.828 0l-4.242-4.243a2 2 0 000-2.828L5.586 5.543a2 2 0 012.828-2.828l4.243-4.243a2 2 0 012.828 0l4.243 4.243a2 2 0 002.828 0l4.243-4.242a2 2 0 012.828 0l4.242 4.243a2 2 0 000 2.828l-2.828 2.828" />
                    </svg>
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
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.301 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 4.425-1.333 7.577-1.234 7.577-1.234.653 1.653.242 3.175.117 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.793.577C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                  <span>GitHub</span>
                </a>
                <a href={profile.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l4-4 4 4m0 0l-4 4m4-4H3" /></svg>
                  <span>Telegram</span>
                </a>
                <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.03 9 8v1.028c-3.707.213-6.456.937-7.992 2.546L12 21l-1.75-3.245" /></svg>
                  <span>WhatsApp</span>
                </a>
                <a href={profile.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l4-4 4 4m0 0l-4 4m4-4H3" /></svg>
                  <span>Telegram</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Form Kontak */}
          <section>
            <h2 className="font-mono text-xs uppercase tracking-wider text-primary mb-6">KIRIM PESAN</h2>
            <div id="contact-form">
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function() {
                      var script = document.createElement('script');
                      script.src = '/components/ContactForm.client.js';
                      document.getElementById('contact-form').appendChild(script);
                    })();
                  `
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}