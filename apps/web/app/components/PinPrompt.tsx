"use client";
import { useState } from "react";
import { Modal } from "@repo/ui/modal";
import { useOwnerStore } from "@/stores/use-owner";

export function PinPrompt({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const login = useOwnerStore((s) => s.login);

  const submit = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);
    const err = await login(pin);
    setLoading(false);

    if (err) {
      setError(err);
      return;
    }

    setPin("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Masuk Mode Pemilik"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-800"
          >
            Batal
          </button>
          <button
            onClick={() => void submit()}
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </>
      }
    >
      <label className="block text-sm font-medium" htmlFor="owner-pin">
        PIN Pemilik
      </label>
      <input
        id="owner-pin"
        type="password"
        inputMode="numeric"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void submit();
        }}
        className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
        placeholder="••••"
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </Modal>
  );
}
