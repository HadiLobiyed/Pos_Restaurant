"use client";

import { useEffect, useState } from "react";
import { PreparationOrderCard } from "@/components/admin/PreparationOrderCard";

type OrderItem = {
  id: string;
  quantity: number;
  comment: string | null;
  status: string;
  menuItem: { name: string; category: { name: string } };
  supplements?: Array<{ name: string }>;
};

type Order = {
  id: string;
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

export default function PreparationPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-dark-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-dark-900">Préparation</h1>
      <p className="mb-6 text-sm text-dark-500">
        État de chaque article par commande. Quand tout est prêt, validez le service : la commande
        apparaît sur le dashboard pour encaissement.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.length === 0 ? (
          <p className="col-span-full py-16 text-center text-dark-500">
            Aucune commande en cours de préparation.
          </p>
        ) : (
          orders.map((order) => (
            <PreparationOrderCard key={order.id} order={order} onServed={fetchOrders} />
          ))
        )}
      </div>
    </div>
  );
}
