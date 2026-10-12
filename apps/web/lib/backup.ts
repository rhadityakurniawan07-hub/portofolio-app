import type { Project } from "@/data/profile";
import type { Profile } from "@/stores/use-profile";

export interface BackupFile {
  version: 1;
  exportedAt: string;
  profile: Profile;
  projects: Project[];
}

export function buildBackup(profile: Profile, projects: Project[]): BackupFile {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: { ...profile },
    projects: projects.map((p) => ({ ...p, techStack: [...p.techStack] })),
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isValidProject(p: unknown): p is Project {
  if (!isRecord(p)) return false;
  return (
    (typeof p.id === "number" || typeof p.id === "string") &&
    typeof p.title === "string" &&
    typeof p.description === "string" &&
    Array.isArray(p.techStack) &&
    (p.techStack as unknown[]).every((t) => typeof t === "string") &&
    typeof p.year === "string" &&
    typeof p.category === "string" &&
    typeof p.status === "string" &&
    typeof p.projectUrl === "string"
  );
}

export function parseBackup(json: unknown):
  | { ok: true; data: BackupFile }
  | { ok: false; error: string } {
  if (!isRecord(json)) return { ok: false, error: "File bukan backup yang valid" };
  if (json.version !== 1) return { ok: false, error: "Versi backup tidak didukung" };
  if (!isRecord(json.profile) || typeof json.profile.name !== "string" || typeof json.profile.email !== "string") {
    return { ok: false, error: "Data profil di backup rusak" };
  }
  if (!Array.isArray(json.projects) || !(json.projects as unknown[]).every(isValidProject)) {
    return { ok: false, error: "Data proyek di backup rusak" };
  }
  return { ok: true, data: json as unknown as BackupFile };
}

export function downloadBackup(data: BackupFile): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `portofolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
