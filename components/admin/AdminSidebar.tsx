"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/pos", label: "POS", icon: "🖥️" },
  { href: "/admin/sales", label: "Ventes", icon: "💰" },
  { href: "/admin/menu", label: "Menu", icon: "📋" },
  { href: "/admin/tables", label: "Tables", icon: "🪑" },
  { href: "/admin/kitchen", label: "Cuisine", icon: "👨‍🍳" },
];

export function AdminSidebar() {
  const pathname = usePathname();

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
        {links.map((link) => (
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
            {link.label}
          </Link>
        ))}
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
