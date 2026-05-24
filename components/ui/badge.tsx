import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        neutral: "bg-bg-elevated text-fg-muted border border-border",
        accent: "bg-accent/15 text-accent border border-accent/40",
        success: "bg-emerald-600/15 text-emerald-300 border border-emerald-500/40",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}