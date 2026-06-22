import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { recordStockPurchase } from "@/lib/stockPurchase";

const patchSchema = z.object({
  delta: z.coerce.number().int().optional(),
  quantity: z.coerce.number().int().min(0).optional(),
  name: z.string().min(1).optional(),
  unit: z.string().nullable().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  try {
    const current = await prisma.stockIngredient.findUnique({ where: { id: params.id } });
    if (!current) return NextResponse.json({ error: "Ingrédient introuvable." }, { status: 404 });

    let nextQty = current.quantity;
    if (parsed.data.quantity != null) {
      nextQty = parsed.data.quantity;
    } else if (parsed.data.delta != null) {
      nextQty = Math.max(0, current.quantity + parsed.data.delta);
    }

    const addedQty = nextQty - current.quantity;

    const row = await prisma.$transaction(async (tx) => {
      if (addedQty > 0) {
        const unitPrice = Number(current.unitPrice ?? 0);
        if (unitPrice > 0) {
          await recordStockPurchase(tx, {
            type: "ingredient",
            itemId: current.id,
            itemName: current.name,
            quantity: addedQty,
            unitPrice,
          });
        }
      }
      return tx.stockIngredient.update({
        where: { id: params.id },
        data: {
          quantity: nextQty,
          ...(parsed.data.name != null ? { name: parsed.data.name.trim() } : {}),
          ...(parsed.data.unit !== undefined ? { unit: parsed.data.unit?.trim() || null } : {}),
        },
      });
    });
    return NextResponse.json(row);
  } catch (e) {
    console.error("PATCH /api/admin/stock/ingredients/[id]", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.stockIngredient.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/admin/stock/ingredients/[id]", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
