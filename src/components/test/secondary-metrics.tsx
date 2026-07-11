"use client";

import type { MetricData } from "@/types";
import { MetricCard } from "@/components/ui/metric-card";
import { METRIC_CARDS } from "@/mocks";

interface SecondaryMetricsProps {
  metrics: MetricData | null;
}

export function SecondaryMetrics({ metrics }: SecondaryMetricsProps) {
  return (
    <div className="mb-xl grid w-full max-w-4xl animate-fade-in grid-cols-1 gap-md md:grid-cols-3 [animation-delay:300ms]">
      {METRIC_CARDS.map((card) => (
        <MetricCard
          key={card.field}
          icon={card.icon}
          iconLabel={card.iconLabel}
          label={card.label}
          value={metrics ? String(metrics[card.field]) : "0"}
          unit={card.unit}
        />
      ))}
    </div>
  );
}
