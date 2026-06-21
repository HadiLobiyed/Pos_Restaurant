"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  STATION_STATUS_LABELS,
  allOrderItemsDone,
} from "@/lib/kitchenStations";

type OrderItemType = {
  id: string;
  quantity: number;
  status: string;
  comment: string | null;
  menuItem: { name: string; category: { name: string } };
  supplements?: Array<{ name: string }>;
};

type OrderType = {
  id: string;
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

function itemStatusLabel(status: string): string {
  if (status === "DONE") return STATION_STATUS_LABELS.DONE;
  if (status === "IN_PROGRESS") return STATION_STATUS_LABELS.IN_PROGRESS;
  return STATION_STATUS_LABELS.PENDING;
}

function itemStatusClass(status: string): string {
  if (status === "DONE") return "bg-primary-100 text-primary-800";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-800";
  return "bg-dark-100 text-dark-700";
}

export function PreparationOrderCard({
  order,
  onServed,
  onStatusUpdated,
}: {
  order: OrderType;
  onServed: () => void;
  onStatusUpdated: () => void;
}) {
  const [serving, setServing] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const readyToServe = allOrderItemsDone(order.orderItems);

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

  async function handleServe() {
    setServing(true);
    setError(null);
    const res = await fetch(`/api/orders/${order.id}/serve`, { method: "PATCH" });
    setServing(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Erreur");
      return;
    }
    onServed();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-dark-200 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-dark-100 bg-dark-50/50 p-4">
        <div>
          <p className="text-lg font-bold text-dark-900">{kitchenOrderHeadline(order)}</p>
          <p className="text-xs text-dark-500">{format(new Date(order.createdAt), "HH:mm:ss")}</p>
        </div>
        {readyToServe ? (
          <span className="rounded-lg bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-800">
            Prête à servir
          </span>
        ) : (
          <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
            En préparation
          </span>
        )}
      </div>

      <ul className="divide-y divide-dark-100 p-4">
        {order.orderItems.map((oi) => {
          const isUpdating = updating === oi.id;
          return (
            <li key={oi.id} className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-dark-900">
                  {oi.menuItem.name}
                  <span className="ml-1 font-normal text-dark-600">×{oi.quantity}</span>
                </p>
                {oi.comment && (
                  <p className="mt-0.5 text-xs text-amber-800">Note : {oi.comment}</p>
                )}
                {Array.isArray(oi.supplements) && oi.supplements.length > 0 && (
                  <p className="mt-0.5 text-xs text-dark-500">
                    + {oi.supplements.map((s) => s.name).join(", ")}
                  </p>
                )}
                <span
                  className={`mt-1.5 inline-block rounded-lg px-2 py-0.5 text-[10px] font-medium ${itemStatusClass(oi.status)}`}
                >
                  {itemStatusLabel(oi.status)}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setItemStatus(oi.id, "PENDING")}
                  disabled={isUpdating || oi.status === "PENDING"}
                  className="rounded px-2 py-1 text-xs font-medium transition disabled:opacity-50"
                  title="En attente"
                >
                  ◯
                </button>
                <button
                  type="button"
                  onClick={() => setItemStatus(oi.id, "IN_PROGRESS")}
                  disabled={isUpdating || oi.status === "IN_PROGRESS"}
                  className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 transition hover:bg-amber-200 disabled:opacity-50"
                  title="En cours"
                >
                  ⏳
                </button>
                <button
                  type="button"
                  onClick={() => setItemStatus(oi.id, "DONE")}
                  disabled={isUpdating || oi.status === "DONE"}
                  className="rounded bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800 transition hover:bg-primary-200 disabled:opacity-50"
                  title="Terminer"
                >
                  ✓
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-dark-100 p-4">
        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={() => void handleServe()}
          disabled={!readyToServe || serving}
          className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {serving ? "Validation en cours…" : "Valider le service"}
        </button>
        {!readyToServe ? (
          <p className="mt-2 text-center text-xs text-dark-500">
            Tous les articles doivent être prêts avant validation.
          </p>
        ) : (
          <p className="mt-2 text-center text-xs text-dark-500">
            La commande sera disponible à l&apos;encaissement sur le dashboard.
          </p>
        )}
      </div>
    </div>
  );
}
