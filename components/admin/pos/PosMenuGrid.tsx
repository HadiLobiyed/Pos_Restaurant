"use client";

import { useState, useMemo } from "react";

type Category = { id: string; name: string };
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

export function PosMenuGrid({
  items,
  categories,
  onAddToCart,
}: {
  items: MenuItem[];
  categories: Category[];
  onAddToCart: (item: MenuItem, qty?: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  const filtered = useMemo(() => {
    let list = Array.isArray(items) ? items : [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description?.toLowerCase().includes(q) ?? false)
      );
    }
    if (categoryId) {
      list = list.filter((i) => i.categoryId === categoryId);
    }
    return list;
  }, [items, search, categoryId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative max-w-md flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un article..."
            className="input-field w-full pl-10"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">Toutes les catégories</option>
          {(Array.isArray(categories) ? categories : []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((item) => {
          const price = Number(item.price);
          const inStock = item.stock === null || item.stock > 0;
          const lowStock = item.stock !== null && item.stock > 0 && item.stock <= 5;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onAddToCart(item)}
              disabled={!inStock}
              className="card group overflow-hidden text-left transition disabled:cursor-not-allowed disabled:opacity-60 hover:shadow-elevated"
            >
              <div className="relative aspect-square bg-dark-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl text-dark-300">
                    •
                  </div>
                )}
                {item.stock !== null && (
                  <span
                    className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                      lowStock ? "bg-amber-500" : "bg-green-500"
                    }`}
                    title={item.stock <= 0 ? "Rupture" : `Stock: ${item.stock}`}
                  />
                )}
                {item.stock !== null && item.stock <= 0 && (
                  <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-medium">
                    Rupture
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <p className="truncate text-sm font-medium text-dark-800">{item.name}</p>
                <p className="text-primary-600 font-semibold mt-0.5">
                  {price.toFixed(2)} DA
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-dark-500">
        {filtered.length === items.length
          ? "Tous les articles affichés."
          : `${filtered.length} article(s) affiché(s).`}
      </p>
    </div>
  );
}
