import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary !text-brand-yellow [&_*]:!text-brand-yellow",
        secondary: "border-border bg-muted text-foreground",
        success: "border-green-200 bg-green-50 text-green-700",
        warning: "border-brand-yellow/70 bg-brand-yellow/80 !text-brand-yellow-foreground [&_*]:!text-brand-yellow-foreground",
        danger: "border-red-200 bg-red-50 text-red-700",
        blue: "border-brand-500 bg-primary !text-brand-yellow shadow-sm [&_*]:!text-brand-yellow",
        slate: "border-slate-200 bg-slate-50 text-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
