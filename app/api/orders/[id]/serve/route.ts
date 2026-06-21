import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { orderItems: true, payment: true },
  });

  if (!order) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  if (order.servedAt) {
    return NextResponse.json({ error: "Commande déjà servie" }, { status: 400 });
  }

  const allDone = order.orderItems.every((oi) => oi.status === "DONE");
  if (!allDone) {
    return NextResponse.json(
      { error: "Tous les articles doivent être terminés en cuisine." },
      { status: 400 }
    );
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { servedAt: new Date() },
    include: {
      table: true,
      orderItems: { include: { menuItem: { include: { category: true } } } },
      payment: true,
    },
  });

  revalidatePath("/admin/dashboard");

  return NextResponse.json(updated);
}
