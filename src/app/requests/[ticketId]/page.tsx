import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft, Edit3, ExternalLink, Mail } from "lucide-react";
import { PageHeader } from "@/components/operation/page-header";
import { PriorityBadge, StatusBadge, TimingBadge } from "@/components/operation/badges";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { emailNotifications, statusHistory, taskComments, users } from "@/lib/operation/mock-data";
import { formatDate, formatDateTime, getAssigneeName, getTaskByTicketId, getTimingStatus } from "@/lib/operation/metrics";
import { Trans } from "@/components/operation/language-provider";

type TaskDetailPageProps = {
  params: Promise<{ ticketId: string }>;
};

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { ticketId } = await params;
  const task = getTaskByTicketId(ticketId);

  if (!task) {
    notFound();
  }

  const comments = taskComments.filter((comment) => comment.taskId === task.id);
  const history = statusHistory.filter((item) => item.taskId === task.id);
  const emails = emailNotifications.filter((email) => email.taskId === task.id);

  return (
    <div>
      <PageHeader
        eyebrow={<Trans en="Task detail" th="รายละเอียดงาน" />}
        title={task.taskTitle}
        description={
          <>
            {task.ticketId} · {task.requesterName} <Trans en="from" th="จากทีม" /> {task.requesterTeam}
          </>
        }
        actions={
          <>
            <Link href="/requests" className={buttonVariants({ variant: "outline" })}>
              <ArrowLeft aria-hidden="true" />
              <Trans en="Back" th="กลับ" />
            </Link>
            <Link href={`/requests/${task.ticketId}/update`} className={buttonVariants()}>
              <Edit3 aria-hidden="true" />
              <Trans en="Update Status" th="อัปเดตสถานะ" />
            </Link>
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[1fr_0.42fr]">
        <div className="grid gap-4">
          <Card className="border-brand-100">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>
                  <Trans en="Request details" th="รายละเอียดคำขอ" />
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  <Trans en="Full context submitted by requester." th="ข้อมูลทั้งหมดที่ผู้ขอส่งเข้ามา" />
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                <TimingBadge timing={getTimingStatus(task)} />
              </div>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Info label={<Trans en="Ticket ID" th="เลขที่งาน" />} value={task.ticketId} mono />
                <Info label={<Trans en="Requester" th="ผู้ขอ" />} value={task.requesterName} />
                <Info label={<Trans en="Requester email" th="อีเมลผู้ขอ" />} value={task.requesterEmail} />
                <Info label={<Trans en="Team" th="ทีม" />} value={task.requesterTeam} />
                <Info label={<Trans en="Category" th="ประเภท" />} value={task.taskCategory} />
                <Info label={<Trans en="Assignee" th="ผู้รับผิดชอบ" />} value={getAssigneeName(task.assigneeId)} />
                <Info label={<Trans en="Created date" th="วันที่สร้าง" />} value={formatDate(task.createdDate)} />
                <Info label={<Trans en="Deadline" th="กำหนดส่ง" />} value={formatDate(task.deadlineDate)} />
                <Info label={<Trans en="Completion date" th="วันที่เสร็จ" />} value={formatDate(task.completionDate)} />
              </div>

              <Separator />

              <div className="grid gap-2">
                <p className="text-sm font-semibold text-muted-foreground">
                  <Trans en="Full details" th="รายละเอียดทั้งหมด" />
                </p>
                <p className="rounded-lg bg-slate-50 p-4 text-sm leading-7 text-foreground">{task.taskDetail}</p>
              </div>

              {task.attachmentUrl ? (
                <a
                  href={task.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-lg border border-brand-500 bg-primary px-3 py-2 text-sm font-semibold !text-brand-yellow [&_*]:!text-brand-yellow"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  <Trans en="Open attachment" th="เปิดไฟล์แนบ" />
                </a>
              ) : (
                <p className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                  <Trans en="No attachment URL was provided." th="ไม่มีลิงก์ไฟล์แนบ" />
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-brand-100">
            <CardHeader>
              <CardTitle>
                <Trans en="Status history timeline" th="ไทม์ไลน์สถานะ" />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {history.length ? (
                history.map((item) => (
                  <div key={item.id} className="grid gap-2 rounded-lg border border-border bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.oldStatus ? <Badge variant="slate">{item.oldStatus}</Badge> : null}
                        <span className="text-sm font-semibold text-muted-foreground">
                          <Trans en="to" th="เป็น" />
                        </span>
                        <StatusBadge status={item.newStatus} />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">{formatDateTime(item.createdAt)}</span>
                    </div>
                    <p className="text-sm leading-6">{item.comment}</p>
                    <p className="text-xs text-muted-foreground">
                      <Trans en="Changed by" th="เปลี่ยนโดย" /> {users.find((user) => user.id === item.changedBy)?.name ?? "Unknown"}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyLine text={<Trans en="No status history yet." th="ยังไม่มีประวัติสถานะ" />} />
              )}
            </CardContent>
          </Card>

          <Card className="border-brand-100">
            <CardHeader>
              <CardTitle>
                <Trans en="Comments" th="ความคิดเห็น" />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {comments.length ? (
                comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg border border-border bg-white p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <Badge variant={comment.isInternal ? "warning" : "blue"}>
                        {comment.isInternal ? <Trans en="Internal" th="ภายใน" /> : <Trans en="Requester visible" th="ผู้ขอมองเห็น" />}
                      </Badge>
                      <span className="text-xs font-semibold text-muted-foreground">{formatDateTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm leading-6">{comment.comment}</p>
                  </div>
                ))
              ) : (
                <EmptyLine text={<Trans en="No comments yet." th="ยังไม่มีความคิดเห็น" />} />
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="grid content-start gap-4">
          <Card className="border-brand-100">
            <CardHeader>
              <CardTitle>
                <Trans en="Internal notes" th="บันทึกภายใน" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {task.internalNote || <Trans en="No internal note has been added." th="ยังไม่มีบันทึกภายใน" />}
              </p>
            </CardContent>
          </Card>

          <Card className="border-brand-100">
            <CardHeader>
              <CardTitle>
                <Trans en="Email notification history" th="ประวัติอีเมลแจ้งเตือน" />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {emails.length ? (
                emails.map((email) => (
                  <div key={email.id} className="grid gap-2 rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{email.subject}</p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{email.recipientEmail}</p>
                      </div>
                      <Badge variant={email.status === "sent" ? "success" : email.status === "failed" ? "danger" : "warning"}>
                        {email.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDateTime(email.sentAt)}</p>
                  </div>
                ))
              ) : (
                <EmptyLine text={<Trans en="No email notifications for this task." th="ยังไม่มีอีเมลแจ้งเตือนสำหรับงานนี้" />} />
              )}
              <Link href="/notifications" className={buttonVariants({ variant: "outline" })}>
                <Mail aria-hidden="true" />
                <Trans en="View all logs" th="ดูบันทึกทั้งหมด" />
              </Link>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}

function Info({ label, value, mono }: { label: ReactNode; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className={mono ? "mt-1 font-mono text-sm font-bold text-brand-700" : "mt-1 text-sm font-semibold text-foreground"}>
        {value}
      </p>
    </div>
  );
}

function EmptyLine({ text }: { text: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">{text}</p>;
}
