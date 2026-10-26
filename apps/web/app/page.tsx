"use client";

import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ContactSection } from "./components/ContactSection";
import { ProfileCard } from "./components/ProfileCard";
import { usePortfolioData } from "@/hooks/use-portfolio-data";

function PortfolioSkeleton() {
  return (
    <div className="container py-12 md:py-24" aria-busy="true" aria-label="Memuat portofolio">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-20 animate-pulse">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <div className="h-3 w-32 rounded bg-gray-800" />
            <div className="h-12 w-4/5 rounded bg-gray-800" />
            <div className="h-5 w-2/3 rounded bg-gray-800" />
            <div className="h-20 rounded bg-gray-800" />
          </div>
          <div className="mx-auto aspect-square w-full max-w-sm rounded-xl bg-gray-800" />
        </div>
        <div className="h-64 rounded-xl bg-gray-800" />
        <div className="h-64 rounded-xl bg-gray-800" />
      </div>
    </div>
  );
}

export default function Home() {
  const { loading } = usePortfolioData();

  if (loading) return <PortfolioSkeleton />;

  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-20">
        <HeroSection />
        <AboutSection />
        <ProfileCard />
        <ProjectsSection />
        <ContactSection />
      </div>
    </div>
  );
}