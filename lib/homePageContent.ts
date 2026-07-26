/** Contenu éditable de la page d'accueil (layout fixe, textes + images modifiables). */
export type HomePageImage = {
  url: string;
  alt: string;
};

export type HomePageStat = {
  value: string;
  label: string;
};

export type HomePageHighlight = {
  title: string;
  subtitle: string;
};

export type HomePageFeature = {
  title: string;
  text: string;
  image: HomePageImage;
};

export type HomePageTestimonial = {
  quote: string;
  author: string;
};

export type HomePageHoursRow = {
  label: string;
  value: string;
};

export type HomePageContent = {
  headerName: string;
  hero: {
    tagline: string;
    title: string;
    description: string;
    image: HomePageImage;
    caption: string;
  };
  highlights: [HomePageHighlight, HomePageHighlight, HomePageHighlight];
  bannerStrip: string;
  stats: [HomePageStat, HomePageStat, HomePageStat, HomePageStat];
  gallery: {
    title: string;
    subtitle: string;
    plat1: HomePageImage;
    plat2: HomePageImage;
    plat3: HomePageImage;
  };
  ambiance: {
    title: string;
    description: string;
    bullets: [string, string, string];
    image: HomePageImage;
  };
  features: {
    title: string;
    subtitle: string;
    items: [HomePageFeature, HomePageFeature, HomePageFeature];
  };
  testimonials: {
    title: string;
    items: [HomePageTestimonial, HomePageTestimonial, HomePageTestimonial];
  };
  cta: {
    title: string;
    text: string;
    image: HomePageImage;
  };
  hours: {
    title: string;
    rows: [HomePageHoursRow, HomePageHoursRow, HomePageHoursRow];
    note: string;
  };
  orderTracking: {
    title: string;
    text: string;
  };
  pageFooter: {
    name: string;
    address: string;
    email: string;
    copyrightName: string;
    gridImages: [string, string, string, string, string, string];
  };
};

const IMG = {
  hero: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&h=2000&q=85",
  plat1: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
  plat2: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
  plat3: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",
  salle: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
  vin: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
  detail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  banner: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
} as const;

export const DEFAULT_HOME_PAGE_CONTENT: HomePageContent = {
  headerName: "La Maison",
  hero: {
    tagline: "Restaurant · Cuisine du marché",
    title: "Une table chaleureuse, des assiettes généreuses",
    description:
      "Venez partager un moment convivial autour de plats préparés avec des produits frais. Sur place, à emporter ou en livraison.",
    image: {
      url: IMG.hero,
      alt: "Salle du restaurant, tables dressées et ambiance tamisée",
    },
    caption: "Une salle lumineuse pour vos déjeuners et dîners entre amis.",
  },
  highlights: [
    { title: "Terrasse", subtitle: "Quand la météo le permet" },
    { title: "Parking", subtitle: "Places à proximité" },
    { title: "Groupes", subtitle: "Sur réservation" },
  ],
  bannerStrip: "Cuisine maison · Carte renouvelée · Accueil du midi au soir · Options végétariennes sur demande",
  stats: [
    { value: "15+", label: "Années d'expérience" },
    { value: "80", label: "Couverts" },
    { value: "4,8", label: "Avis clients" },
    { value: "100%", label: "Fait maison" },
  ],
  gallery: {
    title: "En quelques images",
    subtitle: "Des produits choisis avec soin, une présentation soignée et le plaisir du partage.",
    plat1: { url: IMG.plat1, alt: "Plat du jour, viande et légumes rôtis" },
    plat2: { url: IMG.plat2, alt: "Pizza ou plat italien garni" },
    plat3: { url: IMG.plat3, alt: "Dessert gourmand" },
  },
  ambiance: {
    title: "Un cadre pensé pour vos moments",
    description:
      "Nos équipes veillent à ce que chaque service se déroule dans la bonne humeur : table pour deux, grand groupe ou repas d'affaires, nous adaptons l'organisation pour que vous soyez à l'aise.",
    bullets: [
      "Menu enfant et options sans gluten sur demande (prévenir à la réservation).",
      "Carte des vins sélectionnée pour accompagner nos plats.",
      "Commande en ligne et retrait au comptoir sans attente inutile.",
    ],
    image: { url: IMG.salle, alt: "Tables dressées dans la salle du restaurant" },
  },
  features: {
    title: "Pourquoi nous rendre visite",
    subtitle: "Le goût du fait maison, le service attentif et une ambiance où l'on se sent comme à la maison.",
    items: [
      {
        title: "Produits frais",
        text: "Nos menus évoluent au fil des saisons, en privilégiant les producteurs locaux lorsque c'est possible.",
        image: { url: IMG.plat2, alt: "Ingrédients et plat coloré" },
      },
      {
        title: "Ambiance conviviale",
        text: "Idéal pour un dîner en couple, en famille ou entre amis. Réservez pour être sûr d'avoir une table.",
        image: { url: IMG.banner, alt: "Ambiance du restaurant et du bar, lumière chaude" },
      },
      {
        title: "Comme vous préférez",
        text: "Sur place au restaurant, à emporter ou livrés chez vous — la même qualité dans chaque commande.",
        image: { url: IMG.vin, alt: "Verres de vin sur une table" },
      },
    ],
  },
  testimonials: {
    title: "Ils en parlent",
    items: [
      { quote: "Accueil chaleureux et assiettes copieuses. On y retourne dès que possible !", author: "Camille L." },
      {
        quote: "Parfait pour un dîner en famille. Les enfants ont adoré, et les desserts sont une tuerie.",
        author: "Mehdi R.",
      },
      {
        quote: "Commande à emporter toujours prête à l'heure. Même qualité qu'au restaurant.",
        author: "Sophie T.",
      },
    ],
  },
  cta: {
    title: "Envie de nous rejoindre ce soir ?",
    text: "Réservez votre table en quelques clics ou parcourez la carte pour commander chez vous.",
    image: { url: IMG.banner, alt: "Vue d'ensemble du restaurant et du bar" },
  },
  hours: {
    title: "Horaires",
    rows: [
      { label: "Lundi — Jeudi", value: "12h — 14h30 · 19h — 22h30" },
      { label: "Vendredi — Samedi", value: "12h — 15h · 19h — 23h" },
      { label: "Dimanche", value: "12h — 15h" },
    ],
    note: "Fermeture annuelle : consultez-nous ou nos réseaux pour les dates.",
  },
  orderTracking: {
    title: "Déjà commandé ?",
    text: "Suivez l'état de votre commande avec votre numéro de table ou le code reçu après validation.",
  },
  pageFooter: {
    name: "La Maison",
    address: "12 rue de l'Exemple · 75000 Ville · 01 23 45 67 89",
    email: "contact@lamaison-restaurant.fr",
    copyrightName: "La Maison",
    gridImages: [IMG.plat1, IMG.detail, IMG.vin, IMG.plat3, IMG.plat2, IMG.salle],
  },
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mergeDeep<T>(defaults: T, partial: unknown): T {
  if (partial === undefined || partial === null) return defaults;
  if (Array.isArray(defaults)) {
    if (!Array.isArray(partial)) return defaults;
    return partial.map((item, i) => {
      const defItem = (defaults as unknown[])[i];
      if (isObject(defItem) && isObject(item)) return mergeDeep(defItem, item);
      return item ?? defItem;
    }) as T;
  }
  if (isObject(defaults)) {
    if (!isObject(partial)) return defaults;
    const out = { ...defaults } as Record<string, unknown>;
    for (const key of Object.keys(defaults)) {
      out[key] = mergeDeep((defaults as Record<string, unknown>)[key], partial[key]);
    }
    return out as T;
  }
  return (partial as T) ?? defaults;
}

export function parseHomePageContent(raw: unknown): HomePageContent {
  return mergeDeep(DEFAULT_HOME_PAGE_CONTENT, raw);
}
