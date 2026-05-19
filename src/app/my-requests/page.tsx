import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import { PageHeader } from "@/components/operation/page-header";
import { SummaryCard } from "@/components/operation/summary-card";
import { TaskList } from "@/components/operation/task-list";
import { buttonVariants } from "@/components/ui/button";
import { getDashboardMetrics, getRequesterTasks } from "@/lib/operation/metrics";
import { Trans } from "@/components/operation/language-provider";

export default function MyRequestsPage() {
  const myTasks = getRequesterTasks();
  const metrics = getDashboardMetrics(myTasks);

  return (
    <div>
      <PageHeader
        eyebrow={<Trans en="Requester view" th="มุมมองผู้ขอ" />}
        title={<Trans en="My Requests" th="คำขอของฉัน" />}
        description={
          <Trans
            en="Sample requester view for nara.p@example.com. Real auth can filter by the signed-in requester email."
            th="มุมมองตัวอย่างของผู้ขอ nara.p@example.com เมื่อเชื่อมระบบจริงจะกรองจากอีเมลผู้ใช้งานที่เข้าสู่ระบบ"
          />
        }
        actions={
          <Link href="/requests/new" className={buttonVariants()}>
            <FilePlus2 aria-hidden="true" />
            <Trans en="New Request" th="คำขอใหม่" />
          </Link>
        }
      />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title={<Trans en="My total" th="คำขอของฉันทั้งหมด" />} value={metrics.total} />
        <SummaryCard title={<Trans en="In progress" th="กำลังดำเนินการ" />} value={metrics.inProgress} />
        <SummaryCard title={<Trans en="Waiting" th="รอข้อมูล" />} value={metrics.waitingForInfo} tone="yellow" />
        <SummaryCard title={<Trans en="Completed" th="เสร็จแล้ว" />} value={metrics.completed} tone="green" />
      </section>
      <TaskList tasks={myTasks} emptyMessage={<Trans en="No requests for this requester yet." th="ยังไม่มีคำขอของผู้ขอนี้" />} />
    </div>
  );
}
