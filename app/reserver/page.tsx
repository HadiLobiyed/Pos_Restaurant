"use client";

import Link from "next/link";
import { useState } from "react";

export default function ReserverPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [people, setPeople] = useState("2");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        people: parseInt(people, 10) || 1,
        preferredDate: preferredDate || undefined,
        message: message || undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Erreur. Réessayez.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 px-4 py-12">
        <div className="mx-auto max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-white backdrop-blur">
          <p className="text-lg font-semibold">Demande envoyée</p>
          <p className="mt-2 text-sm text-dark-200">Nous vous recontacterons rapidement pour confirmer votre table.</p>
          <Link href="/" className="mt-6 inline-block rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white hover:bg-primary-400">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 px-4 py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-6 inline-block text-sm font-semibold text-primary-300 hover:text-white">
          ← Retour à l&apos;accueil
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-white">Réserver une table</h1>
        <p className="mb-8 text-dark-300">Laissez-nous vos coordonnées — le restaurant vous rappellera.</p>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-200">Nom</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-dark-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-200">Téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-dark-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-200">Nombre de personnes</label>
            <input
              type="number"
              min={1}
              max={50}
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-dark-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-200">Date / heure souhaitées (optionnel)</label>
            <input
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              placeholder="ex. Samedi 20h"
              className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-dark-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-200">Message (optionnel)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-dark-900"
            />
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary-500 py-3.5 font-semibold text-white hover:bg-primary-400 disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Envoyer la demande"}
          </button>
        </form>
      </div>
    </main>
  );
}
