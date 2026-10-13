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

export const profileData = {
  name: "MUHAMMAD RHADITYA KURNIAWAN",
  role: "Full-Stack Web Developer",
  bio: "Programmer yang berfokus mengembangkan aplikasi web fungsional, bersih, dan bermanfaat.",
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