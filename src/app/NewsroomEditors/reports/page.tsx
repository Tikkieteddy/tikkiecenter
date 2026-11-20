import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeading } from "@/components/newsroom/page-heading";
import { ApprovalBarChart, DailyChecksChart, RiskDistributionChart } from "@/components/newsroom/charts";
import { ApprovalBadge, RiskBadge } from "@/components/newsroom/risk-badge";
import { MetricCard } from "@/components/newsroom/metric-card";
import { screeningLogs } from "@/lib/newsroom/mock-data";
import { AlertTriangle, CheckCircle2, ClipboardCheck, FileSearch, ShieldX } from "lucide-react";

export default function ReportsPage() {
  return (
    <>
      <PageHeading
        eyebrow="Usage Report System"
        title="รายงานการใช้งาน"
        description="สรุปปริมาณการตรวจ ผลประเมิน สถานะอนุมัติ หมวดความเสี่ยง ผู้ใช้งาน และ export เป็น CSV สำหรับ Excel หรือรายงานผู้บริหาร"
      />

      <div className="mb-5 grid gap-3 rounded-lg border border-border bg-white/75 p-4 md:grid-cols-5">
        <input className="h-11 rounded-lg border border-input px-3 text-sm" type="date" defaultValue="2026-05-19" aria-label="วันที่" />
        <select defaultValue="all"><option value="all">ผู้ใช้ทั้งหมด</option><option>พริมโรส Desk</option><option>ณัฐ Politics</option></select>
        <select defaultValue="all"><option value="all">บรรณาธิการทั้งหมด</option><option>editor@newsroom.co.th</option><option>legal@newsroom.co.th</option></select>
        <select defaultValue="all"><option value="all">ทุกสถานะ</option><option>รออนุมัติ</option><option>อนุมัติแล้ว</option><option>ไม่อนุมัติ</option></select>
        <Button><Download /> Export CSV</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="จำนวนการตรวจทั้งหมด" value="315" detail="ช่วง 7 วันล่าสุด" icon={FileSearch} tone="brand" />
        <MetricCard title="จำนวนการตรวจวันนี้" value="72" detail="มากที่สุดในสัปดาห์" icon={FileSearch} tone="default" />
        <MetricCard title="จำนวนรายการที่ได้" value="181" detail="57.5% ของทั้งหมด" icon={CheckCircle2} tone="success" />
        <MetricCard title="จำนวนรายการที่สุ่มเสี่ยง" value="98" detail="ต้องตรวจเพิ่ม" icon={AlertTriangle} tone="warning" />
        <MetricCard title="จำนวนรายการที่ห้าม" value="36" detail="ห้ามเผยแพร่ก่อนตรวจ" icon={ShieldX} tone="danger" />
        <MetricCard title="ส่งขออนุมัติ" value="84" detail="ส่งเข้าคิว editor/legal" icon={ClipboardCheck} tone="brand" />
        <MetricCard title="อนุมัติแล้ว" value="46" detail="ผ่านพร้อมเงื่อนไข/แก้ไข" icon={CheckCircle2} tone="success" />
        <MetricCard title="ไม่อนุมัติ/ขอแก้" value="20" detail="ต้องปรับก่อน publish" icon={FileSpreadsheet} tone="warning" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card><CardHeader><CardTitle>จำนวนการตรวจรายวัน</CardTitle></CardHeader><CardContent><DailyChecksChart /></CardContent></Card>
        <Card><CardHeader><CardTitle>สัดส่วนผลประเมิน</CardTitle></CardHeader><CardContent><RiskDistributionChart /></CardContent></Card>
        <Card><CardHeader><CardTitle>สถานะการอนุมัติ</CardTitle></CardHeader><CardContent><ApprovalBarChart /></CardContent></Card>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>ตารางรายงานพร้อม export</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่ตรวจ</TableHead>
                <TableHead>ผู้ใช้</TableHead>
                <TableHead>หัวข้อข่าว</TableHead>
                <TableHead>ผลประเมิน</TableHead>
                <TableHead>สถานะอนุมัติ</TableHead>
                <TableHead>บรรณาธิการ</TableHead>
                <TableHead>เวลาที่ใช้อนุมัติ</TableHead>
                <TableHead>ความเห็นล่าสุด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {screeningLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="min-w-36">{new Date(log.checkedAt).toLocaleString("th-TH")}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell className="min-w-64 font-semibold">{log.title}</TableCell>
                  <TableCell><RiskBadge level={log.result} /></TableCell>
                  <TableCell><ApprovalBadge status={log.approvalStatus} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.editor}</TableCell>
                  <TableCell>{log.approvalMinutes ? `${log.approvalMinutes} นาที` : "-"}</TableCell>
                  <TableCell className="min-w-72 text-sm text-muted-foreground">{log.latestComment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
