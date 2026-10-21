"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { checkOwnerPin } from "@/lib/portfolio";

interface OwnerState {
  ownerMode: boolean;
  failedAttempts: number;
  login: (pin: string) => string | null;
  logout: () => void;
}

export const useOwnerStore = create<OwnerState>()(
  persist(
    (set, get) => ({
      ownerMode: false,
      failedAttempts: 0,
      login: (pin) => {
        if (get().failedAttempts >= 5) return "Terlalu banyak percobaan. Coba lagi nanti.";
        if (checkOwnerPin(pin)) {
          set({ ownerMode: true, failedAttempts: 0 });
          return null;
        }
        set({ failedAttempts: get().failedAttempts + 1 });
        return "PIN salah";
      },
      logout: () => set({ ownerMode: false, failedAttempts: 0 }),
    }),
    { name: "portfolio-owner", partialize: (s) => ({ ownerMode: s.ownerMode }) as OwnerState }
  )
);
