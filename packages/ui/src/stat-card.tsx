"use client";

import { Briefcase, Code, Clock, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon?: "Briefcase" | "Code" | "Clock";
  variant?: "primary" | "secondary" | "accent";
  className?: string;
}

const variantStyles = {
  primary: "border-primary/30 bg-primary/5",
  secondary: "border-gray-700/50 bg-gray-800/50",
  accent: "border-amber-500/30 bg-amber-500/5",
};

const iconStyles = {
  primary: "text-primary",
  secondary: "text-gray-400",
  accent: "text-amber-500",
};

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Code,
  Clock,
};

export function StatCard({
  title,
  value,
  description,
  icon,
  variant = "primary",
  className,
}: StatCardProps) {
  const Icon = icon ? iconMap[icon] : null;

  return (
    <div
      className={`
        rounded-xl border p-6 transition-all duration-200 hover:border-opacity-50
        ${variantStyles[variant]} ${className}
      `}
    >
      {Icon && (
        <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ${iconStyles[variant]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}