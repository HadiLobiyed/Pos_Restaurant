"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { MenuItemRow } from "@/components/admin/MenuItemRow";

type Category = { id: string; name: string; _count?: { menuItems: number } };
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
  category: Category;
  supplements?: Array<{ id: string; name: string; price: { toString(): string } }>;
};

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const [categorySupplementsId, setCategorySupplementsId] = useState<string>("");
  const [categorySupplementsDraft, setCategorySupplementsDraft] = useState<Array<{ name: string; price: string }>>([]);
  const [savingCategorySupps, setSavingCategorySupps] = useState(false);
  const [categorySuppsError, setCategorySuppsError] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = !categoryFilter || item.categoryId === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false);
      return matchCategory && matchSearch;
    });
  }, [items, categoryFilter, searchQuery]);

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    if (res.ok) setCategories(await res.json());
  }

  async function fetchItems() {
    const res = await fetch("/api/menu");
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    Promise.all([fetchCategories(), fetchItems()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!categorySupplementsId) {
      setCategorySupplementsDraft([]);
      return;
    }
    const categoryItems = items.filter((i) => i.categoryId === categorySupplementsId);
    const first = categoryItems[0];
    const current = Array.isArray(first?.supplements)
      ? first!.supplements!.map((s) => ({ name: s.name, price: s.price.toString() }))
      : [];
    setCategorySupplementsDraft(current);
  }, [categorySupplementsId, items]);

  async function saveCategorySupplements() {
    if (!categorySupplementsId) return;
    setSavingCategorySupps(true);
    setCategorySuppsError(null);

    try {
      const cleaned = categorySupplementsDraft
        .map((s) => ({ name: s.name.trim(), price: s.price.trim() }))
        .filter((s) => s.name.length > 0 || s.price.length > 0);

      if (cleaned.length === 0) {
        // Enregistre "sans suppléments" pour la catégorie
      } else {
        if (cleaned.some((s) => s.name.length === 0)) throw new Error("Nom du supplément requis.");
        if (cleaned.some((s) => Number.isNaN(parseFloat(s.price)) || parseFloat(s.price) <= 0)) {
          throw new Error("Prix du supplément invalide.");
        }
      }

      // Envoyer [] pour effacer les suppléments existants
      const normalized =
        cleaned.length > 0 ? cleaned.map((s) => ({ name: s.name, price: parseFloat(s.price) })) : [];

      const categoryItems = items.filter((i) => i.categoryId === categorySupplementsId);
      if (categoryItems.length === 0) return;

      await Promise.all(
        categoryItems.map(async (it) => {
          const res = await fetch(`/api/menu/${it.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ supplements: normalized }),
          });
          if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            throw new Error(typeof d.error === "string" ? d.error : "Erreur lors de la sauvegarde.");
          }
        })
      );

      await fetchItems();
    } catch (e) {
      setCategorySuppsError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSavingCategorySupps(false);
    }
  }

  function onCategoryCreated() {
    setShowCategoryForm(false);
    fetchCategories();
  }

  function onItemCreated() {
    setShowItemForm(false);
    setEditingItem(null);
    fetchItems();
  }

  function onItemUpdated() {
    setEditingItem(null);
    fetchItems();
  }

  function onItemDeleted() {
    fetchItems();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-dark-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold text-dark-900">Gestion du menu</h1>

      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-dark-800">Catégories</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center rounded-xl border border-dark-200 bg-white px-4 py-2 text-sm font-medium text-dark-800 shadow-card"
            >
              {c.name}
              {c._count != null && (
                <span className="ml-1.5 text-dark-500">({c._count.menuItems})</span>
              )}
            </span>
          ))}
        </div>
        <button
          onClick={() => setShowCategoryForm(true)}
          className="text-sm font-semibold text-primary-600 transition hover:text-primary-700"
        >
          + Ajouter une catégorie
        </button>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-dark-800">Articles</h2>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field w-auto py-2 text-sm"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="search"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field max-w-xs py-2 text-sm"
          />
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowItemForm(true);
            }}
            className="btn-primary"
          >
            + Ajouter un article
          </button>
        </div>
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="border-b border-dark-200 bg-dark-50/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark-700">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark-700">Catégorie</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark-700">Code barre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark-700">Prix</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark-700">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark-700">Visible</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-dark-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-dark-500">
                    {items.length === 0
                      ? "Aucun article. Ajoutez d'abord une catégorie."
                      : "Aucun article ne correspond à la recherche."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <MenuItemRow
                    key={item.id}
                    item={item}
                    onEdit={() => {
                      setEditingItem(item);
                      setShowItemForm(true);
                    }}
                    onUpdated={onItemUpdated}
                    onDeleted={onItemDeleted}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-dark-200 bg-white p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-dark-900">Suppléments par catégorie</h2>
            <p className="mt-1 text-sm text-dark-500">
              Choisis une catégorie (ex: pizza). Les suppléments que tu enregistres s’appliqueront aux produits de cette
              catégorie.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={categorySupplementsId}
            onChange={(e) => setCategorySupplementsId(e.target.value)}
            className="input-field w-auto"
          >
            <option value="">— Choisir une catégorie —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void saveCategorySupplements()}
            disabled={savingCategorySupps || !categorySupplementsId}
            className="btn-primary"
          >
            {savingCategorySupps ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

        {categorySupplementsId && (
          <>
            {categorySuppsError && <p className="mt-3 text-sm text-red-600">{categorySuppsError}</p>}

            <div className="mt-5 space-y-3">
              <div className="space-y-2">
                {categorySupplementsDraft.length === 0 ? (
                  <p className="text-sm text-dark-500">Aucun supplément pour cette catégorie.</p>
                ) : (
                  categorySupplementsDraft.map((s, idx) => (
                    <div key={`${idx}-${s.name}`} className="flex flex-wrap items-center gap-2">
                      <input
                        className="input-field flex-1"
                        value={s.name}
                        onChange={(e) => {
                          setCategorySupplementsDraft((prev) => prev.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)));
                        }}
                        placeholder="Nom du supplément"
                      />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input-field w-32"
                        value={s.price}
                        onChange={(e) => {
                          setCategorySupplementsDraft((prev) => prev.map((x, i) => (i === idx ? { ...x, price: e.target.value } : x)));
                        }}
                        placeholder="Prix"
                      />
                      <button
                        type="button"
                        onClick={() => setCategorySupplementsDraft((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-sm font-semibold text-red-600 hover:underline"
                      >
                        Suppr.
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => setCategorySupplementsDraft((prev) => [...prev, { name: "", price: "" }])}
                className="text-sm font-semibold text-primary-600 hover:underline"
              >
                + Ajouter un supplément
              </button>
            </div>
          </>
        )}
      </div>

      {showCategoryForm && (
        <CategoryForm
          onClose={() => setShowCategoryForm(false)}
          onCreated={onCategoryCreated}
        />
      )}
      {showItemForm && (
        <MenuItemForm
          categories={categories}
          editingItem={editingItem}
          onClose={() => {
            setShowItemForm(false);
            setEditingItem(null);
          }}
          onSaved={onItemCreated}
        />
      )}
    </div>
  );
}
