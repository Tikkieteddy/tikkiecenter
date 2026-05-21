"use client";

import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, ExternalLink, Flag, Pencil, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  clampProgress,
  formatFullDate,
  formatShortDate,
  getPhaseDeadlineText,
  getProjectProgress,
  phaseStatusLabels,
  phaseStatusStyles,
  type Phase,
  type Project,
} from "@/types/timeline";

type PhaseTimelineProps = {
  project: Project;
  onEditPhase: (phase: Phase) => void;
};

export function PhaseTimeline({ project, onEditPhase }: PhaseTimelineProps) {
  const doneCount = project.phases.filter((phase) => phase.status === "done" || phase.status === "delayed_done").length;
  const inProgressCount = project.phases.filter((phase) => phase.status === "active" || phase.status === "delayed_active").length;
  const delayedCount = project.phases.filter((phase) => phase.status === "delayed_active" || phase.status === "delayed_done").length;
  const overallProgress = getProjectProgress(project);

  return (
    <div className="border-t border-[#E8E6DE] bg-[#F8F7F3]/70 px-3 py-4 sm:px-5">
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-start gap-3">
          {project.phases.map((phase, index) => (
            <div key={phase.id} className="relative flex min-w-[9rem] flex-1 flex-col items-center sm:min-w-[11rem]">
              {index > 0 ? (
                <span
                  className="absolute left-[-50%] top-[1.05rem] h-1 w-full rounded-full"
                  style={{ backgroundColor: phaseStatusStyles[project.phases[index - 1].status].circle }}
                  aria-hidden="true"
                />
              ) : null}

              <span
                className="relative z-10 grid size-9 place-items-center rounded-full border-4 border-white text-xs font-black text-white shadow-[0_10px_22px_rgba(15,23,42,0.18)]"
                style={{ backgroundColor: phaseStatusStyles[phase.status].circle }}
              >
                {index + 1}
              </span>

              <PhaseCard phase={phase} onEdit={() => onEditPhase(phase)} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[#E8E6DE] bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs font-black">
            <span className="rounded-full bg-[#E1F5EE] px-3 py-1.5 text-[#0F6E56]">เสร็จ {doneCount}</span>
            <span className="rounded-full bg-[#E6F1FB] px-3 py-1.5 text-[#0C447C]">กำลังทำ {inProgressCount}</span>
            <span className="rounded-full bg-[#FCEBEB] px-3 py-1.5 text-[#A32D2D]">ดีเลย์ {delayedCount}</span>
          </div>
          <span className="text-sm font-black text-slate-800">ภาพรวม {overallProgress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F1EFE8]">
          <div className="h-full rounded-full bg-[#185FA5]" style={{ width: `${overallProgress}%` }} />
        </div>
      </div>
    </div>
  );
}

function PhaseCard({ phase, onEdit }: { phase: Phase; onEdit: () => void }) {
  const style = phaseStatusStyles[phase.status];
  const progress = clampProgress(phase.progress);
  const DeadlineIcon = phase.status === "done" ? CheckCircle2 : phase.status === "pending" ? Flag : phase.status === "active" ? Clock3 : AlertTriangle;

  return (
    <article className="relative mt-3 w-full rounded-2xl border border-[#E8E6DE] bg-white p-3 text-left shadow-[0_14px_30px_rgba(24,95,165,0.08)]">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="absolute right-2 top-2 size-8 rounded-full text-slate-500 hover:bg-[#E6F1FB] hover:text-[#185FA5]"
        aria-label={`แก้ไขเฟส ${phase.name}`}
      >
        <Pencil className="size-4" aria-hidden="true" />
      </Button>

      <h3 className="line-clamp-2 min-h-10 pr-8 text-sm font-black leading-5 text-slate-950">{phase.name || "ยังไม่ตั้งชื่อเฟส"}</h3>

      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
        <CalendarDays className="size-3.5" aria-hidden="true" />
        {formatShortDate(phase.startDate)}
      </div>

      <div
        className={cn(
          "mt-2 inline-flex max-w-full items-center gap-1 rounded-full px-2 py-1 text-[11px] font-black",
          phase.status === "pending" ? "text-[#5F5E5A]" : "",
        )}
        style={{ backgroundColor: style.badgeBg, color: style.badgeText }}
      >
        <DeadlineIcon className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{getPhaseDeadlineText(phase)}</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F1EFE8]">
          <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: style.circle }} />
        </div>
        <span className="text-[11px] font-black text-slate-700">{progress}%</span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
        <Flag className="size-3.5" aria-hidden="true" />
        {formatFullDate(phase.deadline)}
      </div>

      <span
        className="mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-black"
        style={{ backgroundColor: style.badgeBg, color: style.badgeText }}
      >
        {phaseStatusLabels[phase.status]}
      </span>

      <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{phase.description || "ยังไม่มีรายละเอียดงาน"}</p>

      {phase.externalLink?.url ? (
        <a
          href={phase.externalLink.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex max-w-full items-center gap-1 rounded-full border border-[#E8E6DE] bg-[#F8F7F3] px-2.5 py-1 text-[11px] font-black text-[#185FA5] hover:border-[#185FA5]/40 hover:bg-[#E6F1FB]"
        >
          <ExternalLink className="size-3" aria-hidden="true" />
          <span className="truncate">{phase.externalLink.label || "เปิดลิงก์"}</span>
        </a>
      ) : null}
    </article>
  );
}
