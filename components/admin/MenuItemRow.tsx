"use client";

import { useState } from "react";

type MenuItem = {
  id: string;
  name: string;
  price: { toString(): string };
  visible: boolean;
  stock: number | null;
  barcode: string | null;
  category: { name: string };
};

export function MenuItemRow({
  item,
  onEdit,
  onUpdated,
  onDeleted,
}: {
  item: MenuItem;
  onEdit: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stockEditing, setStockEditing] = useState(false);
  const [stockValue, setStockValue] = useState(String(item.stock ?? ""));

  async function toggleVisible() {
    setToggling(true);
    const res = await fetch(`/api/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !item.visible }),
    });
    setToggling(false);
    if (res.ok) onUpdated();
  }

  async function saveStock() {
    const num = stockValue === "" ? null : parseInt(stockValue, 10);
    if (num !== null && (Number.isNaN(num) || num < 0)) return;
    const res = await fetch(`/api/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: num }),
    });
    setStockEditing(false);
    if (res.ok) onUpdated();
  }

  async function deleteItem() {
    if (!confirm("Supprimer cet article ?")) return;
    setDeleting(true);
    const res = await fetch(`/api/menu/${item.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) onDeleted();
  }

  return (
    <tr className="transition hover:bg-dark-50/50">
      <td className="px-4 py-3 text-sm font-medium text-dark-800">{item.name}</td>
      <td className="px-4 py-3 text-sm text-dark-600">{item.category.name}</td>
      <td className="px-4 py-3 font-mono text-sm text-dark-600">
        {item.barcode || "—"}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-dark-700">{Number(item.price).toFixed(2)} DA</td>
      <td className="px-4 py-3">
        {stockEditing ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              onBlur={saveStock}
              onKeyDown={(e) => e.key === "Enter" && saveStock()}
              className="input-field w-20 py-1 text-sm"
              autoFocus
            />
            <button
              type="button"
              onClick={saveStock}
              className="text-xs text-primary-600 font-medium"
            >
              OK
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setStockValue(item.stock != null ? String(item.stock) : "");
              setStockEditing(true);
            }}
            className={`text-sm font-medium ${
              item.stock != null
                ? item.stock <= 5
                  ? "text-red-600"
                  : "text-dark-700"
                : "text-dark-400"
            }`}
          >
            {item.stock != null ? item.stock : "—"}
          </button>
        )}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={toggleVisible}
          disabled={toggling}
          className={`text-sm font-medium ${item.visible ? "text-primary-600" : "text-dark-400"}`}
        >
          {item.visible ? "Oui" : "Masqué"}
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={onEdit}
          className="mr-3 text-sm font-medium text-primary-600 transition hover:text-primary-700"
        >
          Modifier
        </button>
        <button
          onClick={deleteItem}
          disabled={deleting}
          className="text-sm font-medium text-red-600 transition hover:text-red-700 disabled:opacity-50"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
