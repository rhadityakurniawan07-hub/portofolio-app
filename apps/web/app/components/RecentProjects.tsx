"use client";

import Link from "next/link";
import { useProjectsStore } from "@/stores/use-projects";
import { ProjectCard } from "./ProjectCard";

export function RecentProjects() {
  const recentProjects = useProjectsStore((s) => s.projects).slice(0, 2);
  return (
    <section className="space-y-6" aria-labelledby="projects-heading">
      <div className="flex items-center justify-between">
        <h2 id="projects-heading" className="text-2xl font-bold tracking-tight">
          Showcase Proyek Terkini
        </h2>
        <Link
          href="/projects"
          className="text-sm font-medium text-primary hover:underline"
        >
          Lihat Semua →
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {recentProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            canManage={false}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>
    </section>
  );
}
