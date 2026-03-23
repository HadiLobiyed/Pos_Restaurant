import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcryptjs";

const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  password: z.string().min(6).max(200),
  role: z.enum(["ADMIN", "STAFF"]).optional().default("STAFF"),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = session.user?.role ?? "STAFF";
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const passwordHash = await hash(parsed.data.password, 12);

    const created = await prisma.user.create({
      data: {
        name: parsed.data.name.trim(),
        email: parsed.data.email.trim().toLowerCase(),
        password: passwordHash,
        role: parsed.data.role,
      },
    });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (e: any) {
    // Email déjà utilisé (Prisma P2002)
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
    }
    console.error("POST /api/admin/users", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

