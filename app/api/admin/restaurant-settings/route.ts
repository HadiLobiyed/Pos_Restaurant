import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRestaurantName, setRestaurantName } from "@/lib/restaurantSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const restaurantName = await getRestaurantName();
  return NextResponse.json({ restaurantName });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user?.role ?? "STAFF";
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const name = typeof body?.restaurantName === "string" ? body.restaurantName : "";
    const restaurantName = await setRestaurantName(name);
    return NextResponse.json({ ok: true, restaurantName });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur serveur.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
