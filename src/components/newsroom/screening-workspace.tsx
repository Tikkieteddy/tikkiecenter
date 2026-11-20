"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ClipboardCheck, Loader2, SearchCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RiskBadge } from "@/components/newsroom/risk-badge";
import type { AiScreeningResult } from "@/lib/newsroom/types";

type ScreeningResponse = {
  id: string;
  checkedAt: string;
  result: AiScreeningResult;
};

const initialForm = {
  keyword: "",
  headline: "",
  content: "",
  url: "",
  notes: "",
};

export function ScreeningWorkspace() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState<ScreeningResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const canSubmit = useMemo(() => Object.values(form).some((value) => value.trim().length > 0), [form]);

  async function runScreening() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/screenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ตรวจไม่สำเร็จ");
      setResult(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  async function analyzeUrl() {
    if (!form.url) return runScreening();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/url-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.url }),
      });
      const data = await response.json();
      if (!response.ok && !data.result) throw new Error(data.error || "ดึง URL ไม่สำเร็จ");
      setResult({ id: `SCR-${Date.now()}`, checkedAt: new Date().toISOString(), result: data.result });
      setForm((current) => ({
        ...current,
        headline: current.headline || data.title || "",
        content: current.content || data.description || "",
      }));
      if (data.error) setMessage(data.error);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "ไม่สามารถตรวจ URL ได้");
    } finally {
      setLoading(false);
    }
  }

  async function sendApproval() {
    if (!result) return;
    setSending(true);
    setMessage("");
    try {
      const response = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screeningLogId: result.id,
          requesterName: "Newsroom Desk",
          requesterEmail: "desk@newsroom.co.th",
          editorEmail: "editor@newsroom.co.th",
          title: form.headline || form.keyword || "ประเด็นข่าวที่ต้องตรวจ",
          newsUrl: form.url,
          submittedContent: form.content || form.notes,
          requesterNote: form.notes,
          aiResult: result.result,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ส่งอนุมัติไม่สำเร็จ");
      setMessage(data.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการส่งอนุมัติ");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <CardTitle>ฟอร์มตรวจความเสี่ยงก่อนเผยแพร่</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="keyword">Keyword / คำสำคัญ</Label>
            <Input id="keyword" value={form.keyword} onChange={(event) => setForm({ ...form, keyword: event.target.value })} placeholder="เช่น ทุจริต, เลือกตั้ง, คลิป, PDPA" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="headline">Headline / หัวข่าว</Label>
            <Input id="headline" value={form.headline} onChange={(event) => setForm({ ...form, headline: event.target.value })} placeholder="วางหัวข่าวที่ต้องการตรวจ" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">URL ข่าวหรือแหล่งอ้างอิง</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input id="url" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} placeholder="https://..." />
              <Button type="button" variant="secondary" onClick={analyzeUrl} disabled={loading || !form.url}>
                {loading ? <Loader2 className="animate-spin" /> : <SearchCheck />}
                วิเคราะห์ URL
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">เนื้อหาข่าว / transcript / caption</Label>
            <Textarea id="content" rows={8} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="วางเนื้อหาที่ต้องการให้ระบบช่วยคัดกรองเบื้องต้น" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">หมายเหตุสำหรับบรรณาธิการ</Label>
            <Textarea id="notes" rows={4} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="เช่น ต้องขึ้น breaking news ภายใน 10 นาที / มีเอกสารแนบ / รอคำชี้แจง" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" onClick={runScreening} disabled={!canSubmit || loading}>
              {loading ? <Loader2 className="animate-spin" /> : <SearchCheck />}
              ตรวจความเสี่ยง
            </Button>
            <Button type="button" variant="outline" onClick={() => { setForm(initialForm); setResult(null); setMessage(""); }}>
              ล้างข้อมูล
            </Button>
          </div>
          {message ? <p className="rounded-lg border border-orange-100 bg-[#FFF3ED] px-3 py-2 text-sm font-semibold text-[#9A3412]">{message}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ผลวิเคราะห์จากระบบ</CardTitle>
        </CardHeader>
        <CardContent>
          {!result ? (
            <div className="grid min-h-96 place-items-center rounded-lg border border-dashed border-border bg-white/60 p-6 text-center">
              <div>
                <SearchCheck className="mx-auto size-10 text-[#EC5F27]" aria-hidden="true" />
                <p className="mt-3 font-bold text-foreground">ยังไม่มีผลวิเคราะห์</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">วางหัวข่าว เนื้อหา หรือ URL แล้วกดตรวจ ระบบจะแสดงเหตุผล คำเสี่ยง เคสใกล้เคียง และคำแนะนำสำหรับ workflow ห้องข่าว</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="rounded-lg border border-border bg-white/75 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">ผลประเมินเบื้องต้น</p>
                    <h2 className="mt-1 text-xl font-bold text-foreground">{result.result.headline}</h2>
                  </div>
                  <RiskBadge level={result.result.riskLevel} />
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-[#EC5F27]" style={{ width: `${result.result.confidence}%` }} />
                </div>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">Confidence score {result.result.confidence}%</p>
              </div>

              <section className="grid gap-2">
                <h3 className="text-sm font-bold text-foreground">เหตุผลจาก AI</h3>
                <p className="rounded-lg border border-border bg-white/70 p-3 text-sm leading-7 text-muted-foreground">{result.result.reasoning}</p>
              </section>

              <section className="grid gap-2">
                <h3 className="text-sm font-bold text-foreground">ประเด็นกฎหมาย/บรรณาธิการที่เกี่ยวข้อง</h3>
                <div className="flex flex-wrap gap-2">
                  {result.result.legalConcerns.length ? result.result.legalConcerns.map((item) => (
                    <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item}</span>
                  )) : <span className="text-sm text-muted-foreground">ไม่พบประเด็นเสี่ยงหลัก</span>}
                </div>
              </section>

              <section className="grid gap-2">
                <h3 className="text-sm font-bold text-foreground">เกณฑ์จากคลังความรู้ที่ถูกนำมาใช้</h3>
                <div className="grid gap-2">
                  {result.result.evaluationCriteria.length ? result.result.evaluationCriteria.map((criterion) => (
                    <div key={criterion.id} className="rounded-lg border border-border bg-white/70 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-foreground">{criterion.title}</p>
                        <span className="rounded-full bg-[#FFF3ED] px-2.5 py-1 text-xs font-semibold text-[#9A3412]">{criterion.legalRiskType}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{criterion.recommendation}</p>
                    </div>
                  )) : <span className="text-sm text-muted-foreground">ยังไม่พบเกณฑ์จากคลังความรู้ที่ตรงกับเนื้อหานี้</span>}
                </div>
              </section>

              <section className="grid gap-2">
                <h3 className="text-sm font-bold text-foreground">เอกสารอ้างอิงที่เกี่ยวข้อง</h3>
                <div className="grid gap-2">
                  {result.result.matchingReferences.length ? result.result.matchingReferences.map((reference) => (
                    <div key={reference.id} className="rounded-lg border border-orange-100 bg-[#FFF3ED] p-3">
                      <p className="font-semibold text-[#9A3412]">{reference.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#9A3412]">{reference.summary}</p>
                    </div>
                  )) : <span className="text-sm text-muted-foreground">ไม่มีเอกสารอ้างอิงที่ match โดยตรง</span>}
                </div>
              </section>

              <section className="grid gap-2">
                <h3 className="text-sm font-bold text-foreground">คำที่ตรวจพบ</h3>
                <div className="flex flex-wrap gap-2">
                  {result.result.detectedKeywords.length ? result.result.detectedKeywords.map((item) => (
                    <span key={item} className="rounded-full border border-orange-100 bg-[#FFF3ED] px-3 py-1 text-xs font-semibold text-[#9A3412]">{item}</span>
                  )) : <span className="text-sm text-muted-foreground">ไม่พบ keyword ในฐานความเสี่ยง</span>}
                </div>
              </section>

              <section className="grid gap-2">
                <h3 className="text-sm font-bold text-foreground">เคสใกล้เคียง</h3>
                <div className="grid gap-2">
                  {result.result.matchingCases.length ? result.result.matchingCases.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border bg-white/70 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <RiskBadge level={item.severity} />
                      </div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.recommendation}</p>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">ยังไม่พบเคสที่ตรงมากในฐานข้อมูล</p>}
                </div>
              </section>

              <section className="rounded-lg border border-orange-100 bg-[#FFF3ED] p-4">
                <h3 className="text-sm font-bold text-[#9A3412]">คำแนะนำเชิง workflow</h3>
                <p className="mt-2 text-sm leading-7 text-[#9A3412]">{result.result.recommendation}</p>
              </section>

              <Button type="button" onClick={sendApproval} disabled={sending}>
                {sending ? <Loader2 className="animate-spin" /> : <Send />}
                ส่งให้บรรณาธิการอนุมัติ
                <ArrowRight />
              </Button>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-white/70 p-3 text-xs text-muted-foreground">
                <ClipboardCheck className="size-4 text-[#EC5F27]" aria-hidden="true" />
                การส่งอนุมัติจะบันทึกผล AI เหตุผล หมายเหตุ และสร้าง audit log สำหรับตรวจย้อนหลัง
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
