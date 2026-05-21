"use client";

import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import type { Phase, Project } from "@/types/timeline";
import { ProjectCard } from "./ProjectCard";

type ProjectListProps = {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onEditPhase: (projectId: string, phase: Phase) => void;
};

export function ProjectList({ projects, onEditProject, onDeleteProject, onEditPhase }: ProjectListProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!projects.length) {
      setOpenIds(new Set());
      return;
    }

    setOpenIds((current) => {
      if (current.size) return current;
      return new Set([projects[0].id]);
    });
  }, [projects]);

  if (!projects.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#B4B2A9] bg-white p-8 text-center shadow-sm">
        <Inbox className="mx-auto size-11 text-[#185FA5]" aria-hidden="true" />
        <p className="mt-3 text-lg font-black text-slate-950">ไม่พบโปรเจกต์ตามตัวกรอง</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">ลองเปลี่ยนสถานะ ทีม หรือเพิ่มโปรเจกต์ใหม่ได้เลย</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          open={openIds.has(project.id)}
          onToggle={() =>
            setOpenIds((current) => {
              const next = new Set(current);
              if (next.has(project.id)) {
                next.delete(project.id);
              } else {
                next.add(project.id);
              }
              return next;
            })
          }
          onEdit={() => onEditProject(project)}
          onDelete={() => onDeleteProject(project.id)}
          onEditPhase={(phase) => onEditPhase(project.id, phase)}
        />
      ))}
    </div>
  );
}
