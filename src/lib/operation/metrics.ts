import { currentBusinessDate, tasks, users } from "@/lib/operation/mock-data";
import type { OperationTask, ReportFilters, TaskPriority, TaskStatus, TimingStatus } from "@/lib/operation/types";

const taskDate = (date: string) => new Date(`${date}T00:00:00+07:00`);
const currentDate = taskDate(currentBusinessDate);

export const statuses: TaskStatus[] = ["New", "Reviewing", "In Progress", "Waiting for Info", "Done", "Rejected"];
export const priorities: TaskPriority[] = ["Normal", "Urgent", "Very Urgent"];

export function formatDate(date?: string) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(taskDate(date));
}

export function formatDateTime(date?: string) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function daysBetween(startDate: string, endDate: string) {
  const ms = taskDate(endDate).getTime() - taskDate(startDate).getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export function daysUntil(deadlineDate: string) {
  const ms = taskDate(deadlineDate).getTime() - currentDate.getTime();
  return Math.ceil(ms / 86_400_000);
}

export function getTimingStatus(task: OperationTask): TimingStatus {
  if (task.status === "Done" && task.completionDate) {
    return taskDate(task.completionDate).getTime() <= taskDate(task.deadlineDate).getTime()
      ? "Completed on time"
      : "Completed late";
  }

  const remainingDays = daysUntil(task.deadlineDate);

  if (remainingDays < 0) return "Overdue";
  if (remainingDays <= 3) return "Due soon";

  return "Pending";
}

export function getAssigneeName(assigneeId?: string) {
  return users.find((user) => user.id === assigneeId)?.name ?? "Unassigned";
}

export function getRequesterTasks(email = "nara.p@example.com") {
  return tasks.filter((task) => task.requesterEmail === email);
}

export function getTaskByTicketId(ticketId: string) {
  return tasks.find((task) => task.ticketId.toLowerCase() === ticketId.toLowerCase());
}

export function getDashboardMetrics(sourceTasks: OperationTask[] = tasks) {
  const today = currentBusinessDate;
  const timing = sourceTasks.map((task) => getTimingStatus(task));

  return {
    total: sourceTasks.length,
    newToday: sourceTasks.filter((task) => task.createdDate === today).length,
    inProgress: sourceTasks.filter((task) => task.status === "In Progress").length,
    waitingForInfo: sourceTasks.filter((task) => task.status === "Waiting for Info").length,
    completed: sourceTasks.filter((task) => task.status === "Done").length,
    rejected: sourceTasks.filter((task) => task.status === "Rejected").length,
    overdue: timing.filter((status) => status === "Overdue").length,
    dueSoon: timing.filter((status) => status === "Due soon").length,
    completedOnTime: timing.filter((status) => status === "Completed on time").length,
    completedLate: timing.filter((status) => status === "Completed late").length,
  };
}

export function groupCount(items: OperationTask[], getter: (task: OperationTask) => string) {
  return Object.entries(
    items.reduce<Record<string, number>>((acc, task) => {
      const key = getter(task);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
}

export function getAverageCompletionTime(sourceTasks: OperationTask[] = tasks) {
  const completed = sourceTasks.filter((task) => task.status === "Done" && task.completionDate);
  if (!completed.length) return 0;

  const totalDays = completed.reduce((sum, task) => sum + daysBetween(task.createdDate, task.completionDate!), 0);
  return Math.round((totalDays / completed.length) * 10) / 10;
}

export function getTasksDueThisWeek(sourceTasks: OperationTask[] = tasks) {
  return sourceTasks.filter((task) => {
    const remaining = daysUntil(task.deadlineDate);
    return task.status !== "Done" && remaining >= 0 && remaining <= 7;
  });
}

export function getTasksOverdueMoreThan3Days(sourceTasks: OperationTask[] = tasks) {
  return sourceTasks.filter((task) => task.status !== "Done" && daysUntil(task.deadlineDate) < -3);
}

export function getFilterOptions(sourceTasks: OperationTask[] = tasks) {
  return {
    categories: Array.from(new Set(sourceTasks.map((task) => task.taskCategory))).sort(),
    teams: Array.from(new Set(sourceTasks.map((task) => task.requesterTeam))).sort(),
    assignees: users
      .filter((user) => user.role === "Tikkie / Assignee" || user.role === "Admin")
      .map((user) => ({ id: user.id, name: user.name })),
  };
}

export function filterTasks(sourceTasks: OperationTask[], filters: ReportFilters) {
  const daysBack = filters.dateRange === "all" ? null : Number(filters.dateRange.replace("d", ""));
  const lowerBound = daysBack
    ? new Date(currentDate.getTime() - daysBack * 86_400_000)
    : null;

  return sourceTasks.filter((task) => {
    const created = taskDate(task.createdDate);
    const inRange = lowerBound ? created >= lowerBound : true;
    const byStatus = filters.status === "All" || task.status === filters.status;
    const byCategory = filters.category === "All" || task.taskCategory === filters.category;
    const byTeam = filters.requesterTeam === "All" || task.requesterTeam === filters.requesterTeam;
    const byPriority = filters.priority === "All" || task.priority === filters.priority;
    const byAssignee = filters.assignee === "All" || task.assigneeId === filters.assignee;

    return inRange && byStatus && byCategory && byTeam && byPriority && byAssignee;
  });
}

export function buildCsv(sourceTasks: OperationTask[]) {
  const headers = [
    "Ticket ID",
    "Task title",
    "Requester",
    "Team",
    "Category",
    "Priority",
    "Status",
    "Created date",
    "Deadline",
    "Completion date",
    "On-time / Late status",
    "Assignee",
  ];

  const rows = sourceTasks.map((task) => [
    task.ticketId,
    task.taskTitle,
    task.requesterName,
    task.requesterTeam,
    task.taskCategory,
    task.priority,
    task.status,
    task.createdDate,
    task.deadlineDate,
    task.completionDate ?? "",
    getTimingStatus(task),
    getAssigneeName(task.assigneeId),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}
