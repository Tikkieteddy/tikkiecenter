import { NextResponse } from "next/server";
import { analyzeNewsRisk } from "@/lib/newsroom/risk-engine";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง กรุณาลองใหม่" }, { status: 400 });
  }

  const result = analyzeNewsRisk({
    keyword: body.keyword,
    headline: body.headline,
    content: body.content,
    url: body.url,
    notes: body.notes,
  });

  return NextResponse.json({
    id: `SCR-${Date.now()}`,
    checkedAt: new Date().toISOString(),
    result,
  });
}
