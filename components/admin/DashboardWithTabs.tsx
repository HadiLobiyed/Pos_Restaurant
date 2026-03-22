"use client";

import { useState } from "react";
import { OpeningHoursSettings } from "@/components/admin/OpeningHoursSettings";

export function DashboardWithTabs({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<"overview" | "hours">("overview");

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-dark-900">Dashboard</h1>

      <div className="mb-8 flex gap-1 border-b border-dark-200">
        <button
          type="button"
          onClick={() => setTab("overview")}
          className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            tab === "overview"
              ? "border-primary-500 text-primary-700"
              : "border-transparent text-dark-500 hover:text-dark-800"
          }`}
        >
          Vue d&apos;ensemble
        </button>
        <button
          type="button"
          onClick={() => setTab("hours")}
          className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            tab === "hours"
              ? "border-primary-500 text-primary-700"
              : "border-transparent text-dark-500 hover:text-dark-800"
          }`}
        >
          Horaires d&apos;ouverture
        </button>
      </div>

      {tab === "overview" ? children : <OpeningHoursSettings />}
    </div>
  );
}
