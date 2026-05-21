"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, Inbox, Send, Sparkles, TimerReset } from "lucide-react";
import { PageHeader } from "@/components/operation/page-header";
import { PriorityBadge, StatusBadge, TimingBadge } from "@/components/operation/badges";
import { SummaryCard } from "@/components/operation/summary-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { currentBusinessDate, tasks } from "@/lib/operation/mock-data";
import {
  getAssigneeName,
  getDashboardMetrics,
  getRequesterTasks,
  getTasksDueThisWeek,
  getTimingStatus,
} from "@/lib/operation/metrics";
import type { OperationTask } from "@/lib/operation/types";
import { cn } from "@/lib/utils";
import { Trans, useLanguage } from "@/components/operation/language-provider";

type TimelineMode = "incoming" | "outgoing";
type TimelineEventType = "created" | "deadline" | "completed";

type TimelineEvent = {
  id: string;
  date: string;
  type: TimelineEventType;
  task: OperationTask;
};

type TimelineDay = {
  date: string;
  events: TimelineEvent[];
};

const incomingAssigneeIds = new Set(["usr-tikkie", "usr-admin"]);

const eventTypeCopy: Record<TimelineEventType, { en: string; th: string }> = {
  created: { en: "Received", th: "รับคำขอ" },
  deadline: { en: "Deadline", th: "ครบกำหนด" },
  completed: { en: "Completed", th: "เสร็จแล้ว" },
};

const eventTypeClass: Record<TimelineEventType, string> = {
  created: "border-brand-500 bg-primary !text-brand-yellow [&_*]:!text-brand-yellow",
  deadline: "border-brand-yellow/70 bg-brand-yellow/80 !text-brand-yellow-foreground [&_*]:!text-brand-yellow-foreground",
  completed: "border-green-200 bg-green-50 text-green-700",
};

function buildTimelineDays(sourceTasks: OperationTask[]): TimelineDay[] {
  const events = sourceTasks.flatMap<TimelineEvent>((task) => {
    const taskEvents: TimelineEvent[] = [
      {
        id: `${task.id}-created`,
        date: task.createdDate,
        type: "created",
        task,
      },
      {
        id: `${task.id}-deadline`,
        date: task.deadlineDate,
        type: "deadline",
        task,
      },
    ];

    if (task.completionDate) {
      taskEvents.push({
        id: `${task.id}-completed`,
        date: task.completionDate,
        type: "completed",
        task,
      });
    }

    return taskEvents;
  });

  const grouped = events.reduce<Record<string, TimelineEvent[]>>((acc, event) => {
    acc[event.date] = [...(acc[event.date] ?? []), event];
    return acc;
  }, {});

  const eventOrder: Record<TimelineEventType, number> = {
    created: 1,
    deadline: 2,
    completed: 3,
  };

  return Object.entries(grouped)
    .map(([date, dayEvents]) => ({
      date,
      events: dayEvents.sort((a, b) => eventOrder[a.type] - eventOrder[b.type] || a.task.ticketId.localeCompare(b.task.ticketId)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function formatTimelineDate(date: string, language: "en" | "th") {
  return new Intl.DateTimeFormat(language === "th" ? "th-TH" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00+07:00`));
}

function formatTimelineWeekday(date: string, language: "en" | "th") {
  return new Intl.DateTimeFormat(language === "th" ? "th-TH" : "en-GB", {
    weekday: "long",
  }).format(new Date(`${date}T00:00:00+07:00`));
}

function getDateMarker(date: string) {
  if (date === currentBusinessDate) return { en: "Today", th: "วันนี้" };
  return null;
}

export default function TimelinePage() {
  const [mode, setMode] = useState<TimelineMode>("incoming");
  const { language, t } = useLanguage();

  const incomingTasks = useMemo(
    () => tasks.filter((task) => incomingAssigneeIds.has(task.assigneeId ?? "")),
    [],
  );
  const outgoingTasks = useMemo(() => getRequesterTasks(), []);
  const activeTasks = mode === "incoming" ? incomingTasks : outgoingTasks;
  const metrics = getDashboardMetrics(activeTasks);
  const dueThisWeek = getTasksDueThisWeek(activeTasks);
  const timelineDays = buildTimelineDays(activeTasks);

  const modes = [
    {
      id: "incoming" as const,
      title: { en: "Requests sent to us", th: "ไทม์ไลน์งานที่คนอื่นกรอกมาหา" },
      description: {
        en: "Work submitted by other teams and assigned to Tikkie/Admin.",
        th: "แสดงงานที่ทีมอื่นส่งเข้ามาและถูกมอบหมายให้ Tikkie/Admin",
      },
      icon: Inbox,
    },
    {
      id: "outgoing" as const,
      title: { en: "Requests we submitted", th: "ไทม์ไลน์งานที่เรากรอกเข้าไป" },
      description: {
        en: "Requester timeline for work we submitted to follow up with others.",
        th: "แสดงงานที่เรากรอกไว้เพื่อติดตามการทำงานของคนอื่น",
      },
      icon: Send,
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={<Trans en="Calendar timeline" th="ปฏิทินไทม์ไลน์" />}
        title={<Trans en="Timeline" th="ไทม์ไลน์" />}
        description={
          <Trans
            en="Daily calendar view for submitted work, due dates, and completed tasks. Phase 1 uses mock data first; real database filtering can connect here later."
            th="มุมมองปฏิทินรายวันสำหรับงานที่ถูกส่งเข้ามา วันครบกำหนด และงานที่เสร็จแล้ว เฟส 1 ใช้ mock data ก่อน และเตรียมจุดเชื่อมฐานข้อมูลจริงไว้ภายหลัง"
          />
        }
        actions={
          <Link href="/requests/new" className={buttonVariants()}>
            <Sparkles aria-hidden="true" />
            <Trans en="Add request" th="เพิ่มคำขอ" />
          </Link>
        }
      />

      <section className="mb-5 grid gap-3 md:grid-cols-2">
        {modes.map((item) => {
          const Icon = item.icon;
          const active = item.id === mode;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={cn(
                "flex min-h-24 items-start gap-3 rounded-lg border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md",
                active
                  ? "border-brand-500 bg-primary !text-brand-yellow shadow-[0_18px_42px_rgba(23,0,199,0.18)] [&_*]:!text-brand-yellow"
                  : "border-border text-foreground",
              )}
            >
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-lg border",
                  active
                    ? "border-brand-yellow/35 bg-white/12"
                    : "border-brand-100 bg-brand-50 text-brand-700",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-black leading-tight">{t(item.title)}</span>
                <span className={cn("mt-1 block text-sm leading-6", active ? "text-brand-yellow-soft" : "text-muted-foreground")}>
                  {t(item.description)}
                </span>
              </span>
            </button>
          );
        })}
      </section>

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title={<Trans en="Visible tasks" th="งานที่แสดง" />}
          value={activeTasks.length}
          icon={mode === "incoming" ? <Inbox /> : <Send />}
        />
        <SummaryCard title={<Trans en="Daily entries" th="รายการบนปฏิทิน" />} value={timelineDays.reduce((sum, day) => sum + day.events.length, 0)} icon={<CalendarDays />} />
        <SummaryCard title={<Trans en="Due this week" th="ครบกำหนดสัปดาห์นี้" />} value={dueThisWeek.length} tone="yellow" icon={<TimerReset />} />
        <SummaryCard title={<Trans en="Completed" th="เสร็จแล้ว" />} value={metrics.completed} tone="green" icon={<CheckCircle2 />} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[18rem_1fr]">
        <aside className="h-fit rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5 text-brand-700" aria-hidden="true" />
            <p className="text-sm font-black text-foreground">
              <Trans en="Timeline guide" th="คำอธิบายไทม์ไลน์" />
            </p>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            {(["created", "deadline", "completed"] as TimelineEventType[]).map((type) => (
              <div key={type} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-slate-50 p-2">
                <span className="font-semibold text-slate-700">
                  <Trans en={eventTypeCopy[type].en} th={eventTypeCopy[type].th} />
                </span>
                <span className={cn("rounded-full border px-2 py-1 text-xs font-black", eventTypeClass[type])}>
                  <Trans en={eventTypeCopy[type].en} th={eventTypeCopy[type].th} />
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            <Trans
              en="Each task can appear on multiple real calendar dates: received date, deadline date, and completion date."
              th="หนึ่งงานอาจแสดงได้หลายวันตามปฏิทินจริง เช่น วันที่รับคำขอ วันครบกำหนด และวันที่ปิดงาน"
            />
          </p>
        </aside>

        <div className="grid gap-3">
          {timelineDays.length ? (
            timelineDays.map((day) => {
              const marker = getDateMarker(day.date);

              return (
                <div key={day.date} className="grid gap-3 rounded-lg border border-brand-100 bg-white p-4 shadow-sm lg:grid-cols-[9rem_1fr]">
                  <div className="lg:sticky lg:top-20 lg:h-fit">
                    <div className="rounded-lg border border-brand-100 bg-brand-50 p-3">
                      <p className="text-xs font-black uppercase text-brand-700">
                        {formatTimelineWeekday(day.date, language)}
                      </p>
                      <p className="mt-1 text-lg font-black text-foreground">{formatTimelineDate(day.date, language)}</p>
                      {marker ? (
                        <Badge variant="blue" className="mt-3">
                          <Trans en={marker.en} th={marker.th} />
                        </Badge>
                      ) : null}
                      <p className="mt-3 text-xs font-semibold text-muted-foreground">
                        <Trans en={`${day.events.length} entries`} th={`${day.events.length} รายการ`} />
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {day.events.map((event) => (
                      <TimelineEventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-lg border border-dashed border-brand-200 bg-white p-8 text-center shadow-sm">
              <CalendarDays className="mx-auto size-10 text-brand-700" aria-hidden="true" />
              <p className="mt-3 font-black text-foreground">
                <Trans en="No timeline entries yet" th="ยังไม่มีรายการไทม์ไลน์" />
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                <Trans en="Create a request to see it appear in the daily calendar." th="สร้างคำขอแล้วระบบจะแสดงบนปฏิทินรายวัน" />
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TimelineEventCard({ event }: { event: TimelineEvent }) {
  const task = event.task;
  const timing = getTimingStatus(task);

  return (
    <Link
      href={`/requests/${task.ticketId}`}
      className="group grid gap-3 rounded-lg border border-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-black", eventTypeClass[event.type])}>
          {event.type === "deadline" ? <Clock3 className="size-3.5" aria-hidden="true" /> : null}
          <Trans en={eventTypeCopy[event.type].en} th={eventTypeCopy[event.type].th} />
        </span>
        <span className="text-xs font-black text-brand-700">{task.ticketId}</span>
      </div>

      <div>
        <p className="line-clamp-2 text-base font-black leading-tight text-foreground group-hover:text-brand-700">
          {task.taskTitle}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          <Trans en="Requester" th="ผู้ขอ" />: {task.requesterName} · {task.requesterTeam}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          <Trans en="Assignee" th="ผู้รับผิดชอบ" />: {getAssigneeName(task.assigneeId)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        <TimingBadge timing={timing} />
      </div>
    </Link>
  );
}
