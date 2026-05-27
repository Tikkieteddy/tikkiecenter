"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  CalendarDays,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LanguageProvider, LanguageToggle, Trans } from "@/components/operation/language-provider";

const navItems = [
  { href: "/dashboard", label: { en: "Dashboard", th: "แดชบอร์ด" }, icon: LayoutDashboard },
  { href: "/requests/new", label: { en: "Create Request", th: "สร้างคำขอ" }, icon: FilePlus2 },
  { href: "/my-requests", label: { en: "My Requests", th: "คำขอของฉัน" }, icon: ClipboardList },
  { href: "/requests", label: { en: "All Requests", th: "คำขอทั้งหมด" }, icon: ClipboardList },
  { href: "/timeline", label: { en: "Timeline", th: "ไทม์ไลน์" }, icon: CalendarDays },
  { href: "/reports", label: { en: "Reports", th: "รายงาน" }, icon: BarChart3 },
  { href: "/notifications", label: { en: "Notifications", th: "บันทึกอีเมล" }, icon: Bell },
  { href: "/users", label: { en: "User Management", th: "จัดการผู้ใช้" }, icon: Users },
  { href: "/settings", label: { en: "Settings", th: "ตั้งค่า" }, icon: Settings },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/requests") {
    return pathname === "/requests" || pathname.startsWith("/requests/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AppFrameContent>{children}</AppFrameContent>
    </LanguageProvider>
  );
}

function AppFrameContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLogin = pathname === "/login";
  const isProjectHub = pathname === "/home" || pathname === "/tikkiecenter/home";

  if (isProjectHub) {
    return <>{children}</>;
  }

  if (isLogin) {
    return (
      <div className="min-h-screen bg-brand-900">
        {children}
        <AppFooter variant="dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17rem] border-r border-border bg-white/92 px-4 py-4 shadow-sm backdrop-blur lg:block">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg bg-[linear-gradient(135deg,#070044_0%,#1700c7_64%,#00a5ff_100%)] p-3 text-brand-yellow shadow-sm [&_*]:text-brand-yellow"
        >
          <div className="grid size-10 place-items-center overflow-hidden rounded-lg bg-white shadow-sm">
            <Image
              src="/tikkie-project-logo.jpg"
              alt="Tikkie Project Operation Center"
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold">Tikkie Project</p>
            <p className="truncate text-xs font-semibold text-brand-yellow-soft">
              <Trans en="Operation Center" th="ศูนย์ปฏิบัติการ" />
            </p>
          </div>
        </Link>

        <div className="mt-4 rounded-lg border border-brand-100 bg-white p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-foreground">Tikkie Admin</p>
              <p className="text-xs text-muted-foreground">
                <Trans en="Digital Media & AI" th="ทีมดิจิทัลมีเดียและ AI" />
              </p>
            </div>
            <Badge variant="blue">
              <Trans en="Phase 1" th="เฟส 1" />
            </Badge>
          </div>
        </div>

        <div className="mt-3">
          <LanguageToggle />
        </div>

        <nav className="mt-4 grid gap-1" aria-label="Desktop navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700",
                  active && "bg-primary !text-brand-yellow shadow-sm hover:bg-primary hover:!text-brand-yellow [&_*]:!text-brand-yellow",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>
                  <Trans en={item.label.en} th={item.label.th} />
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-4 bottom-4 rounded-lg border border-border bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">
            <Trans en="Integration status" th="สถานะการเชื่อมต่อ" />
          </p>
          <div className="mt-2 grid gap-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span>
                <Trans en="Email notification" th="แจ้งเตือนทางอีเมล" />
              </span>
              <Badge variant="success">
                <Trans en="Active" th="เปิดใช้งาน" />
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span>n8n / LINE OA</span>
              <Badge variant="slate">
                <Trans en="Prepared" th="เตรียมไว้" />
              </Badge>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-border bg-white/92 backdrop-blur lg:hidden">
        <div className="flex min-h-16 items-center justify-between gap-3 px-4">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
            <div className="grid size-9 place-items-center overflow-hidden rounded-lg bg-white shadow-sm">
              <Image
                src="/tikkie-project-logo.jpg"
                alt="Tikkie Project Operation Center"
                width={36}
                height={36}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">Tikkie Project</p>
              <p className="truncate text-xs text-brand-700">
                <Trans en="Operation Center" th="ศูนย์ปฏิบัติการ" />
              </p>
            </div>
          </Link>
          <div className="ml-auto">
            <LanguageToggle compact />
          </div>
          <Button
            aria-label="Open menu"
            size="icon"
            type="button"
            variant="outline"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/45 p-3 lg:hidden">
          <div className="ml-auto grid max-h-[calc(100vh-1.5rem)] w-full max-w-sm gap-4 overflow-auto rounded-lg bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-foreground">
                  <Trans en="Menu" th="เมนู" />
                </p>
                <p className="text-sm text-muted-foreground">
                  <Trans en="Navigate operation center" th="นำทางในศูนย์ปฏิบัติการ" />
                </p>
              </div>
              <Button aria-label="Close menu" size="icon" type="button" variant="ghost" onClick={() => setMobileMenuOpen(false)}>
                <X aria-hidden="true" />
              </Button>
            </div>
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700",
                      active && "bg-primary !text-brand-yellow hover:bg-primary hover:!text-brand-yellow [&_*]:!text-brand-yellow",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    <Trans en={item.label.en} th={item.label.th} />
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-11 items-center gap-3 rounded-lg border border-border px-3 text-sm font-semibold text-slate-600"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <Trans en="Switch role" th="เปลี่ยนบทบาท" />
            </Link>
          </div>
        </div>
      ) : null}

      <main className="min-h-screen pb-10 lg:pl-[17rem]">
        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-5 lg:px-6">{children}</div>
        <AppFooter />
      </main>
    </div>
  );
}

function AppFooter({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <footer
      className={
        variant === "dark"
          ? "px-4 py-5 text-center text-xs font-semibold text-brand-yellow-soft"
          : "px-4 py-5 text-center text-xs font-semibold text-muted-foreground"
      }
    >
      © 2026 TikkieTeddie Lab | V.1.0.0
    </footer>
  );
}
