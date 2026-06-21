import type { Prisma, PrismaClient } from "@prisma/client";

type Db = PrismaClient | Prisma.TransactionClient;

export async function resolveTableId(db: Db, tableIdOrNumber: string): Promise<string | null> {
  const raw = tableIdOrNumber.trim();
  if (!raw) return null;

  let table = await db.table.findUnique({ where: { id: raw } });
  if (!table) {
    const n = Number.parseInt(raw, 10);
    if (!Number.isNaN(n)) {
      table = await db.table.findUnique({ where: { number: n } });
    }
  }
  return table?.id ?? null;
}

/** Commande sur table encore impayée (additions jusqu'au paiement). */
export async function findActiveUnpaidTableOrder(db: Db, tableId: string) {
  return db.order.findFirst({
    where: {
      tableId,
      channel: "DINE_IN",
      payment: { status: "UNPAID" },
    },
    include: {
      table: true,
      payment: true,
      orderItems: { include: { menuItem: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

type CartItemInput = {
  menuItemId: string;
  quantity: number;
  comment?: string;
  supplements?: Array<{ name: string; price: number }>;
};

export function sumCartItems(
  items: CartItemInput[],
  priceMap: Map<string, number>
): number {
  return items.reduce((acc, i) => {
    const base = priceMap.get(i.menuItemId) ?? 0;
    const supSum = Array.isArray(i.supplements)
      ? i.supplements.reduce((s, sup) => s + Number(sup.price || 0), 0)
      : 0;
    return acc + (base + supSum) * i.quantity;
  }, 0);
}

export function sumOrderItemsFromDb(
  orderItems: Array<{
    quantity: number;
    supplements: unknown;
    menuItem: { price: unknown };
  }>
): number {
  return orderItems.reduce((acc, oi) => {
    const base = Number(oi.menuItem.price);
    let supSum = 0;
    if (Array.isArray(oi.supplements)) {
      supSum = (oi.supplements as Array<{ price?: number }>).reduce(
        (s, sup) => s + Number(sup.price || 0),
        0
      );
    }
    return acc + (base + supSum) * oi.quantity;
  }, 0);
}

export async function appendItemsToOrder(
  tx: Prisma.TransactionClient,
  orderId: string,
  items: CartItemInput[]
) {
  const dataWithSupps = items.map((i) => ({
    orderId,
    menuItemId: i.menuItemId,
    quantity: i.quantity,
    comment: i.comment ?? null,
    ...(i.supplements !== undefined ? { supplements: i.supplements } : {}),
  })) as unknown as Prisma.OrderItemCreateManyInput[];

  const dataWithoutSupps = items.map((i) => ({
    orderId,
    menuItemId: i.menuItemId,
    quantity: i.quantity,
    comment: i.comment ?? null,
  }));

  try {
    await tx.orderItem.createMany({ data: dataWithSupps });
  } catch (e: unknown) {
    const msg = String((e as Error)?.message ?? "").toLowerCase();
    const missingSupps =
      msg.includes("supplements") &&
      (msg.includes("unknown") || msg.includes("column") || msg.includes("not exist"));
    if (!missingSupps) throw e;
    await tx.orderItem.createMany({ data: dataWithoutSupps });
  }
}

export function itemIsEditable(status: string): boolean {
  return status === "PENDING";
}
