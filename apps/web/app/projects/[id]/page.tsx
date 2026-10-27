"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ExternalLink, Github, ArrowLeft, Cpu, Code, Briefcase } from "lucide-react";
import { useProjectsStore } from "@/stores/use-projects";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { useOwnerStore } from "@/stores/use-owner";
import { ProjectModal } from "../../components/ProjectModal";
import { DeleteConfirm } from "../../components/DeleteConfirm";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id;
  const projects = useProjectsStore((s) => s.projects);
  usePortfolioData();
  usePortfolioData();
  const removeProject = useProjectsStore((s) => s.removeProject);
  const ownerMode = useOwnerStore((s) => s.ownerMode);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string | null>(null);

  const project = useMemo(
    () => projects.find((p) => String(p.id) === String(id)),
    [projects, id]
  );

  if (!project) {
    return (
      <div className="container py-12 md:py-24">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            href="/#projects-heading"
            className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-transparent px-5 py-3 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Koleksi Proyek
          </Link>
          <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Proyek tidak ditemukan</h1>
            <p className="text-muted-foreground mt-2">Proyek dengan ID tersebut tidak ditemukan.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header with back link */}
        <Link
          href="/#projects-heading"
          className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A]"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Koleksi Proyek
        </Link>

        {/* Project Detail */}
        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-900/50 px-3 py-1 text-xs font-mono font-medium uppercase tracking-wider text-primary">
                  TAHUN {project.year} • {project.category}
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {project.title}
            </h1>

            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline transition-colors"
              >
                <span className="text-xs text-primary hover:underline">
                  {project.projectUrl.replace(/^https?:\/\//, "")}
                </span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0l3 3m-3-3v6" stroke="currentColor" />
                </svg>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.301 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 4.425-1.333 7.577-1.234 7.577-1.234.653 1.653.242 3.175.117 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.793.577C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </a>
            )}

            <div className="flex flex-wrap gap-3 mt-4">
              <span className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-900/50 px-3 py-1.5 text-xs font-mono font-medium text-gray-300">
                <Cpu className="h-3 w-3" aria-hidden="true" />
                {project.category}
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-900/50 px-3 py-1.5 text-xs font-mono font-medium text-gray-300">
                <Briefcase className="h-3 w-3" aria-hidden="true" />
                {project.status}
              </span>
            </div>
          </header>

          {/* Description */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Deskripsi</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground">
              <p className="whitespace-pre-wrap">{project.description}</p>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Teknologi</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-md border border-gray-700 bg-gray-900/50 px-2.5 py-0.5 text-xs font-mono font-medium text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0l3 3m-3-3v6" stroke="currentColor" />
              </svg>
              Buka Web Proyek
            </a>
          )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-transparent px-6 py-3 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.301 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 4.425-1.333 7.577-1.234 7.577-1.234.653 1.653.242 3.175.117 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.793.577C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Lihat Kode Sumber
              </a>
            )}
            <Link
              href="/#projects-heading"
              className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-transparent px-5 py-3 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Koleksi
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}