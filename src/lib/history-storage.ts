import type { HistoryEntry } from "@/types";

const STORAGE_KEY = "netmetric-history";
const MAX_ENTRIES = 50;

/** Load all history entries from localStorage */
export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

/** Save a new entry and persist to localStorage */
export function saveEntry(entry: HistoryEntry): void {
  if (typeof window === "undefined") return;

  try {
    const history = loadHistory();
    history.unshift(entry); // newest first

    // Keep only the latest MAX_ENTRIES
    if (history.length > MAX_ENTRIES) {
      history.splice(MAX_ENTRIES);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

/** Clear all history */
export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
