import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  people: z.number().int().min(1).max(50),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

/** Demande de réservation (public, sans auth) */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse({
      ...body,
      people: typeof body.people === "string" ? parseInt(body.people, 10) : body.people,
    });
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
    }
    const row = await prisma.tableReservation.create({
      data: {
        name: parsed.data.name.trim(),
        phone: parsed.data.phone.trim(),
        people: parsed.data.people,
        preferredDate: parsed.data.preferredDate?.trim() || null,
        message: parsed.data.message?.trim() || null,
      },
    });
    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/reservations error:", e);
    return NextResponse.json({ error: e.message ?? "Erreur serveur" }, { status: 500 });
  }
}
