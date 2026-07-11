import type { HistoryEntry } from "@/types";

export const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: "1",
    download: 230,
    upload: 45,
    ping: 12,
    jitter: 3,
    packetLoss: 0,
    server: "LONDON // S3",
    timestamp: Date.now() - 2 * 60 * 1000,
  },
  {
    id: "2",
    download: 195,
    upload: 38,
    ping: 18,
    jitter: 5,
    packetLoss: 1,
    server: "PARIS // FR1",
    timestamp: Date.now() - 15 * 60 * 1000,
  },
  {
    id: "3",
    download: 210,
    upload: 42,
    ping: 15,
    jitter: 4,
    packetLoss: 0,
    server: "LONDON // S3",
    timestamp: Date.now() - 60 * 60 * 1000,
  },
];
