import { prisma } from "@/lib/prisma";
import { startOfDay } from "date-fns";
import Link from "next/link";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";
import { AutoRefresh } from "@/components/admin/AutoRefresh";

export const dynamic = "force-dynamic";

function getTableLabel(num: number): string {
  if (num === 0) return "À emporter";
  if (num === 99) return "Livraison";
  return `Table ${num}`;
}

export default async function DashboardPage() {
  const today = startOfDay(new Date());
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  const [ordersToday, paymentsToday, unpaidPaymentsData] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today, lte: endOfToday } } }),
    prisma.payment.findMany({
      where: { createdAt: { gte: today, lte: endOfToday }, status: "PAID" },
      include: { order: true },
    }),
    prisma.payment.findMany({
      where: { status: "UNPAID" },
      include: {
        order: {
          include: { table: true, orderItems: { include: { menuItem: true } } },
        },
      },
    }),
  ]);

  const unpaidOrders = unpaidPaymentsData
    .map((p) => p.order)
    .filter((o): o is NonNullable<typeof o> => o != null)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const totalSalesToday = paymentsToday.reduce((sum, p) => sum + Number(p.total), 0);

  const stats = [
    {
      label: "Chiffre d'affaires aujourd'hui",
      value: `${totalSalesToday.toFixed(2)} €`,
      icon: "💰",
      color: "from-primary-500 to-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: "Commandes aujourd'hui",
      value: String(ordersToday),
      icon: "📦",
      color: "from-accent-500 to-accent-600",
      bg: "bg-accent-50",
    },
    {
      label: "À encaisser",
      value: String(unpaidOrders.length),
      icon: "⏳",
      color: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="p-8">
      <AutoRefresh intervalSeconds={10} />
      <h1 className="mb-8 text-2xl font-bold text-dark-900">Dashboard</h1>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card group overflow-hidden"
          >
            <div className={`absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full opacity-10 bg-gradient-to-br ${s.color}`} />
            <div className="relative">
              <span className={`inline-flex rounded-xl p-2.5 ${s.bg} text-2xl`}>{s.icon}</span>
              <p className="mt-4 text-sm font-medium text-dark-500">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-dark-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card overflow-hidden p-0">
        <h2 className="border-b border-dark-200 bg-dark-50/50 px-6 py-4 font-semibold text-dark-800">
          Commandes à encaisser
        </h2>
        <p className="border-b border-dark-100 px-6 py-2 text-sm text-dark-500">
          Table, livraison ou à emporter — cliquez pour envoyer à la caisse
        </p>
        <div className="divide-y divide-dark-100">
          {unpaidOrders.length === 0 ? (
            <p className="px-6 py-10 text-center text-dark-500">Aucune commande à encaisser.</p>
          ) : (
            unpaidOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-dark-50/50"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 font-semibold text-primary-700">
                    {order.table.number}
                  </span>
                  <div>
                    <p className="font-medium text-dark-800">{getTableLabel(order.table.number)}</p>
                    <p className="text-sm capitalize text-dark-500">
                      {order.status.replace("_", " ").toLowerCase()}
                    </p>
                  </div>
                </div>
                <p className="max-w-xs truncate text-sm text-dark-600">
                  {order.orderItems.map((oi) => oi.menuItem.name).join(", ")}
                </p>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <Link href={`/admin/pos?order=${order.id}`} className="btn-primary">
                    À la caisse
                  </Link>
                  <DeleteOrderButton orderId={order.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
