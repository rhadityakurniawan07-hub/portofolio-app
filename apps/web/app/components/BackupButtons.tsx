"use client";
import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { useProfileStore } from "@/stores/use-profile";
import { useProjectsStore } from "@/stores/use-projects";
import { buildBackup, parseBackup, downloadBackup } from "@/lib/backup";
import { DeleteConfirm } from "./DeleteConfirm";
import type { BackupFile } from "@/lib/backup";

export function BackupButtons() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const projects = useProjectsStore((s) => s.projects);
  const replaceProjects = useProjectsStore((s) => s.replaceProjects);
  const [pending, setPending] = useState<BackupFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    downloadBackup(buildBackup(profile, projects));
    setDone("Backup diunduh");
    setTimeout(() => setDone(null), 2000);
  };

  const handleFile = async (f: File | undefined) => {
    if (!f) return;
    setError(null);
    try {
      const parsed = parseBackup(JSON.parse(await f.text()));
      if (!parsed.ok) {
        setError(parsed.error);
        return;
      }
      setPending(parsed.data);
    } catch {
      setError("File tidak bisa dibaca sebagai JSON");
    }
  };

  const confirmImport = () => {
    if (!pending) return;
    updateProfile({ ...pending.profile });
    replaceProjects(pending.projects.map((p) => ({ ...p })));
    setPending(null);
    setDone("Backup dipulihkan");
    setTimeout(() => setDone(null), 2000);
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-800"
          aria-label="Export backup JSON"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Backup</span>
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-800"
          aria-label="Import backup JSON"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Restore</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-label="Pilih file backup"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {(error || done) && (
        <span role="status" className={`text-xs font-medium ${error ? "text-red-400" : "text-green-400"}`}>
          {error ?? done}
        </span>
      )}
      <DeleteConfirm
        open={pending != null}
        title="backup ini (data sekarang akan ditimpa)"
        onCancel={() => setPending(null)}
        onConfirm={confirmImport}
      />
    </>
  );
}
