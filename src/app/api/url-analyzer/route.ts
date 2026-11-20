import { NextResponse } from "next/server";
import { analyzeNewsRisk } from "@/lib/newsroom/risk-engine";

function extractMeta(html: string, field: string) {
  const pattern = new RegExp(`<meta[^>]+(?:name|property)=["']${field}["'][^>]+content=["']([^"']+)["']`, "i");
  return html.match(pattern)?.[1] || "";
}

function extractTitle(html: string) {
  return html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() || "";
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 6000);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const url = body?.url;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "กรุณาระบุ URL ที่ต้องการตรวจ" }, { status: 400 });
  }

  try {
    const response = await fetch(url, { next: { revalidate: 0 } });
    const html = await response.text();
    const title = extractTitle(html) || extractMeta(html, "og:title");
    const description = extractMeta(html, "description") || extractMeta(html, "og:description");
    const bodyText = stripHtml(html);
    const result = analyzeNewsRisk({ headline: title, content: `${description} ${bodyText}`, url });

    return NextResponse.json({ title, description, body: bodyText, result });
  } catch {
    return NextResponse.json(
      {
        error: "ไม่สามารถดึงข้อมูลจาก URL ได้ในขณะนี้",
        result: analyzeNewsRisk({ url, notes: "URL analyzer fetch failed" }),
      },
      { status: 502 },
    );
  }
}
