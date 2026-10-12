"use client";

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"];

/** Beberapa browser HP mengosongkan file.type — kenali lewat ekstensi sebagai cadangan. */
function looksLikeImage(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  if (file.type === "") {
    const name = file.name.toLowerCase();
    return IMAGE_EXTS.some((ext) => name.endsWith(ext));
  }
  return false;
}

function isHeic(file: File): boolean {
  const name = file.name.toLowerCase();
  return file.type.includes("heic") || file.type.includes("heif") || name.endsWith(".heic") || name.endsWith(".heif");
}
/**
 * Perkecil gambar dari perangkat menjadi dataURL JPEG agar hemat localStorage.
 * Hanya jalan di browser (memakai Image + canvas).
 */
export function downscaleImage(file: File, maxDim = 512, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!looksLikeImage(file)) {
      reject(new Error("File harus berupa gambar (JPG/PNG/WebP)"));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Browser tidak mendukung pengolahan gambar"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          isHeic(file)
            ? "Format HEIC iPhone tidak didukung browser — ubah ke JPG/PNG dulu"
            : "File gambar tidak valid"
        )
      );
    };
    img.src = url;
  });
}
