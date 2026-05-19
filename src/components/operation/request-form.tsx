"use client";

import { FormEvent, type ReactNode, useMemo, useState } from "react";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { users } from "@/lib/operation/mock-data";
import { priorities, statuses } from "@/lib/operation/metrics";
import { Trans, useLocalizedText } from "@/components/operation/language-provider";

const categories = [
  "Design",
  "Web",
  "Content",
  "Report",
  "Presentation",
  "Data",
  "Email",
  "Automation",
  "Document",
  "Video editor",
  "Backoffice&Admin",
];
const teams = ["Marketing", "Sales", "Operations", "Content", "Events", "Retail", "Management", "Finance", "HR", "IT", "Backoffice&Admin"];
const otherTeamValue = "__other_team__";

type ToastState = {
  ticketId: string;
  recipientEmail: string;
} | null;

export function RequestForm() {
  const t = useLocalizedText();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const ticketId = useMemo(() => "TK-2026-0023", []);
  const assignees = users.filter((user) => user.role === "Tikkie / Assignee" || user.role === "Admin");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const requesterEmail = String(form.get("requester_email") ?? "");

    setIsSubmitting(true);

    window.setTimeout(() => {
      setToast({ ticketId, recipientEmail: requesterEmail });
      setIsSubmitting(false);
      setSelectedTeam("");
      event.currentTarget.reset();
    }, 650);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.42fr]">
      <Card className="border-brand-100">
        <CardHeader>
          <CardTitle>
            <Trans en="Request information" th="ข้อมูลคำขอ" />
          </CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            <Trans
              en="The requester email is required because Phase 1 uses email notification only."
              th="ต้องกรอกอีเมลผู้ขอ เพราะ Phase 1 ใช้การแจ้งเตือนทางอีเมลเท่านั้น"
            />
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={<Trans en="task_title" th="ชื่องาน" />} required>
                <Input name="task_title" required placeholder={t({ en: "Short, clear task title", th: "ชื่องานแบบสั้นและชัดเจน" })} />
              </Field>
              <Field label={<Trans en="requester_name" th="ชื่อผู้ขอ" />} required>
                <Input name="requester_name" required placeholder={t({ en: "Requester full name", th: "ชื่อเต็มของผู้ขอ" })} />
              </Field>
              <Field label={<Trans en="requester_team" th="ทีมผู้ขอ" />} required>
                <select
                  name={selectedTeam === otherTeamValue ? "requester_team_choice" : "requester_team"}
                  required
                  value={selectedTeam}
                  onChange={(event) => setSelectedTeam(event.target.value)}
                >
                  <option value="" disabled>
                    {t({ en: "Select team", th: "เลือกทีม" })}
                  </option>
                  {teams.map((team) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                  <option value={otherTeamValue}>{t({ en: "Other (specify)", th: "อื่นๆ ระบุ" })}</option>
                </select>
                {selectedTeam === otherTeamValue ? (
                  <Input
                    name="requester_team"
                    required
                    placeholder={t({ en: "Specify requester team", th: "ระบุทีมผู้ขอ" })}
                  />
                ) : null}
              </Field>
              <Field label={<Trans en="requester_email" th="อีเมลผู้ขอ" />} required>
                <Input name="requester_email" required type="email" placeholder="name@example.com" />
              </Field>
              <Field label={<Trans en="task_category" th="ประเภทงาน" />} required>
                <select name="task_category" required defaultValue="">
                  <option value="" disabled>
                    {t({ en: "Select category", th: "เลือกประเภท" })}
                  </option>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </Field>
              <Field label={<Trans en="attachment_url" th="ลิงก์ไฟล์แนบ" />}>
                <Input name="attachment_url" type="url" placeholder="https://..." />
              </Field>
              <Field label={<Trans en="created_date" th="วันที่สร้าง" />} required>
                <Input name="created_date" required type="date" defaultValue="2026-05-18" />
              </Field>
              <Field label={<Trans en="deadline_date" th="กำหนดส่ง" />} required>
                <Input name="deadline_date" required type="date" />
              </Field>
              <Field label={<Trans en="priority" th="ความเร่งด่วน" />} required>
                <select name="priority" required defaultValue="Normal">
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {t({
                        en: priority,
                        th: priority === "Normal" ? "ปกติ" : priority === "Urgent" ? "ด่วน" : "ด่วนมาก",
                      })}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={<Trans en="status" th="สถานะ" />} required>
                <select name="status" required defaultValue="New">
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {t({
                        en: status,
                        th:
                          status === "New"
                            ? "ใหม่"
                            : status === "Reviewing"
                              ? "กำลังตรวจสอบ"
                              : status === "In Progress"
                                ? "กำลังดำเนินการ"
                                : status === "Waiting for Info"
                                  ? "รอข้อมูลเพิ่มเติม"
                                  : status === "Done"
                                    ? "เสร็จแล้ว"
                                    : "ปฏิเสธ",
                      })}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={<Trans en="assignee" th="ผู้รับผิดชอบ" />}>
                <select name="assignee" defaultValue="">
                  <option value="">{t({ en: "Unassigned", th: "ยังไม่กำหนด" })}</option>
                  {assignees.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={<Trans en="internal_note" th="บันทึกภายใน" />}>
                <Input name="internal_note" placeholder={t({ en: "Visible to Admin/Tikkie only", th: "แสดงเฉพาะ Admin/Tikkie" })} />
              </Field>
            </div>

            <Field label={<Trans en="task_detail" th="รายละเอียดงาน" />} required>
              <Textarea
                name="task_detail"
                required
                placeholder={t({
                  en: "Describe expected output, context, links, and deadline notes.",
                  th: "อธิบายผลลัพธ์ที่ต้องการ บริบท ลิงก์ และหมายเหตุเรื่องกำหนดส่ง",
                })}
              />
            </Field>

            <div className="flex flex-wrap items-center gap-3">
              <Button disabled={isSubmitting} type="submit" size="lg">
                {isSubmitting ? t({ en: "Submitting...", th: "กำลังส่ง..." }) : t({ en: "Submit request", th: "ส่งคำขอ" })}
                <Send aria-hidden="true" />
              </Button>
              <p className="text-sm text-muted-foreground">
                <Trans en="A request received email is queued after submit." th="หลังส่งคำขอ ระบบจะเพิ่มอีเมลรับเรื่องเข้าคิวส่ง" />
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid content-start gap-4">
        {toast ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="grid gap-3 p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="size-5" aria-hidden="true" />
                <p className="font-bold">
                  <Trans en="Request submitted" th="ส่งคำขอแล้ว" />
                </p>
              </div>
              <p className="text-sm leading-6 text-green-800">
                {toast.ticketId}{" "}
                <Trans en="was created and a request received email was queued for" th="ถูกสร้างแล้ว และเพิ่มอีเมลรับเรื่องเข้าคิวส่งถึง" />{" "}
                {toast.recipientEmail}.
              </p>
            </CardContent>
          </Card>
        ) : null}

        <Card className="border-brand-100">
          <CardHeader>
            <CardTitle>
              <Trans en="Phase 1 notification" th="การแจ้งเตือน Phase 1" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-brand-500 bg-primary p-3 !text-brand-yellow [&_*]:!text-brand-yellow">
              <span className="flex items-center gap-2 text-sm font-semibold text-brand-yellow">
                <Mail className="size-4" aria-hidden="true" />
                <Trans en="Email service" th="บริการอีเมล" />
              </span>
              <Badge variant="success">
                <Trans en="Ready" th="พร้อม" />
              </Badge>
            </div>
            <Separator />
            <p className="text-sm leading-6 text-muted-foreground">
              <Trans
                en="SMTP, SendGrid, or Resend can be connected in the placeholder email service. n8n and LINE OA are prepared for later but not implemented."
                th="สามารถเชื่อม SMTP, SendGrid หรือ Resend ใน placeholder email service ได้ ส่วน n8n และ LINE OA เตรียมโครงไว้สำหรับภายหลังแต่ยังไม่ implement"
              />
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: ReactNode; required?: boolean; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>
        {label}
        {required ? <span className="ml-1 text-danger">*</span> : null}
      </Label>
      {children}
    </div>
  );
}
