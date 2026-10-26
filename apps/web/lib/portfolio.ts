// apps/web/lib/portfolio.ts
export function parseTechStack(input: string): string[] {
  const seen = new Set<string>();
  for (const part of input.split(",")) {
    const t = part.trim();
    if (t && !seen.has(t)) seen.add(t);
  }
  return [...seen];
}

export function parseDaftar(input: string): string[] {
  return parseTechStack(input);
}

export function validateOptionalUrl(label: string, value: string): string[] {
  if (!value.trim()) return [];
  try {
    new URL(normalizeUrl(value));
    return [];
  } catch {
    return [`${label} tidak valid`];
  }
}

export function validateWhatsAppUrl(value: string): string[] {
  if (!value.trim()) return [];
  const normalized = normalizeWhatsAppUrl(value);
  if (!/^https:\/\/wa\.me\/\d{8,15}$/.test(normalized)) {
    return ["WhatsApp tidak valid"];
  }
  return [];
}

export function validateProfileUrls(v: {
  github: string;
  telegram: string;
  whatsapp: string;
}): string[] {
  return [
    ...validateOptionalUrl("GitHub", v.github),
    ...validateOptionalUrl("Telegram", v.telegram),
    ...validateWhatsAppUrl(v.whatsapp),
  ];
}

export function normalizeUrl(input: string): string {
  const v = input.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

export function normalizeWhatsAppUrl(input: string): string {
  const v = input.trim();
  if (!v) return "";
  const digits = v.replace(/\D/g, "");
  if (!digits) return "";
  const phone = digits.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits.startsWith("8")
      ? `62${digits}`
      : digits;
  return `https://wa.me/${phone}`;
}

function isValidUrl(v: string): boolean {
  if (!v.trim()) return true;
  try {
    new URL(normalizeUrl(v));
    return true;
  } catch {
    return false;
  }
}

export function validateProfileInput(v: {
  fullName: string;
  role: string;
  bio: string;
  location: string;
  email: string;
  availability: string;
}): string[] {
  const errs: string[] = [];
  if (!v.fullName.trim()) errs.push("Nama Lengkap wajib diisi");
  if (!v.role.trim()) errs.push("Peran Utama wajib diisi");
  if (!v.bio.trim()) errs.push("Bio wajib diisi");
  if (!v.location.trim()) errs.push("Domisili wajib diisi");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    errs.push("Email tidak valid");
  if (!v.availability.trim()) errs.push("Status Ketersediaan wajib diisi");
  return errs;
}

export function validateProjectInput(v: {
  title: string;
  description: string;
  techStack: string[];
  year: string;
  link?: string;
}): string[] {
  const errs: string[] = [];
  if (!v.title.trim()) errs.push("Nama Proyek wajib diisi");
  if (!v.description.trim()) errs.push("Deskripsi wajib diisi");
  if (v.techStack.length === 0) errs.push("Teknologi minimal 1");
  if (!v.year.trim()) errs.push("Tahun wajib diisi");
  if (v.link && !isValidUrl(v.link)) errs.push("Tautan Web tidak valid");
  return errs;
}

export function newProjectId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `local-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
  }
}
