import type { EmailType, OperationTask } from "@/lib/operation/types";
import { formatDate } from "@/lib/operation/metrics";

type TemplateInput = {
  task: OperationTask;
  emailType: EmailType;
  latestComment?: string;
  taskUrl?: string;
  updatedAt?: string;
};

const emailTypeLabel: Record<EmailType, string> = {
  request_received: "Request received",
  status_changed: "Status updated",
  waiting_for_info: "Waiting for more information",
  completed: "Task completed",
  rejected: "Request rejected",
  overdue_notice: "Overdue notice",
  comment_added: "New comment from Tikkie",
};

export function buildTaskEmailTemplate({ task, emailType, latestComment, taskUrl, updatedAt }: TemplateInput) {
  const link = taskUrl ?? `/requests/${task.ticketId}`;
  const subject = `[${task.ticketId}] ${emailTypeLabel[emailType]} - ${task.taskTitle}`;
  const body = [
    `Hello ${task.requesterName},`,
    "",
    `${emailTypeLabel[emailType]} for your request.`,
    "",
    `Ticket ID: ${task.ticketId}`,
    `Task title: ${task.taskTitle}`,
    `Current status: ${task.status}`,
    `Latest comment: ${latestComment || "No new comment."}`,
    `Deadline: ${formatDate(task.deadlineDate)}`,
    `Updated date: ${updatedAt ?? new Date().toISOString()}`,
    `Task detail link: ${link}`,
    "",
    "Thank you,",
    "Tikkie Project Operation Center",
  ].join("\n");

  return { subject, body };
}

export async function sendTaskEmail() {
  /*
   * Phase 1 integration point:
   * - Initialize SMTP, SendGrid, or Resend lazily inside this function.
   * - Record every attempt in email_notifications.
   * - Keep n8n and LINE OA out of this function until a later phase.
   */
  return {
    status: "queued" as const,
    provider: "mock-email-service",
  };
}
