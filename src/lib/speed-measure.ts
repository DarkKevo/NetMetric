/**
 * Pure calculation functions for speed test metrics.
 */

/** Convert bytes + elapsed ms to Mbps */
export function calculateMbps(bytes: number, ms: number): number {
  if (ms <= 0) return 0;
  return (bytes * 8) / ms / 1000;
}

/** Median of a number array (discards outliers) */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/** Jitter = mean of successive differences between pings */
export function calculateJitter(pings: number[]): number {
  if (pings.length < 2) return 0;
  let totalDiff = 0;
  for (let i = 1; i < pings.length; i++) {
    totalDiff += Math.abs(pings[i] - pings[i - 1]);
  }
  return totalDiff / (pings.length - 1);
}

/** Packet loss % */
export function calculatePacketLoss(
  total: number,
  timeouts: number,
): number {
  if (total <= 0) return 0;
  return Number.parseFloat(((timeouts / total) * 100).toFixed(1));
}
