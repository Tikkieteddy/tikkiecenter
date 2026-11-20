import { Bookmark, BookOpen, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/newsroom/page-heading";
import { LibrarySourceForm } from "@/components/newsroom/library-source-form";
import { getAllLibraryReferences } from "@/lib/newsroom/library-store";

export const dynamic = "force-dynamic";

export default function LibraryPage() {
  const legalReferences = getAllLibraryReferences();

  return (
    <>
      <PageHeading
        eyebrow="Legal & Editorial Knowledge Library"
        title="คลังความรู้กฎหมายและนโยบายบรรณาธิการ"
        description="ค้นหา guideline สำหรับข่าวการเมือง เลือกตั้ง หมิ่นประมาท ลิขสิทธิ์ PDPA การรายงานศาล และนโยบายภายในห้องข่าว"
      />

      <div className="mb-5 grid gap-3 rounded-lg border border-border bg-white/75 p-4 shadow-sm backdrop-blur md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input className="pl-9" placeholder="ค้นหา guideline, กฎหมาย, keyword หรือ tag ภาษาไทย" />
        </div>
        <select defaultValue="all" aria-label="หมวดความรู้">
          <option value="all">ทุกหมวดความรู้</option>
          <option>หมิ่นประมาท</option>
          <option>PDPA</option>
          <option>เลือกตั้ง</option>
          <option>ลิขสิทธิ์</option>
          <option>ศาล</option>
        </select>
      </div>

      <LibrarySourceForm />

      <div className="grid gap-4 md:grid-cols-2">
        {legalReferences.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge className="border-orange-100 bg-[#FFF3ED] text-[#EC5F27]">{item.category}</Badge>
                  {item.activeForEvaluation ? <Badge className="ml-2 border-green-100 bg-green-50 text-green-700">ใช้ประเมิน</Badge> : null}
                  <CardTitle className="mt-3">{item.title}</CardTitle>
                </div>
                {item.bookmarked ? <Bookmark className="size-5 fill-[#EC5F27] text-[#EC5F27]" aria-hidden="true" /> : <BookOpen className="size-5 text-muted-foreground" aria-hidden="true" />}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">{item.summary}</p>
              <div className="mt-3 grid gap-2 rounded-lg border border-border bg-white/70 p-3 text-xs font-semibold text-muted-foreground">
                <span>ชนิดแหล่งข้อมูล: {item.sourceType}</span>
                {item.fileName ? <span>ไฟล์: {item.fileName}</span> : null}
                {item.sourceUrl ? <span>ลิงก์: {item.sourceUrl}</span> : null}
                <span>Legal risk: {item.legalRiskTypes.join(", ")}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{tag}</span>
                ))}
              </div>
              <details className="mt-4 rounded-lg border border-border bg-white/70 p-3">
                <summary className="cursor-pointer text-sm font-bold text-foreground">เปิดโหมดอ่านรายละเอียด</summary>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.bodyText || "Checklist: ตรวจแหล่งที่มา ตรวจคำพาดหัว ตรวจสิทธิการใช้สื่อ ตรวจข้อมูลส่วนบุคคล และส่งบรรณาธิการหรือกฎหมายเมื่อพบความเสี่ยงสูง ระบบนี้เป็นเครื่องมือช่วยคัดกรอง ไม่ใช่คำวินิจฉัยทางกฎหมาย"}
                </p>
                <div className="mt-3 grid gap-2">
                  {item.criteria.map((criterion) => (
                    <div key={criterion.id} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-sm font-bold text-foreground">{criterion.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{criterion.description}</p>
                      <p className="mt-2 text-xs font-semibold text-[#EC5F27]">Match terms: {criterion.matchTerms.slice(0, 10).join(", ")}</p>
                    </div>
                  ))}
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
