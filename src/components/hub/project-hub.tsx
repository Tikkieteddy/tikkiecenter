import Link from "next/link";
import { Archive, ArrowLeft, ArrowRight, ArrowUpRight, BatteryCharging, BriefcaseBusiness, Calculator, ClipboardList, ListChecks, UserRound } from "lucide-react";
import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { VersionFooter } from "@/components/version-footer";
import styles from "./project-hub.module.css";

type Group = "personal" | "business";
const groups = {
  personal: { name: "Personal", description: "เครื่องมือและโปรเจกต์ส่วนตัว", icon: UserRound },
  business: { name: "Business", description: "ระบบจัดการงานและโปรเจกต์ธุรกิจ", icon: BriefcaseBusiness },
};
const projects = [
  { group: "personal", title: "ttdLab Archive", label: "Archive", description: "เข้าใช้งานเว็บ Archive ของ ttdLab", href: "https://archive.ttdlab.workers.dev/", icon: Archive },
  { group: "personal", title: "EV Charge Daily Calculator", label: "EV Power", description: "คำนวณค่าชาร์จรถ EV รายวัน รายสัปดาห์ รายเดือน และประมาณการล่วงหน้า", href: "https://evpower-beta.vercel.app/", icon: BatteryCharging },
  { group: "business", title: "ระบบติดตามคำขอภายใน", label: "Tikkie Center", description: "ส่งงาน ติดตามสถานะ ดูบันทึกอีเมล และรายงาน", href: "/requestment/login", icon: ClipboardList },
  { group: "business", title: "Requirement & Acceptance Management System", label: "Model Web Mock", description: "จัดการบรีฟ มอบหมายงาน ติดตาม UAT และตรวจรับงาน", href: "https://model-web-mock.vercel.app/", icon: ListChecks },
  { group: "personal", title: "คำนวณไทยช่วยไทย 60/40", label: "Thai Help Calculator", description: "คำนวณส่วนที่รัฐช่วย ค่าใช้จ่ายของเรา และสิทธิคงเหลือวันนี้", href: "https://thai-help-calculator.vercel.app", icon: Calculator },
];

export function ProjectHub({ group }: { group?: Group }) {
  const selected = group ? groups[group] : null;
  const visibleProjects = projects.filter((project) => project.group === group);
  return (
    <main className={styles.surface}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/home" aria-label="ttdLab Home"><BrandWordmark size="lg" /></Link>
          <span className={styles.headerLabel}>Tikkie Center</span>
        </header>
        <section className={styles.content}>
          <div className={styles.heading}>
            {group ? <Link href="/home" className={styles.back}><ArrowLeft size={16} aria-hidden="true" /> ทุกโปรเจกต์</Link> : <p className={styles.eyebrow}>YOUR PROJECT SPACE</p>}
            <h1>{selected?.name ?? "Tikkie Center"}</h1>
            <p className={styles.subtitle}>{selected?.description ?? "พื้นที่รวมโปรเจกต์ของติ๊ก ทั้งเรื่องส่วนตัวและงานธุรกิจ"}</p>
          </div>
          {!group ? (
            <div className={styles.categories}>
              {(Object.keys(groups) as Group[]).map((key) => {
                const item = groups[key];
                const Icon = item.icon;
                return (
                  <Link key={key} href={`/home/${key}`} className={`${styles.category} ${styles[key]}`}>
                    <span className={styles.categoryIcon}><Icon size={30} strokeWidth={1.6} aria-hidden="true" /></span>
                    <h2>{item.name}</h2><p>{item.description}</p>
                    <span className={styles.count}>{projects.filter((project) => project.group === key).length} โปรเจกต์ <ArrowRight size={16} aria-hidden="true" /></span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className={styles.groupContent}>
              <nav className={styles.switcher} aria-label="กลุ่มโปรเจกต์">
                {(Object.keys(groups) as Group[]).map((key) => <Link key={key} href={`/home/${key}`} aria-current={key === group ? "page" : undefined}>{groups[key].name}</Link>)}
              </nav>
              <ul className={styles.projects}>
                {visibleProjects.map((project) => {
                  const Icon = project.icon;
                  return (
                    <li key={project.href}>
                      <a href={project.href} className={`${styles.project} ${styles[group]}`}>
                        <span className={styles.projectIcon}><Icon size={24} strokeWidth={1.7} aria-hidden="true" /></span>
                        <div className={styles.projectCopy}>
                          <span className={styles.eyebrow}>{project.label}</span><h2>{project.title}</h2><p>{project.description}</p>
                        </div>
                        <span className={styles.open}><ArrowUpRight size={20} aria-hidden="true" /></span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <p className={styles.total}>{visibleProjects.length} โปรเจกต์ใน {selected?.name}</p>
            </div>
          )}
        </section>
        <VersionFooter variant="dark" className="py-5" />
      </div>
    </main>
  );
}
