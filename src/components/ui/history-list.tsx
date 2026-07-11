"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/types";

interface HistoryListProps {
  entries: HistoryEntry[];
}

const VISIBLE_COUNT = 5;

function timeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

export function HistoryList({ entries }: HistoryListProps) {
  const [showAll, setShowAll] = useState(false);
  const display = showAll ? entries : entries.slice(0, VISIBLE_COUNT);

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

      <div
        className={`overflow-y-auto rounded-sm border border-outline-variant/10 ${
          showAll ? "max-h-96" : ""
        } lg:max-h-[32rem]`}
      >
        <div className="divide-y divide-outline-variant/5">
          {display.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between bg-surface-container-lowest/60 p-md transition-[background-color,opacity,transform] duration-200 ease-out hover:bg-surface-container-low"
              tabIndex={0}
              role="listitem"
            >
              <div className="flex items-center gap-md min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="material-symbols-outlined scale-75 text-primary-container">
                    north_east
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-mono text-[12px] font-medium uppercase leading-none tracking-widest text-primary">
                    {entry.download.toFixed(1)} Mbps
                  </p>
                  <p className="truncate font-mono text-[10px] uppercase leading-none tracking-widest text-on-surface-variant/60">
                    ↓{entry.download.toFixed(0)} ↑{entry.upload.toFixed(0)} ·{" "}
                    {entry.ping}ms · {timeAgo(entry.timestamp)}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="font-mono text-[12px] font-medium uppercase leading-none tracking-widest text-on-surface-variant">
                  {entry.server.split("//")[0]?.trim() || entry.server}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {entries.length > VISIBLE_COUNT && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-sm flex w-full cursor-pointer items-center justify-center gap-xs rounded-sm bg-surface-container-high px-base py-sm font-mono text-[11px] uppercase tracking-widest text-primary-container transition-[background-color,opacity,transform] duration-150 ease-out hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container"
        >
          <span className="material-symbols-outlined scale-75">
            {showAll ? "expand_less" : "expand_more"}
          </span>
          {showAll
            ? "Show less"
            : `View all (${entries.length})`}
        </button>
      )}
    </section>
  );
}
