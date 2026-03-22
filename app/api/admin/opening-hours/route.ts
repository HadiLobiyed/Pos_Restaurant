import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emptyWeekSchedule, validateWeekSchedule, type WeekSchedule } from "@/lib/openingHours";

function mergeSchedule(raw: unknown): WeekSchedule {
  const base = emptyWeekSchedule();
  if (raw == null || typeof raw !== "object") return base;
  return { ...base, ...(raw as WeekSchedule) };
}

const SETTINGS_ID = "default";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const row = await prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } });
    const openingHours = mergeSchedule(row?.openingHours ?? null);
    return NextResponse.json({ openingHours, timeZone: process.env.RESTAURANT_TZ || "UTC" });
  } catch (e) {
    console.error("GET /api/admin/opening-hours", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const oh = body?.openingHours;
    if (!validateWeekSchedule(oh)) {
      return NextResponse.json({ error: "Format des horaires invalide." }, { status: 400 });
    }

    await prisma.restaurantSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, openingHours: oh },
      update: { openingHours: oh },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PUT /api/admin/opening-hours", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
