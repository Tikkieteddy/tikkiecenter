import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/operation/page-header";
import { StatusUpdateForm } from "@/components/operation/status-update-form";
import { buttonVariants } from "@/components/ui/button";
import { getTaskByTicketId } from "@/lib/operation/metrics";
import { Trans } from "@/components/operation/language-provider";

type StatusUpdatePageProps = {
  params: Promise<{ ticketId: string }>;
};

export default async function StatusUpdatePage({ params }: StatusUpdatePageProps) {
  const { ticketId } = await params;
  const task = getTaskByTicketId(ticketId);

  if (!task) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        eyebrow={<Trans en="Status update" th="อัปเดตสถานะ" />}
        title={task.taskTitle}
        description={
          <>
            {task.ticketId} ·{" "}
            <Trans
              en="change status, add update comment, and queue an email to the requester."
              th="เปลี่ยนสถานะ เพิ่มความคิดเห็น และเพิ่มอีเมลแจ้งผู้ขอเข้าคิวส่ง"
            />
          </>
        }
        actions={
          <Link href={`/requests/${task.ticketId}`} className={buttonVariants({ variant: "outline" })}>
            <ArrowLeft aria-hidden="true" />
            <Trans en="Back to detail" th="กลับไปหน้ารายละเอียด" />
          </Link>
        }
      />
      <StatusUpdateForm task={task} />
    </div>
  );
}
