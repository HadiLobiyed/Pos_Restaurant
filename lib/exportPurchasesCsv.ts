import { format } from "date-fns";
import { fr } from "date-fns/locale";

type PurchaseRow = {
  createdAt: Date;
  itemName: string;
  type: string;
  quantity: number;
  unitPrice: { toString(): string } | number;
  totalCost: { toString(): string } | number;
};

function escapeCsv(value: string): string {
  if (/[;"\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function typeLabel(type: string): string {
  return type === "beverage" ? "Boisson" : "Ingrédient";
}

export function buildPurchasesCsv(purchases: PurchaseRow[], dayLabel: string): string {
  const lines: string[] = [
    `Achats du ${dayLabel}`,
    "",
    ["Heure", "Produit", "Type", "Quantité", "P.U. (DA)", "Total (DA)"].map(escapeCsv).join(";"),
  ];

  let totalProducts = 0;
  let totalSpent = 0;

  for (const p of purchases) {
    totalProducts += p.quantity;
    totalSpent += Number(p.totalCost);
    lines.push(
      [
        format(p.createdAt, "HH:mm"),
        p.itemName,
        typeLabel(p.type),
        String(p.quantity),
        Number(p.unitPrice).toFixed(2),
        Number(p.totalCost).toFixed(2),
      ]
        .map((v) => escapeCsv(String(v)))
        .join(";")
    );
  }

  lines.push("");
  lines.push(`Total produits achetés;${totalProducts}`);
  lines.push(`Total dépensé;${totalSpent.toFixed(2)} DA`);
  lines.push(`Nombre de lignes;${purchases.length}`);

  return "\uFEFF" + lines.join("\r\n");
}

export function formatDayLabel(date: Date): string {
  return format(date, "d MMMM yyyy", { locale: fr });
}
