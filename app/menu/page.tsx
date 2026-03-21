"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MenuClient, type MenuMode } from "@/components/menu/MenuClient";

function MenuContent() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("table") ?? null;
  const modeParam = searchParams.get("mode");

  const mode: MenuMode | "browse" =
    modeParam === "takeaway"
      ? "takeaway"
      : modeParam === "delivery"
        ? "delivery"
        : tableId
          ? "table"
          : "browse";

  const [items, setItems] = useState<Array<{
    id: string;
    name: string;
    description: string | null;
    price: { toString(): string };
    image: string | null;
    categoryId: string;
    category: { id: string; name: string };
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu?public=true")
      .then(async (r) => {
        if (!r.ok) return [];
        const data = await r.json();
        return Array.isArray(data) ? data : [];
      })
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-50">
        <p className="text-dark-500">Chargement du menu...</p>
      </div>
    );
  }

  const hideBack = mode === "table" && !!tableId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 to-white pb-24">
      <header className="sticky top-0 z-10 border-b border-dark-200/60 bg-white/80 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          {hideBack ? (
            <div className="w-16" />
          ) : (
            <Link href="/" className="font-semibold text-primary-600 transition hover:text-primary-700">
              ← Retour
            </Link>
          )}
          <h1 className="text-xl font-bold text-dark-900">Notre menu</h1>
          <div className="w-16" />
        </div>
        {mode === "browse" && (
          <p className="mt-2 text-center text-sm text-amber-700">
            Scannez le QR de votre table, ou utilisez <strong>Commander</strong> sur l’accueil.
          </p>
        )}
        {mode === "takeaway" && (
          <p className="mt-2 text-center text-sm text-primary-700 font-medium">À emporter — validez pour obtenir votre numéro de commande</p>
        )}
        {mode === "delivery" && (
          <p className="mt-2 text-center text-sm text-primary-700 font-medium">Livraison — renseignez vos coordonnées au panier</p>
        )}
      </header>
      <MenuClient
        tableId={tableId}
        mode={mode === "browse" ? "table" : mode}
        items={items}
      />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-dark-50">
          <p className="text-dark-500">Chargement...</p>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
