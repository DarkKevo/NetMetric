"use client";

import type { ReactNode } from "react";

interface MetricCardProps {
  icon: string;
  label: string;
  value: number | string;
  unit: string;
  /** Accessibility label for the icon */
  iconLabel?: string;
}

export function MetricCard({
  icon,
  label,
  value,
  unit,
  iconLabel,
}: MetricCardProps) {
  return (
    <div className="corner-accent relative border border-outline-variant/15 bg-surface-container/60 p-md backdrop-blur-xl transition-[background-color,opacity] duration-200 ease-out">
      <div className="mb-sm flex items-center gap-xs">
        <span
          className="material-symbols-outlined text-sm text-primary-container"
          aria-label={iconLabel ?? label}
          role="img"
        >
          {icon}
        </span>
        <span className="font-mono text-[12px] font-medium uppercase leading-none tracking-widest text-on-surface-variant">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-xs">
        <span className="font-mono text-2xl font-bold leading-none tracking-tight text-primary">
          {value}
        </span>
        <span className="font-mono text-[12px] font-medium uppercase leading-none tracking-widest text-on-surface-variant">
          {unit}
        </span>
      </div>
    </div>
  );
}
