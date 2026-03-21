import Link from "next/link";

export default function CommanderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 px-4 py-12">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="mb-8 inline-block text-sm font-semibold text-primary-300 hover:text-white">
          ← Retour à l&apos;accueil
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-white">Commander</h1>
        <p className="mb-10 text-dark-300">Choisissez comment vous souhaitez recevoir votre commande.</p>

        <div className="space-y-4">
          <Link
            href="/menu?mode=takeaway"
            className="flex flex-col rounded-2xl border-2 border-white/20 bg-white/10 p-6 text-white backdrop-blur transition hover:border-primary-400 hover:bg-white/15"
          >
            <span className="text-xl font-bold">À emporter</span>
            <span className="mt-2 text-sm text-dark-200">Commandez en ligne et récupérez au restaurant avec votre numéro de commande.</span>
          </Link>
          <Link
            href="/menu?mode=delivery"
            className="flex flex-col rounded-2xl border-2 border-white/20 bg-white/10 p-6 text-white backdrop-blur transition hover:border-primary-400 hover:bg-white/15"
          >
            <span className="text-xl font-bold">Livraison</span>
            <span className="mt-2 text-sm text-dark-200">Indiquez votre adresse au moment du panier. Vous recevrez un numéro de commande.</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
