"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle, Trans } from "@/components/operation/language-provider";

const loginHighlights = [
  { label: { en: "Email updates", th: "อัปเดตทางอีเมล" }, icon: Mail },
  { label: { en: "Role-based views", th: "มุมมองตามบทบาท" }, icon: ShieldCheck },
  { label: { en: "Reports ready", th: "รายงานพร้อมใช้" }, icon: CheckCircle2 },
];

const FIRST_ADMIN_EMAIL = "tkkithman@gmail.com";
const FIRST_ADMIN_PASSWORD_HASH = "c60be24741bd0a49ad74a6fac57d545b0326fbaa490eb280eb504a7da4faf655";

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(FIRST_ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const passwordHash = await hashPassword(password);
    const isFirstAdmin = email.trim().toLowerCase() === FIRST_ADMIN_EMAIL && role === "Admin" && passwordHash === FIRST_ADMIN_PASSWORD_HASH;

    if (!isFirstAdmin) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    window.localStorage.setItem(
      "tikkie-ops-session",
      JSON.stringify({
        email: FIRST_ADMIN_EMAIL,
        role: "Admin",
        loginAt: new Date().toISOString(),
      }),
    );
    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-[calc(100vh-3.25rem)] place-items-center bg-[radial-gradient(circle_at_0%_16%,rgba(0,165,255,0.36),transparent_28%),radial-gradient(circle_at_24%_0%,rgba(62,109,255,0.35),transparent_32%),linear-gradient(150deg,#070044_0%,#10006f_38%,#1700c7_66%,#00a5ff_100%)] p-4">
      <div className="grid w-full max-w-5xl gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="grid gap-5">
          <div className="relative h-36 w-full max-w-sm overflow-hidden rounded-lg border border-white/14 bg-white shadow-[0_24px_80px_rgba(0,165,255,0.2)] sm:h-40">
            <Image
              src="/tikkie-project-logo.jpg"
              alt="Tikkie Project Operation Center"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 100vw, 384px"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="blue" className="w-fit border-white/20 bg-white/10 !text-brand-yellow [&_*]:!text-brand-yellow">
              <Trans en="Phase 1 - Email notification only" th="เฟส 1 - แจ้งเตือนทางอีเมลเท่านั้น" />
            </Badge>
            <LanguageToggle />
          </div>
          <div className="grid gap-3">
            <h1 className="text-4xl font-bold leading-tight text-brand-yellow sm:text-5xl">
              Tikkie Project Operation Center
            </h1>
            <p className="max-w-2xl text-base leading-7 text-brand-yellow-soft">
              <Trans
                en="Internal request tracking for submitted work, status updates, email logs, and compact reports."
                th="ระบบติดตามคำขอภายใน สำหรับส่งงาน ติดตามสถานะ ดูบันทึกอีเมล และรายงานแบบกระชับ"
              />
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {loginHighlights.map(({ label, icon: Icon }) => (
              <div
                key={label.en}
                className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/12 p-3 shadow-sm backdrop-blur"
              >
                <Icon className="size-5 text-brand-cyan" aria-hidden="true" />
                <span className="text-sm font-semibold text-brand-yellow">
                  <Trans en={label.en} th={label.th} />
                </span>
              </div>
            ))}
          </div>
        </section>

        <Card className="border-white/20 shadow-[0_24px_80px_rgba(7,0,68,0.36)]">
          <CardHeader>
            <CardTitle>
              <Trans en="Demo access" th="เข้าสู่ระบบตัวอย่าง" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="email">
                <Trans en="Email" th="อีเมล" />
              </label>
              <input
                id="email"
                type="email"
                className="h-11 rounded-lg border border-input bg-white px-3 text-sm shadow-sm"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="password">
                <Trans en="Password" th="รหัสผ่าน" />
              </label>
              <input
                id="password"
                type="password"
                className="h-11 rounded-lg border border-input bg-white px-3 text-sm shadow-sm"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="role">
                <Trans en="Role" th="บทบาท" />
              </label>
              <select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
                <option>Admin</option>
                <option>Tikkie / Assignee</option>
                <option>Requester</option>
                <option>Viewer</option>
              </select>
            </div>
            {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
            <button type="submit" className={buttonVariants({ size: "lg" })}>
              <Trans en="Enter operation center" th="เข้าสู่ศูนย์ปฏิบัติการ" />
              <ArrowRight aria-hidden="true" />
            </button>
            <p className="rounded-lg border border-brand-500 bg-primary p-3 text-sm leading-6 !text-brand-yellow [&_*]:!text-brand-yellow">
              <Trans
                en="This Phase 1 login validates the first Admin with a local mock check. Real authentication and database sessions can be connected later."
                th="Login เฟส 1 นี้ตรวจ Admin คนแรกด้วย mock check ในเครื่องก่อน ระบบยืนยันตัวตนและ session จากฐานข้อมูลจริงสามารถเชื่อมต่อภายหลังได้"
              />
            </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
