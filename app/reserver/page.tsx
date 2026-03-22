"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { serviceHoursDescription, slotLabel } from "@/lib/reservationSlots";

type SlotInfo = { time: string; available: boolean; remaining: number };

function todayYYYYMMDD(): string {
  const t = new Date();
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, "0");
  const d = String(t.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ReserverPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [people, setPeople] = useState("2");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [message, setMessage] = useState("");
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const minDate = useMemo(() => todayYYYYMMDD(), []);

  const loadSlots = useCallback(async (date: string) => {
    if (!date) {
      setSlots([]);
      setReservationTime("");
      return;
    }
    setSlotsLoading(true);
    setError("");
    const res = await fetch(`/api/reservations/availability?date=${encodeURIComponent(date)}`);
    setSlotsLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setSlots([]);
      setError(typeof d.error === "string" ? d.error : "Impossible de charger les créneaux.");
      return;
    }
    const data = await res.json();
    const list = (data.slots ?? []) as SlotInfo[];
    setSlots(list);
    setReservationTime((prev) => {
      const stillOk = list.some((s) => s.time === prev && s.available);
      if (stillOk) return prev;
      const first = list.find((s) => s.available);
      return first ? first.time : "";
    });
  }, []);

  useEffect(() => {
    if (reservationDate) void loadSlots(reservationDate);
  }, [reservationDate, loadSlots]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!reservationDate || !reservationTime) {
      setError("Choisissez une date et un créneau horaire.");
      return;
    }
    const slot = slots.find((s) => s.time === reservationTime);
    if (!slot?.available) {
      setError("Ce créneau n’est plus disponible. Actualisez les horaires.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        people: parseInt(people, 10) || 1,
        reservationDate,
        reservationTime,
        message: message || undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Erreur. Réessayez.");
      if (res.status === 409) void loadSlots(reservationDate);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 px-4 py-12">
        <div className="mx-auto max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-white backdrop-blur">
          <p className="text-lg font-semibold">Demande envoyée</p>
          <p className="mt-2 text-sm text-dark-200">
            Nous vous confirmerons votre table pour le créneau choisi dans les meilleurs délais.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white hover:bg-primary-400"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  const hasAvailableSlot = slots.some((s) => s.available);

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 px-4 py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-6 inline-block text-sm font-semibold text-primary-300 hover:text-white">
          ← Retour à l&apos;accueil
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-white">Réserver une table</h1>
        <p className="mb-2 text-dark-300">Choisissez une date puis un créneau parmi les services proposés.</p>
        <p className="mb-8 text-sm text-primary-200/90">{serviceHoursDescription()}</p>

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
            <label className="mb-1 block text-sm font-medium text-dark-200">Date souhaitée *</label>
            <input
              type="date"
              required
              min={minDate}
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-dark-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dark-200">Heure du service *</label>
            {slotsLoading ? (
              <p className="text-sm text-dark-300">Chargement des créneaux…</p>
            ) : reservationDate && slots.length > 0 ? (
              hasAvailableSlot ? (
                <select
                  required
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-dark-900"
                >
                  <option value="">— Choisir un créneau —</option>
                  {slots.map((s) => (
                    <option key={s.time} value={s.time} disabled={!s.available}>
                      {slotLabel(s.time)}
                      {!s.available ? " (complet)" : ` (${s.remaining} place(s))`}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-amber-200">Aucun créneau libre ce jour-là. Choisissez une autre date.</p>
              )
            ) : (
              <p className="text-sm text-dark-400">Sélectionnez d&apos;abord une date.</p>
            )}
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
            disabled={loading || !reservationDate || !reservationTime || !hasAvailableSlot}
            className="w-full rounded-xl bg-primary-500 py-3.5 font-semibold text-white hover:bg-primary-400 disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Envoyer la demande"}
          </button>
        </form>
      </div>
    </main>
  );
}
