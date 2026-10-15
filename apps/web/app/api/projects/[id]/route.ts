import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { validateProjectInput, parseTechStack, normalizeUrl } from "@/lib/portfolio";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        techStack,
        year: body.year,
        projectUrl: normalizeUrl(body.link ?? ""),
        githubUrl: body.githubUrl ?? "",
        category: body.category ?? "Online",
        status: body.status ?? "Production",
        featured: body.featured ?? false,
      },
    });

    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error("[API] PUT /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui proyek" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.project.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus proyek" },
      { status: 500 }
    );
  }
}