"use client";

import { useState, useEffect } from "react";

type Category = { id: string; name: string };
type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string };
  image: string | null;
  categoryId: string;
  visible: boolean;
  stock: number | null;
  barcode: string | null;
};

export function MenuItemForm({
  categories,
  editingItem,
  onClose,
  onSaved,
}: {
  categories: Category[];
  editingItem: MenuItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [visible, setVisible] = useState(true);
  const [stock, setStock] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description ?? "");
      setPrice(editingItem.price.toString());
      setImage(editingItem.image ?? "");
      setCategoryId(editingItem.categoryId);
      setVisible(editingItem.visible);
      setStock(editingItem.stock != null ? String(editingItem.stock) : "");
      setBarcode(editingItem.barcode ?? "");
    } else if (categories.length) {
      setCategoryId(categories[0].id);
      setStock("");
      setBarcode("");
    }
  }, [editingItem, categories]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      name,
      description: description || undefined,
      price: parseFloat(price),
      image: image || undefined,
      categoryId,
      visible,
      stock: stock === "" ? null : (() => { const n = parseInt(stock, 10); return Number.isNaN(n) ? null : n; })(),
      barcode: barcode === "" ? null : barcode,
    };
    const url = editingItem ? `/api/menu/${editingItem.id}` : "/api/menu";
    const res = await fetch(url, {
      method: editingItem ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (!res.ok) {
      setError(editingItem ? "Erreur mise à jour." : "Erreur création.");
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-8 w-full max-w-md rounded-2xl bg-white p-6 shadow-elevated">
        <h3 className="mb-4 text-lg font-semibold text-dark-900">
          {editingItem ? "Modifier l'article" : "Nouvel article"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-dark-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-dark-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-dark-700">Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-dark-700">Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-dark-700">Code barre</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Ex: 3017620422003"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-dark-700">Stock (optionnel)</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Laisser vide si pas de suivi"
              className="input-field"
            />
            <p className="text-xs text-dark-500 mt-0.5">Pour les boissons : quantité restante. Vide = pas de suivi.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-dark-700">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="input-field"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="visible"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="rounded border-dark-300"
            />
            <label htmlFor="visible" className="text-sm text-dark-700">
              Visible on client menu
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-dark-600 transition hover:bg-dark-100">
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {editingItem ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
