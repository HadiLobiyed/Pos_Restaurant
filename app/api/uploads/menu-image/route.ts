import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

function extFromMime(mime: string) {
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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type", allowed: Array.from(ALLOWED_MIME) },
      { status: 415 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large", maxBytes: MAX_BYTES }, { status: 413 });
  }

  const ext = extFromMime(file.type);
  if (!ext) return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "menu");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${crypto.randomUUID()}.${ext}`;
  const absPath = path.join(uploadsDir, filename);
  await writeFile(absPath, buffer);

  const publicPath = `/uploads/menu/${filename}`;
  return NextResponse.json({ path: publicPath });
}

