"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  KITCHEN_STATIONS,
  KITCHEN_STATION_LABELS,
  STATION_STATUS_LABELS,
  getStationAggregateStatus,
  allOrderItemsDone,
  type KitchenStation,
  type StationItemStatus,
} from "@/lib/kitchenStations";

type OrderItemType = {
  id: string;
  quantity: number;
  status: string;
  menuItem: { name: string; category: { name: string } };
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

function statusChipClass(status: StationItemStatus): string {
  if (status === "DONE") return "bg-primary-100 text-primary-800";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-800";
  return "bg-dark-100 text-dark-700";
}

export function KitchenPreparationCard({
  order,
  onServed,
}: {
  order: OrderType;
  onServed: () => void;
}) {
  const [serving, setServing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stationsWithItems = KITCHEN_STATIONS.map((station) => ({
    station,
    status: getStationAggregateStatus(order.orderItems, station),
  })).filter((s): s is { station: KitchenStation; status: StationItemStatus } => s.status != null);

  const readyToServe = allOrderItemsDone(order.orderItems);

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

      <div className="space-y-2 p-4">
        {stationsWithItems.map(({ station, status }) => (
          <div
            key={station}
            className="flex items-center justify-between rounded-lg border border-dark-100 px-3 py-2"
          >
            <span className="text-sm font-medium text-dark-800">
              {KITCHEN_STATION_LABELS[station]}
            </span>
            <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${statusChipClass(status)}`}>
              {STATION_STATUS_LABELS[status]}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-dark-100 p-4">
        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={() => void handleServe()}
          disabled={!readyToServe || serving}
          className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {serving ? "Envoi..." : "Servie → encaissement"}
        </button>
        {!readyToServe && (
          <p className="mt-2 text-center text-xs text-dark-500">
            Disponible quand tous les postes sont terminés.
          </p>
        )}
      </div>
    </div>
  );
}
