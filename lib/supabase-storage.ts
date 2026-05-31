const DEFAULT_BUCKET = "PRODUITS";

export function getSupabaseProjectUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  return raw?.trim() || null;
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

/** Noms de bucket à essayer (casse / variantes courantes). */
export function getMenuImageBucketCandidates(): string[] {
  const primary = getMenuImageBucket();
  const variants = new Set<string>([
    primary,
    primary.toLowerCase(),
    primary.toUpperCase(),
  ]);
  return Array.from(variants).filter(Boolean);
}

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(getSupabaseProjectUrl() && (getSupabaseServiceKey() || getSupabasePublishableKey()));
}
