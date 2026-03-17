import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  tableId: z.string(),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().int().positive(),
      comment: z.string().optional(),
    })
  ),
});

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
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });

    const { tableId, items } = parsed.data;
    if (items.length === 0)
      return NextResponse.json({ error: "At least one item required" }, { status: 400 });

    const order = await prisma.$transaction(async (tx) => {
      let table = await tx.table.findUnique({ where: { id: tableId } });
      // Backward/UX-friendly: allow passing a table number in `tableId`.
      // (ex: old QR codes or manual testing with ?table=12)
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

      const newOrder = await tx.order.create({
        data: { tableId: table.id, status: "PENDING" },
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
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: error.message ?? "Internal server error" }, { status: 500 });
  }
}