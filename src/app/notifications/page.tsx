import Link from "next/link";
import { MailCheck, RotateCw } from "lucide-react";
import { PageHeader } from "@/components/operation/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/operation/metrics";
import { emailNotifications, tasks } from "@/lib/operation/mock-data";
import { Trans } from "@/components/operation/language-provider";

const emailTypeLabels: Record<string, string> = {
  request_received: "Request received",
  status_changed: "Status changed",
  waiting_for_info: "Waiting for info",
  completed: "Completed",
  rejected: "Rejected",
  overdue_notice: "Overdue notice",
  comment_added: "Comment added",
};

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader
        eyebrow={<Trans en="Email" th="อีเมล" />}
        title={<Trans en="Email Notification Log" th="บันทึกอีเมลแจ้งเตือน" />}
        description={
          <Trans
            en="Phase 1 records email-only notifications for received requests, status changes, comments, completion, rejection, and overdue notices."
            th="Phase 1 บันทึกการแจ้งเตือนทางอีเมลเท่านั้น สำหรับรับเรื่อง เปลี่ยนสถานะ ความคิดเห็น งานเสร็จ การปฏิเสธ และงานเกินกำหนด"
          />
        }
      />

      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        {["sent", "queued", "failed"].map((status) => (
          <Card key={status} className="border-brand-100">
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-semibold capitalize text-muted-foreground">{status}</p>
                <p className="mt-1 text-2xl font-bold">{emailNotifications.filter((email) => email.status === status).length}</p>
              </div>
              <MailCheck className="size-8 text-brand-700" aria-hidden="true" />
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="hidden overflow-hidden border-brand-100 lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead><Trans en="Ticket" th="เลขที่งาน" /></TableHead>
              <TableHead><Trans en="Recipient" th="ผู้รับ" /></TableHead>
              <TableHead><Trans en="Type" th="ประเภท" /></TableHead>
              <TableHead><Trans en="Subject" th="หัวข้อ" /></TableHead>
              <TableHead><Trans en="Status" th="สถานะ" /></TableHead>
              <TableHead><Trans en="Sent at" th="เวลาที่ส่ง" /></TableHead>
              <TableHead><Trans en="Action" th="การทำงาน" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emailNotifications.map((email) => {
              const task = tasks.find((item) => item.id === email.taskId);

              return (
                <TableRow key={email.id}>
                  <TableCell className="font-mono text-xs font-semibold text-brand-700">{task?.ticketId ?? "-"}</TableCell>
                  <TableCell>{email.recipientEmail}</TableCell>
                  <TableCell>{emailTypeLabels[email.emailType]}</TableCell>
                  <TableCell className="max-w-[340px] font-semibold">{email.subject}</TableCell>
                  <TableCell>
                    <Badge variant={email.status === "sent" ? "success" : email.status === "failed" ? "danger" : "warning"}>
                      {email.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(email.sentAt)}</TableCell>
                  <TableCell>
                    <button className={buttonVariants({ variant: "outline", size: "sm" })} disabled={email.status !== "failed"}>
                      <RotateCw aria-hidden="true" />
                      <Trans en="Retry" th="ส่งอีกครั้ง" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <div className="grid gap-3 lg:hidden">
        {emailNotifications.map((email) => {
          const task = tasks.find((item) => item.id === email.taskId);

          return (
            <Card key={email.id} className="border-brand-100">
              <CardContent className="grid gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-brand-700">{task?.ticketId ?? "-"}</p>
                    <p className="mt-1 font-semibold">{email.subject}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{email.recipientEmail}</p>
                  </div>
                  <Badge variant={email.status === "sent" ? "success" : email.status === "failed" ? "danger" : "warning"}>
                    {email.status}
                  </Badge>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-sm">
                  <p>
                    <strong><Trans en="Type:" th="ประเภท:" /></strong> {emailTypeLabels[email.emailType]}
                  </p>
                  <p className="mt-1">
                    <strong><Trans en="Sent:" th="ส่งเมื่อ:" /></strong> {formatDateTime(email.sentAt)}
                  </p>
                </div>
                {task ? (
                  <Link href={`/requests/${task.ticketId}`} className={buttonVariants({ variant: "outline" })}>
                    <Trans en="Open task" th="เปิดงาน" />
                  </Link>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
