import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  orderId: z.string(),
  status: z.enum(["PAID", "UNPAID"]),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  let where: { createdAt?: { gte: Date; lte: Date } } = {};
  if (date) {
    const d = new Date(date);
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    where = { createdAt: { gte: start, lte: end } };
  }
  const payments = await prisma.payment.findMany({
    where,
    include: { order: { include: { table: true, orderItems: { include: { menuItem: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(payments);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const payment = await prisma.$transaction(async (tx) => {
    const p = await tx.payment.update({
      where: { orderId: parsed.data.orderId },
      data: { status: parsed.data.status },
      include: { order: { include: { orderItems: { include: { menuItem: true } } } } },
    });
    if (parsed.data.status === "PAID") {
      await tx.order.update({
        where: { id: parsed.data.orderId },
        data: { status: "DONE" },
      });
      // Décrémenter le stock des articles vendus
      for (const oi of p.order.orderItems) {
        const stock = oi.menuItem.stock;
        if (stock != null) {
          const newStock = Math.max(0, stock - oi.quantity);
          await tx.menuItem.update({
            where: { id: oi.menuItemId },
            data: { stock: newStock },
          });
        }
      }
    }
    return p;
  });
  return NextResponse.json(payment);
}
