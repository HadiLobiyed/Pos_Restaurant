import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { endOfDay, format, startOfDay } from "date-fns";
import { buildPurchasesCsv, formatDayLabel } from "@/lib/exportPurchasesCsv";
import { isArchivedDate, runDataRetention } from "@/lib/dataRetention";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await runDataRetention().catch(() => {});

  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();
  if (Number.isNaN(selectedDate.getTime())) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  const dayKey = format(selectedDate, "yyyy-MM-dd");
  const dayLabel = formatDayLabel(selectedDate);

  if (isArchivedDate(selectedDate)) {
    const summary = await prisma.dailyPurchaseSummary.findUnique({ where: { date: dayKey } });
    const csv = summary
      ? `Date;Produits achetés;Dépenses;Nombre d'achats\n${dayLabel};${summary.totalProducts};${Number(summary.totalSpent).toFixed(2)};${summary.purchaseCount}\n`
      : `Date;Produits achetés;Dépenses;Nombre d'achats\n${dayLabel};0;0.00;0\n`;
    const filename = `achats-${dayKey}.csv`;
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  const dayStart = startOfDay(selectedDate);
  const dayEnd = endOfDay(selectedDate);

  try {
    const purchases = await prisma.stockPurchase.findMany({
      where: { createdAt: { gte: dayStart, lte: dayEnd } },
      orderBy: { createdAt: "asc" },
    });

    const csv = buildPurchasesCsv(purchases, dayLabel);
    const filename = `achats-${dayKey}.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error("GET /api/admin/stock/purchases/export", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
