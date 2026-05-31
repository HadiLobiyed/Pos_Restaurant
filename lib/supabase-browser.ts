import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getMenuImageBucket,
  getSupabaseProjectUrlPublic,
  getSupabasePublishableKey,
} from "./supabase-storage";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  const url = getSupabaseProjectUrlPublic();
  const key = getSupabasePublishableKey();
  if (!url || !key) return null;

  if (!browserClient) {
    browserClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return browserClient;
}

export { getMenuImageBucket };
