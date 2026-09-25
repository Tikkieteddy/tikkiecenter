import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FilePlus2,
  Inbox,
  ListChecks,
  PauseCircle,
  TimerReset,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/operation/page-header";
import { SummaryCard } from "@/components/operation/summary-card";
import { TaskList } from "@/components/operation/task-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getDashboardMetrics, getTasksDueThisWeek, getTasksOverdueMoreThan3Days } from "@/lib/operation/metrics";
import { emailNotifications, tasks } from "@/lib/operation/mock-data";
import { Trans } from "@/components/operation/language-provider";

export default function DashboardPage() {
  const metrics = getDashboardMetrics();
  const dueThisWeek = getTasksDueThisWeek();
  const oldOverdue = getTasksOverdueMoreThan3Days();
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        eyebrow={<Trans en="Operation overview" th="ภาพรวมการทำงาน" />}
        title={<Trans en="Dashboard" th="แดชบอร์ด" />}
        description={
          <Trans
            en="A compact view of requests, deadlines, email status, and work that needs attention today."
            th="มุมมองสรุปของคำขอ กำหนดส่ง สถานะอีเมล และงานที่ต้องติดตามวันนี้"
          />
        }
        actions={
          <Link href="/requests/new" className={buttonVariants()}>
            <FilePlus2 aria-hidden="true" />
            <Trans en="Create Request" th="สร้างคำขอ" />
          </Link>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title={<Trans en="Total requests" th="คำขอทั้งหมด" />}
          value={metrics.total}
          helper={<Trans en="All sample tickets" th="รายการตัวอย่างทั้งหมด" />}
          icon={<Inbox />}
        />
        <SummaryCard
          title={<Trans en="New today" th="คำขอใหม่วันนี้" />}
          value={metrics.newToday}
          helper={<Trans en="Created on 18 May" th="สร้างเมื่อ 18 พ.ค." />}
          icon={<FilePlus2 />}
        />
        <SummaryCard
          title={<Trans en="In progress" th="กำลังดำเนินการ" />}
          value={metrics.inProgress}
          helper={<Trans en="Actively being worked" th="กำลังทำงานอยู่" />}
          icon={<Clock3 />}
        />
        <SummaryCard
          title={<Trans en="Waiting for info" th="รอข้อมูลเพิ่มเติม" />}
          value={metrics.waitingForInfo}
          helper={<Trans en="Requester action needed" th="ต้องการข้อมูลจากผู้ขอ" />}
          icon={<PauseCircle />}
          tone="yellow"
        />
        <SummaryCard
          title={<Trans en="Completed" th="เสร็จแล้ว" />}
          value={metrics.completed}
          helper={<Trans en="Done tickets" th="งานที่ปิดแล้ว" />}
          icon={<CheckCircle2 />}
          tone="green"
        />
        <SummaryCard
          title={<Trans en="Rejected" th="ปฏิเสธ" />}
          value={metrics.rejected}
          helper={<Trans en="Not accepted" th="ไม่รับดำเนินการ" />}
          icon={<XCircle />}
          tone="red"
        />
        <SummaryCard
          title={<Trans en="Overdue" th="เกินกำหนด" />}
          value={metrics.overdue}
          helper={<Trans en="Past deadline" th="เลยกำหนดส่ง" />}
          icon={<AlertTriangle />}
          tone="red"
        />
        <SummaryCard
          title={<Trans en="Due soon" th="ใกล้ครบกำหนด" />}
          value={metrics.dueSoon}
          helper={<Trans en="Within next 3 days" th="ภายใน 3 วันถัดไป" />}
          icon={<TimerReset />}
          tone="yellow"
        />
        <SummaryCard
          title={<Trans en="Completed on time" th="เสร็จตรงเวลา" />}
          value={metrics.completedOnTime}
          helper="completion_date <= deadline"
          icon={<CheckCircle2 />}
          tone="green"
        />
        <SummaryCard
          title={<Trans en="Completed late" th="เสร็จล่าช้า" />}
          value={metrics.completedLate}
          helper="completion_date > deadline"
          icon={<AlertTriangle />}
          tone="red"
        />
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border-brand-100">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>
                <Trans en="Recent activity" th="กิจกรรมล่าสุด" />
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                <Trans en="Latest updated tickets across all teams." th="รายการที่อัปเดตล่าสุดจากทุกทีม" />
              </p>
            </div>
            <Link href="/requests" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <Trans en="View all" th="ดูทั้งหมด" />
            </Link>
          </CardHeader>
          <CardContent>
            <TaskList tasks={recentTasks} compact />
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border-brand-100">
            <CardHeader>
              <CardTitle>
                <Trans en="Deadline focus" th="งานที่ต้องจับตากำหนดส่ง" />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex items-center justify-between rounded-lg bg-brand-yellow/80 p-3 !text-brand-yellow-foreground [&_*]:!text-brand-yellow-foreground">
                <span className="text-sm font-semibold">
                  <Trans en="Due this week" th="ครบกำหนดสัปดาห์นี้" />
                </span>
                <Badge variant="warning">{dueThisWeek.length}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                <span className="text-sm font-semibold text-red-900">
                  <Trans en="Overdue more than 3 days" th="เกินกำหนดมากกว่า 3 วัน" />
                </span>
                <Badge variant="danger">{oldOverdue.length}</Badge>
              </div>
              <Separator />
              <div className="grid gap-2">
                {dueThisWeek.slice(0, 4).map((task) => (
                  <Link key={task.id} href={`/requests/${task.ticketId}`} className="rounded-lg border border-border p-3 hover:bg-brand-50">
                    <p className="font-mono text-xs font-semibold text-brand-700">{task.ticketId}</p>
                    <p className="mt-1 text-sm font-semibold">{task.taskTitle}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-brand-100">
            <CardHeader>
              <CardTitle>
                <Trans en="Email notification queue" th="คิวแจ้งเตือนทางอีเมล" />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex items-center justify-between rounded-lg border border-brand-500 bg-primary p-3 !text-brand-yellow [&_*]:!text-brand-yellow">
                <span className="text-sm font-semibold text-brand-yellow">
                  <Trans en="Phase 1 email only" th="เฟส 1 ใช้อีเมลเท่านั้น" />
                </span>
                <Badge variant="success">
                  <Trans en="Enabled" th="เปิดใช้งาน" />
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <span className="text-sm font-semibold text-slate-700">
                  <Trans en="Queued notifications" th="อีเมลที่รอส่ง" />
                </span>
                <Badge variant="slate">{emailNotifications.filter((email) => email.status === "queued").length}</Badge>
              </div>
              <Link href="/notifications" className={buttonVariants({ variant: "outline" })}>
                <ListChecks aria-hidden="true" />
                <Trans en="Open notification log" th="เปิดบันทึกอีเมล" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
