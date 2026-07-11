import type { HistoryEntry } from "@/types";

export const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: "1",
    speed: 230,
    server: "LONDON // S3",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "2",
    speed: 195,
    server: "PARIS // FR1",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "3",
    speed: 210,
    server: "LONDON // S3",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
];
