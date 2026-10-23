"use client";

import { useEffect, useState } from "react";
import { useProfileStore } from "@/stores/use-profile";
import { TechBadge } from "./TechBadge";

export function AboutSection() {
  const profile = useProfileStore((s) => s.profile);
  const [imgError, setImgError] = useState(false);
  const showPhoto = Boolean(profile.aboutPhotoUrl) && !imgError;

  useEffect(() => {
    setImgError(false);
  }, [profile.aboutPhotoUrl]);

  return (
    <section className="editorial-section" aria-labelledby="about-heading">
      <div className="editorial-grid-2">
        {/* Kolom Kiri - Foto Profil dengan Filter Merah */}
        <div className="editorial-hero-right">
          <div className="editorial-hero-photo">
            <div className="editorial-hero-photo-inner">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-600/20 to-red-600/5 blur-2xl" />
              <div className="relative aspect-square rounded-xl border-2 border-red-600/50 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent" />
                {showPhoto ? (
                  <img
                    src={profile.aboutPhotoUrl}
                    alt={`Foto ${profile.name}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-red-600/20 uppercase font-mono">
                    {(profile.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("") || "FA").toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Konten Teks */}
        <div className="lg:pl-8">
          {/* Subtitle Merah */}
          <p className="font-mono text-xs uppercase tracking-wider text-red-600 mb-2">
            ► TENTANG SAYA
          </p>

          {/* Judul */}
          <h2 id="about-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
            Siapa Saya
          </h2>

          {/* Bio Panjang */}
          <p className="text-base text-muted-foreground mb-8 leading-relaxed max-w-xl">
            {profile.longBio || profile.bio}
          </p>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {profile.specializations.map((tech) => (
              <TechBadge key={tech} name={tech} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}