import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { validateProfileInput } from "@/lib/portfolio";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[API] GET /api/profile error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil profil" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();

    const {
      fullName,
      role,
      bio,
      longBio,
      location,
      email,
      availability,
      availabilityStatus,
      phone,
      photoUrl,
      aboutPhotoUrl,
      github,
      linkedin,
      twitter,
      whatsapp,
      telegram,
      specializations,
      languages,
    } = body;

    // Validasi
    const errs = validateProfileInput({
      fullName: fullName ?? "",
      role: role ?? "",
      bio: bio ?? "",
      location: location ?? "",
      email: email ?? "",
      availability: availability ?? "",
    });

    if (errs.length > 0) {
      return NextResponse.json({ errors: errs }, { status: 400 });
    }

    // Cek email unik
    const existing = await prisma.profile.findUnique({ where: { email: email.trim() } });
    const currentProfile = await prisma.profile.findFirst({ orderBy: { updatedAt: "desc" } });

    let profile;
    if (existing && existing.id !== currentProfile?.id) {
      return NextResponse.json(
        { errors: ["Email sudah digunakan"] },
        { status: 400 }
      );
    }

    if (existing) {
      profile = await prisma.profile.update({
        where: { id: existing.id },
        data: {
          fullName,
          role,
          tagline: bio,
          bio,
          longBio: longBio ?? null,
          location,
          email,
          availability,
          availabilityStatus: availabilityStatus ?? "available",
          phone,
          photoUrl,
          aboutPhotoUrl: aboutPhotoUrl ?? null,
          github,
          linkedin,
          twitter,
          whatsapp,
          telegram,
          skills: specializations ?? [],
          languages: languages ?? [],
        },
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          fullName,
          role,
          tagline: bio,
          bio,
          longBio: longBio ?? null,
          location,
          email,
          availability,
          availabilityStatus: availabilityStatus ?? "available",
          phone,
          photoUrl,
          aboutPhotoUrl: aboutPhotoUrl ?? null,
          github,
          linkedin,
          twitter,
          whatsapp,
          telegram,
          skills: specializations ?? [],
          languages: languages ?? [],
        },
      });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[API] PUT /api/profile error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}