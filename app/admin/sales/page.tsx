import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, format } from "date-fns";
import { fr } from "date-fns/locale";
import { SalesFilters } from "@/components/admin/SalesFilters";
import { ExportSalesButton } from "@/components/admin/ExportSalesButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calcBeverageProfitFromOrderItems } from "@/lib/beverageProfit";

export const dynamic = "force-dynamic";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  await getServerSession(authOptions);

  const { date } = searchParams ?? {};
  const selectedDate = date ? new Date(date) : new Date();
  const dayStart = startOfDay(selectedDate);
  const dayEnd = endOfDay(selectedDate);

  const payments = await prisma.payment.findMany({
    where: { createdAt: { gte: dayStart, lte: dayEnd } },
    include: {
      order: {
        include: {
          table: true,
          orderItems: {
            include: { menuItem: { include: { category: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const paidPayments = payments.filter((p) => p.status === "PAID");
  const totalRevenue = paidPayments.reduce((sum, p) => sum + Number(p.total), 0);
  const dayBeverageProfit = paidPayments.reduce(
    (sum, p) => sum + calcBeverageProfitFromOrderItems(p.order.orderItems),
    0
  );

  const allPaidPayments = await prisma.payment.findMany({
    where: { status: "PAID" },
    include: {
      order: {
        include: {
          orderItems: {
            include: { menuItem: { include: { category: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const dailyProfitsMap = new Map<string, number>();
  for (const payment of allPaidPayments) {
    const dayKey = format(payment.createdAt, "yyyy-MM-dd");
    const profit = calcBeverageProfitFromOrderItems(payment.order.orderItems);
    dailyProfitsMap.set(dayKey, (dailyProfitsMap.get(dayKey) ?? 0) + profit);
  }
  const dailyProfits = Array.from(dailyProfitsMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dayKey, profit]) => ({ dayKey, profit }));

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-dark-900">Ventes</h1>
        <ExportSalesButton date={format(selectedDate, "yyyy-MM-dd")} />
      </div>
      <SalesFilters defaultDate={date ?? format(new Date(), "yyyy-MM-dd")} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card">
          <p className="text-sm font-medium text-dark-500">
            Revenu total ({format(selectedDate, "d MMM yyyy", { locale: fr })})
          </p>
          <p className="mt-1 text-3xl font-bold text-primary-600">
            {totalRevenue.toFixed(2)} DA
          </p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-dark-500">
            Bénéfice boissons ({format(selectedDate, "d MMM yyyy", { locale: fr })})
          </p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">
            {dayBeverageProfit.toFixed(2)} DA
          </p>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden p-0">
        <div className="border-b border-dark-200 bg-dark-50/50 px-6 py-4">
          <h2 className="text-sm font-semibold text-dark-700">Bénéfices boissons par jour</h2>
        </div>
        <table className="w-full">
          <thead className="border-b border-dark-200 bg-dark-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark-700">Bénéfice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-100">
            {dailyProfits.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-dark-500">
                  Aucune vente de boisson enregistrée.
                </td>
              </tr>
            ) : (
              dailyProfits.map(({ dayKey, profit }) => (
                <tr key={dayKey} className="transition hover:bg-dark-50/50">
                  <td className="px-6 py-3 text-sm text-dark-700">
                    {format(new Date(dayKey), "d MMM yyyy", { locale: fr })}
                  </td>
                  <td className="px-6 py-3 font-semibold text-emerald-700">
                    {profit.toFixed(2)} DA
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card mt-6 overflow-hidden p-0">
        <table className="w-full">
          <thead className="border-b border-dark-200 bg-dark-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark-700">Heure</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark-700">Table</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark-700">Articles</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark-700">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark-700">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-dark-500">
                  Aucune vente pour cette date.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="transition hover:bg-dark-50/50">
                  <td className="px-6 py-4 text-sm text-dark-700">
                    {format(payment.createdAt, "HH:mm")}
                  </td>
                  <td className="px-6 py-4 font-medium text-dark-800">
                    {payment.order.publicCode ??
                      (payment.order.table ? `Table ${payment.order.table.number}` : "—")}
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-600">
                    {payment.order.orderItems
                      .map((oi) => `${oi.menuItem.name} x${oi.quantity}`)
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4 font-semibold text-dark-800">
                    {Number(payment.total).toFixed(2)} DA
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${
                        payment.status === "PAID"
                          ? "bg-primary-100 text-primary-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {payment.status === "PAID" ? "Payé" : "Impayé"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
