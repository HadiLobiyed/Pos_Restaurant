import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseProjectUrl,
  getSupabasePublishableKey,
  getSupabaseServiceKey,
} from "./supabase-storage";

let storageClient: SupabaseClient | null = null;
let storageClientKeyUsed = "";

export function getSupabaseStorageClient(): SupabaseClient | null {
  const url = getSupabaseProjectUrl();
  const key = getSupabaseServiceKey() ?? getSupabasePublishableKey();
  if (!url || !key) return null;

  if (!storageClient || storageClientKeyUsed !== key) {
    storageClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    storageClientKeyUsed = key;
  }
  return storageClient;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = getSupabaseProjectUrl();
  const serviceKey = getSupabaseServiceKey();
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export { getMenuImageBucket, getMenuImageBucketCandidates } from "./supabase-storage";
