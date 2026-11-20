import { NextResponse } from "next/server";
import { createLibraryReference } from "@/lib/newsroom/library-ingestion";
import { addRuntimeLibraryReference, getAllLibraryReferences } from "@/lib/newsroom/library-store";
import type { LegalRiskType, LibrarySourceType } from "@/lib/newsroom/types";

const supportedTextTypes = ["text/plain", "text/markdown", "application/json", "text/csv"];

function parseTags(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseLegalRiskTypes(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return undefined;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean) as LegalRiskType[];
}

async function extractFileText(file: File) {
  if (supportedTextTypes.includes(file.type) || file.name.match(/\.(txt|md|csv|json)$/i)) {
    return file.text();
  }

  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    return [
      `PDF uploaded: ${file.name}`,
      "ระบบบันทึกไฟล์นี้เป็นแหล่งอ้างอิงได้ทันที ส่วนการดึงข้อความเต็มจาก PDF สามารถต่อ PDF parser/OCR ใน ingestion worker ภายหลัง",
    ].join("\n");
  }

  return `Uploaded file: ${file.name}`;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const sourceType = (form.get("sourceType") || "TEXT") as LibrarySourceType;
    const file = form.get("file");
    const uploadedFile = file instanceof File ? file : null;
    const bodyTextFromFile = uploadedFile ? await extractFileText(uploadedFile) : "";
    const bodyText = String(form.get("bodyText") || bodyTextFromFile || "");
    const title = String(form.get("title") || uploadedFile?.name || "เอกสารอ้างอิงใหม่");

    const reference = createLibraryReference({
      title,
      category: String(form.get("category") || "แนวปฏิบัติภายใน"),
      sourceType,
      sourceUrl: String(form.get("sourceUrl") || "") || undefined,
      fileName: uploadedFile?.name,
      bodyText,
      tags: parseTags(form.get("tags")),
      legalRiskTypes: parseLegalRiskTypes(form.get("legalRiskTypes")),
      activeForEvaluation: form.get("activeForEvaluation") !== "false",
    });
    addRuntimeLibraryReference(reference);

    return NextResponse.json({
      reference,
      message: "เพิ่มเอกสารเข้าคลังความรู้และสร้างเกณฑ์ประเมินเบื้องต้นแล้ว",
    });
  }

  const body = await request.json().catch(() => null);

  if (!body?.title) {
    return NextResponse.json({ error: "กรุณาระบุชื่อเอกสารหรือหัวข้อแนวปฏิบัติ" }, { status: 400 });
  }

  const reference = createLibraryReference({
    title: body.title,
    category: body.category || "แนวปฏิบัติภายใน",
    sourceType: body.sourceType || "TEXT",
    sourceUrl: body.sourceUrl,
    fileName: body.fileName,
    bodyText: body.bodyText || "",
    tags: body.tags || [],
    legalRiskTypes: body.legalRiskTypes,
    activeForEvaluation: body.activeForEvaluation ?? true,
  });
  addRuntimeLibraryReference(reference);

  return NextResponse.json({
    reference,
    message: "เพิ่มเอกสารเข้าคลังความรู้และสร้างเกณฑ์ประเมินเบื้องต้นแล้ว",
  });
}

export async function GET() {
  return NextResponse.json({ references: getAllLibraryReferences() });
}
