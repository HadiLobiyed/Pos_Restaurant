import Image from "next/image";
import Link from "next/link";
import { getHomePageContent } from "@/lib/homePageSettings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const c = await getHomePageContent();

  return (
    <main className="min-h-screen bg-dark-950 text-dark-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-dark-950/90 backdrop-blur-md">
        <div className="page-shell flex items-center justify-between gap-3 py-4 sm:gap-4">
          <Link href="/" className="min-w-0 truncate font-serif text-lg font-semibold tracking-wide text-white sm:text-xl md:text-2xl">
            {c.headerName}
          </Link>
          <nav className="flex max-w-[65vw] flex-wrap items-center justify-end gap-0.5 text-xs font-medium sm:max-w-none sm:gap-4 sm:text-sm md:gap-6 md:text-base">
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

      <section className="relative overflow-x-clip border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-950 to-primary-950/80" aria-hidden />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L100 50L50 100L0 50Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
        <div className="page-shell relative grid items-center gap-10 py-12 sm:py-16 md:grid-cols-2 md:gap-12 md:py-24">
          <div>
            <p className="animate-fade-in mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-300">
              {c.hero.tagline}
            </p>
            <h1 className="animate-fade-in mb-6 font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl md:leading-tight">
              {c.hero.title}
            </h1>
            <p className="animate-slide-up mb-8 max-w-xl text-lg leading-relaxed text-dark-300 md:text-xl">
              {c.hero.description}
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
              {c.highlights.map((h) => (
                <div key={h.title}>
                  <p className="font-semibold text-white">{h.title}</p>
                  <p>{h.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md motion-safe:animate-hero-reveal md:max-w-none">
            <div className="relative animate-hero-glow-pulse rounded-[1.65rem] bg-gradient-to-br from-primary-400 via-accent-400 to-primary-600 p-[2px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-dark-900 md:aspect-[3/4]">
                <div className="absolute inset-0 will-change-transform motion-safe:animate-hero-kenburns">
                  <div className="relative h-full min-h-[200px] w-full">
                    <Image
                      src={c.hero.image.url}
                      alt={c.hero.image.alt}
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
                <p className="absolute bottom-5 left-5 right-5 z-10 text-sm font-medium text-white/95 drop-shadow-md">
                  {c.hero.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-white/10 bg-primary-950/30 py-4">
        <p className="page-shell text-center text-sm font-medium tracking-wide text-primary-200/90">
          {c.bannerStrip}
        </p>
      </div>

      <section className="page-shell py-12 sm:py-14 md:py-20">
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {c.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-dark-900/50 px-4 py-6 text-center backdrop-blur-sm"
            >
              <p className="font-serif text-3xl font-bold text-white md:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs text-dark-400 md:text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-2 text-center font-serif text-3xl font-bold text-white md:text-4xl">{c.gallery.title}</h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-dark-400">{c.gallery.subtitle}</p>
        <div className="grid gap-4 md:grid-cols-12 md:gap-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 md:col-span-7 md:aspect-auto md:min-h-[320px]">
            <Image src={c.gallery.plat1.url} alt={c.gallery.plat1.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 58vw" unoptimized />
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-5 md:grid-cols-1 md:gap-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <Image src={c.gallery.plat2.url} alt={c.gallery.plat2.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" unoptimized />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <Image src={c.gallery.plat3.url} alt={c.gallery.plat3.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" unoptimized />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-dark-900/35 py-14 md:py-20">
        <div className="page-shell grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-white/10 shadow-elevated">
            <Image src={c.ambiance.image.url} alt={c.ambiance.image.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
          </div>
          <div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">{c.ambiance.title}</h2>
            <p className="mb-6 leading-relaxed text-dark-300">{c.ambiance.description}</p>
            <ul className="space-y-3 text-dark-200">
              {c.ambiance.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-600/30 text-xs font-bold text-primary-300">
                    ✓
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="page-shell py-12 sm:py-14 md:py-20">
        <h2 className="mb-3 text-center font-serif text-3xl font-bold text-white md:text-4xl">{c.features.title}</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-dark-400">{c.features.subtitle}</p>
        <div className="grid gap-6 md:grid-cols-3">
          {c.features.items.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-dark-900/60 shadow-card backdrop-blur-sm transition hover:border-primary-500/35"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image src={item.image.url} alt={item.image.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
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
        <div className="page-shell">
          <h2 className="mb-10 text-center font-serif text-3xl font-bold text-white md:text-4xl">{c.testimonials.title}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {c.testimonials.items.map((t) => (
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
        <Image src={c.cta.image.url} alt={c.cta.image.alt} fill className="object-cover" sizes="100vw" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/95 via-dark-950/75 to-dark-950/40" />
        <div className="page-shell relative flex flex-col justify-center gap-6 py-14 sm:py-16 md:min-h-[360px] md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-xl">
            <h2 className="mb-3 font-serif text-3xl font-bold text-white md:text-4xl">{c.cta.title}</h2>
            <p className="text-dark-200">{c.cta.text}</p>
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
        <div className="page-shell grid gap-10 py-12 sm:py-14 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="mb-6 font-serif text-3xl font-bold text-white">{c.hours.title}</h2>
            <ul className="space-y-3 text-dark-300">
              {c.hours.rows.map((row, i) => (
                <li
                  key={row.label}
                  className={`flex justify-between gap-4 ${i < c.hours.rows.length - 1 ? "border-b border-white/5 pb-3" : ""}`}
                >
                  <span>{row.label}</span>
                  <span className="text-right text-white">{row.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-dark-500">{c.hours.note}</p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-primary-900/40 to-dark-950 p-8">
            <h2 className="mb-3 font-serif text-2xl font-bold text-white">{c.orderTracking.title}</h2>
            <p className="mb-6 text-dark-300">{c.orderTracking.text}</p>
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
        <div className="page-shell mb-10 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 md:gap-3" aria-hidden>
          {c.pageFooter.gridImages.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-white/10 opacity-90 transition hover:opacity-100">
              <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 768px) 33vw, 16vw" unoptimized />
            </div>
          ))}
        </div>
        <div className="page-shell flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 text-center md:flex-row md:text-left">
          <div>
            <p className="font-serif text-lg font-semibold text-white">{c.pageFooter.name}</p>
            <p className="mt-1 text-sm text-dark-500">{c.pageFooter.address}</p>
            <p className="mt-1 text-sm text-dark-500">{c.pageFooter.email}</p>
          </div>
          <div className="flex flex-col items-center gap-3 md:items-end">
            <p className="text-xs text-dark-600">
              © {new Date().getFullYear()} {c.pageFooter.copyrightName}. Tous droits réservés.
            </p>
            <Link href="/admin/login" className="text-xs text-dark-500 underline-offset-4 hover:text-dark-400 hover:underline">
              Espace équipe
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
