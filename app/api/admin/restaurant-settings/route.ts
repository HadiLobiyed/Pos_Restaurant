import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  clearRestaurantLogo,
  getRestaurantBranding,
  setRestaurantName,
} from "@/lib/restaurantSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const branding = await getRestaurantBranding();
  return NextResponse.json(branding);
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
    revalidatePath("/", "layout");
    const branding = await getRestaurantBranding();
    return NextResponse.json({ ok: true, restaurantName, ...branding });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur serveur.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user?.role ?? "STAFF";
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const branding = await clearRestaurantLogo();
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, ...branding });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur serveur.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
