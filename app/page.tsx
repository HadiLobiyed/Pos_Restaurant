import Image from "next/image";
import Link from "next/link";
import { getHomePageContent } from "@/lib/homePageSettings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const c = await getHomePageContent();

  return (
    <main className="min-h-screen bg-dark-950 text-dark-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-dark-950/90 backdrop-blur-md">
        <div className="home-container flex items-center justify-between gap-3 py-3 sm:gap-4 md:py-3.5">
          <Link
            href="/"
            className="min-w-0 truncate font-serif text-lg font-semibold tracking-wide text-white sm:text-xl md:text-xl"
          >
            {c.headerName}
          </Link>
          <nav className="flex max-w-[65vw] flex-wrap items-center justify-end gap-0.5 text-xs font-medium sm:max-w-none sm:gap-3 sm:text-sm md:gap-5">
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
              className="ml-1 rounded-full bg-primary-600 px-3.5 py-1.5 text-white shadow-glow transition hover:bg-primary-500 sm:px-4 sm:py-2"
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
        <div className="home-container relative grid items-center gap-8 py-10 sm:py-12 md:grid-cols-[1fr_min(42%,360px)] md:gap-10 md:py-12 lg:gap-12 lg:py-14">
          <div className="min-w-0">
            <p className="animate-fade-in mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-300 sm:text-sm md:tracking-[0.2em]">
              {c.hero.tagline}
            </p>
            <h1 className="animate-fade-in mb-4 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl md:text-[2.125rem] md:leading-snug lg:text-4xl">
              {c.hero.title}
            </h1>
            <p className="animate-slide-up mb-6 max-w-lg text-base leading-relaxed text-dark-300 md:text-[0.9375rem] md:leading-relaxed lg:max-w-xl lg:text-base">
              {c.hero.description}
            </p>
            <div className="animate-slide-up mb-8 flex flex-wrap gap-2.5 sm:gap-3">
              <Link
                href="/reserver"
                className="inline-flex items-center justify-center rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-elevated transition hover:bg-accent-400 sm:rounded-2xl sm:px-6 sm:py-3"
              >
                Réserver une table
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/15 sm:rounded-2xl sm:px-6 sm:py-3"
              >
                Découvrir la carte
              </Link>
              <Link
                href="/commander"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-dark-100 transition hover:bg-white/10 sm:rounded-2xl sm:px-6 sm:py-3"
              >
                Commander en ligne
              </Link>
            </div>
            <div className="flex flex-wrap gap-5 border-t border-white/10 pt-6 text-xs text-dark-400 sm:gap-6 sm:text-sm md:pt-5">
              {c.highlights.map((h) => (
                <div key={h.title}>
                  <p className="font-semibold text-white">{h.title}</p>
                  <p>{h.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm motion-safe:animate-hero-reveal md:mx-0 md:max-w-none md:justify-self-end">
            <div className="relative animate-hero-glow-pulse rounded-2xl bg-gradient-to-br from-primary-400 via-accent-400 to-primary-600 p-[2px] sm:rounded-[1.65rem]">
              <div className="relative aspect-[4/5] max-h-[min(72vh,520px)] overflow-hidden rounded-[0.9rem] bg-dark-900 sm:rounded-[1.5rem] md:aspect-[5/6] md:max-h-[380px] lg:max-h-[420px]">
                <div className="absolute inset-0 will-change-transform motion-safe:animate-hero-kenburns">
                  <div className="relative h-full min-h-[200px] w-full">
                    <Image
                      src={c.hero.image.url}
                      alt={c.hero.image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 360px"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-950/70 via-dark-950/10 to-transparent"
                  aria-hidden
                />
                <p className="absolute bottom-4 left-4 right-4 z-10 text-xs font-medium text-white/95 drop-shadow-md sm:bottom-5 sm:left-5 sm:right-5 sm:text-sm">
                  {c.hero.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-white/10 bg-primary-950/30 py-3 md:py-3.5">
        <p className="home-container text-center text-xs font-medium tracking-wide text-primary-200/90 sm:text-sm">
          {c.bannerStrip}
        </p>
      </div>

      <section className="home-container home-section-y">
        <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 md:mb-10 md:grid-cols-4">
          {c.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-dark-900/50 px-3 py-4 text-center backdrop-blur-sm sm:rounded-2xl sm:px-4 sm:py-5 md:py-4"
            >
              <p className="font-serif text-2xl font-bold text-white sm:text-3xl md:text-2xl lg:text-3xl">{s.value}</p>
              <p className="mt-0.5 text-[11px] text-dark-400 sm:text-xs md:text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="home-heading mb-2 text-center">{c.gallery.title}</h2>
        <p className="home-subheading mx-auto mb-8 max-w-xl text-center md:mb-9">{c.gallery.subtitle}</p>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-12 md:gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 sm:rounded-2xl md:col-span-7 md:aspect-[16/10] md:max-h-[260px] lg:max-h-[300px]">
            <Image src={c.gallery.plat1.url} alt={c.gallery.plat1.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 420px" unoptimized />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:col-span-5 md:grid-cols-1 md:gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 sm:rounded-2xl md:aspect-[16/10] md:max-h-[140px] lg:max-h-[142px]">
              <Image src={c.gallery.plat2.url} alt={c.gallery.plat2.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 200px" unoptimized />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 sm:rounded-2xl md:aspect-[16/10] md:max-h-[140px] lg:max-h-[142px]">
              <Image src={c.gallery.plat3.url} alt={c.gallery.plat3.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 200px" unoptimized />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-dark-900/35 home-section-y">
        <div className="home-container grid items-center gap-8 md:grid-cols-2 md:gap-10">
          <div className="relative aspect-[5/4] max-h-[280px] overflow-hidden rounded-xl border border-white/10 shadow-elevated sm:rounded-2xl md:max-h-[300px] lg:max-h-[320px]">
            <Image src={c.ambiance.image.url} alt={c.ambiance.image.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 480px" unoptimized />
          </div>
          <div>
            <h2 className="home-heading mb-3">{c.ambiance.title}</h2>
            <p className="mb-5 text-sm leading-relaxed text-dark-300 md:text-[0.9375rem]">{c.ambiance.description}</p>
            <ul className="space-y-2.5 text-sm text-dark-200 md:text-[0.9375rem]">
              {c.ambiance.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600/30 text-[10px] font-bold text-primary-300">
                    ✓
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="home-container home-section-y">
        <h2 className="home-heading mb-2 text-center">{c.features.title}</h2>
        <p className="home-subheading mx-auto mb-8 max-w-xl text-center md:mb-10">{c.features.subtitle}</p>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3 md:gap-4 lg:gap-5">
          {c.features.items.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-xl border border-white/10 bg-dark-900/60 shadow-card backdrop-blur-sm transition hover:border-primary-500/35 sm:rounded-2xl"
            >
              <div className="relative aspect-[16/10] w-full md:aspect-[16/9] md:max-h-[140px]">
                <Image src={item.image.url} alt={item.image.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 320px" unoptimized />
              </div>
              <div className="p-4 md:p-5">
                <h3 className="mb-2 font-serif text-lg font-semibold text-white md:text-xl">{item.title}</h3>
                <p className="text-xs leading-relaxed text-dark-400 sm:text-sm">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-dark-900/40 home-section-y">
        <div className="home-container">
          <h2 className="home-heading mb-6 text-center md:mb-8">{c.testimonials.title}</h2>
          <div className="grid gap-4 md:grid-cols-3 md:gap-4 lg:gap-5">
            {c.testimonials.items.map((t) => (
              <blockquote
                key={t.author}
                className="rounded-xl border border-white/10 bg-dark-950/60 p-5 backdrop-blur-sm sm:rounded-2xl md:p-6"
              >
                <p className="mb-3 text-sm leading-relaxed text-dark-100 sm:text-base">&ldquo;{t.quote}&rdquo;</p>
                <footer className="text-xs font-semibold text-primary-400 sm:text-sm">{t.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[220px] md:min-h-[260px] lg:min-h-[280px]">
        <Image src={c.cta.image.url} alt={c.cta.image.alt} fill className="object-cover" sizes="100vw" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/95 via-dark-950/75 to-dark-950/40" />
        <div className="home-container relative flex flex-col justify-center gap-5 py-10 sm:py-12 md:flex-row md:items-center md:justify-between md:py-12 lg:py-14">
          <div className="max-w-lg">
            <h2 className="home-heading mb-2">{c.cta.title}</h2>
            <p className="text-sm text-dark-200 md:text-base">{c.cta.text}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row sm:gap-3">
            <Link
              href="/reserver"
              className="inline-flex items-center justify-center rounded-xl bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-elevated transition hover:bg-accent-400 sm:rounded-2xl sm:px-7 sm:py-3.5"
            >
              Réserver
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:rounded-2xl sm:px-7 sm:py-3.5"
            >
              Voir le menu
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-dark-900/40">
        <div className="home-container grid gap-8 py-10 sm:py-12 md:grid-cols-2 md:gap-10 md:py-12 lg:py-14">
          <div>
            <h2 className="home-heading mb-4">{c.hours.title}</h2>
            <ul className="space-y-2.5 text-sm text-dark-300">
              {c.hours.rows.map((row, i) => (
                <li
                  key={row.label}
                  className={`flex justify-between gap-4 ${i < c.hours.rows.length - 1 ? "border-b border-white/5 pb-2.5" : ""}`}
                >
                  <span>{row.label}</span>
                  <span className="text-right text-white">{row.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-dark-500 sm:text-sm">{c.hours.note}</p>
          </div>
          <div className="flex flex-col justify-center rounded-xl border border-white/10 bg-gradient-to-br from-primary-900/40 to-dark-950 p-6 sm:rounded-2xl sm:p-8 md:p-6 lg:p-7">
            <h2 className="mb-2 font-serif text-xl font-bold text-white sm:text-2xl">{c.orderTracking.title}</h2>
            <p className="mb-5 text-sm text-dark-300">{c.orderTracking.text}</p>
            <Link
              href="/suivi"
              className="inline-flex w-fit items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-dark-900 transition hover:bg-dark-100 sm:px-6 sm:py-3"
            >
              Suivre ma commande
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-dark-950 py-8 sm:py-10 md:py-10">
        <div className="home-container mb-8 grid grid-cols-3 gap-2 sm:grid-cols-4 md:mb-8 md:grid-cols-6 md:max-w-4xl md:gap-2.5 lg:mx-auto" aria-hidden>
          {c.pageFooter.gridImages.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-white/10 opacity-90 transition hover:opacity-100 sm:rounded-xl">
              <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 768px) 33vw, 80px" unoptimized />
            </div>
          ))}
        </div>
        <div className="home-container flex flex-col items-center justify-between gap-5 border-t border-white/5 pt-8 text-center md:flex-row md:pt-8 md:text-left">
          <div>
            <p className="font-serif text-base font-semibold text-white sm:text-lg">{c.pageFooter.name}</p>
            <p className="mt-1 text-xs text-dark-500 sm:text-sm">{c.pageFooter.address}</p>
            <p className="mt-1 text-xs text-dark-500 sm:text-sm">{c.pageFooter.email}</p>
          </div>
          <div className="flex flex-col items-center gap-2 md:items-end">
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
