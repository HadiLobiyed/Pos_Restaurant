import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="animate-fade-in mb-8 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary-500/20 px-4 py-1.5 text-sm font-semibold text-primary-300">
            Système de caisse & menu QR
          </span>
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-6xl">
            Restaurant
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              {" "}POS
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-dark-300">
            Gestion complète de votre restaurant : commandes, menu digital, tickets et tableau de bord.
          </p>
        </div>

        <div className="animate-slide-up flex flex-col gap-4 sm:flex-row">
          <Link
            href="/admin/login"
            className="group flex items-center justify-center gap-2 rounded-2xl bg-primary-500 px-8 py-4 font-semibold text-white shadow-glow transition-all hover:bg-primary-400 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Admin / Staff
          </Link>
          <Link
            href="/menu"
            className="group flex items-center justify-center gap-2 rounded-2xl border-2 border-white/30 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/50"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Voir le menu
          </Link>
        </div>

        <div className="mt-16 grid max-w-3xl grid-cols-3 gap-6 text-center">
          {[
            { icon: "📱", label: "Menu QR", desc: "Commande par scan" },
            { icon: "🖥️", label: "POS", desc: "Caisse intuitive" },
            { icon: "📊", label: "Tableau de bord", desc: "Ventes en temps réel" },
          ].map((f) => (
            <div key={f.label} className="rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
              <span className="text-3xl">{f.icon}</span>
              <p className="mt-2 font-semibold text-white">{f.label}</p>
              <p className="text-sm text-dark-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
