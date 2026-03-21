"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PosMenuGrid } from "@/components/admin/pos/PosMenuGrid";
import { PosOrderSidebar } from "@/components/admin/pos/PosOrderSidebar";

export type PosCartItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  comment?: string;
};

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string };
  image: string | null;
  categoryId: string;
  stock: number | null;
  category: { id: string; name: string };
};

type Table = { id: string; number: number; reserved: boolean };

export default function PosPage() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("order");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [orderType, setOrderType] = useState<"DINE_IN" | "TAKEAWAY" | "DELIVERY">("DINE_IN");
  const [tableId, setTableId] = useState<string | null>(null);
  const [pax, setPax] = useState(1);
  const [orderNumber, setOrderNumber] = useState(() => Math.floor(Math.random() * 900) + 100);
  const [loadedOrderId, setLoadedOrderId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/menu")
        .then(async (r) => {
          if (!r.ok) return [];
          const data = await r.json();
          return Array.isArray(data) ? data : [];
        })
        .then(setMenuItems)
        .catch(() => setMenuItems([])),
      fetch("/api/tables")
        .then(async (r) => {
          if (!r.ok) return [];
          const data = await r.json();
          return Array.isArray(data) ? data : [];
        })
        .then(setTables)
        .catch(() => setTables([])),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!orderIdFromUrl) return;
    fetch(`/api/orders/${orderIdFromUrl}`)
      .then((r) => r.json())
      .then((order) => {
        if (!order?.id) return;
        setLoadedOrderId(order.id);
        setTableId(order.tableId ?? null);
        if (order.channel === "TAKEAWAY" || order.channel === "DELIVERY") {
          setOrderType(order.channel);
        }
        setCart(
          order.orderItems?.map((oi: { menuItemId: string; menuItem: { name: string; price: { toString(): string } }; quantity: number; comment: string | null }) => ({
            menuItemId: oi.menuItemId,
            name: oi.menuItem.name,
            price: Number(oi.menuItem.price),
            quantity: oi.quantity,
            comment: oi.comment ?? undefined,
          })) ?? []
        );
      })
      .catch(() => {});
  }, [orderIdFromUrl]);

  const categories = useMemo(() => {
    if (!Array.isArray(menuItems)) return [];
    const map = new Map<string, string>();
    menuItems.forEach((i) => map.set(i.category.id, i.category.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [menuItems]);

  const addToCart = (item: MenuItem, qty = 1) => {
    const price = Number(item.price);
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item.id ? { ...c, quantity: c.quantity + qty } : c
        );
      }
      return [...prev, { menuItemId: item.id, name: item.name, price, quantity: qty }];
    });
  };

  const updateCartItem = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.menuItemId === menuItemId ? { ...c, quantity } : c))
    );
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
  };

  const resetOrder = () => {
    setCart([]);
    setOrderNumber(Math.floor(Math.random() * 900) + 100);
    setPax(1);
    setLoadedOrderId(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-100">
        <p className="text-dark-500">Chargement du POS...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-dark-100">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-dark-200 bg-white px-6 py-4 shadow-card">
        <h1 className="text-xl font-bold text-dark-900">Point de vente</h1>
      </header>
      <div className="flex min-h-0 flex-1">
        <div className="flex-1 overflow-auto p-6">
          <PosMenuGrid
            items={menuItems}
            categories={categories}
            onAddToCart={addToCart}
          />
        </div>
        <div className="flex w-[400px] flex-shrink-0 flex-col border-l border-dark-200 bg-white shadow-elevated">
          <PosOrderSidebar
            cart={cart}
            tables={tables}
            orderType={orderType}
            setOrderType={setOrderType}
            tableId={tableId}
            setTableId={setTableId}
            pax={pax}
            setPax={setPax}
            orderNumber={orderNumber}
            onUpdateQuantity={updateCartItem}
            onRemoveItem={removeFromCart}
            onReset={resetOrder}
            loadedOrderId={loadedOrderId}
          />
        </div>
      </div>
    </div>
  );
}
