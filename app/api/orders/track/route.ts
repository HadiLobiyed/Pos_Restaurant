import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findActiveUnpaidTableOrder, resolveTableId } from "@/lib/orderSession";
import { loadOrderForModify } from "@/lib/orderModifyAuth";
import { toTrackPayload } from "@/lib/orderTrackPayload";

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const codeRaw = searchParams.get("code");
  const tableIdRaw = searchParams.get("tableId");
  const tableRaw = searchParams.get("table");

  const params = [codeRaw, tableIdRaw, tableRaw].filter(Boolean);
  if (params.length !== 1) {
    return NextResponse.json(
      { error: "Indiquez un code commande ou identifiez votre table (QR)." },
      { status: 400 }
    );
  }

  try {
    if (codeRaw) {
      const normalized = normalizePublicCode(codeRaw);
      const order = await prisma.order.findUnique({
        where: { publicCode: normalized },
        include,
      });
      if (!order) {
        return NextResponse.json(
          { error: "Commande introuvable. Vérifiez le code reçu après validation." },
          { status: 404 }
        );
      }
      return NextResponse.json(toTrackPayload(order));
    }

    const tableKey = (tableIdRaw ?? tableRaw ?? "").trim();
    const resolvedId = await resolveTableId(prisma, tableKey);
    if (!resolvedId) {
      return NextResponse.json({ error: "Table introuvable. Scannez le QR code de votre table." }, { status: 404 });
    }

    const order = await findActiveUnpaidTableOrder(prisma, resolvedId);
    if (!order) {
      return NextResponse.json(
        { error: "Aucune commande active pour cette table. Passez commande via le menu." },
        { status: 404 }
      );
    }

    return NextResponse.json(toTrackPayload(order));
  } catch (error) {
    console.error("GET /api/orders/track error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
