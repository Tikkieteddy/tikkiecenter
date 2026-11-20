import { Badge } from "@/components/ui/badge";
import type { ApprovalStatus, RiskLevel } from "@/lib/newsroom/types";
import { approvalStatusThai, riskLevelThai } from "@/lib/newsroom/types";

export function RiskBadge({ level }: { level: RiskLevel }) {
  const variant = level === "SAFE" ? "success" : level === "WARNING" ? "warning" : "danger";
  return <Badge variant={variant}>{riskLevelThai[level]}</Badge>;
}

export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  const variant =
    status === "APPROVED" ? "success" : status === "REJECTED" ? "danger" : status === "REVISION_REQUESTED" ? "warning" : "slate";
  return <Badge variant={variant}>{approvalStatusThai[status]}</Badge>;
}
