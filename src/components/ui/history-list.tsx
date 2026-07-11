"use client";

import type { HistoryEntry } from "@/types";

interface HistoryListProps {
  entries: HistoryEntry[];
}

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs === 1 ? "" : "s"} ago`;
  return `${Math.floor(diffHrs / 24)} day(s) ago`;
}

export function HistoryList({ entries }: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <section className="mb-gutter w-full max-w-4xl">
        <h2 className="mb-md inline-block border-b border-primary/20 pb-xs font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-primary">
          Recent Activity
        </h2>
        <p className="text-sm text-on-surface-variant/60">
          No tests recorded yet. Run your first speed test.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-gutter w-full max-w-4xl">
      <h2 className="mb-md inline-block border-b border-primary/20 pb-xs font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-primary">
        Recent Activity
      </h2>

      <div className="space-y-base">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between border border-outline-variant/10 bg-surface-container-lowest/60 p-md transition-[background-color,opacity,transform] duration-200 ease-out hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container"
            tabIndex={0}
            role="listitem"
          >
            <div className="flex items-center gap-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="material-symbols-outlined scale-75 text-primary-container">
                  north_east
                </span>
              </div>
              <div>
                <p className="font-mono text-[12px] font-medium uppercase leading-none tracking-widest text-primary">
                  {entry.speed} Mbps
                </p>
                <p className="font-mono text-[10px] uppercase leading-none tracking-widest text-on-surface-variant opacity-60">
                  {timeAgo(entry.timestamp)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-[12px] font-medium uppercase leading-none tracking-widest text-on-surface-variant">
                {entry.server}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
