"use client";

import { FormEvent, type ReactNode, useMemo, useState } from "react";
import { CheckCircle2, MailCheck, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge, StatusBadge, TimingBadge } from "@/components/operation/badges";
import { buildTaskEmailTemplate } from "@/lib/operation/email";
import { formatDate, getTimingStatus, statuses } from "@/lib/operation/metrics";
import type { EmailType, OperationTask, TaskStatus } from "@/lib/operation/types";
import { Trans, useLocalizedText } from "@/components/operation/language-provider";

type StatusUpdateFormProps = {
  task: OperationTask;
};

type ResultState = {
  status: TaskStatus;
  subject: string;
  body: string;
} | null;

export function StatusUpdateForm({ task }: StatusUpdateFormProps) {
  const t = useLocalizedText();
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [completionDate, setCompletionDate] = useState(task.completionDate ?? "");
  const [comment, setComment] = useState("");
  const [result, setResult] = useState<ResultState>(null);
  const [saving, setSaving] = useState(false);

  const previewTask = useMemo<OperationTask>(
    () => ({
      ...task,
      status,
      completionDate: status === "Done" ? completionDate || "2026-05-18" : task.completionDate,
      updatedAt: "2026-05-18T14:00:00+07:00",
    }),
    [completionDate, status, task],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "Rejected" && !window.confirm(t({ en: "Reject this task and email the requester?", th: "ยืนยันปฏิเสธงานนี้และส่งอีเมลถึงผู้ขอหรือไม่?" }))) return;
    if (status === "Done" && !window.confirm(t({ en: "Mark this task as done and email the requester?", th: "ยืนยันปิดงานนี้และส่งอีเมลถึงผู้ขอหรือไม่?" }))) return;

    setSaving(true);
    window.setTimeout(() => {
      const emailType = getEmailType(status);
      const email = buildTaskEmailTemplate({
        task: previewTask,
        emailType,
        latestComment: comment,
        taskUrl: `/requests/${task.ticketId}`,
        updatedAt: "2026-05-18T14:00:00+07:00",
      });
      setResult({ status, ...email });
      setSaving(false);
    }, 650);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.42fr]">
      <Card className="border-brand-100">
        <CardHeader>
          <CardTitle>
            <Trans en="Update task status" th="อัปเดตสถานะงาน" />
          </CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            <Trans
              en="Status changes automatically prepare an email notification for the requester in Phase 1."
              th="เมื่อเปลี่ยนสถานะ ระบบจะเตรียมอีเมลแจ้งผู้ขอโดยอัตโนมัติใน Phase 1"
            />
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={status} />
              <PriorityBadge priority={task.priority} />
              <TimingBadge timing={getTimingStatus(previewTask)} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label={<Trans en="Current ticket" th="เลขที่งานปัจจุบัน" />}>
                <Input value={task.ticketId} readOnly className="font-mono font-semibold text-brand-700" />
              </Field>
              <Field label={<Trans en="Requester email" th="อีเมลผู้ขอ" />}>
                <Input value={task.requesterEmail} readOnly />
              </Field>
              <Field label={<Trans en="Change status" th="เปลี่ยนสถานะ" />}>
                <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
                  {statuses.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field label={<Trans en="Completion date" th="วันที่เสร็จ" />}>
                <Input
                  disabled={status !== "Done"}
                  type="date"
                  value={completionDate}
                  onChange={(event) => setCompletionDate(event.target.value)}
                />
              </Field>
            </div>

            <Field label={<Trans en="Update comment" th="ความคิดเห็นอัปเดต" />}>
              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={t({
                  en: "This comment will be included in the email to the requester.",
                  th: "ข้อความนี้จะถูกใส่ในอีเมลที่ส่งถึงผู้ขอ",
                })}
              />
            </Field>

            <Field label={<Trans en="Internal note" th="บันทึกภายใน" />}>
              <Textarea
                defaultValue={task.internalNote}
                placeholder={t({ en: "Internal note for Admin/Tikkie only.", th: "บันทึกภายในสำหรับ Admin/Tikkie เท่านั้น" })}
              />
            </Field>

            <div className="flex flex-wrap items-center gap-3">
              <Button disabled={saving} type="submit" size="lg">
                {saving ? t({ en: "Saving...", th: "กำลังบันทึก..." }) : t({ en: "Save update", th: "บันทึกอัปเดต" })}
                <Save aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="success"
                onClick={() => {
                  setStatus("Done");
                  setCompletionDate("2026-05-18");
                }}
              >
                <CheckCircle2 aria-hidden="true" />
                <Trans en="Mark done" th="ทำเครื่องหมายว่าเสร็จ" />
              </Button>
              <Button type="button" variant="danger" onClick={() => setStatus("Rejected")}>
                <XCircle aria-hidden="true" />
                <Trans en="Reject" th="ปฏิเสธ" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <aside className="grid content-start gap-4">
        <Card className="border-brand-100">
          <CardHeader>
            <CardTitle>
              <Trans en="Requester notification" th="การแจ้งเตือนผู้ขอ" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-lg border border-brand-500 bg-primary p-3 text-sm leading-6 !text-brand-yellow [&_*]:!text-brand-yellow">
              <Trans en="Email will be sent to" th="ระบบจะส่งอีเมลถึง" /> <strong>{task.requesterEmail}</strong>{" "}
              <Trans en="after saving the update." th="หลังบันทึกการอัปเดต" />
            </div>
            <div className="grid gap-2 rounded-lg border border-border p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">
                  <Trans en="Deadline" th="กำหนดส่ง" />
                </span>
                <span>{formatDate(task.deadlineDate)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">
                  <Trans en="Current status" th="สถานะปัจจุบัน" />
                </span>
                <Badge variant="blue">{task.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {result ? (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <MailCheck className="size-5" aria-hidden="true" />
                <Trans en="Email queued" th="เพิ่มอีเมลเข้าคิวแล้ว" />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <p className="text-sm font-semibold text-green-900">{result.subject}</p>
              <pre className="max-h-72 overflow-auto rounded-lg bg-white p-3 text-xs leading-5 text-slate-700">
                {result.body}
              </pre>
            </CardContent>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}

function getEmailType(status: TaskStatus): EmailType {
  if (status === "Done") return "completed";
  if (status === "Rejected") return "rejected";
  if (status === "Waiting for Info") return "waiting_for_info";
  return "status_changed";
}

function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
