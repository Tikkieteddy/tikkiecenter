import { PageHeader } from "@/components/operation/page-header";
import { RequestForm } from "@/components/operation/request-form";
import { Trans } from "@/components/operation/language-provider";

export default function NewRequestPage() {
  return (
    <div>
      <PageHeader
        eyebrow={<Trans en="New ticket" th="รายการใหม่" />}
        title={<Trans en="Create Request" th="สร้างคำขอ" />}
        description={
          <Trans
            en="Submit a work request to Tikkie. The requester email is mandatory for Phase 1 email updates."
            th="ส่งคำขอให้งานกับ Tikkie โดยอีเมลผู้ขอเป็นข้อมูลบังคับสำหรับการแจ้งเตือนใน Phase 1"
          />
        }
      />
      <RequestForm />
    </div>
  );
}
