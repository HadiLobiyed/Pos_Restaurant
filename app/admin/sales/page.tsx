import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, format } from "date-fns";
import { SalesFilters } from "@/components/admin/SalesFilters";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "STAFF";
  if (role !== "ADMIN") redirect("/admin/dashboard");

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
          orderItems: { include: { menuItem: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + Number(p.total), 0);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-dark-900">Ventes</h1>
      <SalesFilters defaultDate={date ?? format(new Date(), "yyyy-MM-dd")} />
      <div className="card mt-6 mb-6">
        <p className="text-sm font-medium text-dark-500">
          Revenu total ({format(selectedDate, "d MMM yyyy")})
        </p>
        <p className="mt-1 text-3xl font-bold text-primary-600">
          {totalRevenue.toFixed(2)} DA
        </p>
      </div>
      <div className="card overflow-hidden p-0">
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
