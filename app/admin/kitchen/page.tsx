"use client";

import { useEffect, useMemo, useState } from "react";
import { KitchenOrderCard } from "@/components/admin/KitchenOrderCard";
import { KitchenPreparationCard } from "@/components/admin/KitchenPreparationCard";
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

type KitchenTab = KitchenStation | "preparation";

const POLL_INTERVAL_MS = 10000;

function itemsForStation(order: Order, station: KitchenStation): OrderItem[] {
  return order.orderItems.filter(
    (oi) => getKitchenStation(oi.menuItem.category.name) === station
  );
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<KitchenTab>("pizzeria");

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

  const preparationOrders = orders;

  const displayOrders = activeTab === "preparation" ? null : ordersByStation[activeTab];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-dark-500">Chargement...</p>
      </div>
    );
  }

  const tabs: { id: KitchenTab; label: string; count?: number }[] = [
    ...KITCHEN_STATIONS.map((s) => ({
      id: s as KitchenTab,
      label: KITCHEN_STATION_LABELS[s],
      count: ordersByStation[s].length,
    })),
    {
      id: "preparation",
      label: "Préparation",
      count: preparationOrders.length,
    },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-dark-900">Écran cuisine</h1>
      <p className="mb-6 text-sm text-dark-500">
        Imprimer passe la commande en cours. Quand tout est prêt, onglet Préparation → « Servie »
        envoie la commande au dashboard pour encaissement.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-primary-500 text-white"
                : "bg-white text-dark-600 shadow-card hover:bg-dark-50"
            }`}
          >
            {tab.label}
            {tab.count != null && tab.count > 0 && (
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "preparation" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {preparationOrders.length === 0 ? (
            <p className="col-span-full py-16 text-center text-dark-500">
              Aucune commande en cours de préparation.
            </p>
          ) : (
            preparationOrders.map((order) => (
              <KitchenPreparationCard key={order.id} order={order} onServed={fetchOrders} />
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayOrders!.length === 0 ? (
            <p className="col-span-full py-16 text-center text-dark-500">
              Aucune commande en attente au {KITCHEN_STATION_LABELS[activeTab].toLowerCase()}.
            </p>
          ) : (
            displayOrders!.map(({ order, items }) => (
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
      )}
    </div>
  );
}
