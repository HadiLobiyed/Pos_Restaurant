"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type TrackStep = "home" | "mode" | "table" | "code" | "result";

type TrackPayload = {
  id: string;
  status: string;
  channel: string;
  publicCode: string | null;
  tableNumber: number | null;
  createdAt: string;
  paymentStatus: string | null;
  items: Array<{
    name: string;
    quantity: number;
    comment: string | null;
    status: string;
    unitPrice: number;
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

/** Livraison encaissée : le client voit « En livraison » plutôt que l’état cuisine seul */
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

export default function SuiviCommandePage() {
  const [step, setStep] = useState<TrackStep>("home");
  const [tableInput, setTableInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TrackPayload | null>(null);
  const [query, setQuery] = useState<{ kind: "table" | "code"; value: string } | null>(null);

  const fetchTrack = useCallback(async (kind: "table" | "code", value: string) => {
    const q = kind === "table" ? `table=${encodeURIComponent(value)}` : `code=${encodeURIComponent(value)}`;
    const res = await fetch(`/api/orders/track?${q}`);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(typeof body?.error === "string" ? body.error : "Impossible de charger la commande.");
    }
    return body as TrackPayload;
  }, []);

  useEffect(() => {
    if (step !== "result" || !query) return;
    let cancelled = false;
    const load = () => {
      fetchTrack(query.kind, query.value)
        .then((payload) => {
          if (!cancelled) setData(payload);
        })
        .catch(() => {
          /* garde le dernier état connu pendant le polling */
        });
    };
    load();
    const t = setInterval(load, 10000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [step, query, fetchTrack]);

  async function submitTable(e: React.FormEvent) {
    e.preventDefault();
    const n = tableInput.trim();
    if (!n) {
      setError("Indiquez le numéro de votre table.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const payload = await fetchTrack("table", n);
      setData(payload);
      setQuery({ kind: "table", value: n });
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

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
    setTableInput("");
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
            <p className="mb-6 text-dark-200">
              Vous êtes sur place au restaurant ou vous avez commandé à emporter / en livraison ? Cliquez pour continuer.
            </p>
            <button
              type="button"
              onClick={() => setStep("mode")}
              className="w-full rounded-2xl bg-accent-500 px-8 py-4 font-semibold text-white shadow-glow transition hover:bg-accent-400"
            >
              Suivre ma commande
            </button>
          </div>
        )}

        {step === "mode" && (
          <div className="space-y-4">
            <p className="text-center text-sm font-medium text-white">Où avez-vous passé commande ?</p>
            <button
              type="button"
              onClick={() => {
                setStep("table");
                setError("");
              }}
              className="flex w-full flex-col rounded-2xl border-2 border-white/20 bg-white/10 p-6 text-left text-white backdrop-blur transition hover:border-primary-400 hover:bg-white/15"
            >
              <span className="text-xl font-bold">Sur place</span>
              <span className="mt-2 text-sm text-dark-200">Vous mangez au restaurant : saisissez le numéro de votre table.</span>
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
                À emporter ou livraison : utilisez le code reçu après validation (ex. CMD-123456).
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("home");
                setError("");
              }}
              className="w-full rounded-xl border border-white/30 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              Retour
            </button>
          </div>
        )}

        {step === "table" && (
          <form onSubmit={submitTable} className="space-y-4 rounded-2xl border-2 border-white/20 bg-white/10 p-6 backdrop-blur">
            <label className="block text-sm font-semibold text-white">Numéro de table</label>
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={tableInput}
              onChange={(e) => setTableInput(e.target.value)}
              placeholder="Ex. 5"
              className="w-full rounded-xl border border-white/20 bg-dark-900/50 px-4 py-3 text-white placeholder:text-dark-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
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
                {data.items.map((line, i) => (
                  <li key={i} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium text-white">
                        {line.quantity}× {line.name}
                      </span>
                      <span className="shrink-0 text-dark-200">{(line.unitPrice * line.quantity).toFixed(2)} DA</span>
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
