import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { isValidSlot, MAX_RESERVATIONS_PER_SLOT } from "@/lib/reservationSlots";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  people: z.number().int().min(1).max(50),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reservationTime: z.string().regex(/^\d{2}:\d{2}$/),
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

    const { reservationDate, reservationTime } = parsed.data;
    if (!isValidSlot(reservationTime)) {
      return NextResponse.json({ error: "Créneau horaire invalide." }, { status: 400 });
    }

    const [y, mo, d] = reservationDate.split("-").map(Number);
    const picked = new Date(y, mo - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (picked < today) {
      return NextResponse.json({ error: "La date ne peut pas être dans le passé." }, { status: 400 });
    }

    const used = await prisma.tableReservation.count({
      where: {
        reservationDate,
        reservationTime,
      },
    });
    if (used >= MAX_RESERVATIONS_PER_SLOT) {
      return NextResponse.json(
        { error: "Ce créneau est complet. Choisissez une autre heure ou un autre jour." },
        { status: 409 }
      );
    }

    const row = await prisma.tableReservation.create({
      data: {
        name: parsed.data.name.trim(),
        phone: parsed.data.phone.trim(),
        people: parsed.data.people,
        reservationDate,
        reservationTime,
        message: parsed.data.message?.trim() || null,
      },
    });
    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (e: unknown) {
    console.error("POST /api/reservations error:", e);
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
