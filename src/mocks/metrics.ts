import type { MetricData } from "@/types";

export const MOCK_METRICS: MetricData = {
  download: 245.8,
  upload: 45.2,
  ping: 23,
  jitter: 5,
  packetLoss: 0,
};

export interface MetricCardConfig {
  icon: string;
  iconLabel: string;
  label: string;
  field: keyof MetricData;
  unit: string;
}

export const METRIC_CARDS: MetricCardConfig[] = [
  {
    icon: "compare_arrows",
    iconLabel: "Ping",
    label: "PING",
    field: "ping",
    unit: "ms",
  },
  {
    icon: "equalizer",
    iconLabel: "Jitter",
    label: "JITTER",
    field: "jitter",
    unit: "ms",
  },
];
