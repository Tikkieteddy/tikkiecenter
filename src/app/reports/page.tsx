import { PageHeader } from "@/components/operation/page-header";
import { ReportDashboard } from "@/components/operation/report-dashboard";
import { Trans } from "@/components/operation/language-provider";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        eyebrow={<Trans en="Analytics" th="วิเคราะห์ข้อมูล" />}
        title={<Trans en="Reports" th="รายงาน" />}
        description={
          <Trans
            en="Track completed, delayed, pending, due soon, and overdue work with export-ready filtered data."
            th="ติดตามงานที่เสร็จแล้ว ล่าช้า รอดำเนินการ ใกล้ครบกำหนด และเกินกำหนด พร้อมข้อมูลที่ export ได้"
          />
        }
      />
      <ReportDashboard />
    </div>
  );
}
