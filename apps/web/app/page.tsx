"use client";

import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ContactSection } from "./components/ContactSection";
import { ProfileCard } from "./components/ProfileCard";

export default function Home() {
  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-16">
        <HeroSection />
        <AboutSection />
        <ProfileCard />
        <ProjectsSection />
        <ContactSection />
      </div>
    </div>
  );
}