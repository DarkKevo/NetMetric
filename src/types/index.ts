export interface MetricData {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  packetLoss: number;
}

export interface HistoryEntry {
  id: string;
  speed: number;
  server: string;
  timestamp: Date;
}

export type TestStatus = "idle" | "testing" | "results";

export type TestPhase = "idle" | "ping" | "download" | "upload" | "packet-loss" | "results";
