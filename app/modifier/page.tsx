"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const QrScanner = dynamic(() => import("@/components/public/QrScanner").then((m) => m.QrScanner), {
  ssr: false,
  loading: () => <p className="text-center text-sm text-dark-300">Chargement du scanner…</p>,
});

type ModifyStep = "home" | "mode" | "scan" | "code" | "edit";

type ModifyPayload = {
  id: string;
  tableNumber: number | null;
  tableId: string | null;
  publicCode: string | null;
  paymentStatus: string | null;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    comment: string | null;
    status: string;
    unitPrice: number;
    lineTotal: number;
    editable: boolean;
  }>;
  total: number;
};

function labelItemStatus(s: string): string {
  switch (s) {
    case "PENDING":
      return "En attente";
    case "IN_PROGRESS":
      return "En préparation";
    case "DONE":
      return "Prêt";
    default:
      return s;
  }
}

function ModifyContent() {
  const searchParams = useSearchParams();
  const tableFromUrl = searchParams.get("table");
  const codeFromUrl = searchParams.get("code");

  const [step, setStep] = useState<ModifyStep>("home");
  const [codeInput, setCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<ModifyPayload | null>(null);
  const [auth, setAuth] = useState<{ kind: "tableId" | "code"; value: string } | null>(null);

  const fetchOrder = useCallback(async (kind: "tableId" | "code", value: string) => {
    const q =
      kind === "tableId" ? `tableId=${encodeURIComponent(value)}` : `code=${encodeURIComponent(value)}`;
    const res = await fetch(`/api/orders/modify?${q}`);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(typeof body?.error === "string" ? body.error : "Impossible de charger la commande.");
    }
    return body as ModifyPayload;
  }, []);

  const openEdit = useCallback(
    async (kind: "tableId" | "code", value: string) => {
      setError("");
      setLoading(true);
      try {
        const payload = await fetchOrder(kind, value);
        setData(payload);
        setAuth({ kind, value });
        setStep("edit");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur.");
      } finally {
        setLoading(false);
      }
    },
    [fetchOrder]
  );

  useEffect(() => {
    if (step !== "home") return;
    if (tableFromUrl) {
      openEdit("tableId", tableFromUrl);
    } else if (codeFromUrl) {
      openEdit("code", codeFromUrl);
    }
  }, [tableFromUrl, codeFromUrl, step, openEdit]);

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    const c = codeInput.trim();
    if (!c) {
      setError("Indiquez votre code commande.");
      return;
    }
    await openEdit("code", c);
  }

  async function updateItem(itemId: string, quantity: number) {
    if (!auth) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/modify/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity,
          ...(auth.kind === "tableId" ? { tableId: auth.value } : { code: auth.value }),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof body?.error === "string" ? body.error : "Modification impossible.");
      }
      setData(body as ModifyPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(itemId: string) {
    if (!auth) return;
    setError("");
    setLoading(true);
    try {
      const q =
        auth.kind === "tableId"
          ? `tableId=${encodeURIComponent(auth.value)}`
          : `code=${encodeURIComponent(auth.value)}`;
      const res = await fetch(`/api/orders/modify/items/${itemId}?${q}`, { method: "DELETE" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof body?.error === "string" ? body.error : "Suppression impossible.");
      }
      setData(body as ModifyPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  function goHome() {
    setStep("home");
    setError("");
    setData(null);
    setAuth(null);
    setCodeInput("");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 px-4 py-12">
      <div className="page-shell mx-auto w-full max-w-2xl">
        <Link href="/" className="mb-8 inline-block text-sm font-semibold text-primary-300 hover:text-white">
          ← Retour à l&apos;accueil
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-white">Modifier ma commande</h1>
        <p className="mb-8 text-dark-300">
          Sur place : scannez le QR de votre table. À emporter ou livraison : entrez votre code commande.
        </p>

        {step === "home" && (
          <div className="rounded-2xl border-2 border-white/20 bg-white/10 p-8 text-center backdrop-blur">
            {loading && (tableFromUrl || codeFromUrl) ? (
              <p className="text-dark-200">Chargement…</p>
            ) : (
              <button
                type="button"
                onClick={() => setStep("mode")}
                className="w-full rounded-2xl bg-accent-500 px-8 py-4 font-semibold text-white shadow-glow transition hover:bg-accent-400"
              >
                Modifier ma commande
              </button>
            )}
            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          </div>
        )}

        {step === "mode" && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                setStep("scan");
                setError("");
              }}
              className="flex w-full flex-col rounded-2xl border-2 border-white/20 bg-white/10 p-6 text-left text-white backdrop-blur transition hover:border-primary-400"
            >
              <span className="text-xl font-bold">Sur place</span>
              <span className="mt-2 text-sm text-dark-200">Scanner le QR code de la table</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("code");
                setError("");
              }}
              className="flex w-full flex-col rounded-2xl border-2 border-white/20 bg-white/10 p-6 text-left text-white backdrop-blur transition hover:border-primary-400"
            >
              <span className="text-xl font-bold">Hors restaurant</span>
              <span className="mt-2 text-sm text-dark-200">Entrer le code commande (CMD-…)</span>
            </button>
            <button type="button" onClick={goHome} className="w-full rounded-xl border border-white/30 py-3 text-sm text-white/90">
              Retour
            </button>
          </div>
        )}

        {step === "scan" && (
          <div className="space-y-4 rounded-2xl border-2 border-white/20 bg-white/10 p-6 backdrop-blur">
            <QrScanner onScan={(tableId) => openEdit("tableId", tableId)} onError={setError} />
            {loading && <p className="text-center text-sm text-primary-200">Chargement…</p>}
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button type="button" onClick={() => setStep("mode")} className="w-full rounded-xl border border-white/30 py-3 text-white">
              Retour
            </button>
          </div>
        )}

        {step === "code" && (
          <form onSubmit={submitCode} className="space-y-4 rounded-2xl border-2 border-white/20 bg-white/10 p-6 backdrop-blur">
            <label className="block text-sm font-semibold text-white">Code commande</label>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="CMD-123456"
              className="w-full rounded-xl border border-white/20 bg-dark-900/50 px-4 py-3 font-mono text-white focus:border-primary-400 focus:outline-none"
            />
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary-500 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Chargement…" : "Continuer"}
            </button>
          </form>
        )}

        {step === "edit" && data && (
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-white/20 bg-white/10 p-6 backdrop-blur">
              {data.tableNumber != null && (
                <p className="text-sm text-dark-200">
                  Table <span className="font-bold text-white">{data.tableNumber}</span>
                </p>
              )}
              {data.publicCode && (
                <p className="text-sm text-dark-200">
                  Code <span className="font-mono font-bold text-white">{data.publicCode}</span>
                </p>
              )}
              <p className="mt-2 text-xs text-dark-400">
                Les articles en cours de préparation ne peuvent plus être modifiés.
              </p>
            </div>

            <ul className="space-y-4">
              {data.items.map((line) => (
                <li key={line.id} className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-white">{line.name}</span>
                    <span className="text-dark-200">{line.lineTotal.toFixed(2)} DA</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase text-primary-300">
                    {labelItemStatus(line.status)}
                  </p>
                  {line.editable ? (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => updateItem(line.id, Math.max(0, line.quantity - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded border border-white/30 text-white"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-bold text-white">{line.quantity}</span>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => updateItem(line.id, line.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded border border-white/30 text-white"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => removeItem(line.id)}
                        className="ml-auto text-sm text-red-300 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-dark-400">Non modifiable — en préparation</p>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span>{data.total.toFixed(2)} DA</span>
            </div>

            {(data.tableId || data.publicCode) && (
              <Link
                href={
                  data.tableId
                    ? `/menu?table=${encodeURIComponent(data.tableId)}`
                    : `/menu?code=${encodeURIComponent(data.publicCode!)}`
                }
                className="block w-full rounded-xl bg-primary-500 py-3 text-center font-semibold text-white hover:bg-primary-400"
              >
                Ajouter des plats
              </Link>
            )}

            <Link
              href={
                data.tableId
                  ? `/suivi?table=${encodeURIComponent(data.tableId)}`
                  : data.publicCode
                    ? `/suivi?code=${encodeURIComponent(data.publicCode)}`
                    : "/suivi"
              }
              className="block w-full rounded-xl border border-white/30 py-3 text-center text-white"
            >
              Suivre ma commande
            </Link>

            {error && <p className="text-sm text-red-300">{error}</p>}

            <button type="button" onClick={goHome} className="w-full rounded-xl border border-white/30 py-3 text-white">
              Terminer
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ModifierCommandePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-dark-900">
          <p className="text-dark-300">Chargement…</p>
        </main>
      }
    >
      <ModifyContent />
    </Suspense>
  );
}
