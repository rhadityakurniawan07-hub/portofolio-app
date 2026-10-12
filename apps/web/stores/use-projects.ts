"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { recentProjects, type Project } from "@/data/profile";
import { newProjectId } from "@/lib/portfolio";

interface ProjectsState {
  projects: Project[];
  addProject: (p: Omit<Project, "id">) => void;
  updateProject: (id: number | string, p: Partial<Project>) => void;
  removeProject: (id: number | string) => void;
  replaceProjects: (projects: Project[]) => void;
  resetProjects: () => void;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: recentProjects as Project[],
      addProject: (p) =>
        set((s) => ({
          projects: [{ ...p, id: newProjectId() as unknown as number } as Project, ...s.projects],
        })),
      updateProject: (id, p) =>
        set((s) => ({
          projects: s.projects.map((x) => (x.id === id ? { ...x, ...p } : x)),
        })),
      removeProject: (id) =>
        set((s) => ({ projects: s.projects.filter((x) => x.id !== id) })),
      replaceProjects: (projects) => set({ projects }),
      resetProjects: () => set({ projects: recentProjects as Project[] }),
    }),
    {
      name: "portfolio-projects",
      version: 2,
      // Buang seed lama (id number); proyek buatan user (id string) dipertahankan.
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<ProjectsState>;
        const stored = Array.isArray(p.projects) ? (p.projects as Project[]) : [];
        return { ...p, projects: stored.filter((x) => typeof x?.id === "string") };
      },
      // Seed baru (Santri/CLI/Landing) menggantikan seed lama (E-Commerce/Task CLI)
      // yang id-nya number. Proyek buatan user (id string) dipertahankan.
      merge: (persisted, current) => {
        const cur = current as ProjectsState;
        const p = (persisted ?? {}) as Partial<ProjectsState>;
        const stored = Array.isArray(p.projects) ? (p.projects as Project[]) : [];
        const seed = cur.projects;
        const seedIds = new Set(seed.map((x) => x.id));
        const userKept = stored.filter(
          (x) => typeof x.id === "string" && !seedIds.has(x.id)
        );
        return { ...cur, ...p, projects: [...seed, ...userKept] };
      },
    }
  )
);
