"use client";
import { useEffect, useState } from "react";
import { Modal } from "@repo/ui/modal";
import { useProjectsStore } from "@/stores/use-projects";
import { parseTechStack, normalizeUrl, validateProjectInput } from "@/lib/portfolio";

export function ProjectModal({ open, onClose, editingId }: { open: boolean; onClose: () => void; editingId?: number | string | null }) {
  const projects = useProjectsStore((s) => s.projects);
  const addProject = useProjectsStore((s) => s.addProject);
  const updateProject = useProjectsStore((s) => s.updateProject);
  const editing = editingId != null ? projects.find((p) => p.id === editingId) : undefined;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [link, setLink] = useState("");
  const [year, setYear] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setTitle(editing?.title ?? "");
      setDescription(editing?.description ?? "");
      setTech(editing?.techStack.join(", ") ?? "");
      setLink(editing?.projectUrl ?? "");
      setYear(editing?.year ?? "");
      setErrors([]);
    }
  }, [open, editing?.title, editing?.description, editing?.techStack, editing?.projectUrl, editing?.year]);

  const save = () => {
    const techStack = parseTechStack(tech);
    const errs = validateProjectInput({ title, description, techStack, year, link });
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    if (editing) {
      updateProject(editing.id, { title, description, techStack, year, projectUrl: normalizeUrl(link) });
    } else {
      addProject({
        title,
        description,
        techStack,
        year,
        category: "Online",
        status: "Production",
        projectUrl: normalizeUrl(link),
        githubUrl: "",
        featured: false,
      } as unknown as Parameters<typeof addProject>[0]);
    }
    onClose();
  };

  const field = "w-full rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2.5 text-sm focus:border-primary focus:outline-none";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Ubah Proyek" : "Simpan Proyek Baru"}
      footer={
        <>
          <button onClick={onClose} className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-800">
            Batal
          </button>
          <button onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            {editing ? "Simpan Perubahan" : "Simpan ke Koleksi Proyek"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="pj-title">Nama Proyek *</label>
          <input id="pj-title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="pj-desc">Deskripsi Singkat Proyek *</label>
          <textarea id="pj-desc" rows={3} className={field} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="pj-tech">Teknologi / Bahasa (pisahkan koma) *</label>
          <input id="pj-tech" className={field} value={tech} onChange={(e) => setTech(e.target.value)} placeholder="Next.js, Node.js" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium" htmlFor="pj-link">Tautan Web / Link Proyek</label>
            <input id="pj-link" className={field} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="pj-year">Tanggal / Tahun Pembuatan *</label>
            <input id="pj-year" className={field} value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
          </div>
        </div>
        {errors.length > 0 && (
          <ul className="space-y-1 text-sm text-red-400">
            {errors.map((e) => (
              <li key={e}>• {e}</li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
