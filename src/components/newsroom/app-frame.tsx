"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
  Database,
  FileClock,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Moon,
  ShieldAlert,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MobileNotificationControl } from "@/components/newsroom/mobile-notification-control";

const NEWSROOM_BASE_PATH = "/NewsroomEditors";

const navItems = [
  { href: "/review-chat", label: "แชทตรวจข่าว", icon: MessageSquareText },
  { href: "/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/screening", label: "ตรวจความเสี่ยง", icon: BrainCircuit },
  { href: "/risk-database", label: "ฐานข้อมูลความเสี่ยง", icon: Database },
  { href: "/library", label: "คลังความรู้", icon: BookOpen },
  { href: "/approvals", label: "คิวอนุมัติ", icon: ClipboardCheck },
  { href: "/reports", label: "รายงานการใช้งาน", icon: BarChart3 },
  { href: "/audit-log", label: "Audit Log", icon: FileClock },
  { href: "/admin", label: "ผู้ดูแลระบบ", icon: Settings },
];

function isActivePath(pathname: string, href: string) {
  const fullHref = `${NEWSROOM_BASE_PATH}${href}`;
  if (href === "/dashboard") return pathname === NEWSROOM_BASE_PATH || pathname === fullHref;
  return pathname === fullHref || pathname.startsWith(`${fullHref}/`);
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isStandalonePage = pathname === `${NEWSROOM_BASE_PATH}/login`;

  if (isStandalonePage) {
    return <>{children}</>;
  }

  return (
    <div className="newsroom-theme min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17.5rem] flex-col border-r border-border bg-white/82 px-4 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex">
        <Link href={`${NEWSROOM_BASE_PATH}/dashboard`} className="flex items-center gap-3 rounded-lg bg-[#0F172A] p-3 text-white shadow-sm">
          <div className="grid size-10 place-items-center rounded-lg bg-[#EC5F27] text-white">
            <ShieldAlert className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">News Risk Monitor</p>
            <p className="truncate text-xs text-orange-100">AI Editorial Risk Screening</p>
          </div>
        </Link>

        <div className="mt-4 rounded-lg border border-orange-100 bg-[#FFF3ED] p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#111827]">Editorial Risk Desk</p>
              <p className="mt-1 text-xs leading-5 text-[#6B7280]">โหมดบรรณาธิการ: ตรวจเร็ว มีเหตุผล ตรวจสอบย้อนหลังได้</p>
            </div>
            <Badge className="border-orange-200 bg-white text-[#EC5F27]">สด</Badge>
          </div>
        </div>

        <nav className="newsroom-scrollbar mt-4 grid min-h-0 flex-1 content-start gap-1 overflow-y-auto pr-1" aria-label="Desktop navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={`${NEWSROOM_BASE_PATH}${item.href}`}
                className={cn(
                  "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-[#EC5F27]",
                  active && "bg-[#EC5F27] text-white shadow-sm hover:bg-[#EC5F27] hover:text-white [&_*]:text-white",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 grid shrink-0 gap-3">
          <MobileNotificationControl />
          <div className="rounded-lg border border-border bg-white/78 p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-slate-500">สถานะระบบ</p>
              <Moon className="size-4 text-slate-400" aria-hidden="true" />
            </div>
            <div className="mt-2 grid gap-2 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-2">
                <span>OpenAI API</span>
                <Badge variant="warning">พร้อมต่อ</Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>PostgreSQL / Prisma</span>
                <Badge variant="success">พร้อมใช้</Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>RAG / Vector</span>
                <Badge variant="slate">เตรียมโครงสร้าง</Badge>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-border bg-white/88 backdrop-blur-xl lg:hidden">
        <div className="flex min-h-16 items-center justify-between gap-3 px-4">
          <Link href={`${NEWSROOM_BASE_PATH}/dashboard`} className="flex min-w-0 items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-[#EC5F27] text-white">
              <ShieldAlert className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">News Risk Monitor</p>
              <p className="truncate text-xs text-muted-foreground">ระบบ AI สำหรับกองบรรณาธิการ</p>
            </div>
          </Link>
          <Button aria-label="เปิดเมนู" size="icon" type="button" variant="outline" onClick={() => setMobileMenuOpen(true)}>
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/45 p-3 lg:hidden">
          <div className="ml-auto grid max-h-[calc(100vh-1.5rem)] w-full max-w-sm gap-4 overflow-auto rounded-lg bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-foreground">เมนูห้องข่าว</p>
                <p className="text-sm text-muted-foreground">เลือก workflow ที่ต้องการใช้งาน</p>
              </div>
              <Button aria-label="ปิดเมนู" size="icon" type="button" variant="ghost" onClick={() => setMobileMenuOpen(false)}>
                <X aria-hidden="true" />
              </Button>
            </div>
            <MobileNotificationControl />
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={`${NEWSROOM_BASE_PATH}${item.href}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-[#EC5F27]",
                      active && "bg-[#EC5F27] text-white hover:bg-[#EC5F27] hover:text-white [&_*]:text-white",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              href={`${NEWSROOM_BASE_PATH}/login`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-11 items-center gap-3 rounded-lg border border-border px-3 text-sm font-semibold text-slate-600"
            >
              <LogOut className="size-4" aria-hidden="true" />
              เข้าสู่ระบบใหม่
            </Link>
          </div>
        </div>
      ) : null}

      <main className="min-h-screen pb-10 lg:pl-[17.5rem]">
        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-5 lg:px-6">{children}</div>
        <footer className="px-4 py-5 text-center text-xs font-semibold text-muted-foreground lg:pl-[17.5rem]">
          News Risk Monitor © 2026 | AI-assisted screening, not legal judgment
        </footer>
      </main>
    </div>
  );
}
