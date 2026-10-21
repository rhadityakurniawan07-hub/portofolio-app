"use client";
import { useEffect, useState } from "react";
import { Modal } from "@repo/ui/modal";
import { useProjectsStore } from "@/stores/use-projects";
import { useToast } from "@/components/Toast";
import { parseTechStack, normalizeUrl, validateProjectInput } from "@/lib/portfolio";

export function ProjectModal({ open, onClose, editingId }: { open: boolean; onClose: () => void; editingId?: number | string | null }) {
  const projects = useProjectsStore((s) => s.projects);
  const addProject = useProjectsStore((s) => s.addProject);
  const updateProject = useProjectsStore((s) => s.updateProject);
  const { showToast } = useToast();
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

const save = async () => {
    const techStack = tech.split(",").map(t => t.trim()).filter(Boolean);
    const errs = validateProjectInput({ title, description, techStack, year, link });
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    const payload = {
      title,
      description,
      techStack,
      year,
      link,
      githubUrl: "",
      category: "Online",
      status: "Production",
      featured: false,
    };
    try {
      if (editing) {
        updateProject(editing.id, { title, description, techStack, year, projectUrl: link });
        showToast("Proyek masih diperbarui", "success");
        // Persist ke database (Prisma) — lapisan tambahan
        try {
          const res = await fetch('/api/projects?id=' + encodeURIComponent(editing.id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            showToast('Gagal simpan ke database: ' + (data.error || 'Status ' + res.status), 'error');
          }
        } catch {
          showToast('Gagal kirim ke database (cek koneksi)', 'error');
        }
      } else {
        addProject({
          title,
          description,
          techStack,
          year,
          category: "Online",
          status: "Production",
          projectUrl: link,
          githubUrl: "",
          featured: false,
        } as unknown as Parameters<typeof addProject>[0]);
        showToast("Proyek masih disimpan", "success");
        // Persist ke database (Prisma) — lapisan tambahan
        try {
          const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            showToast('Gagal simpan ke database: ' + (data.error || 'Status ' + res.status), 'error');
          }
        } catch {
          showToast('Gagal kirim ke database (cek koneksi)', 'error');
        }
      }
      onClose();
    } catch {
      showToast('Gagal menyimpan ke penyimpanan browser', 'error');
    }
  };

  const field = "w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2.5 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "UBAH PROYEK" : "SIMPAN PROYEK BARU"}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            BATAL
          </button>
          <button onClick={save} className="btn-primary">
            {editing ? "SIMPAN PERUBAHAN" : "SIMPAN KE KOLEKSI PROYEK"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
          Lengkapi parameter repositori atau aplikasi yang telah Anda selesaikan untuk disimpan ke arsip karya pribadi.
        </p>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pj-title">NAMA PROYEK *</label>
          <input id="pj-title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pj-desc">DESKRIPSI SINGKAT PROYEK *</label>
          <textarea id="pj-desc" rows={3} className={field} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pj-tech">TEKNOLOGI / BAHASA PEMROGRAMAN *</label>
          <input id="pj-tech" className={field} value={tech} onChange={(e) => setTech(e.target.value)} placeholder="Next.js, Node.js" aria-describedby="pj-tech-help" />
          <p id="pj-tech-help" className="mt-1 text-xs text-muted-foreground">Pisahkan dengan koma (,)</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pj-link">TAUTAN WEB / LINK PROYEK</label>
            <input id="pj-link" className={field} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1 block" htmlFor="pj-year">TANGGAL / TAHUN PEMBUATAN *</label>
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