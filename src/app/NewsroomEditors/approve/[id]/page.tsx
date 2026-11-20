import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeading } from "@/components/newsroom/page-heading";
import { ApprovalActions } from "@/components/newsroom/approval-actions";
import { ApprovalBadge, RiskBadge } from "@/components/newsroom/risk-badge";
import { approvalRequests } from "@/lib/newsroom/mock-data";

export default async function EditorApprovalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = approvalRequests.find((item) => item.id === id);

  if (!request) notFound();

  return (
    <>
      <PageHeading
        eyebrow="Editor Review"
        title="หน้าอนุมัติสำหรับบรรณาธิการ"
        description="ตรวจรายละเอียดประเด็นข่าว เหตุผลจาก AI ประเด็นกฎหมายที่เกี่ยวข้อง เคสใกล้เคียง และบันทึกความเห็นก่อนเปลี่ยนสถานะ"
      />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>รายละเอียดประเด็นข่าว</CardTitle>
              <ApprovalBadge status={request.approvalStatus} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <section>
              <p className="text-sm font-semibold text-muted-foreground">หัวข้อข่าว / ประเด็น</p>
              <h2 className="mt-1 text-xl font-bold text-foreground">{request.title}</h2>
            </section>
            <section className="grid gap-2 rounded-lg border border-border bg-white/70 p-4">
              <p className="text-sm font-semibold text-muted-foreground">เนื้อหาที่ส่งตรวจ</p>
              <p className="text-sm leading-7 text-foreground">{request.submittedContent}</p>
            </section>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="ผู้ส่ง" value={`${request.requesterName} (${request.requesterEmail})`} />
              <Info label="บรรณาธิการ" value={request.editorEmail} />
              <Info label="ลิงก์ข่าว" value={request.newsUrl || "-"} />
              <Info label="เวลาส่ง" value={new Date(request.createdAt).toLocaleString("th-TH")} />
            </div>
            <section className="rounded-lg border border-orange-100 bg-[#FFF3ED] p-4">
              <p className="text-sm font-bold text-[#9A3412]">ความเห็นผู้ส่ง</p>
              <p className="mt-2 text-sm leading-7 text-[#9A3412]">{request.requesterNote || "-"}</p>
            </section>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>ผลประเมินจาก AI</CardTitle>
              <RiskBadge level={request.aiRiskLevel} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <section>
              <p className="text-sm font-bold text-foreground">เหตุผลจาก AI</p>
              <p className="mt-2 rounded-lg border border-border bg-white/70 p-3 text-sm leading-7 text-muted-foreground">{request.aiReasoning}</p>
            </section>
            <section>
              <p className="text-sm font-bold text-foreground">ประเด็นกฎหมายที่เกี่ยวข้อง</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {request.legalConcerns.map((item) => (
                  <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item}</span>
                ))}
              </div>
            </section>
            <section>
              <p className="text-sm font-bold text-foreground">เคสใกล้เคียง</p>
              <div className="mt-2 grid gap-2">
                {request.matchingCases.map((item) => (
                  <div key={item} className="rounded-lg border border-border bg-white/70 p-3 text-sm font-semibold text-foreground">{item}</div>
                ))}
              </div>
            </section>
            <section>
              <p className="mb-2 text-sm font-bold text-foreground">กล่องความเห็นบรรณาธิการ</p>
              <ApprovalActions approvalId={request.id} />
            </section>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white/70 p-3">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
