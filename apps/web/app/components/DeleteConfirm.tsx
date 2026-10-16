"use client";
import { Modal } from "@repo/ui/modal";

export function DeleteConfirm({ open, title, onCancel, onConfirm }: { open: boolean; title: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="HAPUS PROYEK"
      footer={
        <>
          <button onClick={onCancel} className="btn-ghost">
            BATAL
          </button>
          <button onClick={onConfirm} className="btn-danger">
            HAPUS
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
