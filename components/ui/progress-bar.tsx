"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  className,
}: ProgressBarProps) {
  const normalized = Math.max(0, Math.min(value, max));
  const percentage = (normalized / max) * 100;

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-xs text-fg-muted">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      ) : null}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-bg-elevated">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent/80 to-accent shadow-glow"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}