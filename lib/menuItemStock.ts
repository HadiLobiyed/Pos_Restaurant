import type { Prisma } from "@prisma/client";

/** Met à jour la visibilité client selon le stock (rupture → invisible). */
export function visibilityFromStock(stock: number | null): boolean | undefined {
  if (stock == null) return undefined;
  return stock > 0;
}

export async function applyStockUpdate(
  tx: Prisma.TransactionClient,
  menuItemId: string,
  newStock: number | null
) {
  const data: { stock: number | null; visible?: boolean } = { stock: newStock };
  const visible = visibilityFromStock(newStock);
  if (visible !== undefined) data.visible = visible;
  return tx.menuItem.update({
    where: { id: menuItemId },
    data,
    include: { category: true },
  });
}
