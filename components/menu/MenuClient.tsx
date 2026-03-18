"use client";

import { useState, useMemo } from "react";
import { MenuItemCard } from "./MenuItemCard";
import { CartDrawer } from "./CartDrawer";
export type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  comment: string;
};

type Item = {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string };
  image: string | null;
  categoryId: string;
  category: { id: string; name: string };
};

export function MenuClient({ tableId, items }: { tableId: string | null; items: Item[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((i) => map.set(i.category.id, i.category.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!categoryFilter) return items;
    return items.filter((i) => i.categoryId === categoryFilter);
  }, [items, categoryFilter]);

  const addToCart = (item: Item, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item.id ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: Number(item.price),
          quantity,
          comment: "",
        },
      ];
    });
  };

  const updateCartItem = (menuItemId: string, updates: { quantity?: number; comment?: string }) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.menuItemId !== menuItemId) return c;
          const next = { ...c, ...updates };
          return next;
        })
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
  };

  const cartTotal = useMemo(
    () => cart.reduce((sum, c) => sum + c.price * c.quantity, 0),
    [cart]
  );
  const cartCount = useMemo(() => cart.reduce((sum, c) => sum + c.quantity, 0), [cart]);

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-4">
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                categoryFilter === null
                  ? "bg-primary-500 text-white shadow-card"
                  : "border border-dark-200 bg-white text-dark-700 hover:bg-dark-50"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  categoryFilter === cat.id
                    ? "bg-primary-500 text-white shadow-card"
                    : "border border-dark-200 bg-white text-dark-700 hover:bg-dark-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAdd={() => addToCart(item)}
              disabled={!tableId}
            />
          ))}
        </div>
        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 py-8">No items in this category.</p>
        )}
      </div>

      {tableId && (
        <>
          <button
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 left-4 right-4 mx-auto flex max-w-4xl items-center justify-center gap-2 rounded-2xl bg-primary-500 py-4 font-semibold text-white shadow-elevated transition hover:bg-primary-600"
          >
            Cart ({cartCount}) — {cartTotal.toFixed(2)} DA
          </button>
          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            cart={cart}
            onUpdate={updateCartItem}
            onRemove={removeFromCart}
            onSubmit={() => setCartOpen(false)}
            tableId={tableId}
            onOrderPlaced={() => setCart([])}
          />
        </>
      )}
    </>
  );
}
