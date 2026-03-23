"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { slotLabel } from "@/lib/reservationSlots";

type Table = {
  id: string;
  number: number;
  reserved: boolean;
  reservationTime: string | null;
};

type SlotInfo = { time: string; available: boolean; remaining: number };

export function TableCard({
  table,
  onUpdated,
  onDeleted,
}: {
  table: Table;
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [reserving, setReserving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [reserveError, setReserveError] = useState<string | null>(null);

  const minDate = useMemo(() => {
    const t = new Date();
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, "0");
    const d = String(t.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  useEffect(() => {
    fetch(`/api/tables/${table.id}/qr`)
      .then((r) => r.json())
      .then((d) => d.dataUrl && setQrDataUrl(d.dataUrl))
      .catch(() => {});
  }, [table.id]);

  useEffect(() => {
    if (!showReserveModal) return;
    // Valeur initiale modal : aujourd'hui
    setReservationDate((cur) => cur || minDate);
  }, [minDate, showReserveModal]);

  useEffect(() => {
    if (!showReserveModal) return;
    if (!reservationDate) return;

    let cancelled = false;
    setSlotsLoading(true);
    setReserveError(null);
    fetch(`/api/reservations/availability?date=${encodeURIComponent(reservationDate)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Impossible de charger les créneaux.");
        const d = await r.json();
        const list = (d.slots ?? []) as SlotInfo[];
        if (cancelled) return;
        setSlots(list);
        setReservationTime((prev) => {
          const stillOk = list.some((s) => s.time === prev && s.available);
          if (stillOk) return prev;
          const first = list.find((s) => s.available);
          return first ? first.time : "";
        });
      })
      .catch((e) => {
        if (cancelled) return;
        setSlots([]);
        setReservationTime("");
        setReserveError(e instanceof Error ? e.message : "Erreur");
      })
      .finally(() => {
        if (cancelled) return;
        setSlotsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reservationDate, showReserveModal]);

  async function toggleReserve() {
    setReserving(true);
    const res = await fetch(`/api/tables/${table.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reserved: !table.reserved,
        reservationTime: !table.reserved ? new Date().toISOString() : null,
      }),
    });
    setReserving(false);
    if (res.ok) onUpdated();
  }

  async function confirmReserve() {
    if (!reservationDate || !reservationTime) return;

    const slot = slots.find((s) => s.time === reservationTime);
    if (!slot?.available) {
      setReserveError("Ce créneau n'est plus disponible. Actualisez les horaires.");
      return;
    }

    setReserving(true);
    setReserveError(null);
    const iso = new Date(`${reservationDate}T${reservationTime}:00`).toISOString();

    const res = await fetch(`/api/tables/${table.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reserved: true,
        reservationTime: iso,
      }),
    });
    setReserving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setReserveError(typeof d.error === "string" ? d.error : "Erreur lors de la réservation.");
      return;
    }
    setShowReserveModal(false);
    onUpdated();
  }

  async function deleteTable() {
    if (!confirm("Supprimer cette table ? Les commandes liées peuvent être affectées.")) return;
    setDeleting(true);
    const res = await fetch(`/api/tables/${table.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) onDeleted();
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-dark-100 p-4">
        <span className="font-semibold text-dark-900">Table {table.number}</span>
        <span
          className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
            table.reserved ? "bg-amber-100 text-amber-800" : "bg-primary-100 text-primary-800"
          }`}
        >
          {table.reserved ? "Réservée" : "Disponible"}
        </span>
      </div>
      <div className="flex flex-col items-center p-6">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt={`QR table ${table.number}`} className="h-32 w-32 rounded-lg" />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-dark-100 text-sm text-dark-400">
            Chargement...
          </div>
        )}
        <p className="mt-2 text-xs text-dark-500">Scanner pour le menu</p>
      </div>
      {table.reserved && table.reservationTime && (
        <div className="px-4 pb-2 text-sm text-dark-600">
          Réservée le {format(new Date(table.reservationTime), "d MMM, HH:mm")}
        </div>
      )}
      <div className="flex gap-2 border-t border-dark-100 p-4">
        {table.reserved ? (
          <button
            onClick={toggleReserve}
            disabled={reserving}
            className="flex-1 rounded-xl bg-amber-100 py-2.5 text-sm font-medium text-amber-800 transition hover:bg-amber-200 disabled:opacity-50"
          >
            Libérer
          </button>
        ) : (
          <button
            onClick={() => setShowReserveModal(true)}
            disabled={reserving}
            className="flex-1 rounded-xl bg-amber-100 py-2.5 text-sm font-medium text-amber-800 transition hover:bg-amber-200 disabled:opacity-50"
          >
            Réserver (date/heure)
          </button>
        )}
        <button
          onClick={deleteTable}
          disabled={deleting}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>

      {showReserveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-elevated">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-dark-900">Réserver la table</h3>
                <p className="mt-1 text-sm text-dark-600">
                  Choisissez une date et un créneau selon les horaires enregistrés par l&apos;admin.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-sm text-dark-600 hover:bg-dark-100"
                onClick={() => {
                  setShowReserveModal(false);
                  setReserveError(null);
                }}
              >
                Fermer
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void confirmReserve();
              }}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-dark-700">Date</label>
                <input
                  type="date"
                  min={minDate}
                  value={reservationDate}
                  onChange={(e) => {
                    setReservationDate(e.target.value);
                    setReservationTime("");
                  }}
                  required
                  className="input-field w-full py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-dark-700">Heure *</label>
                {slotsLoading ? (
                  <p className="text-sm text-dark-500">Chargement des créneaux…</p>
                ) : slots.length > 0 ? (
                  <select
                    required
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    className="input-field w-full py-2 text-sm"
                  >
                    <option value="">— Choisir un créneau —</option>
                    {slots.map((s) => (
                      <option key={s.time} value={s.time} disabled={!s.available}>
                        {slotLabel(s.time)}
                        {!s.available ? " (complet)" : ` (${s.remaining} restant)`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-dark-500">Aucun créneau disponible pour cette date.</p>
                )}
              </div>

              {reserveError && <p className="text-sm text-red-600">{reserveError}</p>}

              <button
                type="submit"
                disabled={reserving || slotsLoading || !reservationDate || !reservationTime || !slots.some((s) => s.time === reservationTime && s.available)}
                className="btn-primary w-full"
              >
                {reserving ? "Réservation…" : "Confirmer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
