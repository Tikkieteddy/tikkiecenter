import { Database, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeading } from "@/components/newsroom/page-heading";
import { RiskBadge } from "@/components/newsroom/risk-badge";
import { riskEntries } from "@/lib/newsroom/mock-data";

export default function RiskDatabasePage() {
  return (
    <>
      <PageHeading
        eyebrow="Risk Database Management"
        title="จัดการฐานข้อมูลความเสี่ยง"
        description="ดูแล Risk Topic, Keyword, บุคคล/องค์กรอ่อนไหว, case study, legal reference, internal guideline, ภาพ คลิป และ URL อ้างอิงสำหรับระบบ AI"
      />

      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-white/75 p-4 shadow-sm backdrop-blur md:flex-row md:items-center">
        <div className="relative flex-1">
          <Database className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input className="pl-9" placeholder="ค้นหาด้วยคำไทย เช่น หมิ่นประมาท, เลือกตั้ง, PDPA, คลิป" />
        </div>
        <Button variant="outline"><Filter /> ตัวกรอง</Button>
        <Button><Plus /> เพิ่มรายการความเสี่ยง</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการความเสี่ยงที่ระบบใช้เทียบเคียง</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อรายการ</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>หมวด</TableHead>
                <TableHead>Legal risk type</TableHead>
                <TableHead>คำแนะนำ</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>อัปเดต</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="min-w-64">
                    <div className="font-semibold text-foreground">{entry.title}</div>
                    <div className="mt-1 text-sm leading-6 text-muted-foreground">{entry.description}</div>
                  </TableCell>
                  <TableCell><RiskBadge level={entry.severity} /></TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell className="min-w-44 text-sm text-muted-foreground">{entry.legalRiskType}</TableCell>
                  <TableCell className="min-w-72 text-sm leading-6 text-muted-foreground">{entry.recommendation}</TableCell>
                  <TableCell className="min-w-56">
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{tag}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(entry.updatedAt).toLocaleDateString("th-TH")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
