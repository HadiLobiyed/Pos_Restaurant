import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { isBeverageCategory } from "@/lib/beverages";
import { applyStockUpdate } from "@/lib/menuItemStock";
import { recordStockPurchase } from "@/lib/stockPurchase";

const patchSchema = z.object({
  delta: z.coerce.number().int().optional(),
  quantity: z.coerce.number().int().min(0).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }
  if (parsed.data.delta == null && parsed.data.quantity == null) {
    return NextResponse.json({ error: "Indiquez delta ou quantity." }, { status: 400 });
  }

  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: params.id },
      include: { category: true },
    });
    if (!item) return NextResponse.json({ error: "Boisson introuvable." }, { status: 404 });
    if (!isBeverageCategory(item.category.name)) {
      return NextResponse.json({ error: "Cet article n'est pas une boisson." }, { status: 400 });
    }

    const current = item.stock ?? 0;
    const nextQty =
      parsed.data.quantity != null
        ? parsed.data.quantity
        : Math.max(0, current + (parsed.data.delta ?? 0));

    const addedQty = nextQty - current;

    const updated = await prisma.$transaction(async (tx) => {
      if (addedQty > 0) {
        const unitPrice = Number(item.purchasePrice ?? 0);
        if (unitPrice > 0) {
          await recordStockPurchase(tx, {
            type: "beverage",
            itemId: item.id,
            itemName: item.name,
            quantity: addedQty,
            unitPrice,
          });
        }
      }
      return applyStockUpdate(tx, params.id, nextQty);
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /api/admin/stock/beverages/[id]", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
