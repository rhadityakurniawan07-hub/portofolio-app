"use client";

import Link from "next/link";
import { Globe, Github, ExternalLink, CheckCircle } from "lucide-react";
import { recentProjects } from "@/data/profile";
import type { Project } from "@/data/profile";

const statusStyles: Record<string, string> = {
  Production: "bg-green-500/20 text-green-400 ring-green-500/30",
  Published: "bg-blue-500/20 text-blue-400 ring-blue-500/30",
  Development: "bg-amber-500/20 text-amber-400 ring-amber-500/30",
};

const categoryStyles: Record<string, string> = {
  Online: "bg-primary/20 text-primary ring-primary/30",
  "CLI Package": "bg-purple-500/20 text-purple-400 ring-purple-500/30",
};

export function RecentProjects() {
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
        {recentProjects.map((project: Project) => (
          <article
            key={project.id}
            className="flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition-all duration-200 hover:border-gray-700"
          >
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${categoryStyles[project.category as keyof typeof categoryStyles]}`}>
                  {project.year}
                  <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                  {project.category}
                </span>
                <Link
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label={`Buka ${project.title}`}
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech: string) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800/50 px-2 py-0.5 text-xs font-medium text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusStyles[project.status as keyof typeof statusStyles]}`}>
                  <CheckCircle className="h-3 w-3" aria-hidden="true" />
                  {project.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-800 px-6 py-4">
              <Link
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
                Buka Web Proyek
              </Link>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label={`Lihat kode sumber ${project.title}`}
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}