"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { profileData } from "@/data/profile";

export type Profile = typeof profileData;

interface ProfileState {
  profile: Profile;
  updateProfile: (p: Partial<Profile>) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: profileData,
      updateProfile: (p) =>
        set((s) => ({ profile: { ...s.profile, ...p } })),
      resetProfile: () => set({ profile: profileData }),
    }),
    {
      name: "portfolio-profile",
      // Gabung data lama di localStorage dengan seed baru agar field baru
      // (misal photoUrl) selalu ada walau user pernah buka versi lama.
      merge: (persisted, current) => ({
        ...(current as ProfileState),
        ...((persisted ?? {}) as Partial<ProfileState>),
        profile: { ...(current as ProfileState).profile, ...((persisted as Partial<ProfileState> | undefined)?.profile ?? {}) },
      }),
    }
  )
);
