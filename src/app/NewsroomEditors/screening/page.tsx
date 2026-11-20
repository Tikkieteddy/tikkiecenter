import { PageHeading } from "@/components/newsroom/page-heading";
import { ScreeningWorkspace } from "@/components/newsroom/screening-workspace";

export default function ScreeningPage() {
  return (
    <>
      <PageHeading
        eyebrow="AI Screening Desk"
        title="ตรวจความเสี่ยงข่าวก่อนเผยแพร่"
        description="ใส่ keyword, headline, เนื้อหา, URL หรือหมายเหตุ ระบบจะคัดกรองเบื้องต้น เทียบฐานความเสี่ยง และให้คำแนะนำแบบใช้งานได้จริงในห้องข่าว"
      />
      <ScreeningWorkspace />
    </>
  );
}
