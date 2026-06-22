"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { isBeverageCategory } from "@/lib/beverages";

type Category = { id: string; name: string };

type StockIngredient = {
  id: string;
  name: string;
  quantity: number;
  unit: string | null;
};

type BeverageItem = {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string };
  stock: number | null;
  category: { name: string };
};

type Tab = "ingredients" | "beverages";

function qtyClass(qty: number): string {
  if (qty <= 0) return "text-red-600 font-bold";
  if (qty <= 5) return "text-amber-600 font-semibold";
  return "text-dark-800 font-semibold";
}

export default function StockPage() {
  const [tab, setTab] = useState<Tab>("ingredients");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [ingredients, setIngredients] = useState<StockIngredient[]>([]);
  const [beverages, setBeverages] = useState<BeverageItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showBevForm, setShowBevForm] = useState(false);

  const [newIngName, setNewIngName] = useState("");
  const [newIngQty, setNewIngQty] = useState("0");
  const [newIngUnit, setNewIngUnit] = useState("");

  const beverageCategoryId = useMemo(
    () => categories.find((c) => isBeverageCategory(c.name))?.id,
    [categories]
  );

  const loadCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error("Chargement catégories impossible.");
    setCategories(await res.json());
  }, []);

  const loadIngredients = useCallback(async () => {
    const res = await fetch("/api/admin/stock/ingredients");
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(typeof d?.error === "string" ? d.error : "Chargement ingrédients impossible.");
    }
    setIngredients(await res.json());
  }, []);

  const loadBeverages = useCallback(async () => {
    const res = await fetch("/api/admin/stock/beverages");
    if (!res.ok) throw new Error("Chargement boissons impossible.");
    setBeverages(await res.json());
  }, []);

  const reload = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      await Promise.all([loadIngredients(), loadBeverages(), loadCategories()]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }, [loadIngredients, loadBeverages, loadCategories]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function createIngredient(e: React.FormEvent) {
    e.preventDefault();
    if (!newIngName.trim()) return;
    setError("");
    const res = await fetch("/api/admin/stock/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newIngName.trim(),
        quantity: parseInt(newIngQty, 10) || 0,
        unit: newIngUnit.trim() || undefined,
      }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(typeof d?.error === "string" ? d.error : "Création impossible.");
      return;
    }
    setNewIngName("");
    setNewIngQty("0");
    setNewIngUnit("");
    await loadIngredients();
  }

  async function adjustIngredient(id: string, delta: number) {
    setError("");
    const res = await fetch(`/api/admin/stock/ingredients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta }),
    });
    if (!res.ok) {
      setError("Mise à jour impossible.");
      return;
    }
    const row = await res.json();
    setIngredients((prev) => prev.map((i) => (i.id === id ? row : i)));
  }

  async function deleteIngredient(id: string) {
    if (!confirm("Supprimer cet ingrédient ?")) return;
    await fetch(`/api/admin/stock/ingredients/${id}`, { method: "DELETE" });
    await loadIngredients();
  }

  async function adjustBeverage(id: string, delta: number) {
    setError("");
    const res = await fetch(`/api/admin/stock/beverages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta }),
    });
    if (!res.ok) {
      setError("Mise à jour impossible.");
      return;
    }
    const row = await res.json();
    setBeverages((prev) => prev.map((b) => (b.id === id ? row : b)));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-dark-500">Chargement du stock…</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-dark-900">Stock</h1>
      <p className="mb-6 text-sm text-dark-500">
        Ingrédients (hors menu) et boissons du menu. Les boissons à stock 0 ne sont plus commandables en ligne.
      </p>

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("ingredients")}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            tab === "ingredients" ? "bg-primary-500 text-white" : "border border-dark-200 bg-white text-dark-700"
          }`}
        >
          Ingrédients
        </button>
        <button
          type="button"
          onClick={() => setTab("beverages")}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            tab === "beverages" ? "bg-primary-500 text-white" : "border border-dark-200 bg-white text-dark-700"
          }`}
        >
          Boissons
        </button>
      </div>

      {tab === "ingredients" && (
        <div className="space-y-6">
          <form
            onSubmit={createIngredient}
            className="flex flex-wrap items-end gap-3 rounded-2xl border border-dark-200 bg-white p-5 shadow-card"
          >
            <div className="min-w-[180px] flex-1">
              <label className="mb-1 block text-xs font-semibold text-dark-600">Nouvel ingrédient</label>
              <input
                value={newIngName}
                onChange={(e) => setNewIngName(e.target.value)}
                placeholder="Ex. Tomates"
                className="input-field"
              />
            </div>
            <div className="w-24">
              <label className="mb-1 block text-xs font-semibold text-dark-600">Quantité</label>
              <input
                type="number"
                min={0}
                value={newIngQty}
                onChange={(e) => setNewIngQty(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="w-24">
              <label className="mb-1 block text-xs font-semibold text-dark-600">Unité</label>
              <input
                value={newIngUnit}
                onChange={(e) => setNewIngUnit(e.target.value)}
                placeholder="kg"
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-primary">
              Ajouter
            </button>
          </form>

          <div className="overflow-hidden rounded-2xl border border-dark-200 bg-white shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-dark-200 bg-dark-50 text-dark-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ingrédient</th>
                  <th className="px-4 py-3 font-semibold">Quantité</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-dark-500">
                      Aucun ingrédient enregistré.
                    </td>
                  </tr>
                ) : (
                  ingredients.map((ing) => (
                    <tr key={ing.id} className="border-b border-dark-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-dark-900">
                        {ing.name}
                        {ing.unit && <span className="ml-1 text-dark-500">({ing.unit})</span>}
                      </td>
                      <td className={`px-4 py-3 ${qtyClass(ing.quantity)}`}>{ing.quantity}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => adjustIngredient(ing.id, -1)}
                            className="rounded-lg border border-dark-200 px-3 py-1 hover:bg-dark-50"
                          >
                            −
                          </button>
                          <button
                            type="button"
                            onClick={() => adjustIngredient(ing.id, 1)}
                            className="rounded-lg border border-dark-200 px-3 py-1 hover:bg-dark-50"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => adjustIngredient(ing.id, 5)}
                            className="rounded-lg border border-primary-200 px-3 py-1 text-primary-700 hover:bg-primary-50"
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteIngredient(ing.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "beverages" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dark-200 bg-white p-5 shadow-card">
            <div>
              <p className="font-semibold text-dark-900">Boissons du menu</p>
              <p className="mt-1 text-xs text-dark-500">
                La boisson est ajoutée au menu (catégorie Boissons) et suivie ici.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowBevForm(true)}
              className="btn-primary"
            >
              + Ajouter une boisson
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-dark-200 bg-white shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-dark-200 bg-dark-50 text-dark-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Boisson</th>
                  <th className="px-4 py-3 font-semibold">Prix</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {beverages.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-dark-500">
                      Aucune boisson. Créez-en une ou ajoutez des articles dans la catégorie Boissons via le menu.
                    </td>
                  </tr>
                ) : (
                  beverages.map((bev) => {
                    const tracked = bev.stock != null;
                    const stock = bev.stock ?? 0;
                    return (
                      <tr key={bev.id} className="border-b border-dark-100 last:border-0">
                        <td className="px-4 py-3">
                          <p className="font-medium text-dark-900">{bev.name}</p>
                          {bev.description && (
                            <p className="text-xs text-dark-500">{bev.description}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-dark-700">{Number(bev.price).toFixed(2)} DA</td>
                        <td className={`px-4 py-3 ${tracked ? qtyClass(stock) : "text-dark-400"}`}>
                          {tracked ? stock : "Non suivi"}
                          {tracked && stock <= 0 && (
                            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                              Rupture
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => adjustBeverage(bev.id, -1)}
                              className="rounded-lg border border-dark-200 px-3 py-1 hover:bg-dark-50"
                            >
                              −
                            </button>
                            <button
                              type="button"
                              onClick={() => adjustBeverage(bev.id, 1)}
                              className="rounded-lg border border-dark-200 px-3 py-1 hover:bg-dark-50"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => adjustBeverage(bev.id, 6)}
                              className="rounded-lg border border-primary-200 px-3 py-1 text-primary-700 hover:bg-primary-50"
                            >
                              +6
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showBevForm && (
        <MenuItemForm
          categories={categories}
          editingItem={null}
          defaultCategoryId={beverageCategoryId}
          lockCategory
          createTitle="Nouvelle boisson"
          onClose={() => setShowBevForm(false)}
          onSaved={async () => {
            setShowBevForm(false);
            await loadBeverages();
          }}
        />
      )}
    </div>
  );
}
