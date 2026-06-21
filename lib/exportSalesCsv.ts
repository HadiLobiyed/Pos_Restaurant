import { format } from "date-fns";
import { fr } from "date-fns/locale";

type PaymentRow = {
  createdAt: Date;
  total: { toString(): string } | number;
  status: string;
  order: {
    publicCode: string | null;
    channel: string;
    table: { number: number } | null;
    orderItems: Array<{
      quantity: number;
      menuItem: { name: string };
    }>;
  };
};

function channelLabel(channel: string): string {
  if (channel === "TAKEAWAY") return "À emporter";
  if (channel === "DELIVERY") return "Livraison";
  return "Sur place";
}

function orderRef(order: PaymentRow["order"]): string {
  if (order.publicCode) return order.publicCode;
  if (order.table) return `Table ${order.table.number}`;
  return "—";
}

function escapeCsv(value: string): string {
  if (/[;"\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function buildSalesCsv(payments: PaymentRow[], dayLabel: string): string {
  const lines: string[] = [
    `Ventes du ${dayLabel}`,
    "",
    ["Heure", "Référence", "Canal", "Articles", "Total (DA)", "Statut"].map(escapeCsv).join(";"),
  ];

  let totalPaid = 0;
  for (const p of payments) {
    const total = Number(p.total);
    if (p.status === "PAID") totalPaid += total;
    const articles = p.order.orderItems
      .map((oi) => `${oi.menuItem.name} x${oi.quantity}`)
      .join(", ");
    lines.push(
      [
        format(p.createdAt, "HH:mm"),
        orderRef(p.order),
        channelLabel(p.order.channel),
        articles,
        total.toFixed(2),
        p.status === "PAID" ? "Payé" : "Impayé",
      ]
        .map((v) => escapeCsv(String(v)))
        .join(";")
    );
  }

  lines.push("");
  lines.push(`Total encaissé (payé);${totalPaid.toFixed(2)} DA`);
  lines.push(`Nombre de ventes;${payments.length}`);

  return "\uFEFF" + lines.join("\r\n");
}

export function formatDayLabel(date: Date): string {
  return format(date, "d MMMM yyyy", { locale: fr });
}
