import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const orderItem = await prisma.orderItem.update({
    where: { id },
    data: { status: parsed.data.status },
    include: { order: { include: { orderItems: true } } },
  });

  // Sync Order.status: DONE when all OrderItems are DONE
  const order = orderItem.order;
  const allDone = order.orderItems.every((oi) => oi.status === "DONE");
  const anyInProgress = order.orderItems.some((oi) => oi.status === "IN_PROGRESS");
  const newOrderStatus = allDone ? "DONE" : anyInProgress ? "IN_PROGRESS" : "PENDING";

  await prisma.order.update({
    where: { id: order.id },
    data: { status: newOrderStatus },
  });

  return NextResponse.json(orderItem);
}
