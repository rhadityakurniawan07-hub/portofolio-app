export interface Project {
  id: number | string;
  title: string;
  description: string;
  techStack: string[];
  year: string;
  category: string;
  status: string;
  projectUrl: string;
  githubUrl: string;
  featured: boolean;
  createdAt?: string;
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
  aboutPhotoUrl: string;
  phone: string;
  github: string;
  linkedin: string;
  twitter: string;
  whatsapp: string;
  telegram: string;
  specializations: string[];
  languages: string[];
}

export const profileData: Profile = {
  name: "MUHAMMAD RHADITYA KURNIAWAN",
  role: "Full-Stack Web Developer",
  bio: "Programmer yang berfokus mengembangkan aplikasi web fungsional, bersih, dan bermanfaat.",
  longBio: "Saya adalah seorang programmer pemula",
  tagline: "Next.js • Node.js • Tailwind CSS",
  location: "Krenji, BEKASI",
  availability: "Terbuka untuk freelance & full-time",
  availabilityStatus: "available",
  email: "hannifah1220@gmail.com",
  photoUrl: "",
  aboutPhotoUrl: "",
  phone: "+62 881-0123-09481",
  github: "https://github.com/rhadityakurniawan07-hub",
  linkedin: "",
  twitter: "",
  whatsapp: "https://wa.me/62881012309481",
  telegram: "",
  specializations: [
    "Next.js",
    "Node.js",
    "Tailwind CSS",
  ],
  languages: ["Indonesia (Professional)"],
};

export const recentProjects: Project[] = [];