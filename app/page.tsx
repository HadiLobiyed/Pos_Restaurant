import Image from "next/image";
import Link from "next/link";

const img = {
  /** Même cliché que `salle` (ID fiable) — l’ancien photo-1517248135467… ne se charge plus chez certains navigateurs / réseaux */
  hero: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&h=2000&q=85",
  plat1: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
  plat2: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
  plat3: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",
  salle: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
  vin: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
  detail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  banner: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
} as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-dark-950 text-dark-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-dark-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link href="/" className="font-serif text-xl font-semibold tracking-wide text-white md:text-2xl">
            La Maison
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-1 text-sm font-medium md:gap-6 md:text-base">
            <Link href="/menu" className="rounded-lg px-2 py-2 text-dark-200 transition hover:text-white md:px-0">
              Carte
            </Link>
            <Link href="/commander" className="rounded-lg px-2 py-2 text-dark-200 transition hover:text-white md:px-0">
              Commander
            </Link>
            <Link href="/suivi" className="rounded-lg px-2 py-2 text-dark-200 transition hover:text-white md:px-0">
              Suivi
            </Link>
            <Link
              href="/reserver"
              className="ml-1 rounded-full bg-primary-600 px-4 py-2 text-white shadow-glow transition hover:bg-primary-500"
            >
              Réserver
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative border-b border-white/5 overflow-x-clip">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-950 to-primary-950/80" aria-hidden />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L100 50L50 100L0 50Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-12 md:px-6 md:py-24">
          <div>
            <p className="animate-fade-in mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-300">
              Restaurant · Cuisine du marché
            </p>
            <h1 className="animate-fade-in mb-6 font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl md:leading-tight">
              Une table chaleureuse, des assiettes généreuses
            </h1>
            <p className="animate-slide-up mb-8 max-w-xl text-lg leading-relaxed text-dark-300 md:text-xl">
              Venez partager un moment convivial autour de plats préparés avec des produits frais. Sur place, à emporter ou
              en livraison.
            </p>
            <div className="animate-slide-up mb-10 flex flex-wrap gap-3">
              <Link
                href="/reserver"
                className="inline-flex items-center justify-center rounded-2xl bg-accent-500 px-7 py-3.5 text-center font-semibold text-white shadow-elevated transition hover:bg-accent-400"
              >
                Réserver une table
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-white/35 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/15"
              >
                Découvrir la carte
              </Link>
              <Link
                href="/commander"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-7 py-3.5 font-semibold text-dark-100 transition hover:bg-white/10"
              >
                Commander en ligne
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 border-t border-white/10 pt-8 text-sm text-dark-400">
              <div>
                <p className="font-semibold text-white">Terrasse</p>
                <p>Quand la météo le permet</p>
              </div>
              <div>
                <p className="font-semibold text-white">Parking</p>
                <p>Places à proximité</p>
              </div>
              <div>
                <p className="font-semibold text-white">Groupes</p>
                <p>Sur réservation</p>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md motion-safe:animate-hero-reveal md:max-w-none">
            <div className="relative rounded-[1.65rem] bg-gradient-to-br from-primary-400 via-accent-400 to-primary-600 p-[2px] animate-hero-glow-pulse">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-dark-900 md:aspect-[3/4]">
                {/* next/image + fill : le parent direct doit être position: relative (pas seulement absolute) */}
                <div className="absolute inset-0 will-change-transform motion-safe:animate-hero-kenburns">
                  <div className="relative h-full min-h-[200px] w-full">
                    <Image
                      src={img.hero}
                      alt="Salle du restaurant, tables dressées et ambiance tamisée"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-950/70 via-dark-950/10 to-transparent"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.25), transparent 55%)",
                  }}
                  aria-hidden
                />
                <p className="absolute bottom-5 left-5 right-5 z-10 text-sm font-medium text-white/95 drop-shadow-md">
                  Une salle lumineuse pour vos déjeuners et dîners entre amis.
                </p>
              </div>
            </div>
          
          </div>
        </div>
      </section>

      <div className="border-b border-white/10 bg-primary-950/30 py-4">
        <p className="mx-auto max-w-6xl px-4 text-center text-sm font-medium tracking-wide text-primary-200/90 md:px-6">
          Cuisine maison · Carte renouvelée · Accueil du midi au soir · Options végétariennes sur demande
        </p>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { n: "15+", l: "Années d'expérience" },
            { n: "80", l: "Couverts" },
            { n: "4,8", l: "Avis clients" },
            { n: "100%", l: "Fait maison" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-white/10 bg-dark-900/50 px-4 py-6 text-center backdrop-blur-sm"
            >
              <p className="font-serif text-3xl font-bold text-white md:text-4xl">{s.n}</p>
              <p className="mt-1 text-xs text-dark-400 md:text-sm">{s.l}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-2 text-center font-serif text-3xl font-bold text-white md:text-4xl">En quelques images</h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-dark-400">
          Des produits choisis avec soin, une présentation soignée et le plaisir du partage.
        </p>
        <div className="grid gap-4 md:grid-cols-12 md:gap-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 md:col-span-7 md:aspect-auto md:min-h-[320px]">
            <Image src={img.plat1} alt="Plat du jour, viande et légumes rôtis" fill className="object-cover" sizes="(max-width: 768px) 100vw, 58vw" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-5 md:grid-cols-1 md:gap-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <Image src={img.plat2} alt="Pizza ou plat italien garni" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <Image src={img.plat3} alt="Dessert gourmand" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-dark-900/35 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-6">
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-white/10 shadow-elevated">
            <Image src={img.salle} alt="Tables dressées dans la salle du restaurant" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">Un cadre pensé pour vos moments</h2>
            <p className="mb-6 leading-relaxed text-dark-300">
              Nos équipes veillent à ce que chaque service se déroule dans la bonne humeur : table pour deux, grand groupe ou
              repas d&apos;affaires, nous adaptons l&apos;organisation pour que vous soyez à l&apos;aise.
            </p>
            <ul className="space-y-3 text-dark-200">
              <li className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-600/30 text-xs font-bold text-primary-300">
                  ✓
                </span>
                Menu enfant et options sans gluten sur demande (prévenir à la réservation).
              </li>
              <li className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-600/30 text-xs font-bold text-primary-300">
                  ✓
                </span>
                Carte des vins sélectionnée pour accompagner nos plats.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-600/30 text-xs font-bold text-primary-300">
                  ✓
                </span>
                Commande en ligne et retrait au comptoir sans attente inutile.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <h2 className="mb-3 text-center font-serif text-3xl font-bold text-white md:text-4xl">Pourquoi nous rendre visite</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-dark-400">
          Le goût du fait maison, le service attentif et une ambiance où l&apos;on se sent comme à la maison.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Produits frais",
              text: "Nos menus évoluent au fil des saisons, en privilégiant les producteurs locaux lorsque c'est possible.",
              img: img.plat2,
              alt: "Ingrédients et plat coloré",
            },
            {
              title: "Ambiance conviviale",
              text: "Idéal pour un dîner en couple, en famille ou entre amis. Réservez pour être sûr d'avoir une table.",
              img: img.banner,
              alt: "Ambiance du restaurant et du bar, lumière chaude",
            },
            {
              title: "Comme vous préférez",
              text: "Sur place au restaurant, à emporter ou livrés chez vous — la même qualité dans chaque commande.",
              img: img.vin,
              alt: "Verres de vin sur une table",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-dark-900/60 shadow-card backdrop-blur-sm transition hover:border-primary-500/35"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image src={item.img} alt={item.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-6">
                <h3 className="mb-3 font-serif text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-dark-400">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-dark-900/40 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="mb-10 text-center font-serif text-3xl font-bold text-white md:text-4xl">Ils en parlent</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "Accueil chaleureux et assiettes copieuses. On y retourne dès que possible !",
                author: "Camille L.",
              },
              {
                quote: "Parfait pour un dîner en famille. Les enfants ont adoré, et les desserts sont une tuerie.",
                author: "Mehdi R.",
              },
              {
                quote: "Commande à emporter toujours prête à l'heure. Même qualité qu'au restaurant.",
                author: "Sophie T.",
              },
            ].map((t) => (
              <blockquote
                key={t.author}
                className="rounded-2xl border border-white/10 bg-dark-950/60 p-6 backdrop-blur-sm md:p-8"
              >
                <p className="mb-4 text-lg leading-relaxed text-dark-100">&ldquo;{t.quote}&rdquo;</p>
                <footer className="text-sm font-semibold text-primary-400">{t.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[280px] md:min-h-[360px]">
        <Image
          src={img.banner}
          alt="Vue d'ensemble du restaurant et du bar"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/95 via-dark-950/75 to-dark-950/40" />
        <div className="relative mx-auto flex max-w-6xl flex-col justify-center gap-6 px-4 py-16 md:min-h-[360px] md:flex-row md:items-center md:justify-between md:px-6 md:py-20">
          <div className="max-w-xl">
            <h2 className="mb-3 font-serif text-3xl font-bold text-white md:text-4xl">Envie de nous rejoindre ce soir ?</h2>
            <p className="text-dark-200">
              Réservez votre table en quelques clics ou parcourez la carte pour commander chez vous.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/reserver"
              className="inline-flex items-center justify-center rounded-2xl bg-accent-500 px-8 py-4 font-semibold text-white shadow-elevated transition hover:bg-accent-400"
            >
              Réserver
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-white/40 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Voir le menu
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-dark-900/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 md:py-20">
          <div>
            <h2 className="mb-6 font-serif text-3xl font-bold text-white">Horaires</h2>
            <ul className="space-y-3 text-dark-300">
              <li className="flex justify-between gap-4 border-b border-white/5 pb-3">
                <span>Lundi — Jeudi</span>
                <span className="text-right text-white">12h — 14h30 · 19h — 22h30</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-white/5 pb-3">
                <span>Vendredi — Samedi</span>
                <span className="text-right text-white">12h — 15h · 19h — 23h</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Dimanche</span>
                <span className="text-right text-white">12h — 15h</span>
              </li>
            </ul>
            <p className="mt-6 text-sm text-dark-500">Fermeture annuelle : consultez-nous ou nos réseaux pour les dates.</p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-primary-900/40 to-dark-950 p-8">
            <h2 className="mb-3 font-serif text-2xl font-bold text-white">Déjà commandé ?</h2>
            <p className="mb-6 text-dark-300">
              Suivez l&apos;état de votre commande avec votre numéro de table ou le code reçu après validation.
            </p>
            <Link
              href="/suivi"
              className="inline-flex w-fit items-center rounded-xl bg-white px-6 py-3 font-semibold text-dark-900 transition hover:bg-dark-100"
            >
              Suivre ma commande
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-dark-950 px-4 py-12 md:px-6">
        <div
          className="mx-auto mb-10 grid max-w-6xl grid-cols-3 gap-2 md:grid-cols-6 md:gap-3"
          aria-hidden
        >
          {[img.plat1, img.detail, img.vin, img.plat3, img.plat2, img.salle].map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-white/10 opacity-90 transition hover:opacity-100">
              <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 768px) 33vw, 16vw" />
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 text-center md:flex-row md:text-left">
          <div>
            <p className="font-serif text-lg font-semibold text-white">La Maison</p>
            <p className="mt-1 text-sm text-dark-500">12 rue de l&apos;Exemple · 75000 Ville · 01 23 45 67 89</p>
            <p className="mt-1 text-sm text-dark-500">contact@lamaison-restaurant.fr</p>
          </div>
          <div className="flex flex-col items-center gap-3 md:items-end">
            <p className="text-xs text-dark-600">© {new Date().getFullYear()} La Maison. Tous droits réservés.</p>
            <Link href="/admin/login" className="text-xs text-dark-500 underline-offset-4 hover:text-dark-400 hover:underline">
              Espace équipe
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
