import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mergeWeekSchedule, validateWeekSchedule, type WeekSchedule } from "@/lib/openingHours";

const SETTINGS_ID = "default";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const row = await prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } });
    const openingHours = mergeWeekSchedule(row?.openingHours ?? null);
    return NextResponse.json({ openingHours, timeZone: process.env.RESTAURANT_TZ || "UTC" });
  } catch (e) {
    console.error("GET /api/admin/opening-hours", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user?.role ?? "STAFF";
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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

    revalidatePath("/commander");
    revalidatePath("/menu");
    revalidatePath("/reserver");
    revalidatePath("/api/opening-hours");

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PUT /api/admin/opening-hours", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
