import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  className?: string;
  theme?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "hero";
};

const sizeClasses = {
  sm: "text-[1.4rem]",
  md: "text-[1.65rem]",
  lg: "text-[1.9rem]",
  hero: "text-5xl sm:text-6xl",
};

export function BrandWordmark({ className, theme = "dark", size = "md" }: BrandWordmarkProps) {
  return (
    <span
      aria-label="ttdLab"
      className={cn("brand-wordmark inline-flex items-baseline whitespace-nowrap leading-none", sizeClasses[size], className)}
    >
      <span aria-hidden="true" className={theme === "dark" ? "text-[#F8FAFC]" : "text-[#0B0F1A]"}>
        ttd
      </span>
      <span
        aria-hidden="true"
        className="bg-[linear-gradient(90deg,#22D3EE_0%,#3B82F6_52%,#8B5CF6_100%)] bg-clip-text text-transparent"
      >
        Lab
      </span>
    </span>
  );
}
