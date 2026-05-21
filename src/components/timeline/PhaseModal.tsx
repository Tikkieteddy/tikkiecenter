"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clampProgress, phaseStatusLabels, phaseStatusStyles, type Phase, type PhaseStatus } from "@/types/timeline";

type PhaseModalProps = {
  open: boolean;
  phase?: Phase | null;
  onClose: () => void;
  onSave: (phase: Phase) => void;
};

export function PhaseModal({ open, phase, onClose, onSave }: PhaseModalProps) {
  const [draft, setDraft] = useState<Phase | null>(phase ?? null);

  useEffect(() => {
    if (open && phase) {
      setDraft(structuredClone(phase));
    }
  }, [open, phase]);

  if (!open || !draft) return null;

  function update(patch: Partial<Phase>) {
    setDraft((current) => (current ? { ...current, ...patch, progress: clampProgress(patch.progress ?? current.progress) } : current));
  }

  function save() {
    if (!draft) return;

    onSave({
      ...draft,
      name: draft.name.trim() || "เฟสใหม่",
      description: draft.description.trim(),
      progress: clampProgress(draft.progress),
      externalLink: draft.externalLink?.url
        ? {
            label: draft.externalLink.label.trim() || "Link",
            url: draft.externalLink.url.trim(),
          }
        : undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/55 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:mx-auto sm:max-w-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#E8E6DE] p-4 sm:p-5">
          <div>
            <p className="text-xl font-black text-slate-950">แก้ไขเฟส</p>
            <p className="text-sm text-slate-500">ปรับชื่อ รายละเอียด วัน และความคืบหน้าของเฟสนี้</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X aria-hidden="true" />
          </Button>
        </div>

        <div className="max-h-[calc(92vh-9rem)] overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ชื่อเฟส" className="sm:col-span-2">
              <input value={draft.name} onChange={(event) => update({ name: event.target.value })} className={inputClass} />
            </Field>
            <Field label="วันเริ่ม">
              <input type="date" value={draft.startDate} onChange={(event) => update({ startDate: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Deadline">
              <input type="date" value={draft.deadline} onChange={(event) => update({ deadline: event.target.value })} className={inputClass} />
            </Field>
            <Field label="สถานะ">
              <select value={draft.status} onChange={(event) => update({ status: event.target.value as PhaseStatus })} className={inputClass}>
                {Object.entries(phaseStatusLabels).map(([status, label]) => (
                  <option key={status} value={status}>
                    {label}
                  </option>
                ))}
              </select>
              <span
                className="mt-1 inline-flex w-fit rounded-full px-3 py-1 text-xs font-black"
                style={{
                  backgroundColor: phaseStatusStyles[draft.status].badgeBg,
                  color: phaseStatusStyles[draft.status].badgeText,
                }}
              >
                {phaseStatusLabels[draft.status]}
              </span>
            </Field>
            <Field label={`Progress ${draft.progress}%`}>
              <input
                type="range"
                min={0}
                max={100}
                value={draft.progress}
                onChange={(event) => update({ progress: Number(event.target.value) })}
                className="h-11 w-full accent-[#185FA5]"
              />
            </Field>
            <Field label="รายละเอียด" className="sm:col-span-2">
              <textarea value={draft.description} onChange={(event) => update({ description: event.target.value })} rows={4} className={inputClass} />
            </Field>
            <Field label="External link label">
              <input
                value={draft.externalLink?.label ?? ""}
                onChange={(event) => update({ externalLink: { label: event.target.value, url: draft.externalLink?.url ?? "" } })}
                placeholder="Jira, Figma, GitHub"
                className={inputClass}
              />
            </Field>
            <Field label="External link URL">
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  value={draft.externalLink?.url ?? ""}
                  onChange={(event) => update({ externalLink: { label: draft.externalLink?.label ?? "Link", url: event.target.value } })}
                  placeholder="https://"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#F1EFE8]">
            <div className="h-full rounded-full" style={{ width: `${draft.progress}%`, backgroundColor: phaseStatusStyles[draft.status].circle }} />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#E8E6DE] p-4 sm:flex-row sm:justify-end sm:p-5">
          <Button type="button" variant="secondary" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button type="button" onClick={save}>
            บันทึกเฟส
          </Button>
        </div>
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
