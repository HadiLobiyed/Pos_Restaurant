"use client";

import { useCallback, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

type ReservationRow = {
  id: string;
  name: string;
  phone: string;
  people: number;
  preferredDate: string | null;
  reservationDate: string | null;
  reservationTime: string | null;
  message: string | null;
  createdAt: string;
  handled: boolean;
};

export default function AdminReservationsPage() {
  const [rows, setRows] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/reservations");
    if (res.ok) setRows(await res.json());
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  async function setHandled(id: string, handled: boolean) {
    setUpdating(id);
    const res = await fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled }),
    });
    setUpdating(null);
    if (res.ok) await load();
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-dark-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-dark-900">Réservations</h1>
      <p className="mb-6 text-sm text-dark-500">
        Demandes de table avec date et heure. Les nouvelles réservations affichent un badge sur l’onglet jusqu’à traitement.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-dark-200 bg-white shadow-card">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-dark-200 bg-dark-50/80">
            <tr>
              <th className="px-4 py-3 font-semibold text-dark-800">Client</th>
              <th className="px-4 py-3 font-semibold text-dark-800">Téléphone</th>
              <th className="px-4 py-3 font-semibold text-dark-800">Personnes</th>
              <th className="px-4 py-3 font-semibold text-dark-800">Date & heure</th>
              <th className="px-4 py-3 font-semibold text-dark-800">Message</th>
              <th className="px-4 py-3 font-semibold text-dark-800">Reçue le</th>
              <th className="px-4 py-3 font-semibold text-dark-800">État</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-dark-500">
                  Aucune réservation pour le moment.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className={r.handled ? "bg-white" : "bg-primary-50/40"}>
                  <td className="px-4 py-3 font-medium text-dark-900">
                    <div className="flex items-center gap-2">
                      {r.name}
                      {!r.handled && (
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                          Nouveau
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-dark-700">
                    <a href={`tel:${r.phone}`} className="text-primary-600 hover:underline">
                      {r.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-dark-700">{r.people}</td>
                  <td className="px-4 py-3 text-dark-700">
                    {r.reservationDate && r.reservationTime ? (
                      <>
                        {format(parseISO(r.reservationDate), "EEEE d MMMM yyyy", { locale: fr })}{" "}
                        <span className="font-semibold text-dark-900">· {r.reservationTime.replace(":", "h")}</span>
                      </>
                    ) : r.preferredDate ? (
                      <span className="text-dark-500">{r.preferredDate} (ancien format)</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-dark-600" title={r.message ?? ""}>
                    {r.message || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-dark-500">
                    {format(new Date(r.createdAt), "dd/MM/yyyy HH:mm", { locale: fr })}
                  </td>
                  <td className="px-4 py-3">
                    {r.handled ? (
                      <button
                        type="button"
                        disabled={updating === r.id}
                        onClick={() => setHandled(r.id, false)}
                        className="text-xs font-medium text-primary-600 hover:underline disabled:opacity-50"
                      >
                        Marquer non traitée
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={updating === r.id}
                        onClick={() => setHandled(r.id, true)}
                        className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                      >
                        Marquer traitée
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
