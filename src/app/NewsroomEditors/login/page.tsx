import Link from "next/link";
import { ArrowRight, Bot, KeyRound, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const roles = ["Admin", "Editor", "Legal Reviewer", "Viewer"];

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(145deg,#0F172A_0%,#111827_52%,#EC5F27_160%)] p-4">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="grid gap-5 text-white">
          <Badge className="w-fit border-white/20 bg-white/10 text-white">AI Assistant for Thai Professional Newsroom Editors</Badge>
          <div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">News Risk Monitor</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-orange-50">
              ระบบช่วยคัดกรองความเสี่ยงก่อนเผยแพร่ สำหรับข่าวการเมือง เลือกตั้ง คดี ศาล ภาพ คลิป และเนื้อหาที่ต้องตัดสินใจเร็วในสถานการณ์ breaking news
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Feature icon={Bot} text="AI reasoning แบบบรรณาธิการ" />
            <Feature icon={ShieldCheck} text="Legal-aware แต่ไม่ฟันธงกฎหมาย" />
            <Feature icon={KeyRound} text="Role-based approval workflow" />
          </div>
        </section>

        <Card className="border-white/20 bg-white/95 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <CardHeader>
            <CardTitle>เข้าสู่ระบบ</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="email">อีเมล</label>
              <input id="email" className="h-11 rounded-lg border border-input bg-white px-3 text-sm shadow-sm" defaultValue="editor@newsroom.co.th" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="role">บทบาท</label>
              <select id="role" defaultValue="Editor">
                {roles.map((role) => <option key={role}>{role}</option>)}
              </select>
            </div>
            <Link href="/NewsroomEditors/dashboard" className={buttonVariants({ size: "lg" })}>
              เข้าสู่ News Risk Monitor <ArrowRight aria-hidden="true" />
            </Link>
            <p className="rounded-lg border border-orange-100 bg-[#FFF3ED] p-3 text-sm leading-6 text-[#9A3412]">
              หน้านี้เป็น mock authentication สำหรับ demo และพร้อมเชื่อมต่อ session provider จริงพร้อม role-based access ในชั้น server route
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Feature({ icon: Icon, text }: { icon: typeof Bot; text: string }) {
  return (
    <div className="flex min-h-20 items-center gap-3 rounded-lg border border-white/16 bg-white/10 p-3 backdrop-blur">
      <Icon className="size-5 shrink-0 text-[#EC5F27]" aria-hidden="true" />
      <span className="text-sm font-semibold text-white">{text}</span>
    </div>
  );
}
