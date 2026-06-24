import type { SupabaseClient } from "@supabase/supabase-js";

export async function listStorageBucketNames(supabase: SupabaseClient): Promise<string[]> {
  const { data, error } = await supabase.storage.listBuckets();
  if (error || !data) return [];
  return data.map((b) => b.name);
}

/** Crée le bucket public s'il n'existe pas (nécessite la clé service_role). */
export async function ensurePublicStorageBucket(
  supabase: SupabaseClient,
  bucketName: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  const existing = await listStorageBucketNames(supabase);
  if (existing.includes(bucketName)) return { ok: true };

  const { error } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  });

  if (error) {
    return { ok: false, message: error.message };
  }
  return { ok: true };
}

export function isBucketNotFoundError(message: string): boolean {
  const msg = message.toLowerCase();
  return msg.includes("bucket not found") || (msg.includes("invalid") && msg.includes("bucket"));
}
