"use client";

import { useState } from "react";
import { format } from "date-fns";

type OrderItemType = {
  id: string;
  quantity: number;
  comment: string | null;
  status: string;
  menuItem: { name: string; category: { name: string } };
};

type OrderType = {
  id: string;
  status: string;
  createdAt: string;
  channel: string;
  publicCode: string | null;
  customerName: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  table: { number: number } | null;
  orderItems: OrderItemType[];
};

function kitchenOrderHeadline(order: OrderType): string {
  if (order.publicCode) return order.publicCode;
  if (order.channel === "TAKEAWAY") return "À emporter";
  if (order.channel === "DELIVERY") return "Livraison";
  if (order.table) return `Table ${order.table.number}`;
  return "Commande";
}

export function KitchenOrderCard({
  order,
  items,
  tab,
  onStatusUpdated,
}: {
  order: OrderType;
  items: OrderItemType[];
  tab: "pizzeria" | "restaurant";
  onStatusUpdated: () => void;
}) {
  const [updating, setUpdating] = useState<string | null>(null);

  const allItemsDone = items.every((oi) => oi.status === "DONE");
  const anyInProgress = items.some((oi) => oi.status === "IN_PROGRESS");
  const displayStatus = allItemsDone ? "DONE" : anyInProgress ? "IN_PROGRESS" : "PENDING";

  const statusColor =
    displayStatus === "DONE"
      ? "bg-primary-100 text-primary-800"
      : displayStatus === "IN_PROGRESS"
        ? "bg-amber-100 text-amber-800"
        : "bg-dark-100 text-dark-700";

  async function setItemStatus(orderItemId: string, status: "PENDING" | "IN_PROGRESS" | "DONE") {
    setUpdating(orderItemId);
    const res = await fetch(`/api/orders/items/${orderItemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(null);
    if (res.ok) onStatusUpdated();
  }

  const cardSurface =
    displayStatus === "PENDING"
      ? "border-dark-200 bg-white"
      : displayStatus === "IN_PROGRESS"
        ? "border-amber-200/70 bg-gradient-to-br from-stone-50 via-amber-50/45 to-yellow-50/90"
        : "border-dark-200 bg-white";

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-card p-0 ${cardSurface}`}>
      <div className="flex items-center justify-between border-b border-dark-100 bg-dark-50/50 p-4">
        <span className="text-lg font-bold text-dark-900">{kitchenOrderHeadline(order)}</span>
        <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${statusColor}`}>
          {displayStatus === "PENDING" ? "En attente" : displayStatus === "IN_PROGRESS" ? "En cours" : "Terminé"}
        </span>
      </div>
      <div className="space-y-1 p-4 text-sm text-dark-600">
        <p>{format(new Date(order.createdAt), "HH:mm:ss")}</p>
        {order.channel === "DELIVERY" && (order.customerName || order.customerPhone || order.customerAddress) && (
          <div className="rounded-lg border border-dark-100 bg-dark-50/80 p-2 text-xs leading-relaxed text-dark-700">
            {order.customerName && <p className="font-medium">{order.customerName}</p>}
            {order.customerPhone && <p>{order.customerPhone}</p>}
            {order.customerAddress && <p className="text-dark-600">{order.customerAddress}</p>}
          </div>
        )}
      </div>
      <ul className="space-y-3 px-4 pb-4">
        {items.map((oi) => {
          const isUpdating = updating === oi.id;
          return (
            <li key={oi.id} className="flex items-center justify-between gap-2 rounded-lg border border-dark-100 p-3">
              <div>
                <span className="text-sm font-medium">
                  {oi.menuItem.name} x{oi.quantity}
                </span>
                {oi.comment && (
                  <span className="mt-0.5 block text-xs text-amber-700">Note : {oi.comment}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setItemStatus(oi.id, "PENDING")}
                  disabled={isUpdating || oi.status === "PENDING"}
                  className="rounded px-2 py-1 text-xs font-medium transition disabled:opacity-50"
                  title="En attente"
                >
                  ◯
                </button>
                <button
                  onClick={() => setItemStatus(oi.id, "IN_PROGRESS")}
                  disabled={isUpdating || oi.status === "IN_PROGRESS"}
                  className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 transition hover:bg-amber-200 disabled:opacity-50"
                  title="En cours"
                >
                  ⏳
                </button>
                <button
                  onClick={() => setItemStatus(oi.id, "DONE")}
                  disabled={isUpdating || oi.status === "DONE"}
                  className="rounded bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800 transition hover:bg-primary-200 disabled:opacity-50"
                  title="Terminé"
                >
                  ✓
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-dark-100 p-3">
        <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-medium ${displayStatus === "DONE" ? "bg-primary-100 text-primary-800" : "text-dark-500"}`}>
          {tab === "pizzeria" ? "Pizzeria" : "Restaurant"} : {displayStatus === "DONE" ? "Terminé" : displayStatus === "IN_PROGRESS" ? "En cours" : "En attente"}
        </span>
      </div>
    </div>
  );
}
