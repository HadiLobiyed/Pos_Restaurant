import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, format } from "date-fns";
import { isArchivedDate, runDataRetention } from "@/lib/dataRetention";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await runDataRetention().catch(() => {});

  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  const day = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(day.getTime())) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  const dayKey = format(day, "yyyy-MM-dd");

  if (isArchivedDate(day)) {
    const summary = await prisma.dailyPurchaseSummary.findUnique({ where: { date: dayKey } });
    return NextResponse.json({
      purchases: [],
      totalProducts: summary?.totalProducts ?? 0,
      totalSpent: summary ? Number(summary.totalSpent) : 0,
      archived: true,
      summary: summary
        ? {
            purchaseCount: summary.purchaseCount,
            totalProducts: summary.totalProducts,
            totalSpent: Number(summary.totalSpent),
          }
        : null,
    });
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

    return NextResponse.json({ purchases, totalProducts, totalSpent, archived: false });
  } catch (e) {
    console.error("GET /api/admin/stock/purchases", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
