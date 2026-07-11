"use client";

interface SegmentedBarProps {
  activeCount: number;
  totalCount: number;
}

export function SegmentedBar({ activeCount, totalCount }: SegmentedBarProps) {
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: totalCount }).map((_, i) => (
        <span
          key={`seg-${i}`}
          className={`inline-block h-3 w-1 ${
            i < activeCount
              ? "bg-primary-container opacity-100 shadow-[0_0_8px_rgba(0,240,255,0.5)]"
              : "bg-primary-container opacity-30"
          }`}
        />
      ))}
    </div>
  );
}
