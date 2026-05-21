"use client";

import { Activity, AlertTriangle, FolderKanban, Gauge } from "lucide-react";

type StatCardsProps = {
  total: number;
  inProgress: number;
  delayed: number;
  averageProgress: number;
};

const cards = [
  {
    key: "total",
    title: "โปรเจกต์ทั้งหมด",
    icon: FolderKanban,
    tone: "blue",
  },
  {
    key: "inProgress",
    title: "กำลังทำ",
    icon: Activity,
    tone: "green",
  },
  {
    key: "delayed",
    title: "มีดีเลย์",
    icon: AlertTriangle,
    tone: "red",
  },
  {
    key: "averageProgress",
    title: "ความคืบหน้าเฉลี่ย",
    icon: Gauge,
    tone: "amber",
  },
] as const;

const toneStyles = {
  blue: "bg-[#E6F1FB] text-[#185FA5]",
  green: "bg-[#E1F5EE] text-[#0F6E56]",
  red: "bg-[#FCEBEB] text-[#A32D2D]",
  amber: "bg-[#FAEEDA] text-[#633806]",
};

export function StatCards({ total, inProgress, delayed, averageProgress }: StatCardsProps) {
  const values = {
    total,
    inProgress,
    delayed,
    averageProgress: `${averageProgress}%`,
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div key={card.key} className="rounded-2xl border border-[#E8E6DE] bg-white p-4 shadow-[0_16px_40px_rgba(24,95,165,0.08)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-500">{card.title}</p>
                <p className="mt-2 text-3xl font-black tracking-normal text-slate-950">{values[card.key]}</p>
              </div>
              <span className={`grid size-11 place-items-center rounded-2xl ${toneStyles[card.tone]}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
