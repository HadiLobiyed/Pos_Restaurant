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
