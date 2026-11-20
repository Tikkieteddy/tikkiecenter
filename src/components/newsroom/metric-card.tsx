import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = "default",
}: {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "default" | "brand" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    default: "bg-slate-100 text-slate-700",
    brand: "bg-[#FFF3ED] text-[#EC5F27]",
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
  }[tone];

  return (
    <Card className="p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-normal text-foreground">{value}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
        </div>
        <div className={cn("grid size-10 shrink-0 place-items-center rounded-lg", toneClass)}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}
