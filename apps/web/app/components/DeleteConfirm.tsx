"use client";
import { Modal } from "@repo/ui/modal";

export function DeleteConfirm({ open, title, onCancel, onConfirm }: { open: boolean; title: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Hapus Proyek"
      footer={
        <>
          <button onClick={onCancel} className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-800">
            Batal
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
            Hapus
          </button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Yakin hapus <span className="font-semibold text-foreground">{title}</span>? Tindakan ini tidak bisa dibatalkan.
      </p>
    </Modal>
  );
}
