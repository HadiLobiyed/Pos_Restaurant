"use client";

import { useCallback, useEffect, useState } from "react";
import {
  WEEKDAY_LABELS_FR,
  emptyWeekSchedule,
  type DayRange,
  type DaySchedule,
  type WeekSchedule,
} from "@/lib/openingHours";

type DayState = { closed: boolean; ranges: DayRange[] };

function toDayState(d: DaySchedule | undefined): DayState {
  if (!d) return { closed: false, ranges: [] };
  return {
    closed: d.closed === true,
    ranges: Array.isArray(d.ranges) ? d.ranges : [],
  };
}

function updateDay(schedule: WeekSchedule, dayKey: string, updater: (d: DayState) => DayState): WeekSchedule {
  const cur = toDayState(schedule[dayKey]);
  return { ...schedule, [dayKey]: updater(cur) };
}

export function OpeningHoursSettings() {
  const [schedule, setSchedule] = useState<WeekSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [tz, setTz] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/opening-hours")
      .then((r) => r.json())
      .then((d) => {
        setSchedule(d.openingHours ?? emptyWeekSchedule());
        setTz(typeof d.timeZone === "string" ? d.timeZone : "");
      })
      .catch(() => setSchedule(emptyWeekSchedule()))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!schedule) return;
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/opening-hours", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ openingHours: schedule }),
    });
    setSaving(false);
    if (res.ok) setMessage("Horaires enregistrés.");
    else {
      const d = await res.json().catch(() => ({}));
      setMessage(typeof d.error === "string" ? d.error : "Erreur à l'enregistrement.");
    }
  }

  if (loading || !schedule) {
    return (
      <div className="rounded-2xl border border-dark-200 bg-white p-8 text-dark-500 shadow-card">Chargement des horaires…</div>
    );
  }

  return (
    <div className="rounded-2xl border border-dark-200 bg-white p-6 shadow-card">
      <p className="mb-1 text-sm text-dark-600">
        Les commandes passées depuis le <strong>menu client</strong> (QR / site) sont refusées en dehors de ces plages.
        Le <strong>POS</strong> reste utilisable à tout moment.
      </p>
      <p className="mb-6 text-xs text-dark-500">
        Fuseau utilisé pour comparer l&apos;heure actuelle : <code className="rounded bg-dark-100 px-1">{tz || "UTC"}</code> — définissez{" "}
        <code className="rounded bg-dark-100 px-1">RESTAURANT_TZ</code> sur le serveur (ex. <code>Africa/Algiers</code>,{" "}
        <code>Europe/Paris</code>).
      </p>

      <div className="space-y-6">
        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
          const key = String(day);
          const dayData = schedule[key] ?? { closed: false, ranges: [{ start: "12:00", end: "14:30" }] };
          const closed = dayData.closed === true;
          const ranges = Array.isArray(dayData.ranges) ? dayData.ranges : [];

          return (
            <div key={day} className="rounded-xl border border-dark-200 bg-dark-50/40 p-4">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="font-semibold text-dark-900">{WEEKDAY_LABELS_FR[day]}</span>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-dark-700">
                  <input
                    type="checkbox"
                    checked={closed}
                    onChange={(e) => {
                      const c = e.target.checked;
                      setSchedule((s) =>
                        s
                          ? updateDay(s, key, () =>
                              c ? { closed: true, ranges: [] } : { closed: false, ranges: [{ start: "12:00", end: "14:30" }] }
                            )
                          : s
                      );
                    }}
                    className="rounded border-dark-300"
                  />
                  Fermé
                </label>
              </div>
              {!closed && (
                <div className="space-y-2">
                  {ranges.map((range, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2">
                      <input
                        type="time"
                        value={range.start}
                        onChange={(e) => {
                          const v = e.target.value;
                          setSchedule((s) => {
                            if (!s) return s;
                            const next = [...ranges];
                            next[idx] = { ...next[idx], start: v };
                            return updateDay(s, key, () => ({ closed: false, ranges: next }));
                          });
                        }}
                        className="rounded-lg border border-dark-200 px-2 py-1.5 text-sm"
                      />
                      <span className="text-dark-500">→</span>
                      <input
                        type="time"
                        value={range.end}
                        onChange={(e) => {
                          const v = e.target.value;
                          setSchedule((s) => {
                            if (!s) return s;
                            const next = [...ranges];
                            next[idx] = { ...next[idx], end: v };
                            return updateDay(s, key, () => ({ closed: false, ranges: next }));
                          });
                        }}
                        className="rounded-lg border border-dark-200 px-2 py-1.5 text-sm"
                      />
                      {ranges.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setSchedule((s) => {
                              if (!s) return s;
                              const next = ranges.filter((_, i) => i !== idx);
                              return updateDay(s, key, () => ({ closed: false, ranges: next }));
                            })
                          }
                          className="text-sm text-red-600 hover:underline"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setSchedule((s) => {
                        if (!s) return s;
                        return updateDay(s, key, (d) => ({
                          closed: false,
                          ranges: [...d.ranges, { start: "19:00", end: "22:00" }],
                        }));
                      })
                    }
                    className="text-sm font-medium text-primary-600 hover:underline"
                  >
                    + Ajouter une plage horaire
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="button" onClick={save} disabled={saving} className="btn-primary">
          {saving ? "Enregistrement…" : "Enregistrer les horaires"}
        </button>
        {message && <p className="text-sm text-dark-600">{message}</p>}
      </div>
    </div>
  );
}
