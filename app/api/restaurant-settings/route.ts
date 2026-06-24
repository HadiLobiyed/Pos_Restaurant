import { NextResponse } from "next/server";
import { getRestaurantBranding } from "@/lib/restaurantSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  const branding = await getRestaurantBranding();
  return NextResponse.json(branding);
}
