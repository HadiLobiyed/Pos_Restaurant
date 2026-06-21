import { prisma } from "@/lib/prisma";
import { findActiveUnpaidTableOrder, resolveTableId } from "@/lib/orderSession";

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

/** Authentification légère pour suivi / modification publique */
export async function loadOrderForModify(searchParams: URLSearchParams) {
  const codeRaw = searchParams.get("code");
  const tableIdRaw = searchParams.get("tableId");
  const tableRaw = searchParams.get("table");

  if (codeRaw && (tableIdRaw || tableRaw)) {
    return { error: "Utilisez soit le code, soit la table.", status: 400 as const };
  }
  if (!codeRaw && !tableIdRaw && !tableRaw) {
    return { error: "Scannez le QR de table ou indiquez le code commande.", status: 400 as const };
  }

  if (codeRaw) {
    const normalized = normalizePublicCode(codeRaw);
    const order = await prisma.order.findUnique({ where: { publicCode: normalized }, include });
    if (!order) return { error: "Commande introuvable.", status: 404 as const };
    if (order.payment?.status === "PAID") {
      return { error: "Commande déjà payée — modification impossible.", status: 403 as const };
    }
    return { order };
  }

  const tableKey = (tableIdRaw ?? tableRaw ?? "").trim();
  const resolvedId = await resolveTableId(prisma, tableKey);
  if (!resolvedId) return { error: "Table introuvable. Scannez le QR code de votre table.", status: 404 as const };

  const order = await findActiveUnpaidTableOrder(prisma, resolvedId);
  if (!order) {
    return {
      error: "Aucune commande active pour cette table. Passez commande via le menu.",
      status: 404 as const,
    };
  }
  return { order };
}
