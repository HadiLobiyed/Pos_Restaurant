import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Nombre de réservations non traitées (badge sidebar) */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const count = await prisma.tableReservation.count({ where: { handled: false } });
    return NextResponse.json({ count });
  } catch (e) {
    console.error("GET /api/admin/reservations/pending-count", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
