import { getMenuImageBucket } from "./supabase-storage";
import { uploadFileToMenuBucket } from "./supabase-upload";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

export function resolveMenuImageMime(file: File): string | null {
  const raw = (file.type || "").toLowerCase();
  if (raw && ALLOWED_MIME.has(raw)) {
    return raw === "image/jpg" ? "image/jpeg" : raw;
  }
  const name = file.name.toLowerCase();
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  return null;
}

export function extFromMenuImageMime(mime: string): string | null {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return null;
  }
}

export function validateMenuImageFile(file: File): string | null {
  if (file.size === 0) return "Fichier vide.";
  if (file.size > MAX_BYTES) return "Image trop lourde (max 5 Mo).";
  if (!resolveMenuImageMime(file)) return "Type non supporté. Utilisez JPG, PNG ou WebP.";
  return null;
}

export async function uploadMenuImageViaApi(file: File): Promise<{ path?: string; error?: string }> {
  const validation = validateMenuImageFile(file);
  if (validation) return { error: validation };

  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/uploads/menu-image", { method: "POST", body: fd });
  const data = (await res.json().catch(() => ({}))) as {
    path?: string;
    error?: string;
    details?: string;
  };

  if (!res.ok) {
    const msg = data.details
      ? `${data.error ?? "Erreur upload"} — ${data.details}`
      : data.error ?? "Erreur upload image.";
    return { error: msg };
  }
  if (!data.path) return { error: "Réponse upload invalide." };
  return { path: data.path };
}

export async function uploadMenuImageViaSupabase(
  file: File,
  supabase: import("@supabase/supabase-js").SupabaseClient
): Promise<{ path?: string; error?: string }> {
  const validation = validateMenuImageFile(file);
  if (validation) return { error: validation };

  const mime = resolveMenuImageMime(file)!;
  const ext = extFromMenuImageMime(mime);
  if (!ext) return { error: "Type non supporté." };

  try {
    const path = await uploadFileToMenuBucket(supabase, file, ext, mime);
    return { path };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur upload";
    if (message.toLowerCase().includes("bucket not found")) {
      return {
        error: `Bucket Storage « ${getMenuImageBucket()} » introuvable. Vérifiez SUPABASE_STORAGE_BUCKET et NEXT_PUBLIC_SUPABASE_URL.`,
      };
    }
    return { error: message };
  }
}
