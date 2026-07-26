"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MenuClient, type MenuMode } from "@/components/menu/MenuClient";

type OrderMeta = {
  channel: string;
  publicCode: string | null;
};

function MenuContent() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("table") ?? null;
  const codeParam = searchParams.get("code") ?? null;
  const modeParam = searchParams.get("mode");

  const [orderMeta, setOrderMeta] = useState<OrderMeta | null>(null);
  const [codeLoading, setCodeLoading] = useState(!!codeParam);
  const [codeError, setCodeError] = useState("");

  const mode: MenuMode | "browse" =
    codeParam && orderMeta
      ? orderMeta.channel === "DELIVERY"
        ? "delivery"
        : "takeaway"
      : modeParam === "takeaway"
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
    stock: number | null;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!codeParam) {
      setOrderMeta(null);
      setCodeLoading(false);
      setCodeError("");
      return;
    }
    setCodeLoading(true);
    setCodeError("");
    fetch(`/api/orders/modify?code=${encodeURIComponent(codeParam)}`)
      .then(async (r) => {
        const body = await r.json().catch(() => ({}));
        if (!r.ok) {
          throw new Error(typeof body?.error === "string" ? body.error : "Commande introuvable.");
        }
        return body as OrderMeta;
      })
      .then((payload) => {
        if (payload.channel !== "TAKEAWAY" && payload.channel !== "DELIVERY") {
          throw new Error("Ce code ne correspond pas à une commande en ligne.");
        }
        setOrderMeta(payload);
      })
      .catch((err) => {
        setOrderMeta(null);
        setCodeError(err instanceof Error ? err.message : "Commande introuvable.");
      })
      .finally(() => setCodeLoading(false));
  }, [codeParam]);

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

  if (loading || codeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-50">
        <p className="text-dark-500">Chargement du menu...</p>
      </div>
    );
  }

  if (codeParam && codeError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-dark-50 px-4">
        <p className="mb-4 text-center text-red-600">{codeError}</p>
        <Link href="/suivi" className="font-semibold text-primary-600 hover:text-primary-700">
          Retour au suivi
        </Link>
      </div>
    );
  }

  const hideBack = (mode === "table" && !!tableId) || !!codeParam;
  const activeCode = codeParam ?? orderMeta?.publicCode ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 to-white pb-24">
      <header className="sticky top-0 z-10 border-b border-dark-200/60 bg-white/80 px-4 py-4 backdrop-blur-md">
        <div className="page-shell flex items-center justify-between gap-2">
          {hideBack ? (
            <div className="w-16 shrink-0" />
          ) : (
            <Link href="/" className="shrink-0 font-semibold text-primary-600 transition hover:text-primary-700">
              ← Retour
            </Link>
          )}
          <h1 className="text-xl font-bold text-dark-900">Notre menu</h1>
          {mode === "table" && tableId ? (
            <div className="flex shrink-0 gap-1 text-xs font-semibold sm:gap-2 sm:text-sm">
              <Link
                href={`/suivi?table=${encodeURIComponent(tableId)}`}
                className="rounded-lg px-2 py-1.5 text-primary-600 hover:bg-primary-50 sm:px-3"
              >
                Suivi
              </Link>
              <Link
                href={`/modifier?table=${encodeURIComponent(tableId)}`}
                className="rounded-lg px-2 py-1.5 text-primary-600 hover:bg-primary-50 sm:px-3"
              >
                Modifier
              </Link>
            </div>
          ) : activeCode ? (
            <div className="flex shrink-0 gap-1 text-xs font-semibold sm:gap-2 sm:text-sm">
              <Link
                href={`/suivi?code=${encodeURIComponent(activeCode)}`}
                className="rounded-lg px-2 py-1.5 text-primary-600 hover:bg-primary-50 sm:px-3"
              >
                Suivi
              </Link>
              <Link
                href={`/modifier?code=${encodeURIComponent(activeCode)}`}
                className="rounded-lg px-2 py-1.5 text-primary-600 hover:bg-primary-50 sm:px-3"
              >
                Modifier
              </Link>
            </div>
          ) : (
            <div className="w-16 shrink-0" />
          )}
        </div>
        {mode === "browse" && (
          <p className="mt-2 text-center text-sm text-amber-700">
            Scannez le QR de votre table, ou utilisez <strong>Commander</strong> sur l&apos;accueil.
          </p>
        )}
        {mode === "takeaway" && (
          <p className="mt-2 text-center text-sm font-medium text-primary-700">
            {activeCode
              ? `À emporter — ajout à la commande ${activeCode}`
              : "À emporter — validez pour obtenir votre numéro de commande"}
          </p>
        )}
        {mode === "delivery" && (
          <p className="mt-2 text-center text-sm font-medium text-primary-700">
            {activeCode
              ? `Livraison — ajout à la commande ${activeCode}`
              : "Livraison — renseignez vos coordonnées au panier"}
          </p>
        )}
      </header>
      <MenuClient
        tableId={tableId}
        orderCode={activeCode}
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
