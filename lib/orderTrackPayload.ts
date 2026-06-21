import { sumOrderItemsFromDb, itemIsEditable } from "@/lib/orderSession";

export type TrackItemPayload = {
  id: string;
  name: string;
  quantity: number;
  comment: string | null;
  status: string;
  unitPrice: number;
  lineTotal: number;
  editable: boolean;
};

export type TrackPayload = {
  id: string;
  status: string;
  channel: string;
  publicCode: string | null;
  tableNumber: number | null;
  tableId: string | null;
  createdAt: string;
  paymentStatus: string | null;
  items: TrackItemPayload[];
  total: number;
};

export function toTrackPayload(order: {
  id: string;
  status: string;
  channel: string;
  publicCode: string | null;
  createdAt: Date;
  tableId: string | null;
  table: { number: number } | null;
  orderItems: Array<{
    id: string;
    quantity: number;
    comment: string | null;
    status: string;
    supplements: unknown;
    menuItem: { name: string; price: unknown };
  }>;
  payment: { status: string } | null;
}): TrackPayload {
  const items: TrackItemPayload[] = order.orderItems.map((oi) => {
    const base = Number(oi.menuItem.price);
    let supSum = 0;
    if (Array.isArray(oi.supplements)) {
      supSum = (oi.supplements as Array<{ price?: number }>).reduce(
        (s, sup) => s + Number(sup.price || 0),
        0
      );
    }
    const unitPrice = base + supSum;
    return {
      id: oi.id,
      name: oi.menuItem.name,
      quantity: oi.quantity,
      comment: oi.comment,
      status: oi.status,
      unitPrice,
      lineTotal: unitPrice * oi.quantity,
      editable: itemIsEditable(oi.status),
    };
  });

  const total = sumOrderItemsFromDb(order.orderItems);

  return {
    id: order.id,
    status: order.status,
    channel: order.channel,
    publicCode: order.publicCode,
    tableNumber: order.table?.number ?? null,
    tableId: order.tableId,
    createdAt: order.createdAt.toISOString(),
    paymentStatus: order.payment?.status ?? null,
    items,
    total,
  };
}
