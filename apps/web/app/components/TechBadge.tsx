"use client";

import {
  Atom,
  Boxes,
  Braces,
  Code2,
  Database,
  FileCode2,
  Layers,
  Server,
  Wind,
  type LucideIcon,
} from "lucide-react";

const techIcons: Record<string, LucideIcon> = {
  "Next.js": Layers,
  React: Atom,
  "Node.js": Server,
  PostgreSQL: Database,
  Prisma: Boxes,
  "Tailwind CSS": Wind,
  TypeScript: Braces,
  JavaScript: FileCode2,
};

export function TechBadge({ name }: { name: string }) {
  const Icon = techIcons[name] ?? Code2;

  return (
    <span className="badge-pill">
      <Icon className="mr-1.5 h-3.5 w-3.5 text-primary" aria-hidden="true" />
      {name}
    </span>
  );
}
