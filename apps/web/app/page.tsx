"use client";

import { HeroSection } from "./components/HeroSection";
import { ProfileCard } from "./components/ProfileCard";

export default function Home() {
  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-5xl mx-auto space-y-16">
        <HeroSection />
        <ProfileCard />
      </div>
    </div>
  );
}
