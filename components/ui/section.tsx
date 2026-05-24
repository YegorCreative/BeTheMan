import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
  spacing?: "sm" | "md" | "lg";
}

const spacingMap: Record<NonNullable<SectionProps["spacing"]>, string> = {
  sm: "py-fluid-md",
  md: "py-fluid-lg",
  lg: "py-fluid-xl",
};

export function Section({
  as = "section",
  spacing = "md",
  className,
  ...props
}: SectionProps) {
  const Comp = as;

  return <Comp className={cn(spacingMap[spacing], className)} {...props} />;
}