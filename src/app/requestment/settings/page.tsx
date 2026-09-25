import { Database, Mail, PlugZap, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/operation/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trans } from "@/components/operation/language-provider";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow={<Trans en="Configuration" th="การตั้งค่า" />}
        title={<Trans en="Settings" th="ตั้งค่า" />}
        description={
          <Trans
            en="Phase 1 is structured for database and email service connection. n8n and LINE OA are intentionally not implemented yet."
            th="Phase 1 เตรียมโครงสำหรับเชื่อมฐานข้อมูลและบริการอีเมล โดยยังไม่ implement n8n และ LINE OA"
          />
        }
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="border-brand-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="size-5 text-brand-700" aria-hidden="true" />
              <Trans en="Email provider" th="ผู้ให้บริการอีเมล" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>EMAIL_PROVIDER</Label>
              <select defaultValue="resend">
                <option value="smtp">SMTP</option>
                <option value="sendgrid">SendGrid-compatible</option>
                <option value="resend">Resend-compatible</option>
              </select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="SMTP_HOST" value="smtp.example.com" />
              <Field label="SMTP_PORT" value="587" />
              <Field label="EMAIL_FROM" value="Tikkie Ops <no-reply@example.com>" />
              <Field label="TASK_DETAIL_BASE_URL" value="https://ops.example.com" />
            </div>
            <p className="rounded-lg border border-brand-500 bg-primary p-3 text-sm leading-6 !text-brand-yellow [&_*]:!text-brand-yellow">
              <Trans
                en="Connect this to `sendTaskEmail()` in `src/lib/operation/email.ts`. Keep service clients lazily initialized."
                th="เชื่อมส่วนนี้กับ `sendTaskEmail()` ใน `src/lib/operation/email.ts` และให้ service client เริ่มทำงานแบบ lazy"
              />
            </p>
          </CardContent>
        </Card>

        <Card className="border-brand-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-5 text-brand-700" aria-hidden="true" />
              <Trans en="Database readiness" th="ความพร้อมของฐานข้อมูล" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-sm font-semibold">PostgreSQL / Supabase schema</span>
              <Badge variant="success"><Trans en="Ready" th="พร้อม" /></Badge>
            </div>
            <p className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              Schema file: <code className="font-mono">database/schema.sql</code>
            </p>
            <Separator />
            <div className="grid gap-2 text-sm">
              <StatusLine label="users" />
              <StatusLine label="tasks" />
              <StatusLine label="task_comments" />
              <StatusLine label="task_status_history" />
              <StatusLine label="email_notifications" />
              <StatusLine label="settings" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-100 xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlugZap className="size-5 text-brand-700" aria-hidden="true" />
              <Trans en="Future integrations" th="การเชื่อมต่อในอนาคต" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-semibold">n8n workflow automation</p>
                <Badge variant="slate"><Trans en="Prepared only" th="เตรียมไว้เท่านั้น" /></Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                <Trans
                  en="Keep task events and email logs structured so workflows can subscribe later. No n8n calls are made in Phase 1."
                  th="เก็บ event ของงานและบันทึกอีเมลให้เป็นโครงสร้าง เพื่อให้ workflow เชื่อมต่อได้ภายหลัง โดย Phase 1 ไม่มีการเรียก n8n"
                />
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-semibold">LINE OA notification</p>
                <Badge variant="slate"><Trans en="Prepared only" th="เตรียมไว้เท่านั้น" /></Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                <Trans
                  en="Requester contact structure can be extended later. Phase 1 sends email only."
                  th="โครงสร้างข้อมูลติดต่อผู้ขอสามารถขยายต่อภายหลังได้ โดย Phase 1 ส่งอีเมลเท่านั้น"
                />
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-100 xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-brand-700" aria-hidden="true" />
              <Trans en="Operational defaults" th="ค่าเริ่มต้นการทำงาน" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { en: "Requester email required", th: "ต้องมีอีเมลผู้ขอ" },
              { en: "Reject requires confirmation", th: "ปฏิเสธต้องยืนยันก่อน" },
              { en: "Done requires confirmation", th: "ปิดงานต้องยืนยันก่อน" },
              { en: "Overdue email supported", th: "รองรับอีเมลงานเกินกำหนด" },
            ].map((item) => (
                <div key={item.en} className="rounded-lg border border-brand-500 bg-primary p-3 text-sm font-semibold !text-brand-yellow [&_*]:!text-brand-yellow">
                  <Trans en={item.en} th={item.th} />
                </div>
              ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input value={value} readOnly />
    </div>
  );
}

function StatusLine({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
      <span className="font-mono text-xs font-semibold">{label}</span>
      <Badge variant="success"><Trans en="defined" th="กำหนดแล้ว" /></Badge>
    </div>
  );
}
