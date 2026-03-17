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
  table: { number: number };
  orderItems: OrderItemType[];
};

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

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-dark-100 bg-dark-50/50 p-4">
        <span className="text-lg font-bold text-dark-900">Table {order.table.number}</span>
        <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${statusColor}`}>
          {displayStatus === "PENDING" ? "En attente" : displayStatus === "IN_PROGRESS" ? "En cours" : "Terminé"}
        </span>
      </div>
      <div className="p-4 text-sm text-dark-600">
        {format(new Date(order.createdAt), "HH:mm:ss")}
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
