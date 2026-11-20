import { riskEntries } from "./mock-data";
import { getAllLibraryReferences } from "./library-store";
import type { AiScreeningResult, LegalRiskType, RiskLevel } from "./types";
import { riskLevelThai } from "./types";

type ScreeningInput = {
  keyword?: string;
  headline?: string;
  content?: string;
  url?: string;
  notes?: string;
};

const escalationTerms = ["ทุจริต", "โกง", "เอื้อประโยชน์", "ปลอม", "บิดเบือน", "เด็ก", "เยาวชน", "ศาล", "คดี", "พยาน"];

const policyEscalationTerms = [
  "ราคาไก่",
  "ราคาไข่",
  "ราคาไข่ไก่",
  "ราคาหมู",
  "ราคาสุกร",
  "ราคาเนื้อหมู",
  "ราคาเนื้อสัตว์",
  "โรคไก่",
  "โรคไข่",
  "โรคหมู",
  "โรคสุกร",
  "โรคเนื้อสัตว์",
  "มาตรา 112",
  "ม.112",
  "112",
  "หมิ่นเบื้องสูง",
  "เบื้องสูง",
  "ข่าวเชิงกล่าวหา",
  "กล่าวหา",
  "แฉ",
];

function normalizeThaiText(value: string) {
  return value
    .toLowerCase()
    .replace(/[“”"'.?!,;:()\[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreSeverity(level: RiskLevel) {
  if (level === "BLOCKED") return 3;
  if (level === "WARNING") return 2;
  return 1;
}

function chooseRiskLevel(score: number, hasBlockedMatch: boolean, hasWarningMatch: boolean): RiskLevel {
  if (hasBlockedMatch || score >= 7) return "BLOCKED";
  if (hasWarningMatch || score >= 3) return "WARNING";
  return "SAFE";
}

function allEvaluationCriteria() {
  return getAllLibraryReferences()
    .filter((reference) => reference.activeForEvaluation)
    .flatMap((reference) => reference.criteria);
}

export function analyzeNewsRisk(input: ScreeningInput): AiScreeningResult {
  const combined = normalizeThaiText(
    [input.keyword, input.headline, input.content, input.url, input.notes].filter(Boolean).join(" "),
  );

  const matchingCases = riskEntries.filter((entry) => {
    const haystack = normalizeThaiText([entry.title, entry.description, entry.editorialNote, ...entry.tags].join(" "));
    return entry.tags.some((tag) => combined.includes(normalizeThaiText(tag))) || haystack.split(" ").some((word) => word.length > 3 && combined.includes(word));
  });

  const detectedKeywords = Array.from(
    new Set([
      ...riskEntries.flatMap((entry) => entry.tags.filter((tag) => combined.includes(normalizeThaiText(tag)))),
      ...allEvaluationCriteria().flatMap((criterion) =>
        criterion.matchTerms.filter((term) => combined.includes(normalizeThaiText(term))),
      ),
      ...escalationTerms.filter((term) => combined.includes(term)),
      ...policyEscalationTerms.filter((term) => combined.includes(normalizeThaiText(term))),
    ]),
  );

  const evaluationCriteria = allEvaluationCriteria().filter((criterion) =>
    criterion.matchTerms.some((term) => combined.includes(normalizeThaiText(term))),
  );
  const matchingReferences = getAllLibraryReferences().filter((reference) =>
    reference.activeForEvaluation && evaluationCriteria.some((criterion) => criterion.sourceReferenceId === reference.id),
  );

  const legalConcerns = Array.from(
    new Set([...matchingCases.map((entry) => entry.legalRiskType), ...evaluationCriteria.map((criterion) => criterion.legalRiskType)]),
  ) as LegalRiskType[];
  const score =
    matchingCases.reduce((total, entry) => total + scoreSeverity(entry.severity), detectedKeywords.length) +
    evaluationCriteria.reduce((total, criterion) => total + scoreSeverity(criterion.severity), 0);
  const riskLevel = chooseRiskLevel(
    score,
    matchingCases.some((entry) => entry.severity === "BLOCKED") || evaluationCriteria.some((criterion) => criterion.severity === "BLOCKED"),
    matchingCases.some((entry) => entry.severity === "WARNING") || evaluationCriteria.some((criterion) => criterion.severity === "WARNING"),
  );

  const fallbackConcern: LegalRiskType[] = riskLevel === "SAFE" ? [] : ["Defamation"];
  const concerns = legalConcerns.length ? legalConcerns : fallbackConcern;
  const label = riskLevelThai[riskLevel];
  const headline =
    riskLevel === "SAFE"
      ? "สามารถเผยแพร่ได้ในเบื้องต้น"
      : riskLevel === "WARNING"
        ? "มีความเสี่ยง ควรตรวจสอบเพิ่มเติม"
        : "มีความเสี่ยงสูง ไม่ควรเผยแพร่ก่อนตรวจสอบ";

  const reasoning =
    riskLevel === "SAFE"
      ? "ยังไม่พบคำหรือบริบทที่เข้ากับฐานความเสี่ยงหลักของกองบรรณาธิการ อย่างไรก็ตามควรตรวจแหล่งที่มา ความถูกต้อง และสิทธิการใช้สื่อประกอบตาม workflow ปกติ"
      : `พบคำหรือบริบทที่อาจเกี่ยวข้องกับ ${concerns.join(", ")} พบเคสใกล้เคียง ${matchingCases.length} รายการ และเข้าเกณฑ์จากคลังความรู้ ${evaluationCriteria.length} ข้อ ระบบจึงแนะนำให้มีมนุษย์ตรวจทานเชิงบรรณาธิการก่อนเผยแพร่`;

  const recommendation =
    riskLevel === "BLOCKED"
      ? "ควรเบรกการเผยแพร่ชั่วคราว ส่งให้บรรณาธิการหรือฝ่ายกฎหมายตรวจ พร้อมแนบเอกสารอ้างอิงและคำชี้แจงจากผู้เกี่ยวข้อง"
      : riskLevel === "WARNING"
        ? "ควรตรวจข้อเท็จจริง แหล่งอ้างอิง สิทธิการใช้ภาพ/คลิป และลดถ้อยคำที่ตีความเป็นข้อกล่าวหาโดยตรง"
        : "เผยแพร่ได้ในเบื้องต้น แต่ยังควรตรวจความถูกต้องของชื่อ ตำแหน่ง เวลา และเครดิตสื่อประกอบก่อนกด publish";

  return {
    riskLevel,
    label,
    headline,
    reasoning,
    detectedKeywords,
    matchingCases,
    matchingReferences,
    evaluationCriteria,
    legalConcerns: concerns,
    recommendation,
    confidence: Math.min(94, Math.max(64, 68 + score * 4)),
  };
}
