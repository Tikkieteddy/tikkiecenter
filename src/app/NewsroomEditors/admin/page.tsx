import { Bot, KeyRound, Settings, ShieldAlert, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/newsroom/page-heading";
import { MetricCard } from "@/components/newsroom/metric-card";

const users = [
  { name: "Admin Newsroom", email: "admin@newsroom.co.th", role: "Admin" },
  { name: "Politics Editor", email: "editor@newsroom.co.th", role: "Editor" },
  { name: "Legal Desk", email: "legal@newsroom.co.th", role: "Legal Reviewer" },
  { name: "Viewer Desk", email: "viewer@newsroom.co.th", role: "Viewer" },
];

export default function AdminPage() {
  return (
    <>
      <PageHeading
        eyebrow="Admin Panel"
        title="ผู้ดูแลระบบ"
        description="จัดการผู้ใช้ สิทธิ์การเข้าถึง risk rules, AI prompts, หมวดความเสี่ยง legal references และ guideline ภายในองค์กร"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="ผู้ใช้ทั้งหมด" value="24" detail="Admin, Editor, Legal Reviewer, Viewer" icon={Users} tone="brand" />
        <MetricCard title="Risk rules" value="128" detail="พร้อม semantic/vector extension" icon={ShieldAlert} tone="warning" />
        <MetricCard title="AI prompts" value="6" detail="แยกตาม workflow ห้องข่าว" icon={Bot} tone="default" />
        <MetricCard title="สิทธิ์ role-based" value="4" detail="ตรวจซ้ำใน server route" icon={KeyRound} tone="success" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>จัดการผู้ใช้และสิทธิ์</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {users.map((user) => (
              <div key={user.email} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white/70 p-3">
                <div>
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge className="border-orange-100 bg-[#FFF3ED] text-[#EC5F27]">{user.role}</Badge>
              </div>
            ))}
            <Button><Users /> เพิ่มผู้ใช้</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>จัดการ AI prompt และ policy</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="prompt-name">ชื่อ prompt</label>
              <Input id="prompt-name" defaultValue="Thai Political News Risk Screening" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="prompt-body">Prompt policy</label>
              <textarea
                id="prompt-body"
                className="min-h-44 rounded-lg border border-input bg-white px-3 py-2 text-sm leading-7"
                defaultValue="ให้วิเคราะห์แบบผู้ช่วยบรรณาธิการข่าวไทยที่ตระหนักความเสี่ยงกฎหมาย ห้ามฟันธงว่าถูก/ผิดกฎหมาย ให้ใช้คำว่าอาจมีความเสี่ยงและควรตรวจโดยมนุษย์"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <Button variant="outline"><Settings /> หมวดความเสี่ยง</Button>
              <Button variant="outline">Legal references</Button>
              <Button>บันทึก prompt</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
