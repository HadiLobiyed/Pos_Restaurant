"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ExportPurchasesButton } from "./ExportPurchasesButton";

export function StockPurchaseFilters({ selectedDate }: { selectedDate: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setDate(date: string) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("date", date);
    router.push(`/admin/stock?${p.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <label htmlFor="stock-date" className="text-sm font-semibold text-dark-700">
          Date
        </label>
        <input
          id="stock-date"
          type="date"
          value={selectedDate}
          onChange={(e) => setDate(e.target.value)}
          className="input-field w-auto max-w-[180px]"
        />
      </div>
      <ExportPurchasesButton date={selectedDate} />
    </div>
  );
}
