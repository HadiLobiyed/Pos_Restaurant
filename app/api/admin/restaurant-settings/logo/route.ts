import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseStorageClient, getSupabaseAdmin } from "@/lib/supabase-admin";
import { uploadBufferToBrandingBucket } from "@/lib/supabase-upload";
import {
  extFromMenuImageMime,
  resolveMenuImageMime,
  validateMenuImageFile,
} from "@/lib/upload-menu-image";
import { isSupabaseStorageConfigured } from "@/lib/supabase-storage";
import { setRestaurantLogo } from "@/lib/restaurantSettings";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function uploadToLocal(buffer: Buffer, ext: string): Promise<{ publicUrl: string; storagePath: string }> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "branding");
  await mkdir(uploadsDir, { recursive: true });
  const filename = `logo.${ext}`;
  await writeFile(path.join(uploadsDir, filename), buffer);
  return { publicUrl: `/uploads/branding/${filename}`, storagePath: `local/${filename}` };
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user?.role ?? "STAFF";
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
    }

    const validation = validateMenuImageFile(file);
    if (validation) return NextResponse.json({ error: validation }, { status: 400 });

    const mime = resolveMenuImageMime(file)!;
    const ext = extFromMenuImageMime(mime)!;
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabase = getSupabaseStorageClient();
    const onVercel = Boolean(process.env.VERCEL);

    let uploaded: { publicUrl: string; storagePath: string };
    if (supabase) {
      const admin = getSupabaseAdmin();
      uploaded = await uploadBufferToBrandingBucket(supabase, buffer, ext, mime, admin);
    } else if (onVercel) {
      return NextResponse.json(
        {
          error: "Supabase Storage non configuré.",
          details:
            "Ajoutez NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY et SUPABASE_STORAGE_BUCKET=products sur Vercel.",
        },
        { status: 503 }
      );
    } else {
      uploaded = await uploadToLocal(buffer, ext);
    }

    const branding = await setRestaurantLogo({
      imageUrl: uploaded.publicUrl,
      storagePath: uploaded.storagePath,
      mimeType: mime,
    });

    revalidatePath("/", "layout");

    return NextResponse.json({
      ok: true,
      ...branding,
      storageConfigured: isSupabaseStorageConfigured(),
    });
  } catch (err: unknown) {
    console.error("POST /api/admin/restaurant-settings/logo", err);
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: "Impossible d'enregistrer le logo.", details: message }, { status: 500 });
  }
}
