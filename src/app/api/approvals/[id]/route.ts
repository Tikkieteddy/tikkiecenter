import { NextResponse } from "next/server";
import { approvalRequests } from "@/lib/newsroom/mock-data";
import { sendApprovalStatusEmail } from "@/lib/newsroom/email";
import { sendMobileNotificationToRecipient } from "@/lib/newsroom/mobile-notifications";
import type { ApprovalStatus } from "@/lib/newsroom/types";
import { approvalStatusThai } from "@/lib/newsroom/types";

const allowedStatuses: ApprovalStatus[] = ["PENDING", "APPROVED", "REJECTED", "REVISION_REQUESTED"];

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const status = body?.approvalStatus as ApprovalStatus;

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
  }

  const existing = approvalRequests.find((item) => item.id === id) || approvalRequests[0];
  const updated = {
    ...existing,
    id,
    approvalStatus: status,
    editorComment: body?.editorComment || existing.editorComment,
    updatedAt: new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
  };

  await sendApprovalStatusEmail(updated, status);
  await sendMobileNotificationToRecipient(updated.requesterEmail, {
    title: "สถานะอนุมัติข่าวอัปเดตแล้ว",
    body: `${updated.title} · ${approvalStatusThai[status]}`,
    targetUrl: `/approve/${updated.id}`,
    tag: `approval-status-${updated.id}`,
  });

  return NextResponse.json({ approval: updated, message: "อัปเดตสถานะและแจ้งผู้ส่งแล้ว" });
}
