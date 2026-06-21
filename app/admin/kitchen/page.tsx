"use client";

import { useEffect, useMemo, useState } from "react";
import { KitchenOrderCard } from "@/components/admin/KitchenOrderCard";
import {
  getKitchenStation,
  KITCHEN_STATION_LABELS,
  KITCHEN_STATIONS,
  type KitchenStation,
} from "@/lib/kitchenStations";

type OrderItem = {
  id: string;
  quantity: number;
  comment: string | null;
  status: string;
  menuItem: { name: string; category: { name: string } };
  supplements?: Array<{ id?: string; name: string; price?: number }>;
};

type Order = {
  id: string;
  status: string;
  servedAt: string | null;
  createdAt: string;
  channel: string;
  publicCode: string | null;
  customerName: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  table: { number: number } | null;
  orderItems: OrderItem[];
};

const POLL_INTERVAL_MS = 10000;

function itemsForStation(order: Order, station: KitchenStation): OrderItem[] {
  return order.orderItems.filter(
    (oi) => getKitchenStation(oi.menuItem.category.name) === station
  );
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<KitchenStation>("pizzeria");

  async function fetchOrders() {
    const res = await fetch("/api/orders/kitchen");
    if (res.ok) setOrders(await res.json());
  }

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(fetchOrders, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  const ordersByStation = useMemo(() => {
    const result: Record<KitchenStation, { order: Order; items: OrderItem[] }[]> = {
      pizzeria: [],
      restaurant: [],
      bar: [],
    };

    for (const order of orders) {
      for (const station of KITCHEN_STATIONS) {
        const stationItems = itemsForStation(order, station);
        if (stationItems.length === 0) continue;
        const allDone = stationItems.every((oi) => oi.status === "DONE");
        if (!allDone) result[station].push({ order, items: stationItems });
      }
    }

    return result;
  }, [orders]);

  const displayOrders = ordersByStation[activeTab];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-dark-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-dark-900">Écran cuisine</h1>
      <p className="mb-6 text-sm text-dark-500">
        Pizza, plats et boissons par poste. Imprimer passe la commande en cours. Suivi global et
        envoi à la caisse dans l’onglet <strong>Préparation</strong>.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {KITCHEN_STATIONS.map((station) => (
          <button
            key={station}
            type="button"
            onClick={() => setActiveTab(station)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === station
                ? "bg-primary-500 text-white"
                : "bg-white text-dark-600 shadow-card hover:bg-dark-50"
            }`}
          >
            {KITCHEN_STATION_LABELS[station]}
            {ordersByStation[station].length > 0 && (
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {ordersByStation[station].length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayOrders.length === 0 ? (
          <p className="col-span-full py-16 text-center text-dark-500">
            Aucune commande en attente au {KITCHEN_STATION_LABELS[activeTab].toLowerCase()}.
          </p>
        ) : (
          displayOrders.map(({ order, items }) => (
            <KitchenOrderCard
              key={`${order.id}-${activeTab}`}
              order={order}
              items={items}
              tab={activeTab}
              onStatusUpdated={fetchOrders}
            />
          ))
        )}
      </div>
    </div>
  );
}
