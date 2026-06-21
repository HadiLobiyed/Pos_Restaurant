"use client";

import { useCallback, useEffect, useState } from "react";

type OpeningHoursState = {
  open: boolean | null;
  loading: boolean;
  hoursToday: string | null;
  timeZone: string | null;
};

async function fetchOpeningHours(): Promise<Response> {
  return fetch("/api/opening-hours", {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" },
  });
}

export function useRestaurantOpen(pollMs = 15_000): OpeningHoursState {
  const [state, setState] = useState<OpeningHoursState>({
    open: null,
    loading: true,
    hoursToday: null,
    timeZone: null,
  });

  const load = useCallback(async () => {
    try {
      const res = await fetchOpeningHours();
      const d = await res.json();
      setState({
        open: d.open !== false,
        loading: false,
        hoursToday: typeof d.hoursToday === "string" ? d.hoursToday : null,
        timeZone: typeof d.timeZone === "string" ? d.timeZone : null,
      });
    } catch {
      setState({ open: true, loading: false, hoursToday: null, timeZone: null });
    }
  }, []);

  useEffect(() => {
    void load();

    const interval = setInterval(() => void load(), pollMs);

    const onFocus = () => void load();
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load, pollMs]);

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
