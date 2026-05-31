import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getMenuImageBucket,
  getMenuImageBucketCandidates,
  getSupabaseProjectRef,
  getSupabaseProjectUrl,
} from "./supabase-storage";
import { randomId } from "./random-id";

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
    `${lastError} — Bucket « ${bucket} » absent sur le projet Supabase` +
    (ref ? ` ${ref}` : "") +
    `. Corrigez NEXT_PUBLIC_SUPABASE_URL sur Vercel : ouvrez une image du site, copiez le host ` +
    `(https://XXXX.supabase.co) et utilisez les clés API de ce même projet (Settings → API). ` +
    `DATABASE_URL et Supabase Storage doivent être le même projet.`
  );
}

export async function uploadBufferToMenuBucket(
  supabase: SupabaseClient,
  buffer: Buffer,
  ext: string,
  mime: string
): Promise<string> {
  const id = randomId();
  const pathVariants = [`${id}.${ext}`, `menu/${id}.${ext}`];
  const buckets = getMenuImageBucketCandidates();

  let lastError = "Upload impossible";

  for (const bucket of buckets) {
    for (const objectPath of pathVariants) {
      const result = await tryUpload(supabase, bucket, objectPath, buffer, mime);
      if (result.ok) return result.publicUrl;

      lastError = `[${bucket}] ${result.message}`;
      const msg = result.message.toLowerCase();
      if (msg.includes("bucket not found") || (msg.includes("invalid") && msg.includes("bucket"))) {
        continue;
      }
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
  mime: string
): Promise<string> {
  const id = randomId();
  const pathVariants = [`${id}.${ext}`, `menu/${id}.${ext}`];
  const buckets = getMenuImageBucketCandidates();

  let lastError = "Upload impossible";

  for (const bucket of buckets) {
    for (const objectPath of pathVariants) {
      const result = await tryUpload(supabase, bucket, objectPath, file, mime);
      if (result.ok) return result.publicUrl;

      lastError = `[${bucket}] ${result.message}`;
      const msg = result.message.toLowerCase();
      if (msg.includes("bucket not found")) continue;
      if (msg.includes("row-level security") || msg.includes("policy") || msg.includes("403")) {
        throw new Error(formatRlsError(lastError));
      }
      throw new Error(lastError);
    }
  }

  throw new Error(formatBucketNotFound(lastError));
}
