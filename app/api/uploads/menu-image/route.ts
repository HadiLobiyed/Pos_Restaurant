import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "menu");
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${crypto.randomUUID()}.${ext}`;
    const absPath = path.join(uploadsDir, filename);
    await writeFile(absPath, buffer);

    const publicPath = `/uploads/menu/${filename}`;
    return NextResponse.json({ path: publicPath });
  } catch (err: unknown) {
    console.error("POST /api/uploads/menu-image", err);
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json(
      {
        error:
          "Impossible d'enregistrer l'image. Vérifiez les droits du dossier public/uploads/menu ou réessayez.",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 }
    );
  }
}
