import { NextResponse } from "next/server";
import { getRestaurantName } from "@/lib/restaurantSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  const restaurantName = await getRestaurantName();
  return NextResponse.json({ restaurantName });
}
