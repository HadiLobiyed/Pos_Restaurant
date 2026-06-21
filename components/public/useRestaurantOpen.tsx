"use client";

import { useEffect, useState } from "react";

type OpeningHoursState = {
  open: boolean | null;
  loading: boolean;
  hoursToday: string | null;
  timeZone: string | null;
};

export function useRestaurantOpen(pollMs = 60_000): OpeningHoursState {
  const [state, setState] = useState<OpeningHoursState>({
    open: null,
    loading: true,
    hoursToday: null,
    timeZone: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/opening-hours");
        const d = await res.json();
        if (cancelled) return;
        setState({
          open: d.open !== false,
          loading: false,
          hoursToday: typeof d.hoursToday === "string" ? d.hoursToday : null,
          timeZone: typeof d.timeZone === "string" ? d.timeZone : null,
        });
      } catch {
        if (!cancelled) {
          setState({ open: true, loading: false, hoursToday: null, timeZone: null });
        }
      }
    }

    void load();
    const t = setInterval(load, pollMs);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [pollMs]);

  return state;
}

export function RestaurantClosedBanner({
  hoursToday,
  className = "",
}: {
  hoursToday?: string | null;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-sm text-amber-100 ${className}`}
      role="status"
    >
      <p className="font-semibold">Restaurant fermé en ce moment</p>
      <p className="mt-1 text-amber-100/90">
        Les commandes et réservations en ligne sont disponibles uniquement pendant nos heures
        d&apos;ouverture.
      </p>
      {hoursToday && <p className="mt-2 text-xs text-amber-200/80">Aujourd&apos;hui : {hoursToday}</p>}
    </div>
  );
}
