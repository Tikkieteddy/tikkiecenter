import { ReviewChatWorkspace } from "@/components/newsroom/review-chat-workspace";
import { PageHeading } from "@/components/newsroom/page-heading";

export default function ReviewChatPage() {
  return (
    <>
      <PageHeading
        eyebrow="Editorial Review Chat"
        title="แชทตรวจข่าวและสื่อก่อนเผยแพร่"
        description="ส่งข้อความ ลิงก์ หรือรูปเข้าคิวตรวจ ระบบจะช่วยคัดกรองความเสี่ยงเบื้องต้น พร้อมปุ่ม Approve / Declined สำหรับ workflow บรรณาธิการ"
      />
      <ReviewChatWorkspace />
    </>
  );
}
