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
    title: "Aplikasi Manajemen Santri",
    description: "Aplikasi web untuk mengelola data santri, kehadiran, dan administrasi pondok dalam satu dasbor terpadu.",
    techStack: ["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
    year: "2024",
    category: "Online",
    status: "Production",
    projectUrl: "https://santri-app.demo.id",
    githubUrl: "https://github.com/fatih/santri-app",
    featured: true,
  },
  {
    id: 2,
    title: "Catatan & Task Manager CLI",
    description: "Command-line interface untuk mencatat dan mengelola tugas harian dengan dukungan tagging dan prioritas.",
    techStack: ["Node.js", "TypeScript", "SQLite"],
    year: "2023",
    category: "CLI Package",
    status: "Published",
    projectUrl: "https://npmjs.com/package/@fatih/task-cli",
    githubUrl: "https://github.com/fatih/task-cli",
    featured: true,
  },
  {
    id: 3,
    title: "Landing Page Evaluasi & Portofolio",
    description: "Landing page responsif untuk evaluasi dan portofolio pribadi dengan performa tinggi dan desain bersih.",
    techStack: ["React", "HTML5", "Tailwind CSS"],
    year: "2023",
    category: "Online",
    status: "Production",
    projectUrl: "https://portofolio.demo.id",
    githubUrl: "https://github.com/fatih/portofolio",
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