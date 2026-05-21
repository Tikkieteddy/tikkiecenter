export type PhaseStatus = "done" | "delayed_done" | "active" | "delayed_active" | "pending";

export type ProjectTeam = "dev" | "design" | "data" | "other";

export type TimelineStatusFilter = "all" | "delayed" | "risk" | "active" | "normal";

export type TimelineTeamFilter = "all" | "dev" | "design" | "data";

export type TimelineSortKey = "startDate" | "progress" | "name" | "status";

export type ExternalLink = {
  label: string;
  url: string;
};

export type Phase = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  deadline: string;
  progress: number;
  status: PhaseStatus;
  externalLink?: ExternalLink;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  team: ProjectTeam;
  teamMembers: { initials: string; color: string }[];
  externalLinks: { icon: string; label: string; url: string }[];
  phases: Phase[];
  createdAt: string;
};

export type ProjectHealth = "delay" | "warn" | "good" | "idle";

export const phaseStatusLabels: Record<PhaseStatus, string> = {
  done: "เสร็จแล้ว",
  delayed_done: "เสร็จล่าช้า",
  active: "กำลังทำ",
  delayed_active: "ดีเลย์",
  pending: "รอดำเนินการ",
};

export const phaseStatusStyles: Record<
  PhaseStatus,
  { circle: string; border: string; badgeBg: string; badgeText: string }
> = {
  done: { circle: "#1D9E75", border: "#1D9E75", badgeBg: "#E1F5EE", badgeText: "#0F6E56" },
  delayed_done: { circle: "#E24B4A", border: "#E24B4A", badgeBg: "#FCEBEB", badgeText: "#A32D2D" },
  active: { circle: "#185FA5", border: "#185FA5", badgeBg: "#E6F1FB", badgeText: "#0C447C" },
  delayed_active: { circle: "#BA7517", border: "#BA7517", badgeBg: "#FAEEDA", badgeText: "#633806" },
  pending: { circle: "#B4B2A9", border: "#B4B2A9", badgeBg: "#F1EFE8", badgeText: "#5F5E5A" },
};

export const projectHealthColors: Record<ProjectHealth, string> = {
  delay: "#E24B4A",
  warn: "#BA7517",
  good: "#1D9E75",
  idle: "#B4B2A9",
};

export function todayDate() {
  return new Date();
}

export function dateFromInput(date: string) {
  return new Date(`${date}T00:00:00+07:00`);
}

export function clampProgress(progress: number) {
  return Math.min(100, Math.max(0, Math.round(Number.isFinite(progress) ? progress : 0)));
}

export function daysBetween(start: string, end: Date = todayDate()) {
  const startTime = dateFromInput(start).getTime();
  const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return Math.ceil((endTime - startTime) / 86_400_000);
}

export function daysUntil(date: string, today: Date = todayDate()) {
  const target = dateFromInput(date).getTime();
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return Math.ceil((target - current) / 86_400_000);
}

export function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  }).format(dateFromInput(date));
}

export function formatFullDate(date: string) {
  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dateFromInput(date));
}

export function detectPhaseStatus(phase: Pick<Phase, "deadline" | "progress">): PhaseStatus {
  const progress = clampProgress(phase.progress);
  const isPastDeadline = daysUntil(phase.deadline) < 0;

  if (progress === 100 && isPastDeadline) return "delayed_done";
  if (progress === 100) return "done";
  if (progress > 0 && isPastDeadline) return "delayed_active";
  if (progress > 0) return "active";
  return "pending";
}

export function getProjectProgress(project: Project) {
  if (!project.phases.length) return 0;
  const total = project.phases.reduce((sum, phase) => sum + clampProgress(phase.progress), 0);
  return Math.round(total / project.phases.length);
}

export function getProjectHealth(project: Project): ProjectHealth {
  if (!project.phases.length || project.phases.every((phase) => phase.status === "pending")) {
    return "idle";
  }

  if (project.phases.some((phase) => phase.status === "delayed_active" || phase.status === "delayed_done")) {
    return "delay";
  }

  if (
    project.phases.some((phase) => phase.status === "active" && daysUntil(phase.deadline) <= 3) ||
    project.phases.some((phase) => phase.status === "pending" && daysUntil(phase.startDate) <= 2)
  ) {
    return "warn";
  }

  return "good";
}

export function getProjectStatusLabel(project: Project) {
  const health = getProjectHealth(project);
  if (health === "delay") return "มีดีเลย์";
  if (health === "warn") return "เสี่ยงดีเลย์";
  if (project.phases.some((phase) => phase.status === "active" || phase.status === "delayed_active")) return "กำลังทำ";
  if (health === "good") return "ปกติ";
  return "ยังไม่เริ่ม";
}

export function getPhaseDeadlineText(phase: Phase) {
  const days = daysUntil(phase.deadline);
  const abs = Math.abs(days);

  if (phase.status === "done") {
    return days >= 0 ? `เสร็จก่อน ${days} วัน` : "เสร็จแล้ว";
  }

  if (phase.status === "delayed_done") {
    return `ช้า ${abs} วัน`;
  }

  if (phase.status === "active") {
    return days >= 0 ? `เหลือ ${days} วัน` : "กำลังทำ";
  }

  if (phase.status === "delayed_active") {
    return `เกิน ${abs} วัน`;
  }

  return formatShortDate(phase.deadline);
}

export function buildEmptyPhase(): Phase {
  return {
    id: makeId("phase"),
    name: "",
    description: "",
    startDate: new Date().toISOString().slice(0, 10),
    deadline: new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10),
    progress: 0,
    status: "pending",
  };
}

export function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
