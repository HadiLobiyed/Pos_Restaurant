import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import {
  CLOSED_NOW_MESSAGE,
  isRestaurantOpenNow,
  mergeWeekSchedule,
  validateWeekSchedule,
} from "@/lib/openingHours";
import {
  appendItemsToOrder,
  findActiveUnpaidOrderByCode,
  findActiveUnpaidTableOrder,
  resolveTableId,
  sumCartItems,
  sumOrderItemsFromDb,
} from "@/lib/orderSession";

const itemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.coerce.number().int().positive(),
  comment: z.string().optional(),
  supplements: z.array(z.object({ name: z.string(), price: z.number() })).optional(),
});

/** Sans `channel` → DINE_IN (compat ancien POS / clients qui envoient seulement tableId + items) */
const createSchema = z
  .object({
    channel: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]).optional(),
    tableId: z.string().optional(),
    code: z.string().optional(),
    items: z.array(itemSchema),
    customerName: z.string().optional(),
    customerPhone: z.string().optional(),
    customerAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const channel = data.channel ?? "DINE_IN";
    if (channel === "DINE_IN" && (!data.tableId || data.tableId.length === 0)) {
      ctx.addIssue({ code: "custom", message: "tableId requis pour une commande sur table", path: ["tableId"] });
    }
  });

async function generateUniquePublicCode(tx: Prisma.TransactionClient): Promise<string> {
  for (let i = 0; i < 12; i++) {
    const code = `CMD-${Math.floor(100000 + Math.random() * 900000)}`;
    const clash = await tx.order.findFirst({
      where: { publicCode: code } as unknown as Prisma.OrderWhereInput,
    });
    if (!clash) return code;
  }
  return `CMD-${Date.now().toString(36).toUpperCase()}`;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      include: {
        table: true,
        orderItems: { include: { menuItem: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });

    const channel = parsed.data.channel ?? "DINE_IN";
    const { tableId, code, items, customerName, customerPhone, customerAddress } = parsed.data;

    if (channel === "DELIVERY" && !session) {
      if (!customerName?.trim() || !customerPhone?.trim() || !customerAddress?.trim()) {
        return NextResponse.json(
          { error: "Pour la livraison : nom, téléphone et adresse sont requis." },
          { status: 400 }
        );
      }
    }
    if (items.length === 0)
      return NextResponse.json({ error: "At least one item required" }, { status: 400 });

    if (!session) {
      try {
        const settings = await prisma.restaurantSettings.findUnique({ where: { id: "default" } });
        const merged = mergeWeekSchedule(settings?.openingHours ?? null);
        const schedule = validateWeekSchedule(merged) ? merged : null;
        const tz = process.env.RESTAURANT_TZ || "UTC";
        if (!isRestaurantOpenNow(schedule, tz)) {
          return NextResponse.json({ error: CLOSED_NOW_MESSAGE }, { status: 403 });
        }
      } catch (e) {
        console.warn("POST /api/orders — horaires non vérifiés (schéma ou DB)", e);
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      let tableIdResolved: string | undefined = undefined;
      if (channel === "DINE_IN" && tableId) {
        const resolved = await resolveTableId(tx, tableId);
        if (!resolved) {
          const err = new Error("TABLE_NOT_FOUND");
          err.name = "TableNotFoundError";
          throw err;
        }
        tableIdResolved = resolved;
      }

      const menuIds = Array.from(new Set(items.map((i) => i.menuItemId)));
      const menuRows = await tx.menuItem.findMany({
        where: { id: { in: menuIds } },
        select: { id: true, price: true },
      });
      const priceMap = new Map(menuRows.map((m) => [m.id, Number(m.price)]));

      if (channel === "DINE_IN" && tableIdResolved) {
        const existing = await findActiveUnpaidTableOrder(tx, tableIdResolved);
        if (existing) {
          await appendItemsToOrder(tx, existing.id, items);
          const allItems = await tx.orderItem.findMany({
            where: { orderId: existing.id },
            include: { menuItem: true },
          });
          await tx.payment.update({
            where: { orderId: existing.id },
            data: { total: sumOrderItemsFromDb(allItems) },
          });
          return tx.order.findUnique({
            where: { id: existing.id },
            include: { table: true, orderItems: { include: { menuItem: true } } },
          });
        }
      }

      if ((channel === "TAKEAWAY" || channel === "DELIVERY") && code?.trim()) {
        const existing = await findActiveUnpaidOrderByCode(tx, code);
        if (!existing) {
          const err = new Error("ORDER_CODE_NOT_FOUND");
          err.name = "OrderCodeNotFoundError";
          throw err;
        }
        if (existing.channel !== channel) {
          const err = new Error("ORDER_CHANNEL_MISMATCH");
          err.name = "OrderChannelMismatchError";
          throw err;
        }
        await appendItemsToOrder(tx, existing.id, items);
        const allItems = await tx.orderItem.findMany({
          where: { orderId: existing.id },
          include: { menuItem: true },
        });
        await tx.payment.update({
          where: { orderId: existing.id },
          data: { total: sumOrderItemsFromDb(allItems) },
        });
        return tx.order.findUnique({
          where: { id: existing.id },
          include: { table: true, orderItems: { include: { menuItem: true } } },
        });
      }

      const publicCode =
        channel === "TAKEAWAY" || channel === "DELIVERY" ? await generateUniquePublicCode(tx) : null;

      const newOrder = await tx.order.create({
        data: {
          tableId: tableIdResolved ?? null,
          channel,
          publicCode,
          customerName: customerName?.trim() || null,
          customerPhone: customerPhone?.trim() || null,
          customerAddress: customerAddress?.trim() || null,
          status: "PENDING",
        } as unknown as Prisma.OrderUncheckedCreateInput,
        include: { table: true },
      });

      await appendItemsToOrder(tx, newOrder.id, items);

      await tx.payment.create({
        data: { orderId: newOrder.id, total: sumCartItems(items, priceMap), status: "UNPAID" },
      });

      return tx.order.findUnique({
        where: { id: newOrder.id },
        include: { table: true, orderItems: { include: { menuItem: true } } },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "TABLE_NOT_FOUND") {
      return NextResponse.json({ error: "Table introuvable. Scannez le QR code de votre table." }, { status: 400 });
    }
    if (error instanceof Error && error.message === "ORDER_CODE_NOT_FOUND") {
      return NextResponse.json(
        { error: "Commande introuvable ou déjà payée. Vérifiez votre code." },
        { status: 404 }
      );
    }
    if (error instanceof Error && error.message === "ORDER_CHANNEL_MISMATCH") {
      return NextResponse.json({ error: "Ce code ne correspond pas au mode de commande choisi." }, { status: 400 });
    }
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
