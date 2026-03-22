import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAllSlotTimes, MAX_RESERVATIONS_PER_SLOT } from "@/lib/reservationSlots";

/** Créneaux disponibles pour une date (YYYY-MM-DD) — public */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: "Paramètre date=YYYY-MM-DD requis." }, { status: 400 });
  }

  const [y, mo, d] = dateStr.split("-").map(Number);
  const picked = new Date(y, mo - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (picked < today) {
    return NextResponse.json({ error: "Date passée." }, { status: 400 });
  }

  try {
    const slots = generateAllSlotTimes();
    const existing = await prisma.tableReservation.findMany({
      where: { reservationDate: dateStr, reservationTime: { not: null } },
      select: { reservationTime: true },
    });
    const countMap = new Map<string, number>();
    for (const r of existing) {
      const t = r.reservationTime as string;
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
