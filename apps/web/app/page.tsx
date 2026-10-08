import { StatCard } from "@repo/ui/stat-card";
import { HeroSection } from "./components/HeroSection";
import { BiodataTable } from "./components/BiodataTable";
import { QuickContacts } from "./components/QuickContacts";
import { RecentProjects } from "./components/RecentProjects";
import { statsData } from "@/data/profile";
import type { StatData } from "@/data/profile";

export default function Home() {
  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-5xl mx-auto space-y-16">
        <HeroSection />

        <section aria-labelledby="stats-heading" className="space-y-6">
          <h2 id="stats-heading" className="sr-only">
            Statistik Utama
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {statsData.map((stat: StatData, index: number) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                variant={stat.variant}
              />
            ))}
          </div>
        </section>

        <BiodataTable />
        <QuickContacts />
        <RecentProjects />
      </div>
    </div>
  );
}