"use client";

import type { KeyboardEvent } from "react";
import { ChevronDown, ExternalLink, FolderKanban, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatFullDate,
  getProjectHealth,
  getProjectProgress,
  getProjectStatusLabel,
  projectHealthColors,
  type Phase,
  type Project,
} from "@/types/timeline";
import { PhaseTimeline } from "./PhaseTimeline";

type ProjectCardProps = {
  project: Project;
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onEditPhase: (phase: Phase) => void;
};

const teamLabels = {
  dev: "Dev",
  design: "Design",
  data: "Data",
  other: "Other",
};

export function ProjectCard({ project, open, onToggle, onEdit, onDelete, onEditPhase }: ProjectCardProps) {
  const health = getProjectHealth(project);
  const accent = projectHealthColors[health];
  const progress = getProjectProgress(project);
  const statusLabel = getProjectStatusLabel(project);

  return (
    <article
      className="overflow-hidden rounded-3xl border border-[#E8E6DE] bg-white shadow-[0_18px_44px_rgba(24,95,165,0.08)]"
      style={{ borderLeft: `6px solid ${accent}` }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle();
          }
        }}
        className="grid w-full gap-3 p-4 text-left transition hover:bg-[#F8F7F3] sm:p-5 lg:grid-cols-[auto_1fr_auto] lg:items-center"
      >
        <span
          className="grid size-12 place-items-center rounded-2xl text-white shadow-[0_12px_24px_rgba(15,23,42,0.16)]"
          style={{ backgroundColor: accent }}
        >
          <FolderKanban className="size-5" aria-hidden="true" />
        </span>

        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="line-clamp-1 text-lg font-black leading-6 text-slate-950">{project.name || "ยังไม่ตั้งชื่อโปรเจกต์"}</span>
            <span className="rounded-full bg-[#E6F1FB] px-2.5 py-1 text-xs font-black text-[#0C447C]">{teamLabels[project.team]}</span>
            <span className="rounded-full px-2.5 py-1 text-xs font-black" style={{ backgroundColor: `${accent}18`, color: accent }}>
              {statusLabel}
            </span>
          </span>
          <span className="mt-1 line-clamp-1 text-sm leading-6 text-slate-500">{project.description || "ยังไม่มีรายละเอียดโปรเจกต์"}</span>
        </span>

        <span className="flex flex-wrap items-center gap-2 lg:justify-end">
          <span className="rounded-full border border-[#E8E6DE] bg-[#F8F7F3] px-3 py-2 text-xs font-black text-slate-700">
            เริ่ม {formatFullDate(project.startDate)}
          </span>

          {project.externalLinks.slice(0, 3).map((link) => (
            <a
              key={`${link.label}-${link.url}`}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#E8E6DE] bg-white px-3 text-xs font-black text-[#185FA5] hover:border-[#185FA5]/40 hover:bg-[#E6F1FB]"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
              {link.label || link.icon || "Link"}
            </a>
          ))}

          <span className="flex -space-x-2">
            {project.teamMembers.slice(0, 5).map((member, index) => (
              <span
                key={`${member.initials}-${index}`}
                className="grid size-9 place-items-center rounded-full border-2 border-white text-xs font-black text-white shadow-sm"
                style={{ backgroundColor: member.color }}
                title={member.initials}
              >
                {member.initials}
              </span>
            ))}
          </span>

          <ProgressRing value={progress} color={accent} />

          <span className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="rounded-full text-slate-500 hover:bg-[#E6F1FB] hover:text-[#185FA5]"
              aria-label={`แก้ไขโปรเจกต์ ${project.name}`}
            >
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                if (window.confirm(`ลบโปรเจกต์ "${project.name}" ใช่ไหม?`)) {
                  onDelete();
                }
              }}
              className="rounded-full text-slate-500 hover:bg-[#FCEBEB] hover:text-[#A32D2D]"
              aria-label={`ลบโปรเจกต์ ${project.name}`}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
            <ChevronDown className={cn("size-5 text-slate-500 transition", open ? "rotate-180" : "")} aria-hidden="true" />
          </span>
        </span>
      </div>

      {open ? <PhaseTimeline project={project} onEditPhase={onEditPhase} /> : null}
    </article>
  );
}

function ProgressRing({ value, color }: { value: number; color: string }) {
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <span className="relative grid size-12 place-items-center">
      <svg className="size-12 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="#F1EFE8" strokeWidth="5" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="5"
        />
      </svg>
      <span className="absolute text-[11px] font-black text-slate-800">{value}%</span>
    </span>
  );
}
