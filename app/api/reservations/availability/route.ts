import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlotTimesForDate, MAX_RESERVATIONS_PER_SLOT } from "@/lib/reservationSlots";

/** Créneaux disponibles pour une date (YYYY-MM-DD) — public */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: "Paramètre date=YYYY-MM-DD requis." }, { status: 400 });
  }

  const [y, mo, d] = dateStr.split("-").map(Number);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }
  const picked = new Date(y, mo - 1, d);
  picked.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (picked.getTime() < today.getTime()) {
    return NextResponse.json({ error: "Date passée." }, { status: 400 });
  }

  try {
    const tz = process.env.RESTAURANT_TZ || "UTC";
    let openingHours: unknown = null;
    try {
      const row = await prisma.restaurantSettings.findUnique({ where: { id: "default" } });
      openingHours = row?.openingHours ?? null;
    } catch (e) {
      console.warn("GET /api/reservations/availability — openingHours introuvables.", e);
    }

    const slots = generateSlotTimesForDate(dateStr, openingHours as any, tz);

    let existing: { reservationTime: string | null }[] = [];
    try {
      existing = await prisma.tableReservation.findMany({
        where: { reservationDate: dateStr, reservationTime: { not: null } },
        select: { reservationTime: true },
      });
    } catch (dbErr) {
      // Souvent : colonnes `reservationDate` / `reservationTime` absentes → lancer `npx prisma db push`
      console.error(
        "GET /api/reservations/availability — requête réservations (schéma DB à jour ?)",
        dbErr
      );
      existing = [];
    }

    const countMap = new Map<string, number>();
    for (const r of existing) {
      if (r.reservationTime == null) continue;
      const t = r.reservationTime;
      countMap.set(t, (countMap.get(t) ?? 0) + 1);
    }

    const availability = slots.map((time) => {
      const used = countMap.get(time) ?? 0;
      return {
        time,
        available: used < MAX_RESERVATIONS_PER_SLOT,
        remaining: Math.max(0, MAX_RESERVATIONS_PER_SLOT - used),
      };
    });

    return NextResponse.json({ date: dateStr, slots: availability });
  } catch (e) {
    console.error("GET /api/reservations/availability", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
