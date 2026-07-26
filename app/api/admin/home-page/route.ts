import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHomePageContent, setHomePageContent } from "@/lib/homePageSettings";
import { parseHomePageContent } from "@/lib/homePageContent";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user?.role ?? "STAFF";
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const content = await getHomePageContent();
  return NextResponse.json({ content });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user?.role ?? "STAFF";
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const content = parseHomePageContent(body?.content ?? body);
    const saved = await setHomePageContent(content);
    revalidatePath("/");
    return NextResponse.json({ ok: true, content: saved });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur serveur.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
