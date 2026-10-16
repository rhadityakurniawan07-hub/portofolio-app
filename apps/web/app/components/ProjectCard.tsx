"use client";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Project } from "@/data/profile";

export function ProjectCard({ project, onEdit, onDelete, canManage }: { project: Project; onEdit: () => void; onDelete: () => void; canManage: boolean }) {
  return (
    <article className="editorial-card">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium tracking-wider text-primary">
            TAHUN {project.year} • {project.category}
          </span>
          <div className="flex items-center gap-2">
            {canManage && (
              <>
                <button onClick={onEdit} className="rounded-md p-1.5 text-gray-400 hover:bg-white/5 hover:text-foreground focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black" aria-label={`Edit ${project.title}`}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 4 8 8 4-4 1.414-1.414c.78-.78 1.84-1.05 2.828-1.05.78 0 1.57.22 2.12.586l.707.707c.39.39.78.585 1.293.585.5 0 1-.19 1.414-.586l2.344-2.343a2 2 0 000-2.828l-4.242-4.243a2 2 0 00-2.828 0L6 14l-2 4 4-2 2-2 2-2 2-2 2-2 2-2z" /></svg>
                </button>
                <button onClick={onDelete} className="rounded-md p-1.5 text-gray-400 hover:bg-white/5 hover:text-red-400 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black" aria-label={`Hapus ${project.title}`}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v12a1 1 0 001 1h8a1 1 0 001-1V7" /></svg>
                </button>
              </>
            )}
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black" aria-label={`Buka ${project.title}`}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
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
              className="block truncate text-xs text-red-600 hover:underline"
            >
              {project.projectUrl.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
        <p className="line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((t) => (
            <span key={t} className="badge-pill">
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
          className="inline-flex items-center gap-2 rounded-md bg-red-600 text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          BUKA WEB PROYEK
        </a>
      </div>
    </article>
  );
}