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

export interface Profile {
  name: string;
  role: string;
  bio: string;           // Tagline / Bio Singkat (untuk HeroSection)
  longBio: string;       // Bio Panjang / Tentang Saya (untuk AboutSection)
  tagline: string;
  location: string;
  availability: string;
  availabilityStatus: string;
  email: string;
  photoUrl: string;
  phone: string;
  github: string;
  linkedin: string;
  twitter: string;
  whatsapp: string;
  telegram: string;
  specializations: string[];
  languages: string[];
}

export const profileData = {
  name: "MUHAMMAD RHADITYA KURNIAWAN",
  role: "Full-Stack Web Developer",
  bio: "Programmer yang berfokus mengembangkan aplikasi web fungsional, bersih, dan bermanfaat.",
  longBio: "Saya adalah seorang Full-Stack Web Developer dengan pengalaman membangun aplikasi web modern menggunakan teknologi terkini. Saya memiliki passion dalam menciptakan solusi digital yang efisien, scalable, dan user-friendly. Memiliki pengalaman dalam pengembangan end-to-end mulai dari perancangan arsitektur, pengembangan frontend/backend, hingga deployment dan maintenance. Terbuka untuk kolaborasi, freelance, maupun posisi full-time.",
  tagline: "Next.js • Node.js • PostgreSQL • Tailwind CSS",
  location: "Sleman, D.I. Yogyakarta",
  availability: "Terbuka untuk freelance & full-time",
  availabilityStatus: "available",
  email: "fatih@dev.id",
  photoUrl: "",
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

export const recentProjects: Project[] = [];