import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const include = {
  table: true,
  orderItems: { include: { menuItem: true } },
  payment: true,
} as const;

function normalizePublicCode(raw: string): string {
  const s = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (/^CMD-\d{6}$/.test(s)) return s;
  if (/^\d{6}$/.test(s)) return `CMD-${s}`;
  return s;
}

function toTrackPayload(order: {
  id: string;
  status: string;
  channel: string;
  publicCode: string | null;
  createdAt: Date;
  table: { number: number } | null;
  orderItems: Array<{
    quantity: number;
    comment: string | null;
    status: string;
    menuItem: { name: string; price: unknown };
  }>;
  payment: { status: string } | null;
}) {
  const items = order.orderItems.map((oi) => ({
    name: oi.menuItem.name,
    quantity: oi.quantity,
    comment: oi.comment,
    status: oi.status,
    unitPrice: Number(oi.menuItem.price),
  }));
  const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  return {
    id: order.id,
    status: order.status,
    channel: order.channel,
    publicCode: order.publicCode,
    tableNumber: order.table?.number ?? null,
    createdAt: order.createdAt.toISOString(),
    paymentStatus: order.payment?.status ?? null,
    items,
    total,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const codeRaw = searchParams.get("code");
  const tableRaw = searchParams.get("table");

  if (!codeRaw && !tableRaw) {
    return NextResponse.json({ error: "Indiquez un code commande ou un numéro de table." }, { status: 400 });
  }
  if (codeRaw && tableRaw) {
    return NextResponse.json({ error: "Utilisez soit le code, soit la table." }, { status: 400 });
  }

  try {
    if (codeRaw) {
      const normalized = normalizePublicCode(codeRaw);
      const order = await prisma.order.findUnique({
        where: { publicCode: normalized },
        include,
      });
      if (!order) {
        return NextResponse.json({ error: "Commande introuvable. Vérifiez le code reçu après validation." }, { status: 404 });
      }
      return NextResponse.json(toTrackPayload(order));
    }

    const num = Number.parseInt(String(tableRaw).trim(), 10);
    if (Number.isNaN(num) || num < 1) {
      return NextResponse.json({ error: "Numéro de table invalide." }, { status: 400 });
    }

    const table = await prisma.table.findUnique({ where: { number: num } });
    if (!table) {
      return NextResponse.json({ error: "Cette table n'existe pas." }, { status: 404 });
    }

    const order = await prisma.order.findFirst({
      where: { tableId: table.id },
      include,
      orderBy: { createdAt: "desc" },
    });

    if (!order) {
      return NextResponse.json({ error: "Aucune commande enregistrée pour cette table." }, { status: 404 });
    }

    return NextResponse.json(toTrackPayload(order));
  } catch (error) {
    console.error("GET /api/orders/track error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
