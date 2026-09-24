import { buildInfo } from "@/generated/build-info";
import { cn } from "@/lib/utils";

type VersionFooterProps = {
  variant?: "light" | "dark";
  className?: string;
};

export function VersionFooter({ variant = "light", className }: VersionFooterProps) {
  const label = `© ${buildInfo.copyrightYears} TikkieTeddie Lab | ${buildInfo.shortVersion}`;

  return (
    <footer
      className={cn(
        "px-4 py-5 text-center text-xs font-semibold",
        variant === "dark" ? "text-brand-yellow-soft" : "text-muted-foreground",
        className,
      )}
    >
      <span
        className="group/version relative inline-flex cursor-help items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2"
        tabIndex={0}
        title={buildInfo.fullVersion}
        aria-label={`${label}; เวอร์ชันเต็ม ${buildInfo.fullVersion}`}
      >
        {label}
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-50 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-md bg-slate-950 px-3 py-2 font-mono text-[11px] font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover/version:opacity-100 group-focus-visible/version:opacity-100"
        >
          {buildInfo.fullVersion}
        </span>
      </span>
    </footer>
  );
}
