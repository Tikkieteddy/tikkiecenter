import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Eye } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PriorityBadge, StatusBadge, TimingBadge } from "@/components/operation/badges";
import { formatDate, getAssigneeName, getTimingStatus } from "@/lib/operation/metrics";
import type { OperationTask } from "@/lib/operation/types";
import { Trans } from "@/components/operation/language-provider";

type TaskListProps = {
  tasks: OperationTask[];
  emptyMessage?: ReactNode;
  compact?: boolean;
};

export function TaskList({ tasks, emptyMessage = "No requests found.", compact = false }: TaskListProps) {
  if (!tasks.length) {
    return (
      <Card className="border-dashed border-brand-500 bg-primary !text-brand-yellow [&_*]:!text-brand-yellow">
        <CardContent className="grid min-h-36 place-items-center p-6 text-center">
          <div>
            <p className="font-semibold text-brand-yellow">{emptyMessage}</p>
            <p className="mt-1 text-sm text-brand-yellow-soft">
              <Trans en="Try changing filters or create a new request." th="ลองเปลี่ยนตัวกรองหรือสร้างคำขอใหม่" />
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="hidden overflow-hidden rounded-lg border border-border bg-white shadow-sm lg:block">
        <Table className="min-w-[1120px]">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead><Trans en="Ticket ID" th="เลขที่งาน" /></TableHead>
              <TableHead><Trans en="Task title" th="ชื่องาน" /></TableHead>
              <TableHead><Trans en="Requester" th="ผู้ขอ" /></TableHead>
              <TableHead><Trans en="Team" th="ทีม" /></TableHead>
              <TableHead><Trans en="Category" th="ประเภท" /></TableHead>
              <TableHead><Trans en="Priority" th="ความเร่งด่วน" /></TableHead>
              <TableHead><Trans en="Status" th="สถานะ" /></TableHead>
              <TableHead><Trans en="Created" th="วันที่สร้าง" /></TableHead>
              <TableHead><Trans en="Deadline" th="กำหนดส่ง" /></TableHead>
              <TableHead><Trans en="Completion" th="วันที่เสร็จ" /></TableHead>
              <TableHead><Trans en="On-time / Late" th="ตรงเวลา / ล่าช้า" /></TableHead>
              {!compact ? <TableHead><Trans en="Assignee" th="ผู้รับผิดชอบ" /></TableHead> : null}
              <TableHead><Trans en="Action" th="การทำงาน" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-mono text-xs font-semibold text-brand-700">{task.ticketId}</TableCell>
                <TableCell className="max-w-[260px] font-semibold">{task.taskTitle}</TableCell>
                <TableCell>{task.requesterName}</TableCell>
                <TableCell>{task.requesterTeam}</TableCell>
                <TableCell>{task.taskCategory}</TableCell>
                <TableCell>
                  <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell>{formatDate(task.createdDate)}</TableCell>
                <TableCell>{formatDate(task.deadlineDate)}</TableCell>
                <TableCell>{formatDate(task.completionDate)}</TableCell>
                <TableCell>
                  <TimingBadge timing={getTimingStatus(task)} />
                </TableCell>
                {!compact ? <TableCell>{getAssigneeName(task.assigneeId)}</TableCell> : null}
                <TableCell>
                  <Link className={buttonVariants({ size: "sm", variant: "outline" })} href={`/requests/${task.ticketId}`}>
                    <Eye aria-hidden="true" />
                    <Trans en="View" th="ดู" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {tasks.map((task) => (
          <Card key={task.id} className="border-brand-100 shadow-sm">
            <CardContent className="grid gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs font-semibold text-brand-700">{task.ticketId}</p>
                  <h3 className="mt-1 text-base font-bold leading-snug">{task.taskTitle}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                  {task.requesterName} · {task.requesterTeam}
                  </p>
                </div>
                <Link
                  href={`/requests/${task.ticketId}`}
                  className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-white text-brand-700 shadow-sm"
                  aria-label={`View ${task.ticketId}`}
                >
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                <TimingBadge timing={getTimingStatus(task)} />
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground"><Trans en="Category" th="ประเภท" /></p>
                  <p className="mt-1 font-semibold">{task.taskCategory}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground"><Trans en="Deadline" th="กำหนดส่ง" /></p>
                  <p className="mt-1 font-semibold">{formatDate(task.deadlineDate)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground"><Trans en="Created" th="วันที่สร้าง" /></p>
                  <p className="mt-1 font-semibold">{formatDate(task.createdDate)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground"><Trans en="Completion" th="วันที่เสร็จ" /></p>
                  <p className="mt-1 font-semibold">{formatDate(task.completionDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
