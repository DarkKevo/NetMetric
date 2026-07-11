"use client";

import { useId } from "react";
import { SegmentedBar } from "./segmented-bar";

interface ThroughputChartProps {
  samples?: number[];
}

const MAX_POINTS = 50; // Max samples shown in viewport

export function ThroughputChart({ samples = [] }: ThroughputChartProps) {
  const gradientId = useId();
  const hasData = samples.length > 0;

  // Safety: handle edge cases
  const safeSamples = hasData && samples.length >= 2 ? samples : [];
  const maxVal = safeSamples.length > 0
    ? Math.max(...safeSamples, 1)
    : 1;

  // Build polyline points
  const points = safeSamples
    .map((s, i) => {
      const x = (i / (safeSamples.length - 1)) * 400;
      const y = Math.max(0, 100 - (s / maxVal) * 80);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPath = points ? `M0,100 ${points} L400,100 Z` : "";
  const latestSpeed = hasData ? samples[samples.length - 1] : 0;
  const avgSpeed = hasData
    ? samples.reduce((a, b) => a + b, 0) / samples.length
    : 0;

  // Grid lines at 25%, 50%, 75% of max
  const gridLines = [25, 50, 75];

  return (
    <div className="group relative overflow-hidden rounded-sm border border-outline-variant/10 bg-surface-container-low/40 p-md transition-[background-color,opacity] duration-200 ease-out">
      <div className="mb-md flex items-center justify-between">
        <h3 className="flex items-center gap-xs font-mono text-[12px] font-medium uppercase leading-none tracking-widest text-on-surface-variant">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              hasData
                ? "animate-pulse bg-primary-container"
                : "bg-outline-variant/40"
            }`}
          />
          {hasData ? "THROUGHPUT" : "THROUGHPUT — LIVE"}
        </h3>

        <div className="flex items-center gap-sm">
          {hasData && (
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-primary-container">
              {avgSpeed.toFixed(0)} avg
            </span>
          )}
          <SegmentedBar
            activeCount={hasData ? Math.min(samples.length, 8) : 0}
            totalCount={8}
          />
        </div>
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

          {/* Grid lines */}
          {gridLines.map((pct) => {
            const y = 100 - (pct / 100) * 80;
            return (
              <g key={pct}>
                <line
                  x1="0"
                  y1={y}
                  x2="400"
                  y2={y}
                  stroke="#00f0ff"
                  strokeOpacity="0.08"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y={y - 2}
                  fill="#00f0ff"
                  fontSize="7"
                  fontFamily="monospace"
                  opacity="0.3"
                >
                  {(maxVal * (pct / 100)).toFixed(0)}
                </text>
              </g>
            );
          })}

          {areaPath ? (
            <>
              {/* Area fill */}
              <path
                d={areaPath}
                fill={`url(#${gradientId})`}
                className="transition-all duration-300 ease-out"
              />

              {/* Stroke line */}
              <polyline
                points={points}
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 ease-out glow-cyan"
              />

              {/* Latest sample dot */}
              <circle
                cx={400}
                cy={Math.max(0, 100 - (latestSpeed / maxVal) * 80)}
                r="3"
                fill="#00f0ff"
                className="animate-pulse"
              />

              {/* Max label */}
              <text
                x="395"
                y="10"
                textAnchor="end"
                fill="#00f0ff"
                fontSize="9"
                fontFamily="monospace"
                opacity="0.6"
              >
                {maxVal.toFixed(0)} Mbps
              </text>
            </>
          ) : (
            /* Animated placeholder */
            <>
              <path
                d="M0,80 Q50,75 100,50 T200,60 T300,30 T400,20"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="1"
                opacity="0.2"
                className="animate-pulse"
              />
              <text
                x="200"
                y="55"
                textAnchor="middle"
                fill="#00f0ff"
                fontSize="10"
                fontFamily="monospace"
                opacity="0.3"
              >
                AWAITING DATA
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Bottom legend */}
      <div className="mt-xs flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/40">
        <span>
          {hasData ? `${samples.length} samples` : "—"}
        </span>
        <span>
          {hasData ? `${(avgSpeed).toFixed(1)} Mbps avg` : "idle"}
        </span>
      </div>
    </div>
  );
}
