export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  year: string;
  category: string;
  status: string;
  projectUrl: string;
  githubUrl: string;
  featured: boolean;
}

export interface StatData {
  title: string;
  value: string;
  description: string;
  variant: "primary" | "secondary" | "accent";
  icon: "Briefcase" | "Code" | "Clock";
}

export interface BiodataField {
  label: string;
  value: string;
  isBadges?: boolean;
  badges?: string[];
}

export const profileData = {
  name: "Muhammad Fatih Al-Ghazali",
  role: "Full-Stack Web Developer",
  bio: "Programmer yang berfokus mengembangkan aplikasi web fungsional, bersih, dan bermanfaat.",
  tagline: "Next.js • Node.js • PostgreSQL • Tailwind CSS",
  location: "Sleman, D.I. Yogyakarta",
  availability: "Terbuka untuk freelance & full-time",
  availabilityStatus: "available",
  email: "fatih@dev.id",
  phone: "+62 8xx-xxxx-xxxx",
  github: "https://github.com/fatih",
  linkedin: "https://linkedin.com/in/fatih",
  twitter: "https://twitter.com/fatih",
  whatsapp: "https://wa.me/628xxxxxxxxxx",
  telegram: "https://t.me/fatih",
  specializations: [
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Tailwind CSS",
  ],
  languages: ["Indonesia (Native)", "English (Professional)"],
};

export const statsData: StatData[] = [
  {
    title: "Hasil Kerja",
    value: "15+",
    description: "Proyek tuntas & terverifikasi",
    variant: "primary" as const,
    icon: "Briefcase",
  },
  {
    title: "Fokus Teknis",
    value: "Web & Backend",
    description: "Arsitektur sistem & API",
    variant: "secondary" as const,
    icon: "Code",
  },
  {
    title: "Status Komitmen",
    value: "Freelance & Full-Time",
    description: "Ketersediaan kerja",
    variant: "accent" as const,
    icon: "Clock",
  },
];

export const recentProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Platform e-commerce full-stack dengan fitur keranjang belanja, pembayaran terintegrasi, dashboard admin, dan manajemen inventaris real-time.",
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Stripe"],
    year: "2024",
    category: "Online",
    status: "Production",
    projectUrl: "https://example.com/ecommerce",
    githubUrl: "https://github.com/rhaditya/ecommerce",
    featured: true,
  },
  {
    id: 2,
    title: "Task Management CLI",
    description: "Command-line interface untuk manajemen tugas pribadi dengan dukungan tagging, prioritas, reminder, dan ekspor data ke berbagai format.",
    techStack: ["Node.js", "TypeScript", "SQLite", "Commander.js", "Chalk"],
    year: "2024",
    category: "CLI Package",
    status: "Published",
    projectUrl: "https://npmjs.com/package/@rhaditya/task-cli",
    githubUrl: "https://github.com/rhaditya/task-cli",
    featured: true,
  },
];

export const biodataFields = [
  { label: "Nama Lengkap", value: profileData.name },
  { label: "Peran Utama", value: profileData.role },
  { label: "Spesialisasi", value: profileData.specializations.join(", "), isBadges: true, badges: profileData.specializations },
  { label: "Domisili", value: profileData.location },
  { label: "Ketersediaan", value: profileData.availability },
  { label: "Penguasaan Bahasa", value: profileData.languages.join(", ") },
];