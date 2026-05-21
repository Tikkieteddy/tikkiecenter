"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Link2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildEmptyPhase,
  clampProgress,
  detectPhaseStatus,
  makeId,
  phaseStatusLabels,
  phaseStatusStyles,
  type ExternalLink,
  type Phase,
  type PhaseStatus,
  type Project,
  type ProjectTeam,
} from "@/types/timeline";

type ProjectModalProps = {
  open: boolean;
  project?: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
};

const teamOptions: Array<{ value: ProjectTeam; label: string }> = [
  { value: "dev", label: "Dev" },
  { value: "design", label: "Design" },
  { value: "data", label: "Data" },
  { value: "other", label: "Other" },
];

const memberColors = ["#185FA5", "#1D9E75", "#E24B4A", "#BA7517", "#6D5BD0", "#0EA5E9"];

function createDraft(project?: Project | null): Project {
  return project
    ? structuredClone(project)
    : {
        id: makeId("project"),
        name: "",
        description: "",
        startDate: new Date().toISOString().slice(0, 10),
        team: "dev",
        teamMembers: [{ initials: "TK", color: "#185FA5" }],
        externalLinks: [],
        phases: [buildEmptyPhase()],
        createdAt: new Date().toISOString(),
      };
}

export function ProjectModal({ open, project, onClose, onSave }: ProjectModalProps) {
  const [draft, setDraft] = useState<Project>(() => createDraft(project));
  const [memberInitials, setMemberInitials] = useState("");
  const [memberColor, setMemberColor] = useState(memberColors[0]);

  useEffect(() => {
    if (open) {
      setDraft(createDraft(project));
      setMemberInitials("");
      setMemberColor(memberColors[0]);
    }
  }, [open, project]);

  const title = useMemo(() => (project ? "แก้ไขโปรเจกต์" : "เพิ่มโปรเจกต์"), [project]);

  if (!open) return null;

  function updatePhase(phaseId: string, patch: Partial<Phase>) {
    setDraft((current) => ({
      ...current,
      phases: current.phases.map((phase) => {
        if (phase.id !== phaseId) return phase;
        const next = { ...phase, ...patch };
        return { ...next, progress: clampProgress(next.progress) };
      }),
    }));
  }

  function addMember() {
    const initials = memberInitials.trim().slice(0, 3).toUpperCase();
    if (!initials) return;

    setDraft((current) => ({
      ...current,
      teamMembers: [...current.teamMembers, { initials, color: memberColor }],
    }));
    setMemberInitials("");
  }

  function addExternalLink() {
    setDraft((current) => ({
      ...current,
      externalLinks: [...current.externalLinks, { icon: "Link", label: "", url: "" }],
    }));
  }

  function updateExternalLink(index: number, patch: Partial<ExternalLink & { icon: string }>) {
    setDraft((current) => ({
      ...current,
      externalLinks: current.externalLinks.map((link, linkIndex) => (linkIndex === index ? { ...link, ...patch } : link)),
    }));
  }

  function removeExternalLink(index: number) {
    setDraft((current) => ({
      ...current,
      externalLinks: current.externalLinks.filter((_, linkIndex) => linkIndex !== index),
    }));
  }

  function movePhase(index: number, direction: -1 | 1) {
    setDraft((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.phases.length) return current;
      const phases = [...current.phases];
      const [phase] = phases.splice(index, 1);
      phases.splice(nextIndex, 0, phase);
      return { ...current, phases };
    });
  }

  function saveProject() {
    const cleaned: Project = {
      ...draft,
      name: draft.name.trim() || "โปรเจกต์ใหม่",
      description: draft.description.trim(),
      externalLinks: draft.externalLinks.filter((link) => link.url.trim()).map((link) => ({ ...link, label: link.label.trim() || "Link", url: link.url.trim() })),
      teamMembers: draft.teamMembers.length ? draft.teamMembers : [{ initials: "TK", color: "#185FA5" }],
      phases: draft.phases.map((phase) => ({
        ...phase,
        name: phase.name.trim() || "เฟสใหม่",
        description: phase.description.trim(),
        progress: clampProgress(phase.progress),
        status: phase.status || detectPhaseStatus(phase),
        externalLink: phase.externalLink?.url
          ? {
              label: phase.externalLink.label.trim() || "Link",
              url: phase.externalLink.url.trim(),
            }
          : undefined,
      })),
    };

    onSave(cleaned);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/55 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:mx-auto sm:max-w-5xl sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#E8E6DE] p-4 sm:p-5">
          <div>
            <p className="text-xl font-black text-slate-950">{title}</p>
            <p className="text-sm text-slate-500">บันทึกข้อมูลลง localStorage key: timeline_projects</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X aria-hidden="true" />
          </Button>
        </div>

        <div className="max-h-[calc(92vh-9rem)] overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="ชื่อโปรเจกต์">
              <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={inputClass} />
            </Field>

            <Field label="วันเริ่ม">
              <input
                type="date"
                value={draft.startDate}
                onChange={(event) => setDraft({ ...draft, startDate: event.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="ทีม">
              <select value={draft.team} onChange={(event) => setDraft({ ...draft, team: event.target.value as ProjectTeam })} className={inputClass}>
                {teamOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="รายละเอียด" className="lg:col-span-2">
              <textarea
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                rows={3}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-[#E8E6DE] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-black text-slate-950">ทีมเมมเบอร์</h3>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {draft.teamMembers.map((member, index) => (
                  <button
                    key={`${member.initials}-${index}`}
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        teamMembers: current.teamMembers.filter((_, memberIndex) => memberIndex !== index),
                      }))
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-[#E8E6DE] bg-[#F8F7F3] py-1 pl-1 pr-3 text-sm font-black text-slate-700"
                  >
                    <span className="grid size-8 place-items-center rounded-full text-xs text-white" style={{ backgroundColor: member.color }}>
                      {member.initials}
                    </span>
                    ลบ
                  </button>
                ))}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                <input
                  value={memberInitials}
                  onChange={(event) => setMemberInitials(event.target.value)}
                  placeholder="Initials เช่น TK"
                  className={inputClass}
                />
                <select value={memberColor} onChange={(event) => setMemberColor(event.target.value)} className={inputClass}>
                  {memberColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <Button type="button" onClick={addMember}>
                  <Plus aria-hidden="true" />
                  เพิ่ม
                </Button>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E8E6DE] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-black text-slate-950">External links</h3>
                <Button type="button" variant="secondary" size="sm" onClick={addExternalLink}>
                  <Plus aria-hidden="true" />
                  เพิ่มลิงก์
                </Button>
              </div>
              <div className="mt-3 grid gap-2">
                {draft.externalLinks.map((link, index) => (
                  <div key={index} className="grid gap-2 sm:grid-cols-[0.7fr_1fr_auto]">
                    <input value={link.label} onChange={(event) => updateExternalLink(index, { label: event.target.value })} placeholder="Label" className={inputClass} />
                    <input value={link.url} onChange={(event) => updateExternalLink(index, { url: event.target.value })} placeholder="https://" className={inputClass} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeExternalLink(index)} className="rounded-full text-[#A32D2D]">
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                ))}
                {!draft.externalLinks.length ? <p className="text-sm text-slate-500">ยังไม่มีลิงก์ภายนอก</p> : null}
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-2xl border border-[#E8E6DE] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-950">Phases</h3>
                <p className="text-sm text-slate-500">เพิ่ม ลบ และจัดลำดับเฟสของโปรเจกต์</p>
              </div>
              <Button type="button" variant="secondary" onClick={() => setDraft((current) => ({ ...current, phases: [...current.phases, buildEmptyPhase()] }))}>
                <Plus aria-hidden="true" />
                เพิ่มเฟส
              </Button>
            </div>

            <div className="mt-4 grid gap-3">
              {draft.phases.map((phase, index) => (
                <PhaseInlineEditor
                  key={phase.id}
                  phase={phase}
                  index={index}
                  phaseCount={draft.phases.length}
                  onChange={(patch) => updatePhase(phase.id, patch)}
                  onMove={movePhase}
                  onRemove={() =>
                    setDraft((current) => ({
                      ...current,
                      phases: current.phases.length > 1 ? current.phases.filter((item) => item.id !== phase.id) : current.phases,
                    }))
                  }
                />
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#E8E6DE] p-4 sm:flex-row sm:justify-end sm:p-5">
          <Button type="button" variant="secondary" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button type="button" onClick={saveProject}>
            บันทึกโปรเจกต์
          </Button>
        </div>
      </div>
    </div>
  );
}

function PhaseInlineEditor({
  phase,
  index,
  phaseCount,
  onChange,
  onMove,
  onRemove,
}: {
  phase: Phase;
  index: number;
  phaseCount: number;
  onChange: (patch: Partial<Phase>) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E8E6DE] bg-[#F8F7F3] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-[#185FA5] px-3 py-1 text-xs font-black text-[#FFE766]">Phase {index + 1}</span>
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={() => onMove(index, -1)} disabled={index === 0} className="size-8 rounded-full">
            <ArrowUp aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => onMove(index, 1)} disabled={index === phaseCount - 1} className="size-8 rounded-full">
            <ArrowDown aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} disabled={phaseCount === 1} className="size-8 rounded-full text-[#A32D2D]">
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-4">
        <Field label="ชื่อเฟส">
          <input value={phase.name} onChange={(event) => onChange({ name: event.target.value })} className={inputClass} />
        </Field>
        <Field label="วันเริ่ม">
          <input type="date" value={phase.startDate} onChange={(event) => onChange({ startDate: event.target.value })} className={inputClass} />
        </Field>
        <Field label="Deadline">
          <input type="date" value={phase.deadline} onChange={(event) => onChange({ deadline: event.target.value })} className={inputClass} />
        </Field>
        <Field label="สถานะ">
          <select value={phase.status} onChange={(event) => onChange({ status: event.target.value as PhaseStatus })} className={inputClass}>
            {Object.entries(phaseStatusLabels).map(([status, label]) => (
              <option key={status} value={status}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={`Progress ${phase.progress}%`} className="lg:col-span-2">
          <input
            type="range"
            min={0}
            max={100}
            value={phase.progress}
            onChange={(event) => onChange({ progress: Number(event.target.value) })}
            className="h-11 w-full accent-[#185FA5]"
          />
        </Field>
        <Field label="รายละเอียด" className="lg:col-span-2">
          <input value={phase.description} onChange={(event) => onChange({ description: event.target.value })} className={inputClass} />
        </Field>
        <Field label="External link" className="lg:col-span-4">
          <div className="grid gap-2 sm:grid-cols-[0.6fr_1fr]">
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                value={phase.externalLink?.label ?? ""}
                onChange={(event) => onChange({ externalLink: { label: event.target.value, url: phase.externalLink?.url ?? "" } })}
                placeholder="Label เช่น Figma"
                className={`${inputClass} pl-9`}
              />
            </div>
            <input
              value={phase.externalLink?.url ?? ""}
              onChange={(event) => onChange({ externalLink: { label: phase.externalLink?.label ?? "Link", url: event.target.value } })}
              placeholder="https://"
              className={inputClass}
            />
          </div>
        </Field>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full" style={{ width: `${phase.progress}%`, backgroundColor: phaseStatusStyles[phase.status].circle }} />
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`grid gap-1.5 text-sm font-black text-slate-700 ${className}`}>
      {label}
      {children}
    </label>
  );
}

const inputClass =
  "min-h-11 w-full rounded-xl border border-[#E8E6DE] bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#185FA5] focus:ring-4 focus:ring-[#185FA5]/10";
