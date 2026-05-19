import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Clock3, CircleDot, PauseCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TaskPriority, TaskStatus, TimingStatus } from "@/lib/operation/types";
import { Trans } from "@/components/operation/language-provider";

const statusLabels: Record<TaskStatus, { en: string; th: string }> = {
  New: { en: "New", th: "ใหม่" },
  Reviewing: { en: "Reviewing", th: "กำลังตรวจสอบ" },
  "In Progress": { en: "In Progress", th: "กำลังดำเนินการ" },
  "Waiting for Info": { en: "Waiting for Info", th: "รอข้อมูลเพิ่มเติม" },
  Done: { en: "Done", th: "เสร็จแล้ว" },
  Rejected: { en: "Rejected", th: "ปฏิเสธ" },
};

const priorityLabels: Record<TaskPriority, { en: string; th: string }> = {
  Normal: { en: "Normal", th: "ปกติ" },
  Urgent: { en: "Urgent", th: "ด่วน" },
  "Very Urgent": { en: "Very Urgent", th: "ด่วนมาก" },
};

const timingLabels: Record<TimingStatus, { en: string; th: string }> = {
  "Completed on time": { en: "Completed on time", th: "เสร็จตรงเวลา" },
  "Completed late": { en: "Completed late", th: "เสร็จล่าช้า" },
  Overdue: { en: "Overdue", th: "เกินกำหนด" },
  "Due soon": { en: "Due soon", th: "ใกล้ครบกำหนด" },
  Pending: { en: "Pending", th: "รอดำเนินการ" },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config: Record<TaskStatus, { variant: "blue" | "warning" | "success" | "danger" | "slate"; icon: ReactNode }> = {
    New: { variant: "blue", icon: <CircleDot aria-hidden="true" /> },
    Reviewing: { variant: "warning", icon: <Clock3 aria-hidden="true" /> },
    "In Progress": { variant: "blue", icon: <Clock3 aria-hidden="true" /> },
    "Waiting for Info": { variant: "warning", icon: <PauseCircle aria-hidden="true" /> },
    Done: { variant: "success", icon: <CheckCircle2 aria-hidden="true" /> },
    Rejected: { variant: "danger", icon: <XCircle aria-hidden="true" /> },
  };

  return (
    <Badge variant={config[status].variant} className="[&_svg]:size-3">
      {config[status].icon}
      <Trans en={statusLabels[status].en} th={statusLabels[status].th} />
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const variant = priority === "Very Urgent" ? "danger" : priority === "Urgent" ? "warning" : "slate";

  return (
    <Badge variant={variant}>
      <Trans en={priorityLabels[priority].en} th={priorityLabels[priority].th} />
    </Badge>
  );
}

export function TimingBadge({ timing }: { timing: TimingStatus }) {
  const variant =
    timing === "Completed on time"
      ? "success"
      : timing === "Completed late" || timing === "Overdue"
        ? "danger"
        : timing === "Due soon"
          ? "warning"
          : "slate";

  return (
    <Badge variant={variant} className="[&_svg]:size-3">
      {timing === "Overdue" ? <AlertTriangle aria-hidden="true" /> : null}
      <Trans en={timingLabels[timing].en} th={timingLabels[timing].th} />
    </Badge>
  );
}
