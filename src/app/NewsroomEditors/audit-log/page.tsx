import { FileClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeading } from "@/components/newsroom/page-heading";
import { ApprovalBadge, RiskBadge } from "@/components/newsroom/risk-badge";
import { screeningLogs } from "@/lib/newsroom/mock-data";

export default function AuditLogPage() {
  return (
    <>
      <PageHeading
        eyebrow="Audit Trail"
        title="บันทึกการตรวจสอบย้อนหลัง"
        description="ติดตามว่าใครตรวจอะไร เมื่อไร ระบบประเมินอย่างไร สถานะอนุมัติเป็นอะไร และบรรณาธิการให้ความเห็นใด เพื่อความโปร่งใสและตรวจสอบได้"
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileClock className="size-5 text-[#EC5F27]" aria-hidden="true" />
            <CardTitle>Audit Log</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>ผู้ตรวจ</TableHead>
                <TableHead>เนื้อหา/หัวข้อ</TableHead>
                <TableHead>AI Result</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>AI Reasoning / Editor comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {screeningLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="min-w-40 font-mono text-xs">{new Date(log.checkedAt).toLocaleString("th-TH")}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell className="min-w-64 font-semibold">{log.title}</TableCell>
                  <TableCell><RiskBadge level={log.result} /></TableCell>
                  <TableCell><ApprovalBadge status={log.approvalStatus} /></TableCell>
                  <TableCell className="min-w-96 text-sm leading-6 text-muted-foreground">{log.latestComment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
