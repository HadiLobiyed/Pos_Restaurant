"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

type Table = {
  id: string;
  number: number;
  reserved: boolean;
  reservationTime: string | null;
};

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

  useEffect(() => {
    fetch(`/api/tables/${table.id}/qr`)
      .then((r) => r.json())
      .then((d) => d.dataUrl && setQrDataUrl(d.dataUrl))
      .catch(() => {});
  }, [table.id]);

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
        <button
          onClick={toggleReserve}
          disabled={reserving}
          className="flex-1 rounded-xl bg-amber-100 py-2.5 text-sm font-medium text-amber-800 transition hover:bg-amber-200 disabled:opacity-50"
        >
          {table.reserved ? "Libérer" : "Réserver"}
        </button>
        <button
          onClick={deleteTable}
          disabled={deleting}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
