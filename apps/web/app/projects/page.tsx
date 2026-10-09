"use client";

import { useMemo, useState } from "react";
import { useProjectsStore } from "@/stores/use-projects";
import { useOwnerStore } from "@/stores/use-owner";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectModal } from "../components/ProjectModal";
import { DeleteConfirm } from "../components/DeleteConfirm";

export default function ProjectsPage() {
  const projects = useProjectsStore((s) => s.projects);
  const removeProject = useProjectsStore((s) => s.removeProject);
  const ownerMode = useOwnerStore((s) => s.ownerMode);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [deleteId, setDeleteId] = useState<number | string | null>(null);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      q === ""
        ? projects
        : projects.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.techStack.some((t) => t.toLowerCase().includes(q))
          ),
    [projects, q]
  );

  const deleteTarget = deleteId != null ? projects.find((p) => p.id === deleteId) : undefined;

  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="mb-2 text-xs font-medium text-primary">• ARSIP REPOSITORI PRIBADI</p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Daftar Proyek Saya
          </h1>
          <p className="text-muted-foreground">
            Koleksi dan arsip hasil pembuatan aplikasi & website pribadi.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Cari proyek berdasarkan judul atau teknologi (cth: Next.js, CLI)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900/50 pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Cari proyek"
            />
          </div>
          {ownerMode && (
            <button
              onClick={() => {
                setEditingId(null);
                setModalOpen(true);
              }}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              + Simpan Proyek Baru
            </button>
          )}
        </div>

        <p className="text-sm text-muted-foreground" role="status">
          {q === ""
            ? `Menampilkan ${projects.length} proyek`
            : `Menampilkan ${visible.length} dari ${projects.length} proyek untuk "${query.trim()}"`}
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {visible.length === 0 && q !== "" && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center sm:col-span-2">
              <p className="text-muted-foreground">Tidak ada proyek yang cocok untuk &quot;{query.trim()}&quot;.</p>
              <button
                onClick={() => setQuery("")}
                className="mt-3 rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-800"
              >
                Hapus pencarian
              </button>
            </div>
          )}
          {projects.length === 0 && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center text-muted-foreground sm:col-span-2">
              Belum ada proyek. Klik &quot;Simpan Proyek Baru&quot; untuk menambahkan.
            </div>
          )}
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              canManage={ownerMode}
              onEdit={() => {
                setEditingId(project.id);
                setModalOpen(true);
              }}
              onDelete={() => setDeleteId(project.id)}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        open={modalOpen}
        editingId={editingId}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
        }}
      />
      <DeleteConfirm
        open={deleteId != null}
        title={deleteTarget?.title ?? ""}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId != null) removeProject(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  )
}
