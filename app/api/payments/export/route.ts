import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { endOfDay, format, startOfDay } from "date-fns";
import { buildSalesCsv, formatDayLabel } from "@/lib/exportSalesCsv";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();
  if (Number.isNaN(selectedDate.getTime())) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  const dayStart = startOfDay(selectedDate);
  const dayEnd = endOfDay(selectedDate);

  const payments = await prisma.payment.findMany({
    where: { createdAt: { gte: dayStart, lte: dayEnd } },
    include: {
      order: {
        include: {
          table: true,
          orderItems: { include: { menuItem: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const dayLabel = formatDayLabel(selectedDate);
  const csv = buildSalesCsv(payments, dayLabel);
  const filename = `ventes-${format(selectedDate, "yyyy-MM-dd")}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
