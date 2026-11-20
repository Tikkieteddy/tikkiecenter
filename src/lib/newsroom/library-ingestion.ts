import type { EvaluationCriterion, LegalReference, LegalRiskType, LibrarySourceType, RiskLevel } from "./types";

type LibraryInput = {
  title: string;
  category: string;
  sourceType: LibrarySourceType;
  sourceUrl?: string;
  fileName?: string;
  bodyText?: string;
  tags?: string[];
  legalRiskTypes?: LegalRiskType[];
  activeForEvaluation?: boolean;
};

const legalRiskDefaults: Record<string, LegalRiskType> = {
  pdpa: "PDPA",
  "ข้อมูลส่วนบุคคล": "PDPA",
  เด็ก: "Sensitive minors",
  เยาวชน: "Sensitive minors",
  ai: "Deepfake/manipulated media",
  deepfake: "Deepfake/manipulated media",
  ลิขสิทธิ์: "Copyright infringement",
  เลือกตั้ง: "Election restriction",
  ศาล: "Court restriction",
  หมิ่นประมาท: "Defamation",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function inferLegalRiskTypes(input: Pick<LibraryInput, "title" | "category" | "bodyText" | "tags" | "legalRiskTypes">) {
  if (input.legalRiskTypes?.length) return input.legalRiskTypes;

  const haystack = [input.title, input.category, input.bodyText, ...(input.tags || [])].join(" ").toLowerCase();
  const inferred = Object.entries(legalRiskDefaults)
    .filter(([term]) => haystack.includes(term.toLowerCase()))
    .map(([, risk]) => risk);

  return Array.from(new Set(inferred.length ? inferred : ["Defamation"])) as LegalRiskType[];
}

export function buildCriteriaFromLibrarySource(input: LibraryInput): EvaluationCriterion[] {
  const legalRiskTypes = inferLegalRiskTypes(input);
  const terms = Array.from(
    new Set(
      [
        ...(input.tags || []),
        ...input.category.split(/[,\s/]+/),
        ...input.title.split(/[,\s/]+/),
        ...(input.bodyText || "").split(/[,\s/]+/).filter((word) => word.length >= 4).slice(0, 24),
      ].filter(Boolean),
    ),
  ).slice(0, 32);

  return legalRiskTypes.map((legalRiskType, index) => {
    const severity: RiskLevel = legalRiskType === "PDPA" || legalRiskType === "Sensitive minors" ? "BLOCKED" : "WARNING";

    return {
      id: `criteria-${slugify(input.title)}-${index + 1}`,
      title: `เกณฑ์จากเอกสาร: ${input.title}`,
      description: `ใช้คำสำคัญและบริบทจาก ${input.sourceType === "FILE" ? "ไฟล์" : input.sourceType === "LINK" ? "ลิงก์" : "ข้อความ"} นี้เป็นสัญญาณเตือนเบื้องต้น`,
      severity,
      legalRiskType,
      matchTerms: terms,
      recommendation:
        severity === "BLOCKED"
          ? "ควรหยุดตรวจเพิ่มชั่วคราวและส่งให้บรรณาธิการหรือฝ่ายกฎหมายประเมินก่อนเผยแพร่"
          : "ควรตรวจแหล่งที่มา ถ้อยคำ และบริบทตามแนวปฏิบัติที่อ้างอิงก่อนเผยแพร่",
      sourceReferenceId: `lib-${slugify(input.title)}`,
    };
  });
}

export function createLibraryReference(input: LibraryInput): LegalReference {
  const legalRiskTypes = inferLegalRiskTypes(input);
  const criteria = buildCriteriaFromLibrarySource({ ...input, legalRiskTypes });
  const bodyText = input.bodyText?.trim() || "";

  return {
    id: `lib-${slugify(input.title || input.fileName || "uploaded-source")}`,
    title: input.title,
    category: input.category,
    summary: bodyText
      ? bodyText.slice(0, 180)
      : "เอกสารนี้ถูกเพิ่มเป็นแหล่งอ้างอิงในคลังความรู้ และพร้อมใช้เป็นเกณฑ์ประเมินเมื่อเปิดใช้งาน",
    sourceType: input.sourceType,
    sourceUrl: input.sourceUrl,
    fileName: input.fileName,
    bodyText,
    activeForEvaluation: input.activeForEvaluation ?? true,
    legalRiskTypes,
    criteria,
    tags: input.tags || [],
    bookmarked: false,
    updatedAt: new Date().toISOString(),
  };
}
