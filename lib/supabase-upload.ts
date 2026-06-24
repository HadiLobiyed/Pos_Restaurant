import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getMenuImageBucket,
  getMenuImageBucketCandidates,
  getSupabaseProjectRef,
  getSupabaseProjectUrl,
  DEFAULT_BUCKET,
} from "./supabase-storage";
import { randomId } from "./random-id";
import {
  ensurePublicStorageBucket,
  isBucketNotFoundError,
} from "./storage-bucket";

type UploadBody = Buffer | File | Blob;

async function tryUpload(
  supabase: SupabaseClient,
  bucket: string,
  objectPath: string,
  body: UploadBody,
  mime: string
): Promise<{ ok: true; publicUrl: string } | { ok: false; message: string }> {
  const { error } = await supabase.storage.from(bucket).upload(objectPath, body, {
    contentType: mime,
    upsert: true,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return { ok: true, publicUrl: data.publicUrl };
}

function formatBucketNotFound(lastError: string): string {
  const url = getSupabaseProjectUrl();
  const ref = url ? getSupabaseProjectRef(url) : null;
  const bucket = getMenuImageBucket();

  return (
    `${lastError} — Aucun bucket Storage utilisable (config : « ${bucket} »). ` +
    (ref ? `Projet Supabase : ${ref}. ` : "") +
    `Créez un bucket PUBLIC nommé « products » : Supabase → Storage. ` +
    `Puis sur Vercel : SUPABASE_STORAGE_BUCKET=products (comme dans l’URL .../public/products/...). ` +
    `(Settings → API → service_role) pour création auto.`
  );
}

async function prepareBuckets(
  supabase: SupabaseClient,
  adminSupabase: SupabaseClient | null
): Promise<string[]> {
  const candidates = getMenuImageBucketCandidates();
  if (!adminSupabase) return candidates;

  const toEnsure = [getMenuImageBucket(), DEFAULT_BUCKET, "produits"];
  for (const name of toEnsure) {
    await ensurePublicStorageBucket(adminSupabase, name).catch(() => {});
  }
  return candidates;
}

export async function uploadBufferToMenuBucket(
  supabase: SupabaseClient,
  buffer: Buffer,
  ext: string,
  mime: string,
  adminSupabase?: SupabaseClient | null
): Promise<string> {
  const id = randomId();
  const pathVariants = [`${id}.${ext}`, `menu/${id}.${ext}`];
  const buckets = await prepareBuckets(supabase, adminSupabase ?? null);

  let lastError = "Upload impossible";

  for (const bucket of buckets) {
    for (const objectPath of pathVariants) {
      const result = await tryUpload(supabase, bucket, objectPath, buffer, mime);
      if (result.ok) return result.publicUrl;

      lastError = `[${bucket}] ${result.message}`;
      const msg = result.message.toLowerCase();
      if (isBucketNotFoundError(msg)) continue;
      if (msg.includes("row-level security") || msg.includes("policy") || msg.includes("403")) {
        throw new Error(formatRlsError(lastError));
      }
      throw new Error(lastError);
    }
  }

  throw new Error(formatBucketNotFound(lastError));
}

function formatRlsError(lastError: string): string {
  return (
    `${lastError} — Ouvrez Supabase → SQL Editor, exécutez tout le fichier supabase/storage-policies.sql ` +
    `(ou ajoutez SUPABASE_SERVICE_ROLE_KEY sur Vercel pour contourner RLS).`
  );
}

export async function uploadFileToMenuBucket(
  supabase: SupabaseClient,
  file: File,
  ext: string,
  mime: string,
  adminSupabase?: SupabaseClient | null
): Promise<string> {
  const id = randomId();
  const pathVariants = [`${id}.${ext}`, `menu/${id}.${ext}`];
  const buckets = await prepareBuckets(supabase, adminSupabase ?? null);

  let lastError = "Upload impossible";

  for (const bucket of buckets) {
    for (const objectPath of pathVariants) {
      const result = await tryUpload(supabase, bucket, objectPath, file, mime);
      if (result.ok) return result.publicUrl;

      lastError = `[${bucket}] ${result.message}`;
      const msg = result.message.toLowerCase();
      if (isBucketNotFoundError(msg)) continue;
      if (msg.includes("row-level security") || msg.includes("policy") || msg.includes("403")) {
        throw new Error(formatRlsError(lastError));
      }
      throw new Error(lastError);
    }
  }

  throw new Error(formatBucketNotFound(lastError));
}

/** Logo restaurant — chemin fixe branding/logo.{ext} (upsert) */
export async function uploadBufferToBrandingBucket(
  supabase: SupabaseClient,
  buffer: Buffer,
  ext: string,
  mime: string,
  adminSupabase?: SupabaseClient | null
): Promise<{ publicUrl: string; storagePath: string }> {
  const objectPath = `branding/logo.${ext}`;
  const buckets = await prepareBuckets(supabase, adminSupabase ?? null);
  let lastError = "Upload impossible";

  for (const bucket of buckets) {
    const result = await tryUpload(supabase, bucket, objectPath, buffer, mime);
    if (result.ok) return { publicUrl: result.publicUrl, storagePath: `${bucket}/${objectPath}` };

    lastError = `[${bucket}] ${result.message}`;
    const msg = result.message.toLowerCase();
    if (isBucketNotFoundError(msg)) continue;
    if (msg.includes("row-level security") || msg.includes("policy") || msg.includes("403")) {
      throw new Error(formatRlsError(lastError));
    }
    throw new Error(lastError);
  }

  throw new Error(formatBucketNotFound(lastError));
}
