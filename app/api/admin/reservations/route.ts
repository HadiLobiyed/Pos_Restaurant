import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Liste des réservations (admin) */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await prisma.tableReservation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rows);
  } catch (e) {
    console.error("GET /api/admin/reservations", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
