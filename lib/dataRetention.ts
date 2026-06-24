import { format, startOfDay, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { calcBeverageProfitFromOrderItems } from "@/lib/beverageProfit";

export const RETENTION_DAYS = 7;

function groupByDay<T extends { createdAt: Date }>(rows: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const key = format(row.createdAt, "yyyy-MM-dd");
    const list = map.get(key);
    if (list) list.push(row);
    else map.set(key, [row]);
  }
  return map;
}

/** Archive les ventes et achats détaillés de plus de 7 jours en totaux journaliers. */
export async function runDataRetention(): Promise<void> {
  const cutoff = startOfDay(subDays(new Date(), RETENTION_DAYS));

  const oldPayments = await prisma.payment.findMany({
    where: { createdAt: { lt: cutoff } },
    include: {
      order: {
        include: {
          orderItems: {
            include: { menuItem: { include: { category: true } } },
          },
        },
      },
    },
  });

  for (const [dayKey, payments] of Array.from(groupByDay(oldPayments).entries())) {
    const paid = payments.filter((p) => p.status === "PAID");
    const dayRevenue = paid.reduce((s, p) => s + Number(p.total), 0);
    const dayProfit = paid.reduce(
      (s, p) => s + calcBeverageProfitFromOrderItems(p.order.orderItems),
      0
    );

    const existing = await prisma.dailySalesSummary.findUnique({ where: { date: dayKey } });
    await prisma.dailySalesSummary.upsert({
      where: { date: dayKey },
      create: {
        date: dayKey,
        totalRevenue: dayRevenue,
        totalSales: payments.length,
        paidCount: paid.length,
        beverageProfit: dayProfit,
      },
      update: {
        totalRevenue: Number(existing?.totalRevenue ?? 0) + dayRevenue,
        totalSales: (existing?.totalSales ?? 0) + payments.length,
        paidCount: (existing?.paidCount ?? 0) + paid.length,
        beverageProfit: Number(existing?.beverageProfit ?? 0) + dayProfit,
      },
    });

    const orderIds = Array.from(new Set(payments.map((p) => p.orderId)));
    if (orderIds.length > 0) {
      await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
    }
  }

  const oldPurchases = await prisma.stockPurchase.findMany({
    where: { createdAt: { lt: cutoff } },
  });

  for (const [dayKey, purchases] of Array.from(groupByDay(oldPurchases).entries())) {
    const dayProducts = purchases.reduce((s, p) => s + p.quantity, 0);
    const daySpent = purchases.reduce((s, p) => s + Number(p.totalCost), 0);

    const existing = await prisma.dailyPurchaseSummary.findUnique({ where: { date: dayKey } });
    await prisma.dailyPurchaseSummary.upsert({
      where: { date: dayKey },
      create: {
        date: dayKey,
        totalProducts: dayProducts,
        totalSpent: daySpent,
        purchaseCount: purchases.length,
      },
      update: {
        totalProducts: (existing?.totalProducts ?? 0) + dayProducts,
        totalSpent: Number(existing?.totalSpent ?? 0) + daySpent,
        purchaseCount: (existing?.purchaseCount ?? 0) + purchases.length,
      },
    });

    const ids = purchases.map((p) => p.id);
    await prisma.stockPurchase.deleteMany({ where: { id: { in: ids } } });
  }
}

export function isArchivedDate(date: Date): boolean {
  return startOfDay(date) < startOfDay(subDays(new Date(), RETENTION_DAYS));
}
