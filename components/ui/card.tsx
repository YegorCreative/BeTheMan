import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/90 bg-bg-surface/80 p-fluid-md shadow-card backdrop-blur",
        interactive &&
          "transition-transform duration-300 hover:-translate-y-1 hover:border-accent/40",
        className,
      )}
      {...props}
    />
  );
}