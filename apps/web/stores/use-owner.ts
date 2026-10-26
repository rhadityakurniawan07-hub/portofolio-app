"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OwnerState {
  ownerMode: boolean;
  checking: boolean;
  login: (pin: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useOwnerStore = create<OwnerState>()(
  persist(
    (set) => ({
      ownerMode: false,
      checking: true,
      login: async (pin) => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pin }),
          });

          if (res.ok) {
            set({ ownerMode: true });
            return null;
          }

          if (res.status === 429) {
            return "Terlalu banyak percobaan. Coba lagi nanti.";
          }

          return "PIN salah";
        } catch {
          return "Gagal terhubung ke server";
        }
      },
      logout: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch {
          // State lokal tetap dikosongkan meski request gagal.
        }
        set({ ownerMode: false });
      },
      refresh: async () => {
        try {
          const res = await fetch("/api/auth/session", { cache: "no-store" });
          const data = (await res.json()) as { authenticated?: boolean };
          set({ ownerMode: Boolean(data.authenticated), checking: false });
        } catch {
          set({ ownerMode: false, checking: false });
        }
      },
    }),
    {
      name: "portfolio-owner",
      partialize: (s) => ({ ownerMode: s.ownerMode }) as OwnerState,
    }
  )
);
