"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const links: Array<{
  href: string;
  label: string;
  icon: string;
  badge?: "pendingReservations";
}> = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/pos", label: "POS", icon: "🖥️" },
  { href: "/admin/sales", label: "Ventes", icon: "💰" },
  { href: "/admin/menu", label: "Menu", icon: "📋" },
  { href: "/admin/tables", label: "Tables", icon: "🪑" },
  { href: "/admin/reservations", label: "Réservations", icon: "📅", badge: "pendingReservations" },
  { href: "/admin/kitchen", label: "Cuisine", icon: "👨‍🍳" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [pendingReservations, setPendingReservations] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/reservations/pending-count");
      if (res.ok) {
        const d = await res.json();
        setPendingReservations(typeof d.count === "number" ? d.count : 0);
      }
    }
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <aside className="flex w-64 flex-col bg-dark-900 text-white">
      <div className="border-b border-white/10 px-6 py-5">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-xl font-bold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-lg">
            R
          </span>
          Restaurant POS
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const showBadge =
            link.badge === "pendingReservations" && pendingReservations != null && pendingReservations > 0;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                pathname === link.href
                  ? "bg-primary-500/20 text-primary-300"
                  : "text-dark-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="flex-1">{link.label}</span>
              {showBadge && (
                <span className="shrink-0 min-w-[1.25rem] rounded-full bg-red-600 px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-white">
                  {pendingReservations! > 99 ? "99+" : pendingReservations}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-dark-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
