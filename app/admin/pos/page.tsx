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
  availableSupplements: SupplementChoice[];
  selectedSupplements: SupplementChoice[];
};

export type SupplementChoice = { id?: string; name: string; price: number };

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string };
  image: string | null;
  categoryId: string;
  stock: number | null;
  category: { id: string; name: string };
  supplements?: Array<{ id: string; name: string; price: { toString(): string } }>;
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
  const [orderPublicCode, setOrderPublicCode] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  /** Panier figé après envoi (ticket / impression avec code + client alors que le panier est vidé) */
  const [lastTicketSnapshot, setLastTicketSnapshot] = useState<PosCartItem[] | null>(null);

  const ticketCart = cart.length > 0 ? cart : lastTicketSnapshot ?? [];

  const [supplementPicker, setSupplementPicker] = useState<MenuItem | null>(null);
  const [tempSelectedSupplementIds, setTempSelectedSupplementIds] = useState<string[]>([]);

  const handleAfterOrderCreated = (order: { publicCode?: string | null }) => {
    if (cart.length > 0) setLastTicketSnapshot([...cart]);
    setCart([]);
    setLoadedOrderId(null);
    setOrderNumber(Math.floor(Math.random() * 900) + 100);
    setPax(1);
    if (order?.publicCode != null && String(order.publicCode).length > 0) {
      setOrderPublicCode(String(order.publicCode));
    }
  };

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
        setOrderPublicCode(typeof order.publicCode === "string" ? order.publicCode : null);
        setCustomerName(order.customerName ?? "");
        setCustomerPhone(order.customerPhone ?? "");
        setCustomerAddress(order.customerAddress ?? "");
        if (order.channel === "TAKEAWAY" || order.channel === "DELIVERY") {
          setOrderType(order.channel);
        }
        setCart(
          order.orderItems?.map(
            (oi: {
              menuItemId: string;
              menuItem: { name: string; price: { toString(): string } };
              quantity: number;
              comment: string | null;
              supplements?: any;
            }) => {
              const selectedSupplements: SupplementChoice[] = Array.isArray(oi.supplements)
                ? oi.supplements.map((s: any) => ({
                    name: String(s.name ?? ""),
                    price: Number(s.price ?? 0),
                  }))
                : [];
              return {
                menuItemId: oi.menuItemId,
                name: oi.menuItem.name,
                price: Number(oi.menuItem.price),
                quantity: oi.quantity,
                comment: oi.comment ?? undefined,
                availableSupplements: [],
                selectedSupplements,
              };
            }
          ) ?? []
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
    const supplements = Array.isArray(item.supplements) ? item.supplements : [];
    const hasSupps = supplements.length > 0;

    const supplementOptions: SupplementChoice[] = supplements.map((s) => ({
      id: s.id,
      name: s.name,
      price: Number(s.price),
    }));

    if (hasSupps) {
      const existing = cart.find((c) => c.menuItemId === item.id);
      const chosen = existing?.selectedSupplements ?? [];
      const tempIds = supplementOptions
        .filter((opt) => chosen.some((ch) => (ch.id && opt.id && ch.id === opt.id) || ch.name === opt.name))
        .map((opt) => opt.id ?? opt.name);
      setTempSelectedSupplementIds(tempIds);
      setSupplementPicker(item);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item.id
            ? { ...c, quantity: c.quantity + qty, selectedSupplements: [], availableSupplements: [] }
            : c
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: qty,
          availableSupplements: [],
          selectedSupplements: [],
        },
      ];
    });
  };

  function confirmAddWithSupplements(item: MenuItem, chosen: SupplementChoice[], qty = 1) {
    const supplementOptions: SupplementChoice[] = Array.isArray(item.supplements)
      ? item.supplements.map((s) => ({ id: s.id, name: s.name, price: Number(s.price) }))
      : [];
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item.id
            ? { ...c, quantity: c.quantity + qty, availableSupplements: supplementOptions, selectedSupplements: chosen }
            : c
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: qty,
          availableSupplements: supplementOptions,
          selectedSupplements: chosen,
        },
      ];
    });
  }

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
    setOrderPublicCode(null);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setLastTicketSnapshot(null);
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
            ticketCart={ticketCart}
            tables={tables}
            orderType={orderType}
            setOrderType={setOrderType}
            tableId={tableId}
            setTableId={setTableId}
            pax={pax}
            setPax={setPax}
            orderNumber={orderNumber}
            orderPublicCode={orderPublicCode}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            customerAddress={customerAddress}
            setCustomerAddress={setCustomerAddress}
            onUpdateQuantity={updateCartItem}
            onRemoveItem={removeFromCart}
            onReset={resetOrder}
            onAfterOrderCreated={handleAfterOrderCreated}
            loadedOrderId={loadedOrderId}
          />
        </div>
      </div>

      {supplementPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-elevated">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-dark-900">Suppléments</h3>
                <p className="mt-1 text-sm text-dark-600">
                  {supplementPicker.name} — choisissez les suppléments
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSupplementPicker(null)}
                className="rounded-lg px-2 py-1 text-sm text-dark-600 hover:bg-dark-50"
              >
                Fermer
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {Array.isArray(supplementPicker.supplements) && supplementPicker.supplements.length > 0 ? (
                supplementPicker.supplements.map((s) => {
                  const key = s.id ?? s.name;
                  const checked = tempSelectedSupplementIds.includes(key);
                  return (
                    <label key={key} className="flex items-center justify-between gap-3 text-sm text-dark-700">
                      <span className="min-w-0 truncate">{s.name}</span>
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-dark-500">+ {Number(s.price).toFixed(2)} DA</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const isOn = e.target.checked;
                            setTempSelectedSupplementIds((prev) =>
                              isOn ? Array.from(new Set([...prev, key])) : prev.filter((x) => x !== key)
                            );
                          }}
                        />
                      </span>
                    </label>
                  );
                })
              ) : (
                <p className="text-sm text-dark-500">Aucun supplément.</p>
              )}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const chosen: SupplementChoice[] = Array.isArray(supplementPicker.supplements)
                    ? supplementPicker.supplements
                        .filter((s) => tempSelectedSupplementIds.includes(s.id ?? s.name))
                        .map((s) => ({ id: s.id, name: s.name, price: Number(s.price) }))
                    : [];
                  confirmAddWithSupplements(supplementPicker, chosen, 1);
                  setSupplementPicker(null);
                }}
                className="btn-primary flex-1"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => {
                  setSupplementPicker(null);
                  setTempSelectedSupplementIds([]);
                }}
                className="flex-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-dark-600 transition hover:bg-dark-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
