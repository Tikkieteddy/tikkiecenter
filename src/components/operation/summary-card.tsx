import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SummaryCardProps = {
  title: ReactNode;
  value: string | number;
  helper?: ReactNode;
  icon?: ReactNode;
  tone?: "blue" | "green" | "yellow" | "red" | "slate";
};

const toneClass = {
  blue: "bg-primary !text-brand-yellow border-brand-500 shadow-sm [&_*]:!text-brand-yellow",
  green: "bg-green-50 text-green-700 border-green-100",
  yellow: "bg-amber-50 text-amber-700 border-amber-100",
  red: "bg-red-50 text-red-700 border-red-100",
  slate: "bg-slate-50 text-slate-700 border-slate-100",
};

export function SummaryCard({ title, value, helper, icon, tone = "blue" }: SummaryCardProps) {
  return (
    <Card className="border-brand-100 shadow-[0_12px_30px_rgba(23,0,199,0.08)]">
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold leading-none text-foreground">{value}</p>
          {helper ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{helper}</p> : null}
        </div>
        <div className={cn("grid size-10 shrink-0 place-items-center rounded-lg border", toneClass[tone])}>
          {icon ?? <ArrowUpRight className="size-5" aria-hidden="true" />}
        </div>
      </CardContent>
    </Card>
  );
}
