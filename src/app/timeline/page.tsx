"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, FilePlus2, Inbox, Send, TimerReset } from "lucide-react";
import { PageHeader } from "@/components/operation/page-header";
import { PriorityBadge, StatusBadge, TimingBadge } from "@/components/operation/badges";
import { SummaryCard } from "@/components/operation/summary-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { tasks } from "@/lib/operation/mock-data";
import { getAssigneeName, getDashboardMetrics, getRequesterTasks, getTimingStatus } from "@/lib/operation/metrics";
import type { OperationTask } from "@/lib/operation/types";
import { cn } from "@/lib/utils";
import { Trans, useLanguage } from "@/components/operation/language-provider";

type RelationFilter = "waiting-for-others" | "others-waiting-for-us";
type WorkTypeFilter = "all" | "dev" | "content" | "seo" | "other";
type WorkType = Exclude<WorkTypeFilter, "all">;

const incomingAssigneeIds = new Set(["usr-tikkie", "usr-admin"]);

const relationFilters: Array<{
  id: RelationFilter;
  label: { en: string; th: string };
  helper: { en: string; th: string };
  icon: typeof Inbox;
}> = [
  {
    id: "others-waiting-for-us",
    label: { en: "Others waiting for us", th: "งานที่คนอื่นรอเรา" },
    helper: { en: "Requests assigned to Tikkie/Admin", th: "งานที่ถูกส่งมาหา Tikkie/Admin" },
    icon: Inbox,
  },
  {
    id: "waiting-for-others",
    label: { en: "We wait for others", th: "งานที่เรารอคนอื่น" },
    helper: { en: "Requests we submitted to track follow-up", th: "งานที่เรากรอกไว้เพื่อติดตามคนอื่น" },
    icon: Send,
  },
];

const workTypeFilters: Array<{ id: WorkTypeFilter; label: string; th: string }> = [
  { id: "all", label: "All", th: "ทั้งหมด" },
  { id: "dev", label: "Dev", th: "Dev" },
  { id: "content", label: "Content", th: "Content" },
  { id: "seo", label: "SEO", th: "SEO" },
  { id: "other", label: "Other", th: "Other" },
];

const workTypeStyle: Record<WorkType, { dot: string; badge: string; label: string }> = {
  dev: {
    dot: "bg-brand-cyan",
    badge: "border-brand-cyan/35 bg-brand-cyan/10 text-brand-700",
    label: "Dev",
  },
  content: {
    dot: "bg-primary",
    badge: "border-brand-300 bg-brand-50 text-brand-700",
    label: "Content",
  },
  seo: {
    dot: "bg-brand-yellow",
    badge: "border-brand-yellow/70 bg-brand-yellow/80 !text-brand-yellow-foreground",
    label: "SEO",
  },
  other: {
    dot: "bg-slate-400",
    badge: "border-slate-200 bg-slate-50 text-slate-700",
    label: "Other",
  },
};

function getWorkType(task: OperationTask): WorkType {
  const category = task.taskCategory.toLowerCase();
  const searchable = `${task.taskTitle} ${task.taskDetail} ${task.taskCategory}`.toLowerCase();

  if (searchable.includes("seo") || searchable.includes("faq") || searchable.includes("utm") || searchable.includes("help center")) {
    return "seo";
  }

  if (["web", "automation", "data"].includes(category)) {
    return "dev";
  }

  if (["content", "design", "presentation", "video editor", "document", "email"].includes(category)) {
    return "content";
  }

  return "other";
}

function getTimelineTasks(relation: RelationFilter) {
  if (relation === "waiting-for-others") {
    return getRequesterTasks();
  }

  return tasks.filter((task) => incomingAssigneeIds.has(task.assigneeId ?? ""));
}

function formatDate(date: string, language: "en" | "th") {
  return new Intl.DateTimeFormat(language === "th" ? "th-TH" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00+07:00`));
}

function sortByDeadline(sourceTasks: OperationTask[]) {
  return [...sourceTasks].sort((a, b) => a.deadlineDate.localeCompare(b.deadlineDate) || a.ticketId.localeCompare(b.ticketId));
}

export default function TimelinePage() {
  const [relation, setRelation] = useState<RelationFilter>("others-waiting-for-us");
  const [workType, setWorkType] = useState<WorkTypeFilter>("all");
  const { language, t } = useLanguage();

  const relationTasks = useMemo(() => getTimelineTasks(relation), [relation]);
  const visibleTasks = useMemo(() => {
    const filtered = workType === "all" ? relationTasks : relationTasks.filter((task) => getWorkType(task) === workType);
    return sortByDeadline(filtered);
  }, [relationTasks, workType]);

  const metrics = getDashboardMetrics(visibleTasks);
  const pendingCount = visibleTasks.filter((task) => task.status !== "Done" && task.status !== "Rejected").length;
  const selectedRelation = relationFilters.find((item) => item.id === relation)!;
  const SelectedRelationIcon = selectedRelation.icon;

  return (
    <div>
      <PageHeader
        eyebrow={<Trans en="Simple timeline" th="ไทม์ไลน์แบบง่าย" />}
        title={<Trans en="Timeline" th="ไทม์ไลน์" />}
        description={
          <Trans
            en="A clean daily work list with the task title on the left, due date on the right, and labels for work type and status."
            th="รายการงานรายวันแบบอ่านง่าย หัวข้องานอยู่ซ้าย วันอยู่ขวา พร้อมจุดและ label บอกประเภทงานกับสถานะ"
          />
        }
        actions={
          <Link href="/requests/new" className={buttonVariants()}>
            <FilePlus2 aria-hidden="true" />
            <Trans en="Add request" th="เพิ่มคำขอ" />
          </Link>
        }
      />

      <section className="mb-5 grid gap-3 md:grid-cols-2">
        {relationFilters.map((item) => {
          const Icon = item.icon;
          const active = item.id === relation;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setRelation(item.id)}
              className={cn(
                "flex min-h-20 items-center gap-3 rounded-lg border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md",
                active
                  ? "border-brand-500 bg-primary !text-brand-yellow shadow-[0_18px_42px_rgba(23,0,199,0.18)] [&_*]:!text-brand-yellow"
                  : "border-border text-foreground",
              )}
            >
              <span className={cn("grid size-11 shrink-0 place-items-center rounded-lg border", active ? "border-brand-yellow/35 bg-white/12" : "border-brand-100 bg-brand-50 text-brand-700")}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-black leading-tight">{t(item.label)}</span>
                <span className={cn("mt-1 block text-xs leading-5", active ? "text-brand-yellow-soft" : "text-muted-foreground")}>
                  {t(item.helper)}
                </span>
              </span>
            </button>
          );
        })}
      </section>

      <section className="mb-5 rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-foreground">
              <Trans en="Filter by work type" th="กรองตามประเภทงาน" />
            </p>
            <p className="text-xs leading-5 text-muted-foreground">
              <Trans en="Use labels to see only Dev, Content, SEO, or Other work." th="เลือก label เพื่อดูเฉพาะ Dev, Content, SEO หรือ Other" />
            </p>
          </div>
          <Badge variant="blue">
            <SelectedRelationIcon aria-hidden="true" />
            {t(selectedRelation.label)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {workTypeFilters.map((item) => {
            const active = item.id === workType;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setWorkType(item.id)}
                className={cn(
                  "min-h-10 rounded-lg border px-4 text-sm font-black transition",
                  active
                    ? "border-brand-500 bg-primary !text-brand-yellow shadow-sm"
                    : "border-border bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
                )}
              >
                {language === "th" ? item.th : item.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title={<Trans en="Visible tasks" th="งานที่แสดง" />} value={visibleTasks.length} icon={<CalendarDays />} />
        <SummaryCard title={<Trans en="Pending" th="ยังไม่เสร็จ" />} value={pendingCount} icon={<Clock3 />} />
        <SummaryCard title={<Trans en="Overdue" th="เกินกำหนด" />} value={metrics.overdue} tone="red" icon={<TimerReset />} />
        <SummaryCard title={<Trans en="Completed" th="เสร็จแล้ว" />} value={metrics.completed} tone="green" icon={<CheckCircle2 />} />
      </section>

      <section className="rounded-lg border border-brand-100 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <div>
            <p className="text-base font-black text-foreground">{t(selectedRelation.label)}</p>
            <p className="text-xs leading-5 text-muted-foreground">
              <Trans en="Simple list sorted by real deadline date." th="รายการแบบง่ายเรียงตามวันครบกำหนดจริง" />
            </p>
          </div>
          <Badge variant="slate">{visibleTasks.length}</Badge>
        </div>

        {visibleTasks.length ? (
          <div className="grid gap-2">
            {visibleTasks.map((task) => (
              <TimelineRow key={task.id} task={task} language={language} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-brand-200 bg-brand-50 p-8 text-center">
            <CalendarDays className="mx-auto size-10 text-brand-700" aria-hidden="true" />
            <p className="mt-3 font-black text-foreground">
              <Trans en="No matching work" th="ไม่พบงานตามตัวกรอง" />
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              <Trans en="Try another relation or work type filter." th="ลองเปลี่ยนตัวกรองประเภทงานหรือมุมมองงาน" />
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function TimelineRow({ task, language }: { task: OperationTask; language: "en" | "th" }) {
  const workType = getWorkType(task);
  const style = workTypeStyle[workType];
  const timing = getTimingStatus(task);

  return (
    <Link
      href={`/requests/${task.ticketId}`}
      className="group grid gap-3 rounded-lg border border-border bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50/60 hover:shadow-md sm:grid-cols-[1fr_auto] sm:items-center sm:p-4"
    >
      <div className="flex min-w-0 gap-3">
        <div className="relative flex w-4 shrink-0 justify-center pt-1.5">
          <span className="absolute bottom-0 top-6 w-px bg-brand-100" aria-hidden="true" />
          <span className={cn("relative z-10 size-3 rounded-full ring-4 ring-white", style.dot)} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full border px-2.5 py-1 text-xs font-black", style.badge)}>{style.label}</span>
            <span className="text-xs font-black text-brand-700">{task.ticketId}</span>
            <StatusBadge status={task.status} />
          </div>
          <p className="mt-2 line-clamp-2 text-base font-black leading-tight text-foreground group-hover:text-brand-700">
            {task.taskTitle}
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            <Trans en="Requester" th="ผู้ขอ" />: {task.requesterName} · <Trans en="Assignee" th="ผู้รับผิดชอบ" />: {getAssigneeName(task.assigneeId)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <PriorityBadge priority={task.priority} />
            <TimingBadge timing={timing} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg bg-brand-50 px-3 py-2 sm:grid sm:min-w-32 sm:justify-items-end sm:bg-transparent sm:px-0 sm:py-0">
        <span className="text-xs font-bold text-muted-foreground">
          <Trans en="Due" th="ครบกำหนด" />
        </span>
        <span className="text-sm font-black text-foreground sm:text-right">{formatDate(task.deadlineDate, language)}</span>
      </div>
    </Link>
  );
}
