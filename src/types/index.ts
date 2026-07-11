export interface MetricData {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  packetLoss: number;
}

export interface HistoryEntry {
  id: string;
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  packetLoss: number;
  server: string;
  timestamp: number;
}

export type TestStatus = "idle" | "testing" | "results";

export type TestPhase = "idle" | "ping" | "download" | "upload" | "packet-loss" | "results";
