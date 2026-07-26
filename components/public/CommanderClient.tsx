"use client";

import Link from "next/link";
import {
  RestaurantClosedBanner,
  useRestaurantOpen,
} from "@/components/public/useRestaurantOpen";

export function CommanderClient() {
  const { open, loading, hoursToday } = useRestaurantOpen();

  const orderingDisabled = !loading && open === false;

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 px-4 py-12">
      <div className="page-shell mx-auto w-full max-w-2xl">
        <Link href="/" className="mb-8 inline-block text-sm font-semibold text-primary-300 hover:text-white">
          ← Retour à l&apos;accueil
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-white">Commander</h1>
        <p className="mb-4 text-dark-300">Choisissez comment vous souhaitez recevoir votre commande.</p>
        {!loading && hoursToday && (
          <p className="mb-4 text-sm text-primary-200/90">Horaires du jour : {hoursToday}</p>
        )}
        {orderingDisabled && <RestaurantClosedBanner hoursToday={hoursToday} className="mb-6" />}

        <Link
          href="/suivi"
          className="mb-10 flex w-full items-center justify-center rounded-2xl border-2 border-primary-400/50 bg-primary-500/20 px-6 py-4 text-center font-semibold text-primary-100 transition hover:border-primary-300 hover:bg-primary-500/30"
        >
          Suivre une commande déjà passée
        </Link>

        <div className="space-y-4">
          {orderingDisabled ? (
            <>
              <div className="flex flex-col rounded-2xl border-2 border-white/10 bg-white/5 p-6 text-dark-400 opacity-60">
                <span className="text-xl font-bold">À emporter</span>
                <span className="mt-2 text-sm">Indisponible — restaurant fermé.</span>
              </div>
              <div className="flex flex-col rounded-2xl border-2 border-white/10 bg-white/5 p-6 text-dark-400 opacity-60">
                <span className="text-xl font-bold">Livraison</span>
                <span className="mt-2 text-sm">Indisponible — restaurant fermé.</span>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/menu?mode=takeaway"
                className="flex flex-col rounded-2xl border-2 border-white/20 bg-white/10 p-6 text-white backdrop-blur transition hover:border-primary-400 hover:bg-white/15"
              >
                <span className="text-xl font-bold">À emporter</span>
                <span className="mt-2 text-sm text-dark-200">
                  Commandez en ligne et récupérez au restaurant avec votre numéro de commande.
                </span>
              </Link>
              <Link
                href="/menu?mode=delivery"
                className="flex flex-col rounded-2xl border-2 border-white/20 bg-white/10 p-6 text-white backdrop-blur transition hover:border-primary-400 hover:bg-white/15"
              >
                <span className="text-xl font-bold">Livraison</span>
                <span className="mt-2 text-sm text-dark-200">
                  Indiquez votre adresse au moment du panier. Vous recevrez un numéro de commande.
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
