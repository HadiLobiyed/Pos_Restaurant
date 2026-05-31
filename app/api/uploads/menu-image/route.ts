import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMenuImageBucket, getSupabaseAdmin } from "@/lib/supabase-admin";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

function extFromMime(mime: string) {
  switch (mime) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return null;
  }
}

function mimeFromFilename(filename: string): string | null {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return null;
}

function resolveMime(file: File): string | null {
  const raw = (file.type || "").toLowerCase();
  if (raw && ALLOWED_MIME.has(raw)) {
    return raw === "image/jpg" ? "image/jpeg" : raw;
  }
  return mimeFromFilename(file.name);
}

async function uploadToLocal(buffer: Buffer, ext: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "menu");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${crypto.randomUUID()}.${ext}`;
  const absPath = path.join(uploadsDir, filename);
  await writeFile(absPath, buffer);

  return `/uploads/menu/${filename}`;
}

async function uploadToSupabase(buffer: Buffer, ext: string, mime: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase Storage non configuré");
  }

  const bucket = getMenuImageBucket();
  const objectPath = `menu/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType: mime,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Fichier vide" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large", maxBytes: MAX_BYTES }, { status: 413 });
    }

    const mime = resolveMime(file);
    if (!mime) {
      return NextResponse.json(
        { error: "Type non supporté. Utilisez JPG, PNG ou WebP." },
        { status: 415 }
      );
    }

    const ext = extFromMime(mime);
    if (!ext) {
      return NextResponse.json({ error: "Type non supporté." }, { status: 415 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const supabase = getSupabaseAdmin();
    const onVercel = Boolean(process.env.VERCEL);

    let publicPath: string;
    if (supabase) {
      publicPath = await uploadToSupabase(buffer, ext, mime);
    } else if (onVercel) {
      return NextResponse.json(
        {
          error:
            "Stockage des images non configuré. Ajoutez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sur Vercel, puis créez le bucket « menu-images » (public) dans Supabase Storage.",
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
        error: "Impossible d'enregistrer l'image. Vérifiez la configuration Supabase Storage ou réessayez.",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 }
    );
  }
}
