import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  formatTodayHoursLabel,
  isRestaurantOpenNow,
  mergeWeekSchedule,
  validateWeekSchedule,
  type WeekSchedule,
} from "@/lib/openingHours";

const SETTINGS_ID = "default";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
};

/** Lecture publique : le restaurant est-il ouvert maintenant ? */
export async function GET() {
  try {
    const row = await prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } }).catch(() => null);
    const merged = mergeWeekSchedule(row?.openingHours ?? null);
    const schedule: WeekSchedule | null = validateWeekSchedule(merged) ? merged : null;
    const tz = process.env.RESTAURANT_TZ || "UTC";
    const open = isRestaurantOpenNow(schedule, tz);
    const hoursToday = formatTodayHoursLabel(schedule, tz);
    return NextResponse.json({ open, timeZone: tz, hoursToday }, { headers: NO_CACHE_HEADERS });
  } catch (e) {
    console.error("GET /api/opening-hours", e);
    return NextResponse.json(
      {
        open: true,
        timeZone: process.env.RESTAURANT_TZ || "UTC",
        hoursToday: null,
      },
      { headers: NO_CACHE_HEADERS }
    );
  }
}
