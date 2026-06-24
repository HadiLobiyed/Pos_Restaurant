import { NextResponse } from "next/server";
import { getRestaurantBranding } from "@/lib/restaurantSettings";

export const dynamic = "force-dynamic";

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="6" fill="#0d9488"/>
  <path d="M8 14h16v2H8v-2zm0 4h12v2H8v-2z" fill="white"/>
  <circle cx="24" cy="10" r="3" fill="white"/>
</svg>`;

export async function GET() {
  const { logoUrl } = await getRestaurantBranding();
  if (logoUrl) {
    return NextResponse.redirect(logoUrl, { status: 302 });
  }
  return new NextResponse(DEFAULT_SVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
