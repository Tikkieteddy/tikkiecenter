import { ArrowUpRight, BatteryCharging, Calculator, ClipboardList, ListChecks, Sparkles } from "lucide-react";
import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { VersionFooter } from "@/components/version-footer";

const projects = [
  {
    title: "คำนวณไทยช่วยไทย 60/40",
    eyebrow: "Thai Help Calculator",
    href: "https://thai-help-calculator.vercel.app",
    description: "กรอกราคาสินค้า แล้วดูทันทีว่ารัฐช่วยเท่าไหร่ เราจ่ายเท่าไหร่ และสิทธิคงเหลือวันนี้เท่าไหร่",
    icon: Calculator,
    metric: "60% / สูงสุด 200 บาท",
    accent: "from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6]",
  },
  {
    title: "EV Charge Daily Calculator",
    eyebrow: "EV Power",
    href: "https://evpower-beta.vercel.app/",
    description: "คำนวณค่าชาร์จไฟรถ EV รายวัน รายสัปดาห์ รายเดือน และประมาณการล่วงหน้า",
    icon: BatteryCharging,
    metric: "Daily / Weekly / Monthly",
    accent: "from-[#3B82F6] to-[#22D3EE]",
  },
  {
    title: "ระบบติดตามคำขอภายใน",
    eyebrow: "Tikkie Center",
    href: "https://tikkiecenter.vercel.app/login",
    description: "ระบบติดตามคำขอภายใน สำหรับส่งงาน ติดตามสถานะ ดูบันทึกอีเมล และรายงานแบบกระชับ เพื่อเตือนความจำสำหรับผู้ใช้งาน",
    icon: ClipboardList,
    metric: "Requests / Email / Reports",
    accent: "from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE]",
  },
  {
    title: "Requirement & Acceptance Management System",
    eyebrow: "Model Web Mock",
    href: "https://model-web-mock.vercel.app/",
    description: "จัดการ Technical Workflow ตั้งแต่บรีฟ มอบหมาย ติดตาม UAT และตรวจรับงาน พร้อมหน้าเดโมสำหรับทดสอบการใช้งาน",
    icon: ListChecks,
    metric: "Brief / Workflow / UAT",
    accent: "from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6]",
  },
];

export default function TikkieCenterHomePage() {
  return (
    <main className="brand-orbit-surface min-h-screen overflow-hidden text-[#F8FAFC]">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="flex min-h-[68px] items-center justify-between gap-4 border-b border-white/[0.08]">
          <BrandWordmark size="lg" />
          <a
            href="https://tikkiecenter.vercel.app/login"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-[linear-gradient(90deg,#3B82F6,#8B5CF6)] px-4 text-sm font-bold text-[#F8FAFC] shadow-[0_12px_30px_rgba(59,130,246,0.24)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            เข้าระบบ
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </header>

        <section className="grid flex-1 content-center gap-6 py-7 lg:grid-cols-[minmax(14rem,0.58fr)_minmax(0,1.9fr)] lg:items-center xl:gap-8">
          <div className="max-w-sm lg:self-start lg:pt-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 px-2.5 py-1.5 text-[11px] font-bold text-[#C7D2FE] shadow-sm backdrop-blur">
              <Sparkles className="size-3.5 text-[#22D3EE]" aria-hidden="true" />
              ศูนย์รวมโปรเจคของติ๊ก
            </div>
            <h1 className="mt-3 text-3xl font-black leading-tight text-[#F8FAFC] sm:text-4xl">
              Tikkie Center
            </h1>
            <p className="mt-2 max-w-xs text-sm leading-6 text-[#94A3B8]">
              หน้าเดียวสำหรับเข้าใช้งานทุกโปรเจคสำคัญ เลือกการ์ดที่ต้องการ แล้วไปต่อได้ทันทีแบบเร็ว สะอาด และเป็นระเบียบ
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const Icon = project.icon;

              return (
                <a
                  key={project.title}
                  href={project.href}
                  className="group relative min-h-[17rem] overflow-hidden rounded-lg border border-white/10 bg-[#111827]/80 p-4 shadow-[0_20px_52px_rgba(0,0,0,0.24)] backdrop-blur transition hover:-translate-y-1 hover:border-[#3B82F6]/45 hover:bg-[#172036]/90"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${project.accent}`} />
                  <div className="absolute -right-14 -top-14 size-36 rounded-full border border-white/20 bg-white/10" aria-hidden="true" />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid size-11 place-items-center rounded-lg border border-[#3B82F6]/35 bg-[#0B0F1A]/70 text-[#22D3EE] shadow-sm">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#3B82F6] px-2.5 py-1 text-[11px] font-black text-[#F8FAFC]">
                        Open
                        <ArrowUpRight className="size-3 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="mt-5">
                      <p className="text-[11px] font-black uppercase text-[#60A5FA]">{project.eyebrow}</p>
                      <h2 className="mt-1.5 text-xl font-black leading-tight text-[#F8FAFC]">{project.title}</h2>
                      <p className="mt-2.5 line-clamp-3 text-xs leading-5 text-[#CBD5E1]">{project.description}</p>
                    </div>

                    <div className="mt-auto pt-4">
                      <div className="rounded-lg border border-white/[0.08] bg-[#0B0F1A]/65 px-3 py-2.5">
                        <p className="text-[10px] font-semibold text-[#94A3B8]">Project scope</p>
                        <p className="mt-0.5 text-xs font-black text-[#E2E8F0]">{project.metric}</p>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <VersionFooter variant="dark" className="py-5 text-[#94A3B8]" />
      </div>
    </main>
  );
}
