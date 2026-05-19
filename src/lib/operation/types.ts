export type UserRole = "Admin" | "Tikkie / Assignee" | "Requester" | "Viewer";

export type TaskStatus =
  | "New"
  | "Reviewing"
  | "In Progress"
  | "Waiting for Info"
  | "Done"
  | "Rejected";

export type TaskPriority = "Normal" | "Urgent" | "Very Urgent";

export type EmailType =
  | "request_received"
  | "status_changed"
  | "waiting_for_info"
  | "completed"
  | "rejected"
  | "overdue_notice"
  | "comment_added";

export type NotificationStatus = "queued" | "sent" | "failed";

export type OperationUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team: string;
  createdAt: string;
  lastLoginAt: string;
};

export type OperationTask = {
  id: string;
  ticketId: string;
  taskTitle: string;
  requesterName: string;
  requesterTeam: string;
  requesterEmail: string;
  taskCategory: string;
  taskDetail: string;
  attachmentUrl?: string;
  createdDate: string;
  deadlineDate: string;
  completionDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId?: string;
  internalNote?: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskComment = {
  id: string;
  taskId: string;
  userId: string;
  comment: string;
  isInternal: boolean;
  createdAt: string;
};

export type TaskStatusHistory = {
  id: string;
  taskId: string;
  oldStatus?: TaskStatus;
  newStatus: TaskStatus;
  changedBy: string;
  comment: string;
  createdAt: string;
};

export type EmailNotification = {
  id: string;
  taskId: string;
  recipientEmail: string;
  emailType: EmailType;
  subject: string;
  body: string;
  status: NotificationStatus;
  sentAt?: string;
  errorMessage?: string;
};

export type TimingStatus = "Completed on time" | "Completed late" | "Overdue" | "Due soon" | "Pending";

export type ReportFilters = {
  dateRange: "7d" | "30d" | "90d" | "all";
  status: "All" | TaskStatus;
  category: "All" | string;
  requesterTeam: "All" | string;
  priority: "All" | TaskPriority;
  assignee: "All" | string;
};
