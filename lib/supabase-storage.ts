const DEFAULT_BUCKET = "PRODUITS";

/** Extrait https://REF.supabase.co depuis DATABASE_URL / POSTGRES_URL */
export function deriveSupabaseUrlFromDatabase(): string | null {
  const db = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
  if (!db.includes("supabase")) return null;

  const poolerRef = db.match(/postgres\.([a-z0-9]+)[:@]/i)?.[1];
  if (poolerRef) return `https://${poolerRef}.supabase.co`;

  const directRef = db.match(/db\.([a-z0-9]+)\.supabase\.co/i)?.[1];
  if (directRef) return `https://${directRef}.supabase.co`;

  return null;
}

export function getSupabaseProjectRef(url: string): string | null {
  return url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i)?.[1] ?? null;
}

/**
 * URL du projet Supabase.
 * Sur le serveur : si NEXT_PUBLIC_SUPABASE_URL ≠ projet DATABASE_URL, on utilise DATABASE_URL
 * (le bucket PRODUITS est en général sur le même projet que Postgres).
 */
export function getSupabaseProjectUrl(): string | null {
  const explicit = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL
  )?.trim();
  const fromDb = deriveSupabaseUrlFromDatabase();

  if (fromDb && explicit && fromDb !== explicit && typeof window === "undefined") {
    return fromDb;
  }

  return explicit || fromDb || null;
}

/** URL pour le navigateur (build Next.js) — uniquement NEXT_PUBLIC_* */
export function getSupabaseProjectUrlPublic(): string | null {
  const explicit = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL
  )?.trim();
  return explicit || null;
}

export function getSupabaseServiceKey(): string | null {
  const raw =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_KEY;
  return raw?.trim() || null;
}

export function getSupabasePublishableKey(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return raw?.trim() || null;
}

export function getMenuImageBucket(): string {
  const raw = process.env.SUPABASE_STORAGE_BUCKET?.trim();
  return raw || DEFAULT_BUCKET;
}

export function getMenuImageBucketCandidates(): string[] {
  const primary = getMenuImageBucket();
  const variants = new Set<string>([primary]);
  if (primary.toLowerCase() !== primary) variants.add(primary.toLowerCase());
  if (primary.toUpperCase() !== primary) variants.add(primary.toUpperCase());
  return Array.from(variants);
}

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(getSupabaseProjectUrl() && (getSupabaseServiceKey() || getSupabasePublishableKey()));
}

export function getSupabaseStorageConfigDebug() {
  const explicit = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL
  )?.trim();
  const fromDb = deriveSupabaseUrlFromDatabase();
  const resolved = getSupabaseProjectUrl();
  return {
    explicitUrl: explicit ?? null,
    derivedFromDatabaseUrl: fromDb,
    resolvedServerUrl: resolved,
    publicBrowserUrl: getSupabaseProjectUrlPublic(),
    urlsMismatch: Boolean(explicit && fromDb && explicit !== fromDb),
    bucket: getMenuImageBucket(),
    hasPublishableKey: Boolean(getSupabasePublishableKey()),
    hasServiceRoleKey: Boolean(getSupabaseServiceKey()),
  };
}
