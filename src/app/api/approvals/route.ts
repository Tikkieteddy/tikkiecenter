import { NextResponse } from "next/server";
import { sendApprovalRequestEmail } from "@/lib/newsroom/email";
import { analyzeNewsRisk } from "@/lib/newsroom/risk-engine";
import { sendMobileNotificationToRecipient } from "@/lib/newsroom/mobile-notifications";
import type { ApprovalRequest } from "@/lib/newsroom/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.title || !body?.editorEmail || !body?.requesterEmail) {
    return NextResponse.json({ error: "กรุณากรอกหัวข้อ อีเมลผู้ส่ง และอีเมลบรรณาธิการ" }, { status: 400 });
  }

  const aiResult = body.aiResult || analyzeNewsRisk({ headline: body.title, content: body.submittedContent, url: body.newsUrl });
  const approval: ApprovalRequest = {
    id: `APR-${Date.now()}`,
    screeningLogId: body.screeningLogId || `SCR-${Date.now()}`,
    requesterName: body.requesterName || "Newsroom User",
    requesterEmail: body.requesterEmail,
    editorEmail: body.editorEmail,
    title: body.title,
    newsUrl: body.newsUrl || "",
    submittedContent: body.submittedContent || "",
    aiRiskLevel: aiResult.riskLevel,
    aiReasoning: aiResult.reasoning,
    requesterNote: body.requesterNote || "",
    approvalStatus: "PENDING",
    editorComment: "",
    legalConcerns: aiResult.legalConcerns || [],
    matchingCases: (aiResult.matchingCases || []).map((item: { title: string }) => item.title),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviewedAt: null,
  };

  await sendApprovalRequestEmail(approval);
  await sendMobileNotificationToRecipient(approval.editorEmail, {
    title: "มีประเด็นข่าวรออนุมัติ",
    body: `${approval.title} · ผลประเมิน ${aiResult.label}`,
    targetUrl: `/approve/${approval.id}`,
    tag: `approval-${approval.id}`,
  });

  return NextResponse.json({ approval, message: "ส่งให้บรรณาธิการอนุมัติแล้ว" });
}
