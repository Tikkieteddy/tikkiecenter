import { AlertTriangle, CheckCircle2, ClipboardCheck, FileSearch, ShieldX, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApprovalBadge, RiskBadge } from "@/components/newsroom/risk-badge";
import { MetricCard } from "@/components/newsroom/metric-card";
import { PageHeading } from "@/components/newsroom/page-heading";
import { DailyChecksChart, RiskDistributionChart } from "@/components/newsroom/charts";
import { screeningLogs, topKeywords } from "@/lib/newsroom/mock-data";

export default function DashboardPage() {
  return (
    <>
      <PageHeading
        eyebrow="Newsroom Command Dashboard"
        title="แดชบอร์ดตรวจความเสี่ยงข่าว"
        description="มุมมองเร็วสำหรับบรรณาธิการไทย: เห็นจำนวนการตรวจวันนี้ ประเด็นเสี่ยงล่าสุด คำที่ถูกแจ้งเตือนบ่อย และรายการที่ควรตรวจต่อก่อน publish"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="จำนวนการตรวจวันนี้" value="72" detail="เพิ่มขึ้น 14% จากเมื่อวาน" icon={FileSearch} tone="brand" />
        <MetricCard title="รายการสุ่มเสี่ยง" value="26" detail="รอ desk editor ตรวจบริบท" icon={AlertTriangle} tone="warning" />
        <MetricCard title="รายการห้ามเผยแพร่ก่อนตรวจ" value="11" detail="ส่ง legal/editor review แล้ว 7 รายการ" icon={ShieldX} tone="danger" />
        <MetricCard title="อนุมัติเฉลี่ย" value="24 นาที" detail="เหมาะกับ workflow breaking news" icon={Timer} tone="success" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>จำนวนการตรวจรายวัน</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyChecksChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>สัดส่วน ได้ / สุ่มเสี่ยง / ห้าม</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart />
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>คำที่ถูกแจ้งเตือนบ่อย</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topKeywords.map((keyword, index) => (
                <span
                  key={keyword}
                  className="rounded-full border border-orange-100 bg-[#FFF3ED] px-3 py-1.5 text-sm font-semibold text-[#9A3412]"
                >
                  #{index + 1} {keyword}
                </span>
              ))}
            </div>
            <div className="mt-5 grid gap-3 rounded-lg border border-border bg-white/70 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <ClipboardCheck className="size-4 text-[#EC5F27]" aria-hidden="true" />
                รายการที่ควรตรวจสอบเพิ่มเติม
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                พาดหัวที่มีข้อกล่าวหาทางการเมือง, คลิปจากแพลตฟอร์มภายนอก และข่าวคดีที่ยังอยู่ในศาลควรถูกส่งเข้าคิวอนุมัติก่อนเผยแพร่
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ประวัติการวิเคราะห์ล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>หัวข้อข่าว</TableHead>
                  <TableHead>ผลประเมิน</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>ความเห็นล่าสุด</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {screeningLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="font-semibold text-foreground">{log.title}</div>
                      <div className="text-xs text-muted-foreground">{log.user} · {new Date(log.checkedAt).toLocaleString("th-TH")}</div>
                    </TableCell>
                    <TableCell><RiskBadge level={log.result} /></TableCell>
                    <TableCell><ApprovalBadge status={log.approvalStatus} /></TableCell>
                    <TableCell className="min-w-56 text-sm text-muted-foreground">{log.latestComment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="เผยแพร่ได้ในเบื้องต้น" value="35" detail="ผ่าน checklist ปกติ" icon={CheckCircle2} tone="success" />
        <MetricCard title="รออนุมัติ" value="18" detail="อยู่ในคิวบรรณาธิการ" icon={ClipboardCheck} tone="default" />
        <MetricCard title="ขอแก้ไขเพิ่มเติม" value="13" detail="ต้องปรับถ้อยคำ/หลักฐาน" icon={AlertTriangle} tone="warning" />
        <MetricCard title="ไม่อนุมัติ" value="7" detail="มี risk สูงหรือข้อมูลไม่พอ" icon={ShieldX} tone="danger" />
      </div>
    </>
  );
}
