"use client";

import { useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ImagePlus,
  Link2,
  Loader2,
  MessageSquareText,
  Send,
  ShieldAlert,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RiskBadge } from "@/components/newsroom/risk-badge";
import type { AiScreeningResult } from "@/lib/newsroom/types";

type ReviewStatus = "PENDING" | "APPROVED" | "DECLINED";

type ChatItem = {
  id: string;
  sender: "USER" | "AI";
  createdAt: string;
  text: string;
  link?: string;
  imageName?: string;
  imagePreview?: string;
  result?: AiScreeningResult;
  status?: ReviewStatus;
  declinedComment?: string;
};

const statusText: Record<ReviewStatus, string> = {
  PENDING: "รอตัดสินใจ",
  APPROVED: "Approve",
  DECLINED: "Declined",
};

const statusClass: Record<ReviewStatus, string> = {
  PENDING: "border-orange-100 bg-[#FFF3ED] text-[#9A3412]",
  APPROVED: "border-green-100 bg-green-50 text-green-700",
  DECLINED: "border-red-100 bg-red-50 text-red-700",
};

export function ReviewChatWorkspace() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const [items, setItems] = useState<ChatItem[]>([
    {
      id: "welcome",
      sender: "AI",
      createdAt: new Date().toISOString(),
      text: "ส่งข้อความ ลิงก์ หรือรูปมาได้เลย ระบบจะตรวจความเสี่ยงเบื้องต้นและดึงเกณฑ์จากคลังความรู้มาใช้ประกอบการพิจารณา",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [declineTarget, setDeclineTarget] = useState<ChatItem | null>(null);
  const [declineComment, setDeclineComment] = useState("");

  const canSubmit = useMemo(() => {
    return message.trim().length > 0 || link.trim().length > 0 || Boolean(image);
  }, [image, link, message]);

  function updateAiItem(id: string, patch: Partial<ChatItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function handleImageChange(file: File | undefined) {
    if (!file) return;
    if (image?.preview) URL.revokeObjectURL(image.preview);
    setImage({ file, preview: URL.createObjectURL(file) });
  }

  function clearImage() {
    if (image?.preview) URL.revokeObjectURL(image.preview);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function submitForReview() {
    if (!canSubmit) return;

    setLoading(true);
    const userItem: ChatItem = {
      id: `USR-${Date.now()}`,
      sender: "USER",
      createdAt: new Date().toISOString(),
      text: message.trim() || "ส่งรูป/ลิงก์ให้ตรวจสอบ",
      link: link.trim() || undefined,
      imageName: image?.file.name,
      imagePreview: image?.preview,
    };

    setItems((current) => [...current, userItem]);

    try {
      const response = await fetch("/api/screenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: message.slice(0, 180),
          content: message,
          url: link,
          notes: image
            ? `แนบรูปสำหรับตรวจสอบ: ${image.file.name} (${Math.round(image.file.size / 1024)} KB). ต้องส่ง OCR/image moderation เพิ่มหากใช้ตรวจภาพจริง`
            : "",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ตรวจสอบไม่สำเร็จ");

      const result = data.result as AiScreeningResult;
      const aiItem: ChatItem = {
        id: `AI-${Date.now()}`,
        sender: "AI",
        createdAt: new Date().toISOString(),
        text: result.recommendation,
        result,
        status: "PENDING",
      };

      setItems((current) => [...current, aiItem]);
      setMessage("");
      setLink("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setImage(null);
    } catch (error) {
      setItems((current) => [
        ...current,
        {
          id: `ERR-${Date.now()}`,
          sender: "AI",
          createdAt: new Date().toISOString(),
          text: error instanceof Error ? error.message : "ระบบตรวจสอบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function approve(item: ChatItem) {
    updateAiItem(item.id, {
      status: "APPROVED",
      text: "บรรณาธิการกด Approve แล้ว สามารถเดิน workflow ต่อได้ตามเงื่อนไขที่ระบุในผลประเมิน",
    });
  }

  function openDecline(item: ChatItem) {
    setDeclineTarget(item);
    setDeclineComment(item.declinedComment || "");
  }

  function saveDecline() {
    if (!declineTarget) return;
    updateAiItem(declineTarget.id, {
      status: "DECLINED",
      declinedComment: declineComment.trim(),
      text: "บรรณาธิการกด Declined ต้องแก้ไขหรือหยุดเผยแพร่ตามคอมเมนต์ก่อนส่งตรวจใหม่",
    });
    setDeclineTarget(null);
    setDeclineComment("");
  }

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="min-h-[calc(100vh-12rem)] overflow-hidden">
          <CardHeader className="border-b border-border bg-white/75">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquareText className="size-5 text-[#EC5F27]" aria-hidden="true" />
                หน้าต่างแชทตรวจสอบ
              </CardTitle>
              <Badge className="border-orange-100 bg-[#FFF3ED] text-[#EC5F27]">AI Screening + Editor Decision</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-4">
            <div className="newsroom-scrollbar grid max-h-[58vh] min-h-96 content-start gap-4 overflow-y-auto pr-1">
              {items.map((item) => (
                <article
                  key={item.id}
                  className={item.sender === "USER" ? "ml-auto max-w-[88%] rounded-lg bg-[#0F172A] p-4 text-white" : "mr-auto max-w-[92%] rounded-lg border border-border bg-white/78 p-4 shadow-sm"}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={item.sender === "USER" ? "text-xs font-bold text-orange-100" : "text-xs font-bold text-[#EC5F27]"}>
                        {item.sender === "USER" ? "Desk ส่งตรวจ" : "AI Editorial Assistant"}
                      </p>
                      <p className={item.sender === "USER" ? "mt-2 whitespace-pre-wrap text-sm leading-7 text-white" : "mt-2 whitespace-pre-wrap text-sm leading-7 text-foreground"}>
                        {item.text}
                      </p>
                    </div>
                    {item.status ? <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass[item.status]}`}>{statusText[item.status]}</span> : null}
                  </div>

                  {item.link ? (
                    <a className="mt-3 flex items-center gap-2 break-all rounded-lg border border-white/20 bg-white/10 p-2 text-xs font-semibold" href={item.link} target="_blank" rel="noreferrer">
                      <Link2 className="size-4 shrink-0" aria-hidden="true" />
                      {item.link}
                    </a>
                  ) : null}

                  {item.imagePreview ? (
                    <div className="mt-3 overflow-hidden rounded-lg border border-white/20 bg-white/10">
                      <img src={item.imagePreview} alt={item.imageName || "ภาพที่ส่งตรวจ"} className="max-h-64 w-full object-contain" />
                      <p className="px-3 py-2 text-xs font-semibold">{item.imageName}</p>
                    </div>
                  ) : null}

                  {item.result ? (
                    <div className="mt-4 grid gap-3 rounded-lg border border-border bg-white/80 p-3 text-foreground">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">ผลประเมินเบื้องต้น</p>
                          <p className="mt-1 font-bold">{item.result.headline}</p>
                        </div>
                        <RiskBadge level={item.result.riskLevel} />
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">{item.result.reasoning}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.result.detectedKeywords.slice(0, 8).map((keyword) => (
                          <span key={keyword} className="rounded-full bg-[#FFF3ED] px-2.5 py-1 text-xs font-semibold text-[#9A3412]">
                            {keyword}
                          </span>
                        ))}
                      </div>
                      {item.declinedComment ? (
                        <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm leading-6 text-red-700">
                          <span className="font-bold">เหตุผล Declined: </span>
                          {item.declinedComment}
                        </div>
                      ) : null}
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Button type="button" variant="success" onClick={() => approve(item)} disabled={item.status === "APPROVED"}>
                          <CheckCircle2 />
                          Approve
                        </Button>
                        <Button type="button" variant="danger" onClick={() => openDecline(item)} disabled={item.status === "DECLINED"}>
                          <XCircle />
                          Declined
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-white/80 p-3 shadow-sm">
              <div className="grid gap-3">
                <Textarea
                  rows={3}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="พิมพ์ข้อความ หัวข่าว caption หรือรายละเอียดที่ต้องการให้ตรวจ..."
                />
                <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                  <Input value={link} onChange={(event) => setLink(event.target.value)} placeholder="วาง link ข่าว / social / source URL" />
                  <input ref={fileInputRef} className="hidden" type="file" accept="image/*" onChange={(event) => handleImageChange(event.target.files?.[0])} />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <ImagePlus />
                    แนบรูป
                  </Button>
                </div>
                {image ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-orange-100 bg-[#FFF3ED] p-2 text-sm font-semibold text-[#9A3412]">
                    <span className="min-w-0 truncate">{image.file.name}</span>
                    <Button aria-label="ลบรูปที่แนบ" type="button" size="icon" variant="ghost" onClick={clearImage}>
                      <X />
                    </Button>
                  </div>
                ) : null}
                <Button type="button" onClick={submitForReview} disabled={!canSubmit || loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <Send />}
                  ส่งเข้าตรวจสอบ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-[#EC5F27]" aria-hidden="true" />
              หลักการตัดสินใจ
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-7 text-muted-foreground">
            <p>Approve ใช้เมื่อบรรณาธิการเห็นว่าสามารถเดินต่อได้ตามเงื่อนไขที่ระบุ เช่น เพิ่มที่มา ปรับคำ หรือส่งอนุมัติขั้นถัดไป</p>
            <p>Declined ใช้เมื่อควรหยุดเผยแพร่หรือให้แก้ไขก่อน โดยต้องใส่คอมเมนต์เพื่อให้ audit log อ่านย้อนกลับได้</p>
            <div className="rounded-lg border border-orange-100 bg-[#FFF3ED] p-3 text-[#9A3412]">
              รูปภาพในเวอร์ชันนี้แสดง preview และแนบชื่อไฟล์เข้าบริบทตรวจสอบ โครงสร้างพร้อมต่อ OCR / image moderation ในขั้นต่อไป
            </div>
          </CardContent>
        </Card>
      </div>

      {declineTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-foreground">เขียนคอมเมนต์ Declined</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">ระบุเหตุผลให้ชัดเจน เพื่อให้ reporter หรือ desk นำไปแก้ไขก่อนส่งตรวจใหม่</p>
              </div>
              <Button aria-label="ปิดหน้าต่าง" type="button" size="icon" variant="ghost" onClick={() => setDeclineTarget(null)}>
                <X />
              </Button>
            </div>
            <Textarea
              className="mt-4"
              rows={6}
              value={declineComment}
              onChange={(event) => setDeclineComment(event.target.value)}
              placeholder="เช่น หัวข่าวยังเป็นข้อกล่าวหาโดยตรง ขาดคำชี้แจงจากผู้ถูกกล่าวหา และควรส่ง legal review ก่อน"
            />
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setDeclineTarget(null)}>
                ยกเลิก
              </Button>
              <Button type="button" variant="danger" onClick={saveDecline} disabled={!declineComment.trim()}>
                <XCircle />
                บันทึก Declined
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
