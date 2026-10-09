"use client";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Project } from "@/data/profile";

export function ProjectCard({ project, onEdit, onDelete, canManage }: { project: Project; onEdit: () => void; onDelete: () => void; canManage: boolean }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium tracking-wide text-primary">
            TAHUN {project.year} • {project.category}
          </span>
          <div className="flex items-center gap-2">
            {canManage && (
              <>
                <button onClick={onEdit} className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-foreground" aria-label={`Edit ${project.title}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={onDelete} className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-red-400" aria-label={`Hapus ${project.title}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label={`Buka ${project.title}`}>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold">{project.title}</h3>
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-xs text-primary hover:underline"
            >
              {project.projectUrl.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
        <p className="line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((t) => (
            <span key={t} className="rounded-full border border-gray-700 bg-gray-800/50 px-2 py-0.5 text-xs text-gray-300">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto border-t border-gray-800 px-6 py-4">
        <a
          href={project.projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Buka Web Proyek
        </a>
      </div>
    </article>
  );
}
