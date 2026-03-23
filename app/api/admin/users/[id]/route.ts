import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const idSchema = z.object({
  id: z.string().min(1),
});

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = session.user?.role ?? "STAFF";
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = idSchema.parse(await params);
  const selfId = session.user?.id;
  if (selfId && id === selfId) {
    return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte." }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }
    console.error("DELETE /api/admin/users/[id]", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

