import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeading } from "@/components/newsroom/page-heading";
import { ApprovalBadge, RiskBadge } from "@/components/newsroom/risk-badge";
import { approvalRequests } from "@/lib/newsroom/mock-data";

export default function ApprovalsPage() {
  return (
    <>
      <PageHeading
        eyebrow="Editor Approval Workflow"
        title="คิวอนุมัติประเด็นข่าว"
        description="รวมรายการที่ผู้สื่อข่าวหรือ desk ส่งให้บรรณาธิการตรวจ ก่อนตัดสินใจเผยแพร่ แก้ไข หรือส่งฝ่ายกฎหมายตรวจต่อ"
      />

      <Card>
        <CardHeader>
          <CardTitle>รายการขออนุมัติล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ประเด็นข่าว</TableHead>
                <TableHead>ผู้ส่ง</TableHead>
                <TableHead>ผล AI</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>บรรณาธิการ</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvalRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="min-w-72">
                    <div className="font-semibold text-foreground">{request.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{new Date(request.createdAt).toLocaleString("th-TH")}</div>
                  </TableCell>
                  <TableCell>{request.requesterName}</TableCell>
                  <TableCell><RiskBadge level={request.aiRiskLevel} /></TableCell>
                  <TableCell><ApprovalBadge status={request.approvalStatus} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{request.editorEmail}</TableCell>
                  <TableCell>
                    <Link href={`/NewsroomEditors/approve/${request.id}`} className={buttonVariants({ variant: "outline", className: "min-w-32" })}>
                      เปิดตรวจ <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-white/70 p-3 text-sm text-muted-foreground">
            <ClipboardCheck className="size-4 text-[#EC5F27]" aria-hidden="true" />
            ทุกการเปลี่ยนสถานะจะถูกส่ง notification และบันทึกใน audit log
          </div>
        </CardContent>
      </Card>
    </>
  );
}
