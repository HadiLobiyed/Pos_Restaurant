import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  formatTodayHoursLabel,
  isRestaurantOpenNow,
  validateWeekSchedule,
  type WeekSchedule,
} from "@/lib/openingHours";

const SETTINGS_ID = "default";

/** Lecture publique : le restaurant est-il ouvert maintenant ? */
export async function GET() {
  try {
    const row = await prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } }).catch(() => null);
    const raw = (row?.openingHours as WeekSchedule | null) ?? null;
    const schedule = validateWeekSchedule(raw) ? raw : null;
    const tz = process.env.RESTAURANT_TZ || "UTC";
    const open = isRestaurantOpenNow(schedule, tz);
    const hoursToday = formatTodayHoursLabel(schedule, tz);
    return NextResponse.json({ open, timeZone: tz, hoursToday });
  } catch (e) {
    console.error("GET /api/opening-hours", e);
    return NextResponse.json({
      open: true,
      timeZone: process.env.RESTAURANT_TZ || "UTC",
      hoursToday: null,
    });
  }
}
