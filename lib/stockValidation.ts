import type { PrismaClient } from "@prisma/client";

type Db = Pick<PrismaClient, "menuItem">;

type CartLine = { menuItemId: string; quantity: number };

/** Vérifie le stock menu (boissons suivies : stock !== null). */
export async function validateMenuItemsStock(
  db: Db,
  items: CartLine[]
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (items.length === 0) return { ok: true };

  const qtyById = new Map<string, number>();
  for (const i of items) {
    qtyById.set(i.menuItemId, (qtyById.get(i.menuItemId) ?? 0) + i.quantity);
  }

  const rows = await db.menuItem.findMany({
    where: { id: { in: Array.from(qtyById.keys()) } },
    select: { id: true, name: true, stock: true },
  });

  for (const [id, qty] of Array.from(qtyById.entries())) {
    const row = rows.find((r) => r.id === id);
    if (!row || row.stock == null) continue;
    if (row.stock <= 0) {
      return { ok: false, message: `${row.name} est en rupture de stock.` };
    }
    if (row.stock < qty) {
      return {
        ok: false,
        message: `Stock insuffisant pour ${row.name} (reste : ${row.stock}).`,
      };
    }
  }

  return { ok: true };
}
