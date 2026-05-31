import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { getMenuImageBucketCandidates, getSupabaseStorageClient } from "@/lib/supabase-admin";
import { uploadBufferToMenuBucket } from "@/lib/supabase-upload";
import {
  extFromMenuImageMime,
  resolveMenuImageMime,
  validateMenuImageFile,
} from "@/lib/upload-menu-image";
import {
  getSupabaseProjectUrl,
  getSupabasePublishableKey,
  getSupabaseServiceKey,
  isSupabaseStorageConfigured,
} from "@/lib/supabase-storage";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function uploadToLocal(buffer: Buffer, ext: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "menu");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${crypto.randomUUID()}.${ext}`;
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/menu/${filename}`;
}

/** Diagnostic (admin connecté) — GET /api/uploads/menu-image */
export async function GET(req: NextRequest) {
  if (!(await requireApiAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseStorageClient();
  const buckets = getMenuImageBucketCandidates();
  const buf = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z5BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );

  const checks = {
    supabaseUrl: Boolean(getSupabaseProjectUrl()),
    publishableKey: Boolean(getSupabasePublishableKey()),
    serviceRoleKey: Boolean(getSupabaseServiceKey()),
    storageConfigured: isSupabaseStorageConfigured(),
    bucketCandidates: buckets,
    vercel: Boolean(process.env.VERCEL),
  };

  if (!supabase) {
    return NextResponse.json({
      ok: false,
      checks,
      message: "Client Supabase non créé — variables manquantes ou redeploy nécessaire.",
    });
  }

  try {
    const testUrl = await uploadBufferToMenuBucket(supabase, buf, "png", "image/png");
    return NextResponse.json({ ok: true, checks, testUploadUrl: testUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur test";
    return NextResponse.json({ ok: false, checks, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await requireApiAuth(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const validation = validateMenuImageFile(file);
    if (validation) {
      return NextResponse.json({ error: validation }, { status: 400 });
    }

    const mime = resolveMenuImageMime(file)!;
    const ext = extFromMenuImageMime(mime)!;
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabase = getSupabaseStorageClient();
    const onVercel = Boolean(process.env.VERCEL);

    let publicPath: string;
    if (supabase) {
      publicPath = await uploadBufferToMenuBucket(supabase, buffer, ext, mime);
    } else if (onVercel) {
      return NextResponse.json(
        {
          error: "Supabase Storage non configuré sur Vercel.",
          details:
            "Ajoutez NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_STORAGE_BUCKET=PRODUITS puis Redeploy.",
        },
        { status: 503 }
      );
    } else {
      publicPath = await uploadToLocal(buffer, ext);
    }

    return NextResponse.json({ path: publicPath });
  } catch (err: unknown) {
    console.error("POST /api/uploads/menu-image", err);
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json(
      {
        error: "Impossible d'enregistrer l'image.",
        details: message,
      },
      { status: 500 }
    );
  }
}
