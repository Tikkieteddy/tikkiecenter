"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, PencilLine, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ApprovalStatus } from "@/lib/newsroom/types";

export function ApprovalActions({ approvalId }: { approvalId: string }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState<ApprovalStatus | null>(null);
  const [message, setMessage] = useState("");

  async function updateStatus(status: ApprovalStatus) {
    setLoading(status);
    setMessage("");
    try {
      const response = await fetch(`/api/approvals/${approvalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: status, editorComment: comment }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "อัปเดตไม่สำเร็จ");
      setMessage(data.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-3">
      <Textarea rows={5} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="ความเห็นบรรณาธิการ เช่น ปรับหัวให้อ่อนลง เพิ่มคำชี้แจงผู้ถูกกล่าวหา หรือให้กฎหมายตรวจอีกชั้น" />
      <div className="grid gap-2 sm:grid-cols-3">
        <Button type="button" variant="success" onClick={() => updateStatus("APPROVED")} disabled={!!loading}>
          {loading === "APPROVED" ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
          อนุมัติ
        </Button>
        <Button type="button" variant="danger" onClick={() => updateStatus("REJECTED")} disabled={!!loading}>
          {loading === "REJECTED" ? <Loader2 className="animate-spin" /> : <XCircle />}
          ไม่อนุมัติ
        </Button>
        <Button type="button" variant="secondary" onClick={() => updateStatus("REVISION_REQUESTED")} disabled={!!loading}>
          {loading === "REVISION_REQUESTED" ? <Loader2 className="animate-spin" /> : <PencilLine />}
          ขอแก้ไขเพิ่มเติม
        </Button>
      </div>
      {message ? <p className="rounded-lg border border-orange-100 bg-[#FFF3ED] px-3 py-2 text-sm font-semibold text-[#9A3412]">{message}</p> : null}
    </div>
  );
}
