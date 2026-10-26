import type { Profile, Project } from "@/data/profile";
import { normalizeWhatsAppUrl } from "@/lib/portfolio";

export type ProfileRecord = {
  id: string;
  fullName: string;
  role: string;
  tagline: string;
  bio: string;
  longBio: string | null;
  location: string;
  email: string;
  availability: string;
  availabilityStatus: string;
  phone: string | null;
  photoUrl: string | null;
  aboutPhotoUrl: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  whatsapp: string | null;
  telegram: string | null;
  skills: string[];
  languages: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectRecord = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  projectUrl: string | null;
  githubUrl: string | null;
  year: string;
  category: string;
  status: string;
  featured: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

const text = (value: string | null | undefined): string => value ?? "";

export function mapProfileRecord(record: ProfileRecord): Profile {
  return {
    name: record.fullName,
    role: record.role,
    bio: record.bio,
    longBio: text(record.longBio),
    tagline: record.tagline || record.bio,
    location: record.location,
    availability: record.availability,
    availabilityStatus: record.availabilityStatus,
    email: record.email,
    photoUrl: text(record.photoUrl),
    aboutPhotoUrl: text(record.aboutPhotoUrl),
    phone: text(record.phone),
    github: text(record.github),
    linkedin: text(record.linkedin),
    twitter: text(record.twitter),
    whatsapp: normalizeWhatsAppUrl(text(record.whatsapp)),
    telegram: text(record.telegram),
    specializations: record.skills ?? [],
    languages: record.languages ?? [],
  };
}

export function mapProjectRecord(record: ProjectRecord): Project {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    techStack: record.techStack ?? [],
    year: record.year,
    category: record.category,
    status: record.status,
    projectUrl: text(record.projectUrl),
    githubUrl: text(record.githubUrl),
    featured: record.featured,
    createdAt:
      record.createdAt instanceof Date
        ? record.createdAt.toISOString()
        : record.createdAt,
  };
}
