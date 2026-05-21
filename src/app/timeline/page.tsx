"use client";

import { useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import { FilterBar } from "@/components/timeline/FilterBar";
import { PhaseModal } from "@/components/timeline/PhaseModal";
import { ProjectList } from "@/components/timeline/ProjectList";
import { ProjectModal } from "@/components/timeline/ProjectModal";
import { StatCards } from "@/components/timeline/StatCards";
import { useTimelineProjects } from "@/hooks/useTimelineProjects";
import {
  getProjectHealth,
  getProjectProgress,
  type Phase,
  type Project,
  type TimelineSortKey,
  type TimelineStatusFilter,
  type TimelineTeamFilter,
} from "@/types/timeline";

const statusRank = {
  delay: 0,
  warn: 1,
  good: 2,
  idle: 3,
};

export default function TimelinePage() {
  const { hydrated, projects, addProject, updateProject, deleteProject, updatePhase } = useTimelineProjects();
  const [statusFilter, setStatusFilter] = useState<TimelineStatusFilter>("all");
  const [teamFilter, setTeamFilter] = useState<TimelineTeamFilter>("all");
  const [sortKey, setSortKey] = useState<TimelineSortKey>("startDate");
  const [projectModalState, setProjectModalState] = useState<{ open: boolean; project: Project | null }>({ open: false, project: null });
  const [phaseModalState, setPhaseModalState] = useState<{ open: boolean; projectId: string; phase: Phase | null }>({
    open: false,
    projectId: "",
    phase: null,
  });

  const visibleProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const health = getProjectHealth(project);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "delayed" && health === "delay") ||
        (statusFilter === "risk" && health === "warn") ||
        (statusFilter === "active" && project.phases.some((phase) => phase.status === "active" || phase.status === "delayed_active")) ||
        (statusFilter === "normal" && (health === "good" || health === "idle"));
      const matchesTeam = teamFilter === "all" || project.team === teamFilter;
      return matchesStatus && matchesTeam;
    });

    return [...filtered].sort((a, b) => {
      if (sortKey === "progress") return getProjectProgress(b) - getProjectProgress(a);
      if (sortKey === "name") return a.name.localeCompare(b.name, "th");
      if (sortKey === "status") return statusRank[getProjectHealth(a)] - statusRank[getProjectHealth(b)];
      return a.startDate.localeCompare(b.startDate);
    });
  }, [projects, sortKey, statusFilter, teamFilter]);

  const stats = useMemo(() => {
    const total = projects.length;
    const inProgress = projects.filter((project) => project.phases.some((phase) => phase.status === "active" || phase.status === "delayed_active")).length;
    const delayed = projects.filter((project) => getProjectHealth(project) === "delay").length;
    const averageProgress = total ? Math.round(projects.reduce((sum, project) => sum + getProjectProgress(project), 0) / total) : 0;
    return { total, inProgress, delayed, averageProgress };
  }, [projects]);

  return (
    <section className="min-h-[calc(100vh-5rem)] rounded-3xl border border-[#E8E6DE] bg-[#F8F7F3] p-3 shadow-[0_24px_60px_rgba(24,95,165,0.10)] sm:p-5">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#185FA5]/20 bg-white px-3 py-1.5 text-xs font-black text-[#185FA5]">
              <CalendarClock className="size-4" aria-hidden="true" />
              Project Timeline Dashboard
            </span>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-normal text-slate-950 sm:text-4xl">ไทม์ไลน์โปรเจกต์</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              ดูโปรเจกต์เป็น accordion พร้อม step-bar timeline แนวนอน เพิ่ม/แก้ไข/ลบโปรเจกต์และเฟสได้ทันที ข้อมูลทั้งหมดเก็บใน localStorage key{" "}
              <span className="font-black text-[#185FA5]">timeline_projects</span>
            </p>
          </div>

        </header>

        <div className="grid gap-5">
          <FilterBar
            statusFilter={statusFilter}
            teamFilter={teamFilter}
            sortKey={sortKey}
            onStatusChange={setStatusFilter}
            onTeamChange={setTeamFilter}
            onSortChange={setSortKey}
            onAddProject={() => setProjectModalState({ open: true, project: null })}
          />

          <StatCards {...stats} />

          {!hydrated ? (
            <div className="rounded-3xl border border-[#E8E6DE] bg-white p-8 text-center text-sm font-black text-slate-600 shadow-sm">กำลังโหลด timeline...</div>
          ) : (
            <ProjectList
              projects={visibleProjects}
              onEditProject={(project) => setProjectModalState({ open: true, project })}
              onDeleteProject={deleteProject}
              onEditPhase={(projectId, phase) => setPhaseModalState({ open: true, projectId, phase })}
            />
          )}
        </div>
      </div>

      <ProjectModal
        open={projectModalState.open}
        project={projectModalState.project}
        onClose={() => setProjectModalState({ open: false, project: null })}
        onSave={(project) => {
          if (projectModalState.project) {
            updateProject(project);
          } else {
            addProject(project);
          }
        }}
      />

      <PhaseModal
        open={phaseModalState.open}
        phase={phaseModalState.phase}
        onClose={() => setPhaseModalState({ open: false, projectId: "", phase: null })}
        onSave={(phase) => updatePhase(phaseModalState.projectId, phase)}
      />
    </section>
  );
}
