"use client";

import { useCallback, useEffect, useState } from "react";
import { useProfileStore } from "@/stores/use-profile";
import { useProjectsStore } from "@/stores/use-projects";
import {
  mapProfileRecord,
  mapProjectRecord,
  type ProfileRecord,
  type ProjectRecord,
} from "@/lib/mappers";

type ProfileResponse = { profile: ProfileRecord | null };
type ProjectsResponse = { projects: ProjectRecord[] };

export function usePortfolioData() {
  const replaceProfile = useProfileStore((s) => s.replaceProfile);
  const replaceProjects = useProjectsStore((s) => s.replaceProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const [profileRes, projectsRes] = await Promise.all([
        fetch("/api/profile", { cache: "no-store", signal }),
        fetch("/api/projects", { cache: "no-store", signal }),
      ]);

      if (!profileRes.ok || !projectsRes.ok) {
        throw new Error("Gagal memuat data portofolio");
      }

      const [profileData, projectsData] = (await Promise.all([
        profileRes.json(),
        projectsRes.json(),
      ])) as [ProfileResponse, ProjectsResponse];

      if (signal?.aborted) return;

      if (profileData.profile) {
        replaceProfile(mapProfileRecord(profileData.profile));
      }
      if (Array.isArray(projectsData.projects)) {
        replaceProjects(projectsData.projects.map(mapProjectRecord));
      }
    } catch (err) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err.message : "Gagal memuat data portofolio");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [replaceProfile, replaceProjects]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { loading, error, reload: load };
}
