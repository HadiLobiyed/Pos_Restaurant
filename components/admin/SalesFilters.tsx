"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SalesFilters({ defaultDate }: { defaultDate: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setDate(date: string) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("date", date);
    router.push(`/admin/sales?${p.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="date" className="text-sm font-semibold text-dark-700">
        Date
      </label>
      <input
        id="date"
        type="date"
        defaultValue={defaultDate}
        onChange={(e) => setDate(e.target.value)}
        className="input-field w-auto max-w-[180px]"
      />
    </div>
  );
}
