import { NextResponse } from "next/server";
import { upsertWebPushSubscription } from "@/lib/newsroom/notification-store";
import type { UserRole } from "@/lib/newsroom/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const subscription = body?.subscription;
  const p256dh = subscription?.keys?.p256dh;
  const auth = subscription?.keys?.auth;
  const endpoint = subscription?.endpoint;

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "ข้อมูล subscription ไม่ครบถ้วน" }, { status: 400 });
  }

  const record = upsertWebPushSubscription({
    userEmail: body.userEmail || "editor@newsroom.co.th",
    role: (body.role || "EDITOR") as UserRole,
    endpoint,
    p256dh,
    auth,
    userAgent: request.headers.get("user-agent") || undefined,
  });

  return NextResponse.json({
    subscription: record,
    message: "เปิดแจ้งเตือนบนมือถือแล้ว",
  });
}
