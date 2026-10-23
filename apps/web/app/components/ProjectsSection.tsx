"use client";

import { useMemo, useState } from "react";
import { useProjectsStore } from "@/stores/use-projects";
import { useOwnerStore } from "@/stores/use-owner";
import { useToast } from "@/components/Toast";
import type { Project } from "@/data/profile";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectModal } from "../components/ProjectModal";
import { DeleteConfirm } from "../components/DeleteConfirm";

const CATEGORIES = ["Online", "CLI Package"] as const;

export function ProjectsSection() {
  const projects = useProjectsStore((s) => s.projects);
  const removeProject = useProjectsStore((s) => s.removeProject);
  const ownerMode = useOwnerStore((s) => s.ownerMode);
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [deleteId, setDeleteId] = useState<number | string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "category">("newest");
  const [showFilters, setShowFilters] = useState(false);

  const allTechStacks = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.techStack))).sort(),
    [projects]
  );
  const allCategories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))).sort(),
    [projects]
  );

  const q = query.trim().toLowerCase();
  const visible = useMemo(() => {
    let result = projects;
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedTech.length > 0) {
      result = result.filter((p) =>
        selectedTech.every((t) => p.techStack.includes(t))
      );
    }
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return String(b.id).localeCompare(String(a.id));
        case "oldest":
          return String(a.id).localeCompare(String(b.id));
        case "az":
          return a.title.localeCompare(b.title);
        case "category":
          return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    return result;
  }, [projects, q, selectedCategories, selectedTech, sortBy]);

  const deleteTarget = deleteId != null ? projects.find((p) => p.id === deleteId) : undefined;
  const hasActiveFilters =
    selectedCategories.length > 0 || selectedTech.length > 0 || sortBy !== "newest";

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTech([]);
    setSortBy("newest");
  };

  const handleDelete = () => {
    if (deleteId != null) {
      removeProject(deleteId);
      showToast("Proyek dihapus", "success");
      // Persist ke database (Prisma) — lapisan tambahan
      fetch('/api/projects?id=' + encodeURIComponent(deleteId), { method: 'DELETE' })
        .catch(() => { /* toast tidak perlu, hapus sudah terjadi di localStorage */ });
      setDeleteId(null);
    }
  };

  return (
    <section aria-labelledby="projects-heading">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="mb-2 text-xs font-medium text-primary">• ARSIP REPOSITORI PRIBADI</p>
          <h2 id="projects-heading" className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Daftar Proyek Saya</h2>
          <p className="text-muted-foreground">Koleksi dan arsip hasil pembuatan aplikasi &amp; website pribadi.</p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="search" placeholder="Cari proyek berdasarkan judul atau teknologi (cth: Next.js, CLI)..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-900/50 pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" aria-label="Cari proyek" />
          </div>
          {ownerMode && (<button onClick={() => { setEditingId(null); setModalOpen(true); }} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">+ Simpan Proyek Baru</button>)}
        </div>

        <div className="mb-6">
          <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-900/50 px-4 py-2 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A]" aria-expanded={showFilters}>
            Filter &amp; Urutkan
            {hasActiveFilters && (<span className="inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">{selectedCategories.length + selectedTech.length + (sortBy !== "newest" ? 1 : 0)}</span>)}
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 space-y-4 sm:grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Kategori</label>
              <div className="flex flex-wrap gap-2">
                {(["Online", "CLI Package"] as const).map((cat) => (
                  <label key={cat} className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${selectedCategories.includes(cat) ? "border-primary bg-primary/10 text-primary" : "border-gray-700 text-muted-foreground hover:border-primary"}`}>
                    <input type="checkbox" value={cat} checked={selectedCategories.includes(cat)} onChange={(e) => setSelectedCategories((p) => e.target.checked ? [...p, cat] : p.filter((c) => c !== cat))} className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black" />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Teknologi</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                {allTechStacks.map((tech) => (
                  <label key={tech} className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-colors ${selectedTech.includes(tech) ? "border border-primary bg-primary/10 text-primary" : "border border-gray-700 text-gray-300 hover:border-primary"}`}>
                    <input type="checkbox" value={tech} checked={selectedTech.includes(tech)} onChange={(e) => setSelectedTech((p) => e.target.checked ? [...p, tech] : p.filter((t) => t !== tech))} className="w-3.5 h-3.5 rounded border-gray-600 text-primary focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black" />
                    {tech}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Urutkan</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="az">A-Z</option>
                <option value="category">Kategori</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-6">
            {visible.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">{q || selectedCategories.length || selectedTech.length || sortBy !== "newest" ? "Belum ada proyek yang cocok." : "Belum ada proyek."}</div>}
            <div className="space-y-3">
              {visible.map((project) => (
                <ProjectCard key={project.id} project={project} onEdit={() => { setEditingId(project.id); setModalOpen(true); }} onDelete={() => { setDeleteId(project.id); }} canManage={ownerMode} />
              ))}
            </div>
          </div>
        </div>

        <ProjectModal open={modalOpen} editingId={editingId} onClose={() => { setModalOpen(false); setEditingId(null); }} />
        <DeleteConfirm open={deleteId != null} title={deleteTarget?.title ?? ""} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} />
      </div>
    </section>
  );
}