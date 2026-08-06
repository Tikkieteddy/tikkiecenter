import Image from "next/image";
import { ArrowUpRight, BatteryCharging, Calculator, ClipboardList, MapPinned, Sparkles } from "lucide-react";

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
  {
    title: "EV Trip Planner",
    eyebrow: "Tikkie Travel",
    href: "https://tikkiecenter-trip.vercel.app",
    description: "วางแผนเที่ยวด้วยรถ EV คำนวณเส้นทาง แบตเตอรี่ จุดชาร์จ และสถานที่แวะระหว่างทาง",
    icon: MapPinned,
    metric: "Route / Charging / Travel",
    accent: "from-brand-cyan via-brand-400 to-brand-yellow",
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

        <section className="grid flex-1 content-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-white/10 px-3 py-2 text-xs font-bold text-brand-yellow-soft shadow-sm backdrop-blur">
              <Sparkles className="size-4 text-brand-yellow" aria-hidden="true" />
              ศูนย์รวมโปรเจคของติ๊ก
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight text-brand-yellow sm:text-5xl lg:text-6xl">
              Tikkie Center
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-brand-yellow-soft sm:text-lg">
              หน้าเดียวสำหรับเข้าใช้งานทุกโปรเจคสำคัญ เลือกการ์ดที่ต้องการ แล้วไปต่อได้ทันทีแบบเร็ว สะอาด และเป็นระเบียบ
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => {
              const Icon = project.icon;

              return (
                <a
                  key={project.title}
                  href={project.href}
                  className="group relative min-h-[20rem] overflow-hidden rounded-lg border border-white/18 bg-white/12 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur transition hover:-translate-y-1 hover:bg-white/16"
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${project.accent}`} />
                  <div className="absolute -right-16 -top-16 size-44 rounded-full border border-white/20 bg-white/10" aria-hidden="true" />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid size-14 place-items-center rounded-lg border border-brand-yellow/28 bg-brand-900/40 text-brand-yellow shadow-sm">
                        <Icon className="size-7" aria-hidden="true" />
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-brand-yellow/30 bg-brand-yellow px-3 py-1 text-xs font-black !text-brand-yellow-foreground [&_*]:!text-brand-yellow-foreground">
                        Open
                        <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="mt-6">
                      <p className="text-xs font-black uppercase text-brand-yellow-soft">{project.eyebrow}</p>
                      <h2 className="mt-2 text-2xl font-black leading-tight text-brand-yellow">{project.title}</h2>
                      <p className="mt-4 text-sm leading-7 text-brand-yellow-soft">{project.description}</p>
                    </div>

                    <div className="mt-auto pt-6">
                      <div className="rounded-lg border border-white/14 bg-brand-900/34 p-3">
                        <p className="text-xs font-semibold text-brand-yellow-soft">Project scope</p>
                        <p className="mt-1 text-sm font-black text-brand-yellow">{project.metric}</p>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <footer className="py-5 text-center text-xs font-semibold text-brand-yellow-soft">
          © 2026 TikkieTeddie Lab | V.1.0.0
        </footer>
      </div>
    </main>
  );
}
