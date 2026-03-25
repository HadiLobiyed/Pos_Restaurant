"use client";

import { useState } from "react";

export function TableForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const num = parseInt(number, 10);
    if (Number.isNaN(num) || num < 1) {
      setError("Numéro de table invalide.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: num }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erreur lors de la création.");
      return;
    }
    onCreated();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-elevated">
        <h3 className="mb-4 text-lg font-semibold text-dark-900">Nouvelle table</h3>
        <form onSubmit={handleSubmit}>
          <label className="mb-1.5 block text-sm font-semibold text-dark-700">Numéro de table</label>
          <input
            type="number"
            min="1"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            className="input-field mb-4"
          />
          {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-dark-600 transition hover:bg-dark-100">
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              Créerer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
