import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import { PageHeader } from "@/components/operation/page-header";
import { TaskList } from "@/components/operation/task-list";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { tasks } from "@/lib/operation/mock-data";
import { Trans } from "@/components/operation/language-provider";

export default function RequestsPage() {
  return (
    <div>
      <PageHeader
        eyebrow={<Trans en="Task list" th="รายการงาน" />}
        title={<Trans en="All Requests" th="คำขอทั้งหมด" />}
        description={
          <Trans
            en="Desktop uses a table. Mobile and small tablets automatically switch to stacked request cards."
            th="บนเดสก์ท็อปจะแสดงเป็นตาราง ส่วนมือถือและแท็บเล็ตขนาดเล็กจะเปลี่ยนเป็นการ์ดอัตโนมัติ"
          />
        }
        actions={
          <Link href="/requests/new" className={buttonVariants()}>
            <FilePlus2 aria-hidden="true" />
            <Trans en="Create Request" th="สร้างคำขอ" />
          </Link>
        }
      />
      <Card className="mb-4 border-brand-100">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { en: "All statuses", th: "ทุกสถานะ" },
            { en: "All categories", th: "ทุกประเภท" },
            { en: "All teams", th: "ทุกทีม" },
            { en: "All priorities", th: "ทุกความเร่งด่วน" },
            { en: "All assignees", th: "ทุกผู้รับผิดชอบ" },
          ].map((label) => (
            <select key={label.en} defaultValue={label.en} aria-label={label.en}>
              <option value={label.en}>
                <Trans en={label.en} th={label.th} />
              </option>
            </select>
          ))}
        </CardContent>
      </Card>
      <TaskList tasks={tasks} />
    </div>
  );
}
