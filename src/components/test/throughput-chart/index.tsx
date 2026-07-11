"use client";

import { useId } from "react";
import { SegmentedBar } from "./segmented-bar";

interface ThroughputChartProps {
  samples?: number[];
}

export function ThroughputChart({ samples = [] }: ThroughputChartProps) {
  const gradientId = useId();
  const hasData = samples.length > 0;

  // Build SVG polyline points from samples
  // Normalize samples to fit the SVG viewBox (0-400 x, 0-100 y, inverted)
  const maxVal = hasData ? Math.max(...samples, 1) : 1;
  const points = hasData
    ? samples
        .map((s, i) => {
          const x = (i / (samples.length - 1)) * 400;
          const y = Math.max(0, 100 - (s / maxVal) * 80); // 0-80px range, leave room at top
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ")
    : "";

  // Area path: polyline + bottom-right corner
  const areaPath = hasData
    ? `M0,100 ${points} L400,100 Z`
    : "";

  return (
    <div className="group relative overflow-hidden rounded-sm border border-outline-variant/10 bg-surface-container-low/40 p-md transition-[background-color,opacity] duration-200 ease-out">
      <div className="mb-md flex items-center justify-between">
        <h3 className="flex items-center gap-xs font-mono text-[12px] font-medium uppercase leading-none tracking-widest text-on-surface-variant">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary-container" />
          THROUGHPUT{hasData ? "" : " REALTIME"}
        </h3>

        <SegmentedBar activeCount={5} totalCount={8} />
      </div>

      <div className="relative h-32 w-full">
        <svg
          className="h-full w-full"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
          aria-label="Throughput chart"
          role="img"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {hasData ? (
            <>
              {/* Area fill */}
              <path d={areaPath} fill={`url(#${gradientId})`} />

              {/* Stroke line */}
              <polyline
                points={points}
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2"
                className="glow-cyan"
              />

              {/* Max label */}
              <text
                x="395"
                y="12"
                textAnchor="end"
                fill="#00f0ff"
                fontSize="10"
                fontFamily="monospace"
                opacity="0.6"
              >
                {maxVal.toFixed(0)} Mbps
              </text>
            </>
          ) : (
            /* Static placeholder path */
            <path
              d="M0,80 Q50,75 100,50 T200,60 T300,30 T400,20"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1"
              opacity="0.4"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
