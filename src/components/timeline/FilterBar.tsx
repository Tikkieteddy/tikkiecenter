"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TimelineSortKey, TimelineStatusFilter, TimelineTeamFilter } from "@/types/timeline";

const statusOptions: Array<{ value: TimelineStatusFilter; label: string }> = [
  { value: "all", label: "ทั้งหมด" },
  { value: "delayed", label: "มีดีเลย์" },
  { value: "risk", label: "เสี่ยงดีเลย์" },
  { value: "active", label: "กำลังทำ" },
  { value: "normal", label: "ปกติ" },
];

const teamOptions: Array<{ value: TimelineTeamFilter; label: string }> = [
  { value: "all", label: "ทุกทีม" },
  { value: "dev", label: "Dev" },
  { value: "design", label: "Design" },
  { value: "data", label: "Data" },
];

const sortOptions: Array<{ value: TimelineSortKey; label: string }> = [
  { value: "startDate", label: "เรียงตามวันเริ่ม" },
  { value: "progress", label: "ความคืบหน้า" },
  { value: "name", label: "ชื่อโปรเจกต์" },
  { value: "status", label: "สถานะ" },
];

type FilterBarProps = {
  statusFilter: TimelineStatusFilter;
  teamFilter: TimelineTeamFilter;
  sortKey: TimelineSortKey;
  onStatusChange: (value: TimelineStatusFilter) => void;
  onTeamChange: (value: TimelineTeamFilter) => void;
  onSortChange: (value: TimelineSortKey) => void;
  onAddProject: () => void;
};

export function FilterBar({
  statusFilter,
  teamFilter,
  sortKey,
  onStatusChange,
  onTeamChange,
  onSortChange,
  onAddProject,
}: FilterBarProps) {
  return (
    <div className="rounded-2xl border border-[#E8E6DE] bg-white p-3 shadow-[0_16px_40px_rgba(24,95,165,0.08)] sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-3 md:grid-cols-2 lg:flex lg:flex-1 lg:flex-wrap">
          <PillGroup>
            {statusOptions.map((option) => (
              <PillButton
                key={option.value}
                active={statusFilter === option.value}
                onClick={() => onStatusChange(option.value)}
              >
                {option.label}
              </PillButton>
            ))}
          </PillGroup>

          <PillGroup>
            {teamOptions.map((option) => (
              <PillButton key={option.value} active={teamFilter === option.value} onClick={() => onTeamChange(option.value)}>
                {option.label}
              </PillButton>
            ))}
          </PillGroup>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:shrink-0">
          <label className="sr-only" htmlFor="timeline-sort">
            เรียงข้อมูล
          </label>
          <select
            id="timeline-sort"
            value={sortKey}
            onChange={(event) => onSortChange(event.target.value as TimelineSortKey)}
            className="min-h-11 rounded-full border border-[#E8E6DE] bg-[#F8F7F3] px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-[#185FA5] focus:ring-4 focus:ring-[#185FA5]/10"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button type="button" size="lg" onClick={onAddProject} className="rounded-full px-5">
            <Plus aria-hidden="true" />
            เพิ่มโปรเจกต์
          </Button>
        </div>
      </div>
    </div>
  );
}

function PillGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function PillButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-full border px-4 text-sm font-black transition",
        active
          ? "border-[#185FA5] bg-[#185FA5] text-[#FFE766] shadow-[0_10px_24px_rgba(24,95,165,0.24)]"
          : "border-[#E8E6DE] bg-white text-slate-600 hover:border-[#185FA5]/40 hover:bg-[#E6F1FB] hover:text-[#0C447C]",
      )}
    >
      {children}
    </button>
  );
}
