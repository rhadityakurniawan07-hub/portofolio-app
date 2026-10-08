"use client";

import { useState } from "react";
import { Mail, MapPin, Github, Linkedin, Twitter, ExternalLink } from "lucide-react";
import { profileData } from "@/data/profile";

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(profileData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-8" aria-labelledby="hero-heading">
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
        <div className="relative flex-shrink-0">
          <div className="relative h-32 w-32 md:h-40 md:w-40">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 blur-xl" />
            <div className="relative h-full w-full rounded-full border-4 border-gray-700 bg-gray-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-primary/30">
                RK
              </div>
            </div>
            <span className={`absolute bottom-2 right-2 h-4 w-4 rounded-full border-4 border-background ${
              profileData.availabilityStatus === "available" ? "bg-green-500" : "bg-gray-500"
            }`} aria-label={profileData.availability} />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400 ring-1 ring-green-500/30">
              <span className="relative h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true">
                <span className="absolute inset-0 h-1.5 w-1.5 rounded-full bg-green-500 opacity-75 animate-ping" />
              </span>
              {profileData.availability}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {profileData.location}
            </span>
          </div>

          <h1 id="hero-heading" className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {profileData.name}
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">{profileData.tagline}</p>
          <p className="max-w-2xl text-base text-muted-foreground">{profileData.bio}</p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <button
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              aria-label="Ubah profil"
            >
              Ubah Profil
            </button>
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-3 text-sm font-semibold transition-colors hover:bg-gray-800"
              aria-label={copied ? "Email disalin" : "Salin email"}
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {copied ? "Disalin!" : "Hubungi"}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start pt-2">
            <a
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={profileData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}