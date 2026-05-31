import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  for (const f of [".env", ".env.local"]) {
    try {
      for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    } catch {
      /* ignore */
    }
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY;
const publishable =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "PRODUITS";

console.log("URL:", url ? "set" : "MISSING");
console.log("Service role:", service ? "set" : "MISSING");
console.log("Publishable:", publishable ? "set" : "MISSING");
console.log("Bucket env:", bucket);

if (!url) process.exit(0);

const key = service || publishable;
if (!key) {
  console.log("No Supabase key to test");
  process.exit(0);
}

const sb = createClient(url, key, { auth: { persistSession: false } });
const buf = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z5BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

const { data: buckets, error: listErr } = await sb.storage.listBuckets();
if (listErr) {
  console.log("listBuckets:", listErr.message);
} else {
  console.log(
    "Buckets in project:",
    buckets?.length ? buckets.map((x) => x.name).join(", ") : "(none)"
  );
}

for (const b of [bucket, bucket.toLowerCase()]) {
  const path = `menu/test-${Date.now()}.png`;
  const { data, error } = await sb.storage.from(b).upload(path, buf, {
    contentType: "image/png",
    upsert: true,
  });
  console.log(
    `Bucket "${b}":`,
    error ? `FAIL — ${error.message}` : `OK — ${data?.path}`
  );
  if (!error) {
    const { data: pub } = sb.storage.from(b).getPublicUrl(path);
    console.log("  Public URL:", pub.publicUrl);
    await sb.storage.from(b).remove([path]);
  }
}
