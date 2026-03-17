"use client";

import { useEffect, useMemo, useState } from "react";
import { KitchenOrderCard } from "@/components/admin/KitchenOrderCard";

const PIZZA_CATEGORY = "pizza";

type OrderItem = {
  id: string;
  quantity: number;
  comment: string | null;
  status: string;
  menuItem: { name: string; category: { name: string } };
};

type Order = {
  id: string;
  status: string;
  createdAt: string;
  table: { number: number };
  orderItems: OrderItem[];
};

const POLL_INTERVAL_MS = 10000;

function isPizzaItem(oi: OrderItem): boolean {
  return oi.menuItem.category.name.toLowerCase() === PIZZA_CATEGORY;
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pizzeria" | "restaurant">("pizzeria");

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

  const { pizzeriaOrders, restaurantOrders } = useMemo(() => {
    const pizzeria: { order: Order; items: OrderItem[] }[] = [];
    const restaurant: { order: Order; items: OrderItem[] }[] = [];

    for (const order of orders) {
      const pizzaItems = order.orderItems.filter(isPizzaItem);
      const restaurantItems = order.orderItems.filter((oi) => !isPizzaItem(oi));

      if (pizzaItems.length > 0) {
        const allPizzaDone = pizzaItems.every((oi) => oi.status === "DONE");
        if (!allPizzaDone) pizzeria.push({ order, items: pizzaItems });
      }

      if (restaurantItems.length > 0) {
        const allRestaurantDone = restaurantItems.every((oi) => oi.status === "DONE");
        if (!allRestaurantDone) restaurant.push({ order, items: restaurantItems });
      }
    }

    return { pizzeriaOrders: pizzeria, restaurantOrders: restaurant };
  }, [orders]);

  const displayOrders = activeTab === "pizzeria" ? pizzeriaOrders : restaurantOrders;

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
        Rafraîchissement automatique toutes les 10 secondes. Une commande avec pizza + plat apparaît dans les deux onglets.
      </p>

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("pizzeria")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "pizzeria"
              ? "bg-primary-500 text-white"
              : "bg-white text-dark-600 shadow-card hover:bg-dark-50"
          }`}
        >
          Pizzeria
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("restaurant")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "restaurant"
              ? "bg-primary-500 text-white"
              : "bg-white text-dark-600 shadow-card hover:bg-dark-50"
          }`}
        >
          Restaurant
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayOrders.length === 0 ? (
          <p className="col-span-full py-16 text-center text-dark-500">
            Aucune commande en attente dans {activeTab === "pizzeria" ? "la pizzeria" : "le restaurant"}.
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
