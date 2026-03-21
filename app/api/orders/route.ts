import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const itemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.coerce.number().int().positive(),
  comment: z.string().optional(),
});

/** Sans `channel` → DINE_IN (compat ancien POS / clients qui envoient seulement tableId + items) */
const createSchema = z
  .object({
    channel: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]).optional(),
    tableId: z.string().optional(),
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
    // Infos livraison obligatoires seulement pour les commandes publiques (sans session staff)
  });

async function generateUniquePublicCode(tx: Prisma.TransactionClient): Promise<string> {
  for (let i = 0; i < 12; i++) {
    const code = `CMD-${Math.floor(100000 + Math.random() * 900000)}`;
    // Cast : si l’IDE affiche une erreur, exécute `npx prisma generate` (schéma avec publicCode)
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
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: error.message ?? "Internal server error" }, { status: 500 });
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
    const { tableId, items, customerName, customerPhone, customerAddress } = parsed.data;

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

    const order = await prisma.$transaction(async (tx) => {
      let tableIdResolved: string | undefined = undefined;
      if (channel === "DINE_IN" && tableId) {
        let table = await tx.table.findUnique({ where: { id: tableId } });
        if (!table) {
          const asNumber = Number.parseInt(tableId, 10);
          if (!Number.isNaN(asNumber)) {
            table = await tx.table.findUnique({ where: { number: asNumber } });
          }
        }
        if (!table) {
          const err = new Error("TABLE_NOT_FOUND");
          err.name = "TableNotFoundError";
          throw err;
        }
        tableIdResolved = table.id;
      }

      const publicCode =
        channel === "TAKEAWAY" || channel === "DELIVERY" ? await generateUniquePublicCode(tx) : null;

      // Unchecked + cast : compatible même si TS/Prisma Client n’est pas régénéré après le schéma
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

      await tx.orderItem.createMany({
        data: items.map((i) => ({
          orderId: newOrder.id,
          menuItemId: i.menuItemId,
          quantity: i.quantity,
          comment: i.comment ?? null,
        })),
      });

      const orderItems = await tx.orderItem.findMany({
        where: { orderId: newOrder.id },
        include: { menuItem: true },
      });

      const sum = orderItems.reduce(
        (s, oi) => s + Number(oi.menuItem.price) * oi.quantity,
        0
      );

      await tx.payment.create({
        data: { orderId: newOrder.id, total: sum, status: "UNPAID" },
      });

      return tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          table: true,
          orderItems: { include: { menuItem: true } },
        },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    if (error?.message === "TABLE_NOT_FOUND") {
      return NextResponse.json({ error: "Table introuvable. Scannez le QR code de votre table." }, { status: 400 });
    }
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: error.message ?? "Internal server error" }, { status: 500 });
  }
}
