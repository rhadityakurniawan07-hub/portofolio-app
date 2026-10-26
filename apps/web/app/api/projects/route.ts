import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { validateProjectInput, parseTechStack } from "@/lib/portfolio";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("[API] GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar proyek" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();

    const techStack = Array.isArray(body.techStack)
      ? body.techStack
      : parseTechStack(body.tech ?? "");

    const errs = validateProjectInput({
      title: body.title ?? "",
      description: body.description ?? "",
      techStack,
      year: body.year ?? "",
      link: body.link ?? "",
    });

    if (errs.length > 0) {
      return NextResponse.json({ errors: errs }, { status: 400 });
    }

    const created = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        techStack,
        projectUrl: body.link ?? "",
        githubUrl: body.githubUrl ?? "",
        year: body.year,
        category: body.category ?? "Online",
        status: body.status ?? "Production",
        featured: body.featured ?? false,
      },
    });

    return NextResponse.json({ project: created }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Gagal membuat proyek" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Parameter id diperlukan" }, { status: 400 });
    }

    const body = await req.json();

    const techStack = Array.isArray(body.techStack)
      ? body.techStack
      : parseTechStack(body.tech ?? "");

    const errs = validateProjectInput({
      title: body.title ?? "",
      description: body.description ?? "",
      techStack,
      year: body.year ?? "",
      link: body.link ?? "",
    });

    if (errs.length > 0) {
      return NextResponse.json({ errors: errs }, { status: 400 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        techStack,
        projectUrl: body.link ?? "",
        githubUrl: body.githubUrl ?? "",
        year: body.year,
        category: body.category ?? "Online",
        status: body.status ?? "Production",
        featured: body.featured ?? false,
      },
    });

    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error("[API] PUT /api/projects error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui proyek" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Parameter id diperlukan" }, { status: 400 });
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[API] DELETE /api/projects error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus proyek" },
      { status: 500 }
    );
  }
}