import { NextResponse } from "next/server";
import { sendMobileNotificationToRecipient } from "@/lib/newsroom/mobile-notifications";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const recipientEmail = body?.recipientEmail || "editor@newsroom.co.th";

  const result = await sendMobileNotificationToRecipient(recipientEmail, {
    title: "News Risk Monitor",
    body: "ทดสอบแจ้งเตือนมือถือสำหรับคิวอนุมัติข่าว",
    targetUrl: "/approvals",
    tag: "news-risk-test",
  });

  return NextResponse.json({
    result,
    message: result.sent ? "ส่งแจ้งเตือนทดสอบแล้ว" : "ยังไม่ได้ส่งแจ้งเตือน โปรดตรวจการตั้งค่า VAPID/device",
  });
}
