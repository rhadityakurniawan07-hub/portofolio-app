"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { recentProjects, type Project } from "@/data/profile";
import { newProjectId } from "@/lib/portfolio";

interface ProjectsState {
  projects: Project[];
  addProject: (p: Omit<Project, "id">) => void;
  updateProject: (id: Project["id"], p: Partial<Project>) => void;
  removeProject: (id: Project["id"]) => void;
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
      resetProjects: () => set({ projects: recentProjects as Project[] }),
    }),
    { name: "portfolio-projects" }
  )
);
