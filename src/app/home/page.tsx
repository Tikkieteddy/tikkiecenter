import Image from "next/image";
import { ArrowUpRight, BatteryCharging, Calculator, ClipboardList, Sparkles } from "lucide-react";
import { VersionFooter } from "@/components/version-footer";

const projects = [
  {
    title: "คำนวณไทยช่วยไทย 60/40",
    eyebrow: "Thai Help Calculator",
    href: "https://thai-help-calculator.vercel.app",
    description: "กรอกราคาสินค้า แล้วดูทันทีว่ารัฐช่วยเท่าไหร่ เราจ่ายเท่าไหร่ และสิทธิคงเหลือวันนี้เท่าไหร่",
    icon: Calculator,
    metric: "60% / สูงสุด 200 บาท",
    accent: "from-red-500 via-brand-yellow to-green-500",
  },
  {
    title: "EV Charge Daily Calculator",
    eyebrow: "EV Power",
    href: "https://evpower-beta.vercel.app/",
    description: "คำนวณค่าชาร์จไฟรถ EV รายวัน รายสัปดาห์ รายเดือน และประมาณการล่วงหน้า",
    icon: BatteryCharging,
    metric: "Daily / Weekly / Monthly",
    accent: "from-brand-cyan to-brand-400",
  },
  {
    title: "ระบบติดตามคำขอภายใน",
    eyebrow: "Tikkie Center",
    href: "https://tikkiecenter.vercel.app/login",
    description: "ระบบติดตามคำขอภายใน สำหรับส่งงาน ติดตามสถานะ ดูบันทึกอีเมล และรายงานแบบกระชับ เพื่อเตือนความจำสำหรับผู้ใช้งาน",
    icon: ClipboardList,
    metric: "Requests / Email / Reports",
    accent: "from-brand-yellow to-brand-yellow-soft",
  },
];

export default function TikkieCenterHomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_14%_0%,rgba(0,165,255,0.32),transparent_30%),radial-gradient(circle_at_92%_8%,rgba(255,230,109,0.2),transparent_24%),linear-gradient(145deg,#070044_0%,#12007c_44%,#1700c7_72%,#00a5ff_100%)] text-brand-yellow">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/20 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
              <Image
                src="/tikkie-project-logo.jpg"
                alt="Tikkie Project Operation Center"
                width={48}
                height={48}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-black leading-tight sm:text-xl">Tikkie Center</p>
              <p className="truncate text-xs font-semibold text-brand-yellow-soft">Project hub by TikkieTeddie Lab</p>
            </div>
          </div>
          <a
            href="https://tikkiecenter.vercel.app/login"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-brand-yellow/40 bg-brand-yellow px-4 text-sm font-black !text-brand-yellow-foreground shadow-[0_14px_36px_rgba(255,230,109,0.24)] transition hover:-translate-y-0.5 hover:bg-brand-yellow-soft [&_*]:!text-brand-yellow-foreground"
          >
            เข้าระบบ
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </header>

        <section className="grid flex-1 content-center gap-6 py-7 lg:grid-cols-[minmax(14rem,0.58fr)_minmax(0,1.9fr)] lg:items-center xl:gap-8">
          <div className="max-w-sm lg:self-start lg:pt-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-white/10 px-2.5 py-1.5 text-[11px] font-bold text-brand-yellow-soft shadow-sm backdrop-blur">
              <Sparkles className="size-3.5 text-brand-yellow" aria-hidden="true" />
              ศูนย์รวมโปรเจคของติ๊ก
            </div>
            <h1 className="mt-3 text-3xl font-black leading-tight text-brand-yellow sm:text-4xl">
              Tikkie Center
            </h1>
            <p className="mt-2 max-w-xs text-sm leading-6 text-brand-yellow-soft">
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
                  className="group relative min-h-[17rem] overflow-hidden rounded-lg border border-white/18 bg-white/12 p-4 shadow-[0_20px_52px_rgba(0,0,0,0.2)] backdrop-blur transition hover:-translate-y-1 hover:bg-white/16"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${project.accent}`} />
                  <div className="absolute -right-14 -top-14 size-36 rounded-full border border-white/20 bg-white/10" aria-hidden="true" />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid size-11 place-items-center rounded-lg border border-brand-yellow/28 bg-brand-900/40 text-brand-yellow shadow-sm">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-brand-yellow/30 bg-brand-yellow px-2.5 py-1 text-[11px] font-black !text-brand-yellow-foreground [&_*]:!text-brand-yellow-foreground">
                        Open
                        <ArrowUpRight className="size-3 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="mt-5">
                      <p className="text-[11px] font-black uppercase text-brand-yellow-soft">{project.eyebrow}</p>
                      <h2 className="mt-1.5 text-xl font-black leading-tight text-brand-yellow">{project.title}</h2>
                      <p className="mt-2.5 line-clamp-3 text-xs leading-5 text-brand-yellow-soft">{project.description}</p>
                    </div>

                    <div className="mt-auto pt-4">
                      <div className="rounded-lg border border-white/14 bg-brand-900/34 px-3 py-2.5">
                        <p className="text-[10px] font-semibold text-brand-yellow-soft">Project scope</p>
                        <p className="mt-0.5 text-xs font-black text-brand-yellow">{project.metric}</p>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <VersionFooter variant="dark" className="py-5" />
      </div>
    </main>
  );
}
