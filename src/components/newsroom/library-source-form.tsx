"use client";

import { useState } from "react";
import { FileUp, Link2, Loader2, Plus, TextCursorInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LegalReference, LibrarySourceType } from "@/lib/newsroom/types";

export function LibrarySourceForm() {
  const [sourceType, setSourceType] = useState<LibrarySourceType>("FILE");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<LegalReference | null>(null);

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setPreview(null);
    formData.set("sourceType", sourceType);

    try {
      const response = await fetch("/api/library-sources", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "เพิ่มเอกสารไม่สำเร็จ");
      setMessage(data.message);
      setPreview(data.reference);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการเพิ่มเอกสาร");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-5 border-orange-100 bg-white/85">
      <CardHeader>
        <CardTitle>เพิ่มกฎหมาย / แนวปฏิบัติ / เอกสารอ้างอิง</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          <SourceTypeButton active={sourceType === "FILE"} icon={FileUp} label="อัปโหลดไฟล์" onClick={() => setSourceType("FILE")} />
          <SourceTypeButton active={sourceType === "LINK"} icon={Link2} label="เพิ่มจากลิงก์" onClick={() => setSourceType("LINK")} />
          <SourceTypeButton active={sourceType === "TEXT"} icon={TextCursorInput} label="วางข้อความ" onClick={() => setSourceType("TEXT")} />
        </div>

        <form action={submit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="library-title">ชื่อเอกสาร / แนวปฏิบัติ</Label>
              <Input id="library-title" name="title" placeholder="เช่น แนวปฏิบัติการรายงานข่าวเด็ก" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="library-category">หมวด</Label>
              <Input id="library-category" name="category" placeholder="เช่น PDPA, เด็กและเยาวชน, AI, ลิขสิทธิ์" required />
            </div>
          </div>

          {sourceType === "FILE" ? (
            <div className="grid gap-2">
              <Label htmlFor="library-file">ไฟล์อ้างอิง</Label>
              <Input id="library-file" name="file" type="file" accept=".pdf,.txt,.md,.csv,.json,.doc,.docx" />
              <p className="text-xs leading-5 text-muted-foreground">รองรับ PDF, text, markdown, CSV, JSON และเตรียมต่อ OCR/PDF parser สำหรับไฟล์สแกนภายหลัง</p>
            </div>
          ) : null}

          {sourceType === "LINK" ? (
            <div className="grid gap-2">
              <Label htmlFor="library-link">ลิงก์เอกสาร / ประกาศ / guideline</Label>
              <Input id="library-link" name="sourceUrl" placeholder="https://..." />
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="library-text">{sourceType === "TEXT" ? "ข้อความ guideline" : "สรุปหรือข้อความสำคัญจากเอกสาร"}</Label>
            <Textarea id="library-text" name="bodyText" rows={5} placeholder="วางเนื้อหาหรือสรุปข้อที่ต้องการให้ระบบใช้เป็นเกณฑ์ประเมิน" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="library-tags">Tags / keywords</Label>
              <Input id="library-tags" name="tags" placeholder="คั่นด้วย comma เช่น เด็ก, เยาวชน, ปกปิดตัวตน" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="library-risk-types">Legal risk types</Label>
              <Input id="library-risk-types" name="legalRiskTypes" placeholder="เช่น PDPA, Sensitive minors" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <input name="activeForEvaluation" type="checkbox" value="true" defaultChecked />
            ใช้เอกสารนี้เป็นเกณฑ์ในการประเมินของเว็บ
          </label>

          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Plus />}
            เพิ่มเข้าคลังและสร้างเกณฑ์ประเมิน
          </Button>
        </form>

        {message ? <p className="mt-4 rounded-lg border border-orange-100 bg-[#FFF3ED] px-3 py-2 text-sm font-semibold text-[#9A3412]">{message}</p> : null}

        {preview ? (
          <div className="mt-4 rounded-lg border border-border bg-white/75 p-4">
            <p className="font-bold text-foreground">{preview.title}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{preview.summary}</p>
            <div className="mt-3 grid gap-2">
              {preview.criteria.map((criterion) => (
                <div key={criterion.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                  <span className="font-bold text-foreground">{criterion.title}</span>
                  <span className="text-muted-foreground"> · {criterion.legalRiskType} · {criterion.severity}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SourceTypeButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof FileUp;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button type="button" variant={active ? "default" : "outline"} onClick={onClick}>
      <Icon />
      {label}
    </Button>
  );
}
