import type { SupabaseClient } from "@supabase/supabase-js";
import { getMenuImageBucketCandidates } from "./supabase-storage";
import crypto from "crypto";

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

export async function uploadBufferToMenuBucket(
  supabase: SupabaseClient,
  buffer: Buffer,
  ext: string,
  mime: string
): Promise<string> {
  const id = crypto.randomUUID();
  const pathVariants = [`menu/${id}.${ext}`, `${id}.${ext}`];
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
        continue;
      }
      throw new Error(lastError);
    }
  }

  throw new Error(
    `${lastError} — Vérifiez SUPABASE_STORAGE_BUCKET=PRODUITS, NEXT_PUBLIC_SUPABASE_URL (même projet que Storage), et exécutez supabase/storage-policies.sql.`
  );
}

export async function uploadFileToMenuBucket(
  supabase: SupabaseClient,
  file: File,
  ext: string,
  mime: string
): Promise<string> {
  const id = crypto.randomUUID();
  const pathVariants = [`menu/${id}.${ext}`, `${id}.${ext}`];
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
        continue;
      }
      throw new Error(lastError);
    }
  }

  throw new Error(`${lastError} — Exécutez supabase/storage-policies.sql dans Supabase.`);
}
