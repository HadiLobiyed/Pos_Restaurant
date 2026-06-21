import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { loadOrderForModify } from "@/lib/orderModifyAuth";
import { itemIsEditable, sumOrderItemsFromDb } from "@/lib/orderSession";
import { toTrackPayload } from "@/lib/orderTrackPayload";

const patchSchema = z.object({
  quantity: z.coerce.number().int().min(0).optional(),
  comment: z.string().optional(),
  tableId: z.string().optional(),
  code: z.string().optional(),
});

async function authFromBody(body: { tableId?: string; code?: string }) {
  const sp = new URLSearchParams();
  if (body.code) sp.set("code", body.code);
  if (body.tableId) sp.set("tableId", body.tableId);
  return loadOrderForModify(sp);
}

const orderInclude = {
  table: true,
  orderItems: { include: { menuItem: true } },
  payment: true,
} as const;

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }

    const auth = await authFromBody(parsed.data);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const item = auth.order.orderItems.find((oi) => oi.id === params.id);
    if (!item) {
      return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
    }
    if (!itemIsEditable(item.status)) {
      return NextResponse.json(
        { error: "Cet article est en cours de préparation et ne peut plus être modifié." },
        { status: 403 }
      );
    }

    const { quantity, comment } = parsed.data;

    if (quantity === 0) {
      await prisma.$transaction(async (tx) => {
        await tx.orderItem.delete({ where: { id: params.id } });
        const remaining = await tx.orderItem.findMany({
          where: { orderId: auth.order.id },
          include: { menuItem: true },
        });
        if (remaining.length === 0) {
          throw new Error("EMPTY_ORDER");
        }
        const newTotal = sumOrderItemsFromDb(remaining);
        await tx.payment.update({ where: { orderId: auth.order.id }, data: { total: newTotal } });
      });
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.orderItem.update({
          where: { id: params.id },
          data: {
            ...(quantity != null ? { quantity } : {}),
            ...(comment !== undefined ? { comment: comment || null } : {}),
          },
        });
        const allItems = await tx.orderItem.findMany({
          where: { orderId: auth.order.id },
          include: { menuItem: true },
        });
        const newTotal = sumOrderItemsFromDb(allItems);
        await tx.payment.update({ where: { orderId: auth.order.id }, data: { total: newTotal } });
      });
    }

    const updated = await prisma.order.findUnique({
      where: { id: auth.order.id },
      include: orderInclude,
    });
    return NextResponse.json(toTrackPayload(updated!));
  } catch (e) {
    if (e instanceof Error && e.message === "EMPTY_ORDER") {
      return NextResponse.json(
        { error: "Impossible de supprimer le dernier article. Contactez le personnel si besoin." },
        { status: 400 }
      );
    }
    console.error("PATCH /api/orders/modify/items/[id]", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const sp = new URLSearchParams();
    const bodyCode = searchParams.get("code");
    const bodyTableId = searchParams.get("tableId");
    if (bodyCode) sp.set("code", bodyCode);
    if (bodyTableId) sp.set("tableId", bodyTableId);

    const auth = await loadOrderForModify(sp);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const item = auth.order.orderItems.find((oi) => oi.id === params.id);
    if (!item) {
      return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
    }
    if (!itemIsEditable(item.status)) {
      return NextResponse.json(
        { error: "Cet article est en cours de préparation et ne peut plus être supprimé." },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.orderItem.delete({ where: { id: params.id } });
      const remaining = await tx.orderItem.findMany({
        where: { orderId: auth.order.id },
        include: { menuItem: true },
      });
      if (remaining.length === 0) {
        throw new Error("EMPTY_ORDER");
      }
      const newTotal = sumOrderItemsFromDb(remaining);
      await tx.payment.update({ where: { orderId: auth.order.id }, data: { total: newTotal } });
    });

    const updated = await prisma.order.findUnique({
      where: { id: auth.order.id },
      include: orderInclude,
    });
    return NextResponse.json(toTrackPayload(updated!));
  } catch (e) {
    if (e instanceof Error && e.message === "EMPTY_ORDER") {
      return NextResponse.json({ error: "Impossible de supprimer le dernier article." }, { status: 400 });
    }
    console.error("DELETE /api/orders/modify/items/[id]", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
