import { NextResponse } from "next/server";
import { loadOrderForModify } from "@/lib/orderModifyAuth";
import { toTrackPayload } from "@/lib/orderTrackPayload";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const result = await loadOrderForModify(searchParams);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(toTrackPayload(result.order));
}
