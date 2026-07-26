"use client";

import { useCallback, useEffect, useState } from "react";
import type { HomePageContent } from "@/lib/homePageContent";
import { DEFAULT_HOME_PAGE_CONTENT } from "@/lib/homePageContent";
import { Field, HomePageImageField, Section } from "@/components/admin/HomePageEditorFields";

export function HomePageEditor() {
  const [content, setContent] = useState<HomePageContent>(DEFAULT_HOME_PAGE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/home-page")
      .then((r) => r.json())
      .then((d) => {
        if (d.content) setContent(d.content as HomePageContent);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/home-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Page d'accueil enregistrée. Consultez le site public pour voir les changements.");
    } else {
      const d = await res.json().catch(() => ({}));
      setMessage(typeof d.error === "string" ? d.error : "Erreur à l'enregistrement.");
    }
  }

  if (loading) {
    return (
      <div className="mb-8 rounded-2xl border border-dark-200 bg-white p-6 text-dark-500 shadow-card">
        Chargement de la page d&apos;accueil…
      </div>
    );
  }

  return (
    <form onSubmit={save} className="mb-8 space-y-4">
      <div className="rounded-2xl border border-dark-200 bg-white p-6 shadow-card">
        <h2 className="mb-1 text-lg font-semibold text-dark-900">Page d&apos;accueil</h2>
        <p className="mb-4 text-sm text-dark-600">
          Modifiez les textes et les photos de la page publique. La disposition reste fixe. Le footer « Powred By
          Noblex » n&apos;est pas modifiable.
        </p>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary-600 hover:underline"
        >
          Voir la page d&apos;accueil →
        </a>
      </div>

      <Section title="En-tête">
        <Field label="Nom affiché en haut" value={content.headerName} onChange={(v) => setContent({ ...content, headerName: v })} />
      </Section>

      <Section title="Bannière principale (hero)">
        <Field label="Surtitre" value={content.hero.tagline} onChange={(v) => setContent({ ...content, hero: { ...content.hero, tagline: v } })} />
        <Field label="Titre principal" value={content.hero.title} onChange={(v) => setContent({ ...content, hero: { ...content.hero, title: v } })} />
        <Field label="Texte d'introduction" value={content.hero.description} onChange={(v) => setContent({ ...content, hero: { ...content.hero, description: v } })} multiline />
        <HomePageImageField
          label="Photo principale"
          url={content.hero.image.url}
          alt={content.hero.image.alt}
          showAlt
          onUrlChange={(url) => setContent({ ...content, hero: { ...content.hero, image: { ...content.hero.image, url } } })}
          onAltChange={(alt) => setContent({ ...content, hero: { ...content.hero, image: { ...content.hero.image, alt } } })}
        />
        <Field label="Légende sous la photo" value={content.hero.caption} onChange={(v) => setContent({ ...content, hero: { ...content.hero, caption: v } })} />
        <div className="grid gap-3 md:grid-cols-3">
          {content.highlights.map((h, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-dark-100 p-3">
              <Field label={`Info ${i + 1} — titre`} value={h.title} onChange={(v) => {
                const highlights = [...content.highlights] as HomePageContent["highlights"];
                highlights[i] = { ...highlights[i], title: v };
                setContent({ ...content, highlights });
              }} />
              <Field label={`Info ${i + 1} — sous-titre`} value={h.subtitle} onChange={(v) => {
                const highlights = [...content.highlights] as HomePageContent["highlights"];
                highlights[i] = { ...highlights[i], subtitle: v };
                setContent({ ...content, highlights });
              }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Bandeau sous le hero">
        <Field label="Texte du bandeau" value={content.bannerStrip} onChange={(v) => setContent({ ...content, bannerStrip: v })} />
      </Section>

      <Section title="Chiffres clés">
        <div className="grid gap-3 md:grid-cols-2">
          {content.stats.map((s, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 rounded-lg border border-dark-100 p-3">
              <Field label="Valeur" value={s.value} onChange={(v) => {
                const stats = [...content.stats] as HomePageContent["stats"];
                stats[i] = { ...stats[i], value: v };
                setContent({ ...content, stats });
              }} />
              <Field label="Libellé" value={s.label} onChange={(v) => {
                const stats = [...content.stats] as HomePageContent["stats"];
                stats[i] = { ...stats[i], label: v };
                setContent({ ...content, stats });
              }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Galerie « En quelques images »">
        <Field label="Titre" value={content.gallery.title} onChange={(v) => setContent({ ...content, gallery: { ...content.gallery, title: v } })} />
        <Field label="Sous-titre" value={content.gallery.subtitle} onChange={(v) => setContent({ ...content, gallery: { ...content.gallery, subtitle: v } })} multiline />
        {(["plat1", "plat2", "plat3"] as const).map((key, i) => (
          <HomePageImageField
            key={key}
            label={`Photo galerie ${i + 1}`}
            url={content.gallery[key].url}
            alt={content.gallery[key].alt}
            showAlt
            onUrlChange={(url) => setContent({ ...content, gallery: { ...content.gallery, [key]: { ...content.gallery[key], url } } })}
            onAltChange={(alt) => setContent({ ...content, gallery: { ...content.gallery, [key]: { ...content.gallery[key], alt } } })}
          />
        ))}
      </Section>

      <Section title="Section « Un cadre pensé pour vos moments »">
        <Field label="Titre" value={content.ambiance.title} onChange={(v) => setContent({ ...content, ambiance: { ...content.ambiance, title: v } })} />
        <Field label="Texte" value={content.ambiance.description} onChange={(v) => setContent({ ...content, ambiance: { ...content.ambiance, description: v } })} multiline />
        {content.ambiance.bullets.map((b, i) => (
          <Field key={i} label={`Point ${i + 1}`} value={b} onChange={(v) => {
            const bullets = [...content.ambiance.bullets] as HomePageContent["ambiance"]["bullets"];
            bullets[i] = v;
            setContent({ ...content, ambiance: { ...content.ambiance, bullets } });
          }} multiline />
        ))}
        <HomePageImageField
          label="Photo de la salle"
          url={content.ambiance.image.url}
          alt={content.ambiance.image.alt}
          showAlt
          onUrlChange={(url) => setContent({ ...content, ambiance: { ...content.ambiance, image: { ...content.ambiance.image, url } } })}
          onAltChange={(alt) => setContent({ ...content, ambiance: { ...content.ambiance, image: { ...content.ambiance.image, alt } } })}
        />
      </Section>

      <Section title="« Pourquoi nous rendre visite » (3 cartes)">
        <Field label="Titre de section" value={content.features.title} onChange={(v) => setContent({ ...content, features: { ...content.features, title: v } })} />
        <Field label="Sous-titre" value={content.features.subtitle} onChange={(v) => setContent({ ...content, features: { ...content.features, subtitle: v } })} multiline />
        {content.features.items.map((item, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-dark-100 p-4">
            <p className="text-sm font-semibold text-dark-800">Carte {i + 1}</p>
            <Field label="Titre" value={item.title} onChange={(v) => {
              const items = [...content.features.items] as HomePageContent["features"]["items"];
              items[i] = { ...items[i], title: v };
              setContent({ ...content, features: { ...content.features, items } });
            }} />
            <Field label="Texte" value={item.text} onChange={(v) => {
              const items = [...content.features.items] as HomePageContent["features"]["items"];
              items[i] = { ...items[i], text: v };
              setContent({ ...content, features: { ...content.features, items } });
            }} multiline />
            <HomePageImageField
              label="Photo"
              url={item.image.url}
              alt={item.image.alt}
              showAlt
              onUrlChange={(url) => {
                const items = [...content.features.items] as HomePageContent["features"]["items"];
                items[i] = { ...items[i], image: { ...items[i].image, url } };
                setContent({ ...content, features: { ...content.features, items } });
              }}
              onAltChange={(alt) => {
                const items = [...content.features.items] as HomePageContent["features"]["items"];
                items[i] = { ...items[i], image: { ...items[i].image, alt } };
                setContent({ ...content, features: { ...content.features, items } });
              }}
            />
          </div>
        ))}
      </Section>

      <Section title="Témoignages">
        <Field label="Titre" value={content.testimonials.title} onChange={(v) => setContent({ ...content, testimonials: { ...content.testimonials, title: v } })} />
        {content.testimonials.items.map((t, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-dark-100 p-3">
            <Field label={`Citation ${i + 1}`} value={t.quote} onChange={(v) => {
              const items = [...content.testimonials.items] as HomePageContent["testimonials"]["items"];
              items[i] = { ...items[i], quote: v };
              setContent({ ...content, testimonials: { ...content.testimonials, items } });
            }} multiline />
            <Field label="Auteur" value={t.author} onChange={(v) => {
              const items = [...content.testimonials.items] as HomePageContent["testimonials"]["items"];
              items[i] = { ...items[i], author: v };
              setContent({ ...content, testimonials: { ...content.testimonials, items } });
            }} />
          </div>
        ))}
      </Section>

      <Section title="Bannière « Envie de nous rejoindre »">
        <Field label="Titre" value={content.cta.title} onChange={(v) => setContent({ ...content, cta: { ...content.cta, title: v } })} />
        <Field label="Texte" value={content.cta.text} onChange={(v) => setContent({ ...content, cta: { ...content.cta, text: v } })} multiline />
        <HomePageImageField
          label="Photo de fond"
          url={content.cta.image.url}
          alt={content.cta.image.alt}
          showAlt
          onUrlChange={(url) => setContent({ ...content, cta: { ...content.cta, image: { ...content.cta.image, url } } })}
          onAltChange={(alt) => setContent({ ...content, cta: { ...content.cta, image: { ...content.cta.image, alt } } })}
        />
      </Section>

      <Section title="Horaires & suivi commande">
        <Field label="Titre horaires" value={content.hours.title} onChange={(v) => setContent({ ...content, hours: { ...content.hours, title: v } })} />
        {content.hours.rows.map((row, i) => (
          <div key={i} className="grid gap-2 md:grid-cols-2">
            <Field label="Jour(s)" value={row.label} onChange={(v) => {
              const rows = [...content.hours.rows] as HomePageContent["hours"]["rows"];
              rows[i] = { ...rows[i], label: v };
              setContent({ ...content, hours: { ...content.hours, rows } });
            }} />
            <Field label="Heures" value={row.value} onChange={(v) => {
              const rows = [...content.hours.rows] as HomePageContent["hours"]["rows"];
              rows[i] = { ...rows[i], value: v };
              setContent({ ...content, hours: { ...content.hours, rows } });
            }} />
          </div>
        ))}
        <Field label="Note sous les horaires" value={content.hours.note} onChange={(v) => setContent({ ...content, hours: { ...content.hours, note: v } })} multiline />
        <Field label="Titre « Déjà commandé ? »" value={content.orderTracking.title} onChange={(v) => setContent({ ...content, orderTracking: { ...content.orderTracking, title: v } })} />
        <Field label="Texte suivi commande" value={content.orderTracking.text} onChange={(v) => setContent({ ...content, orderTracking: { ...content.orderTracking, text: v } })} multiline />
      </Section>

      <Section title="Pied de page (contenu restaurant)">
        <Field label="Nom" value={content.pageFooter.name} onChange={(v) => setContent({ ...content, pageFooter: { ...content.pageFooter, name: v } })} />
        <Field label="Adresse & téléphone" value={content.pageFooter.address} onChange={(v) => setContent({ ...content, pageFooter: { ...content.pageFooter, address: v } })} />
        <Field label="E-mail" value={content.pageFooter.email} onChange={(v) => setContent({ ...content, pageFooter: { ...content.pageFooter, email: v } })} />
        <Field label="Nom copyright" value={content.pageFooter.copyrightName} onChange={(v) => setContent({ ...content, pageFooter: { ...content.pageFooter, copyrightName: v } })} />
        <p className="text-xs text-dark-500">Grille de 6 miniatures en bas de page :</p>
        {content.pageFooter.gridImages.map((url, i) => (
          <HomePageImageField
            key={i}
            label={`Miniature ${i + 1}`}
            url={url}
            onUrlChange={(newUrl) => {
              const gridImages = [...content.pageFooter.gridImages] as HomePageContent["pageFooter"]["gridImages"];
              gridImages[i] = newUrl;
              setContent({ ...content, pageFooter: { ...content.pageFooter, gridImages } });
            }}
          />
        ))}
      </Section>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-dark-200 bg-white p-5 shadow-card">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Enregistrement…" : "Enregistrer la page d'accueil"}
        </button>
        {message && <p className="text-sm text-dark-600">{message}</p>}
      </div>
    </form>
  );
}
