"use client";

import { useCallback, useEffect, useState } from "react";

export function RestaurantNameSettings() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/restaurant-settings")
      .then((r) => r.json())
      .then((d) => setName(typeof d.restaurantName === "string" ? d.restaurantName : ""))
      .catch(() => setName(""))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/restaurant-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantName: name }),
    });
    setSaving(false);
    if (res.ok) {
      const d = await res.json();
      if (typeof d.restaurantName === "string") setName(d.restaurantName);
      setMessage("Nom du restaurant enregistré. Il apparaît dans le POS et sur les tickets.");
    } else {
      const d = await res.json().catch(() => ({}));
      setMessage(typeof d.error === "string" ? d.error : "Erreur à l'enregistrement.");
    }
  }

  if (loading) {
    return (
      <div className="mb-8 rounded-2xl border border-dark-200 bg-white p-6 text-dark-500 shadow-card">
        Chargement…
      </div>
    );
  }

  return (
    <form onSubmit={save} className="mb-8 rounded-2xl border border-dark-200 bg-white p-6 shadow-card">
      <h2 className="mb-1 text-lg font-semibold text-dark-900">Nom du restaurant</h2>
      <p className="mb-4 text-sm text-dark-600">
        Ce nom s&apos;affiche dans le POS, sur les tickets imprimés et dans la barre latérale admin.
      </p>
      <label className="mb-1 block text-xs font-semibold text-dark-600">Nom affiché</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={80}
        required
        className="mb-4 w-full max-w-md rounded-xl border border-dark-200 px-3 py-2 text-sm text-dark-900 focus:border-primary-400 focus:outline-none"
        placeholder="Mon restaurant"
      />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Enregistrement…" : "Enregistrer le nom"}
        </button>
        {message && <p className="text-sm text-dark-600">{message}</p>}
      </div>
    </form>
  );
}
