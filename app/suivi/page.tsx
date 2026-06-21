"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const QrScanner = dynamic(() => import("@/components/public/QrScanner").then((m) => m.QrScanner), {
  ssr: false,
  loading: () => <p className="text-center text-sm text-dark-300">Chargement du scanner…</p>,
});

type TrackStep = "home" | "mode" | "scan" | "code" | "result";

type TrackPayload = {
  id: string;
  status: string;
  channel: string;
  publicCode: string | null;
  tableNumber: number | null;
  tableId: string | null;
  createdAt: string;
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

function labelOrderStatus(s: string): string {
  switch (s) {
    case "PENDING":
      return "En attente";
    case "IN_PROGRESS":
      return "En préparation";
    case "DONE":
      return "Terminée";
    default:
      return s;
  }
}

function displayGlobalStatus(data: TrackPayload): string {
  if (data.channel === "DELIVERY" && data.paymentStatus === "PAID") {
    if (data.status === "DONE") return "En Livraison";
    return "En livraison";
  }
  return labelOrderStatus(data.status);
}

function deliveryPaidSubtitle(data: TrackPayload): string | null {
  if (data.channel !== "DELIVERY" || data.paymentStatus !== "PAID") return null;
  if (data.status === "DONE") return "Merci de votre confiance.";
  return "Votre commande payée est en cours de préparation ou de livraison.";
}

function labelItemStatus(s: string): string {
  switch (s) {
    case "PENDING":
      return "En attente";
    case "IN_PROGRESS":
      return "En cours";
    case "DONE":
      return "Prêt";
    default:
      return s;
  }
}

function labelPayment(s: string | null): string {
  if (!s) return "—";
  if (s === "PAID") return "Payée";
  if (s === "UNPAID") return "À payer";
  return s;
}

function TrackResultSummary({ data }: { data: TrackPayload }) {
  const subtitle = deliveryPaidSubtitle(data);
  return (
    <div className="rounded-2xl border-2 border-primary-400/40 bg-white/10 p-6 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium text-primary-200">État global</p>
        {data.channel === "DELIVERY" && (
          <span className="rounded-full bg-accent-500/25 px-2.5 py-0.5 text-xs font-semibold text-accent-200">
            Livraison
          </span>
        )}
        {data.channel === "TAKEAWAY" && (
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-dark-200">
            À emporter
          </span>
        )}
      </div>
      <p className="mt-1 text-2xl font-bold text-white">{displayGlobalStatus(data)}</p>
      {subtitle && <p className="mt-2 text-sm text-dark-300">{subtitle}</p>}
      <div className="mt-4 grid gap-2 text-sm text-dark-200">
        {data.tableNumber != null && (
          <p>
            Table : <span className="font-semibold text-white">{data.tableNumber}</span>
          </p>
        )}
        {data.publicCode && (
          <p>
            Code : <span className="font-mono font-semibold text-white">{data.publicCode}</span>
          </p>
        )}
        <p>
          Paiement : <span className="text-white">{labelPayment(data.paymentStatus)}</span>
        </p>
      </div>
    </div>
  );
}

function SuiviContent() {
  const searchParams = useSearchParams();
  const tableFromUrl = searchParams.get("table");
  const codeFromUrl = searchParams.get("code");

  const [step, setStep] = useState<TrackStep>("home");
  const [codeInput, setCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TrackPayload | null>(null);
  const [query, setQuery] = useState<{ kind: "tableId" | "code"; value: string } | null>(null);

  const fetchTrack = useCallback(async (kind: "tableId" | "code", value: string) => {
    const q =
      kind === "tableId" ? `tableId=${encodeURIComponent(value)}` : `code=${encodeURIComponent(value)}`;
    const res = await fetch(`/api/orders/track?${q}`);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(typeof body?.error === "string" ? body.error : "Impossible de charger la commande.");
    }
    return body as TrackPayload;
  }, []);

  const openTableTrack = useCallback(
    async (tableId: string) => {
      setError("");
      setLoading(true);
      try {
        const payload = await fetchTrack("tableId", tableId);
        setData(payload);
        setQuery({ kind: "tableId", value: tableId });
        setStep("result");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur.");
      } finally {
        setLoading(false);
      }
    },
    [fetchTrack]
  );

  const openCodeTrack = useCallback(
    async (code: string) => {
      setError("");
      setLoading(true);
      try {
        const payload = await fetchTrack("code", code);
        setData(payload);
        setQuery({ kind: "code", value: code });
        setStep("result");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur.");
      } finally {
        setLoading(false);
      }
    },
    [fetchTrack]
  );

  useEffect(() => {
    if (tableFromUrl && step === "home") {
      openTableTrack(tableFromUrl);
    } else if (codeFromUrl && step === "home") {
      openCodeTrack(codeFromUrl);
    }
  }, [tableFromUrl, codeFromUrl, step, openTableTrack, openCodeTrack]);

  useEffect(() => {
    if (step !== "result" || !query) return;
    let cancelled = false;
    const load = () => {
      fetchTrack(query.kind, query.value)
        .then((payload) => {
          if (!cancelled) setData(payload);
        })
        .catch(() => {});
    };
    load();
    const t = setInterval(load, 10000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [step, query, fetchTrack]);

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    const c = codeInput.trim();
    if (!c) {
      setError("Indiquez le code de commande reçu après validation.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const payload = await fetchTrack("code", c);
      setData(payload);
      setQuery({ kind: "code", value: c });
      setStep("result");
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
    setQuery(null);
    setCodeInput("");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 px-4 py-12">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="mb-8 inline-block text-sm font-semibold text-primary-300 hover:text-white">
          ← Retour à l&apos;accueil
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-white">Suivi de commande</h1>
        <p className="mb-8 text-dark-300">
          Consultez l&apos;état de votre commande en temps réel (rafraîchissement automatique toutes les 10 secondes).
        </p>

        {step === "home" && (
          <div className="rounded-2xl border-2 border-white/20 bg-white/10 p-8 text-center backdrop-blur">
            {loading && (tableFromUrl || codeFromUrl) ? (
              <p className="text-dark-200">Chargement de votre commande…</p>
            ) : (
              <>
                <p className="mb-6 text-dark-200">
                  Sur place au restaurant ou commande à emporter / livraison ? Cliquez pour continuer.
                </p>
                <button
                  type="button"
                  onClick={() => setStep("mode")}
                  className="w-full rounded-2xl bg-accent-500 px-8 py-4 font-semibold text-white shadow-glow transition hover:bg-accent-400"
                >
                  Suivre ma commande
                </button>
              </>
            )}
            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          </div>
        )}

        {step === "mode" && (
          <div className="space-y-4">
            <p className="text-center text-sm font-medium text-white">Où avez-vous passé commande ?</p>
            <button
              type="button"
              onClick={() => {
                setStep("scan");
                setError("");
              }}
              className="flex w-full flex-col rounded-2xl border-2 border-white/20 bg-white/10 p-6 text-left text-white backdrop-blur transition hover:border-primary-400 hover:bg-white/15"
            >
              <span className="text-xl font-bold">Sur place</span>
              <span className="mt-2 text-sm text-dark-200">
                Scannez le QR code affiché sur votre table.
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("code");
                setError("");
              }}
              className="flex w-full flex-col rounded-2xl border-2 border-white/20 bg-white/10 p-6 text-left text-white backdrop-blur transition hover:border-primary-400 hover:bg-white/15"
            >
              <span className="text-xl font-bold">Hors restaurant</span>
              <span className="mt-2 text-sm text-dark-200">
                À emporter ou livraison : utilisez le code reçu (ex. CMD-123456).
              </span>
            </button>
            <button
              type="button"
              onClick={goHome}
              className="w-full rounded-xl border border-white/30 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              Retour
            </button>
          </div>
        )}

        {step === "scan" && (
          <div className="space-y-4 rounded-2xl border-2 border-white/20 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm font-semibold text-white">Scannez le QR code de votre table</p>
            <QrScanner onScan={openTableTrack} onError={setError} />
            {loading && <p className="text-center text-sm text-primary-200">Chargement…</p>}
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button
              type="button"
              onClick={() => {
                setStep("mode");
                setError("");
              }}
              className="w-full rounded-xl border border-white/30 py-3 font-semibold text-white hover:bg-white/10"
            >
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
              placeholder="CMD-123456 ou 123456"
              autoComplete="off"
              className="w-full rounded-xl border border-white/20 bg-dark-900/50 px-4 py-3 font-mono text-white placeholder:text-dark-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
            {error && <p className="text-sm text-red-300">{error}</p>}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-primary-500 py-3 font-semibold text-white hover:bg-primary-400 disabled:opacity-60"
              >
                {loading ? "Chargement…" : "Voir ma commande"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("mode");
                  setError("");
                }}
                className="rounded-xl border border-white/30 px-4 py-3 font-semibold text-white hover:bg-white/10"
              >
                Retour
              </button>
            </div>
          </form>
        )}

        {step === "result" && data && (
          <div className="space-y-6">
            <TrackResultSummary data={data} />

            <div className="rounded-2xl border-2 border-white/20 bg-white/10 p-6 backdrop-blur">
              <h2 className="mb-4 text-lg font-bold text-white">Votre commande</h2>
              <ul className="space-y-4">
                {data.items.map((line) => (
                  <li key={line.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium text-white">
                        {line.quantity}× {line.name}
                      </span>
                      <span className="shrink-0 text-dark-200">{line.lineTotal.toFixed(2)} DA</span>
                    </div>
                    {line.comment && <p className="mt-1 text-sm text-dark-300">Note : {line.comment}</p>}
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary-300">
                      {labelItemStatus(line.status)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-between border-t border-white/20 pt-4 text-lg font-bold text-white">
                <span>Total</span>
                <span>{data.total.toFixed(2)} DA</span>
              </div>
            </div>

            {data.paymentStatus === "UNPAID" && (data.tableId || data.publicCode) && (
              <Link
                href={
                  data.tableId
                    ? `/modifier?table=${encodeURIComponent(data.tableId)}`
                    : `/modifier?code=${encodeURIComponent(data.publicCode!)}`
                }
                className="block w-full rounded-xl border-2 border-primary-400/50 py-3 text-center font-semibold text-primary-200 hover:bg-white/10"
              >
                Modifier ma commande
              </Link>
            )}

            <button
              type="button"
              onClick={goHome}
              className="w-full rounded-xl border-2 border-white/30 py-3 font-semibold text-white hover:bg-white/10"
            >
              Nouvelle recherche
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SuiviCommandePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-dark-900">
          <p className="text-dark-300">Chargement…</p>
        </main>
      }
    >
      <SuiviContent />
    </Suspense>
  );
}
