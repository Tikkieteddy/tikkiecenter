export type RiskLevel = "SAFE" | "WARNING" | "BLOCKED";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "REVISION_REQUESTED";

export type UserRole = "ADMIN" | "EDITOR" | "LEGAL_REVIEWER" | "VIEWER";

export type LibrarySourceType = "FILE" | "LINK" | "TEXT";

export type NotificationChannel = "WEB_PUSH" | "EMAIL" | "LINE";

export type LegalRiskType =
  | "Defamation"
  | "Computer Crime Act"
  | "Copyright infringement"
  | "PDPA"
  | "Sensitive minors"
  | "Graphic violence"
  | "National security"
  | "Hate speech"
  | "Election restriction"
  | "Court restriction"
  | "Gambling/drug content"
  | "Fake news"
  | "Deepfake/manipulated media"
  | "Royal institution sensitivity"
  | "Agriculture market sensitivity"
  | "Animal disease sensitivity"
  | "Unverified accusation";

export type RiskEntry = {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  category: string;
  legalRiskType: LegalRiskType;
  editorialNote: string;
  recommendation: string;
  sourceLink: string;
  tags: string[];
  createdBy: string;
  updatedAt: string;
};

export type LegalReference = {
  id: string;
  title: string;
  category: string;
  summary: string;
  sourceType: LibrarySourceType;
  sourceUrl?: string;
  fileName?: string;
  bodyText: string;
  activeForEvaluation: boolean;
  legalRiskTypes: LegalRiskType[];
  criteria: EvaluationCriterion[];
  tags: string[];
  bookmarked: boolean;
  updatedAt: string;
};

export type EvaluationCriterion = {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  legalRiskType: LegalRiskType;
  matchTerms: string[];
  recommendation: string;
  sourceReferenceId: string;
};

export type ScreeningLog = {
  id: string;
  checkedAt: string;
  user: string;
  title: string;
  inputType: "Keyword" | "Headline" | "Content" | "URL";
  result: RiskLevel;
  approvalStatus: ApprovalStatus;
  editor: string;
  approvalMinutes: number | null;
  latestComment: string;
};

export type ApprovalRequest = {
  id: string;
  screeningLogId: string;
  requesterName: string;
  requesterEmail: string;
  editorEmail: string;
  title: string;
  newsUrl: string;
  submittedContent: string;
  aiRiskLevel: RiskLevel;
  aiReasoning: string;
  requesterNote: string;
  approvalStatus: ApprovalStatus;
  editorComment: string;
  legalConcerns: LegalRiskType[];
  matchingCases: string[];
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
};

export type WebPushSubscriptionRecord = {
  id: string;
  userEmail: string;
  role: UserRole;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationLog = {
  id: string;
  channel: NotificationChannel;
  recipient: string;
  title: string;
  body: string;
  targetUrl?: string;
  status: "PENDING" | "SENT" | "FAILED" | "SKIPPED";
  errorMessage?: string;
  createdAt: string;
};

export type AiScreeningResult = {
  riskLevel: RiskLevel;
  label: "ได้" | "สุ่มเสี่ยง" | "ห้าม";
  headline: string;
  reasoning: string;
  detectedKeywords: string[];
  matchingCases: RiskEntry[];
  matchingReferences: LegalReference[];
  evaluationCriteria: EvaluationCriterion[];
  legalConcerns: LegalRiskType[];
  recommendation: string;
  confidence: number;
};

export const riskLevelThai: Record<RiskLevel, "ได้" | "สุ่มเสี่ยง" | "ห้าม"> = {
  SAFE: "ได้",
  WARNING: "สุ่มเสี่ยง",
  BLOCKED: "ห้าม",
};

export const approvalStatusThai: Record<ApprovalStatus, string> = {
  PENDING: "รออนุมัติ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
  REVISION_REQUESTED: "ขอแก้ไขเพิ่มเติม",
};
