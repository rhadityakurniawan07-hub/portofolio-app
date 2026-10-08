"use client";

import { Code, Database, Globe, Layers, Terminal } from "lucide-react";
import { useProfileStore } from "@/stores/use-profile";

interface BiodataRow {
  label: string;
  value: string;
  isBadges?: boolean;
  badges?: string[];
}

const techIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Next.js / React": Globe,
  "Node.js / Express": Layers,
  "PostgreSQL / Prisma": Database,
  "Tailwind CSS": Code,
  TypeScript: Code,
  Docker: Terminal,
};

export function BiodataTable() {
  const profile = useProfileStore((s) => s.profile);

  const rows: BiodataRow[] = [
    { label: "Nama Lengkap", value: profile.name },
    { label: "Peran Utama", value: profile.role },
    {
      label: "Spesialisasi",
      value: profile.specializations.join(", "),
      isBadges: true,
      badges: profile.specializations,
    },
    { label: "Domisili", value: profile.location },
    { label: "Ketersediaan", value: profile.availability },
    { label: "Penguasaan Bahasa", value: profile.languages.join(", ") },
  ];

  return (
    <section className="space-y-6" aria-labelledby="biodata-heading">
      <h2 id="biodata-heading" className="text-2xl font-bold tracking-tight">
        Biodata Lengkap
      </h2>
      <dl className="divide-y divide-gray-800">
        {rows.map((field: BiodataRow) => (
          <div
            key={field.label}
            className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:gap-4"
          >
            <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground sm:w-40 sm:font-semibold sm:text-foreground">
              {field.label}
            </dt>
            <dd className="flex flex-wrap items-center gap-2 text-sm sm:flex-1">
              {field.isBadges && field.badges ? (
                <div className="flex flex-wrap gap-1.5">
                  {field.badges?.map((badge: string) => {
                    const IconComponent = techIcons[badge];
                    return (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800/50 px-2.5 py-0.5 text-xs font-medium text-gray-300"
                      >
                        {IconComponent && (
                          <IconComponent className="h-3 w-3 text-primary" aria-hidden="true" />
                        )}
                        {badge}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-foreground">{field.value}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
