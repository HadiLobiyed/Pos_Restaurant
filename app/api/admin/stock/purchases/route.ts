import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  const day = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(day.getTime())) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);

  try {
    const purchases = await prisma.stockPurchase.findMany({
      where: { createdAt: { gte: dayStart, lte: dayEnd } },
      orderBy: { createdAt: "desc" },
    });

    const totalProducts = purchases.reduce((sum, p) => sum + p.quantity, 0);
    const totalSpent = purchases.reduce((sum, p) => sum + Number(p.totalCost), 0);

    return NextResponse.json({ purchases, totalProducts, totalSpent });
  } catch (e) {
    console.error("GET /api/admin/stock/purchases", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
