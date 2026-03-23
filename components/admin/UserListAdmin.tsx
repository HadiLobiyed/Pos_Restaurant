"use client";

import { useEffect, useState } from "react";

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
};

export function UserListAdmin() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(typeof d.error === "string" ? d.error : "Impossible de charger les utilisateurs.");
      }
      const data = (await res.json()) as AdminUserRow[];
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function deleteUser(id: string) {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(typeof d.error === "string" ? d.error : "Erreur lors de la suppression.");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-dark-200 bg-white p-6 shadow-card">
      <h2 className="mb-4 text-xl font-semibold text-dark-900">Liste des utilisateurs</h2>

      {loading ? (
        <p className="text-sm text-dark-500">Chargement...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-dark-500">Aucun utilisateur.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-200 bg-dark-50/50">
                <th className="px-3 py-3 text-left font-semibold text-dark-800">Nom</th>
                <th className="px-3 py-3 text-left font-semibold text-dark-800">Email</th>
                <th className="px-3 py-3 text-left font-semibold text-dark-800">Rôle</th>
                <th className="px-3 py-3 text-right font-semibold text-dark-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {rows.map((u) => (
                <tr key={u.id}>
                  <td className="px-3 py-3 text-dark-800">{u.name}</td>
                  <td className="px-3 py-3 text-dark-600">{u.email}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        u.role === "ADMIN" ? "bg-primary-100 text-primary-800" : "bg-dark-100 text-dark-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button
                      type="button"
                      disabled={deletingId === u.id}
                      onClick={() => void deleteUser(u.id)}
                      className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === u.id ? "..." : "Supprimer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

