"use client";

import type { MetricData } from "@/types";
import { MetricCard } from "@/components/ui/metric-card";
import { METRIC_CARDS } from "@/mocks";

interface SecondaryMetricsProps {
  metrics: MetricData | null;
}

function formatValue(v: number): string {
  // Max 2 decimales, sin trailing zeros
  return String(Number(v.toFixed(2)));
}

export function SecondaryMetrics({ metrics }: SecondaryMetricsProps) {
  return (
    <div className="mb-xl grid w-full max-w-4xl animate-fade-in grid-cols-2 gap-md [animation-delay:300ms]">
      {METRIC_CARDS.map((card) => (
        <MetricCard
          key={card.field}
          icon={card.icon}
          iconLabel={card.iconLabel}
          label={card.label}
          value={metrics ? formatValue(metrics[card.field]) : "0"}
          unit={card.unit}
        />
      ))}
    </div>
  );
}
