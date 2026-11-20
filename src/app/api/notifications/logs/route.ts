import { NextResponse } from "next/server";
import { getNotificationLogs, getWebPushSubscriptions } from "@/lib/newsroom/notification-store";

export async function GET() {
  return NextResponse.json({
    subscriptions: getWebPushSubscriptions(),
    logs: getNotificationLogs(),
  });
}
