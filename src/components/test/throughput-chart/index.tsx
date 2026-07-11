"use client";

import { useId } from "react";
import type { HistoryEntry } from "@/types";

interface ThroughputChartProps {
  entries: HistoryEntry[];
}

export function ThroughputChart({ entries }: ThroughputChartProps) {
  const gradientId = useId();

  if (entries.length === 0) {
    return (
      <div className="mb-xl group relative overflow-hidden rounded-sm border border-outline-variant/10 bg-surface-container-low/40 p-md">
        <div className="flex h-32 items-center justify-center">
          <p className="font-mono text-[11px] uppercase tracking-widest text-on-surface-variant/40">
            Run tests to see your speed trend
          </p>
        </div>
      </div>
    );
  }

  // Take last 20 entries for a clean chart, sorted oldest → newest
  const sorted = [...entries]
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-20);

  const downloadSpeeds = sorted.map((e) => e.download);
  const uploadSpeeds = sorted.map((e) => e.upload);
  const allSpeeds = [...downloadSpeeds, ...uploadSpeeds];
  const maxSpeed = Math.max(...allSpeeds, 1);

  // Dimensions in viewBox
  const w = 500;
  const h = 120;
  const padL = 50;
  const padR = 20;
  const padT = 15;
  const padB = 25;
  const graphW = w - padL - padR;
  const graphH = h - padT - padB;

  const mapY = (v: number) =>
    padT + graphH - (v / maxSpeed) * graphH;
  const mapX = (i: number) =>
    i === 0
      ? padL
      : padL + (i / (sorted.length - 1)) * graphW;

  // Build download polyline
  const dlPoints = sorted
    .map((e, i) => `${mapX(i).toFixed(1)},${mapY(e.download).toFixed(1)}`)
    .join(" ");
  const dlArea = `M${mapX(0).toFixed(1)},${(padT + graphH).toFixed(1)} ${dlPoints} L${mapX(sorted.length - 1).toFixed(1)},${(padT + graphH).toFixed(1)} Z`;

  // Build upload polyline
  const ulPoints = sorted
    .map((e, i) => `${mapX(i).toFixed(1)},${mapY(e.upload).toFixed(1)}`)
    .join(" ");

  // Trend calculation: linear regression on download speeds
  const n = sorted.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  const meanX = indices.reduce((a, b) => a + b, 0) / n;
  const meanY = downloadSpeeds.reduce((a, b) => a + b, 0) / n;
  const slope =
    indices.reduce((sum, x, i) => sum + (x - meanX) * (downloadSpeeds[i] - meanY), 0) /
    indices.reduce((sum, x) => sum + (x - meanX) ** 2, 0);

  const trendLabel =
    Math.abs(slope) < 0.5
      ? "STABLE"
      : slope > 0
        ? "IMPROVING"
        : "DECLINING";
  const trendColor =
    trendLabel === "STABLE"
      ? "#00f0ff"
      : trendLabel === "IMPROVING"
        ? "#00ff88"
        : "#ff4466";

  // Axis labels — show first, middle, last dates
  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };
  const labelIndices = [
    0,
    ...(n > 2 ? [Math.floor((n - 1) / 2)] : []),
    n - 1,
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="mt-20 mb-xl group relative overflow-hidden rounded-sm border border-outline-variant/10 bg-surface-container-low/40 p-md transition-[background-color,opacity] duration-200 ease-out">
      <div className="mb-md flex items-center justify-between">
        <h3 className="flex items-center gap-xs font-mono text-[12px] font-medium uppercase leading-none tracking-widest text-on-surface-variant">
          <span className="inline-block h-2 w-2 rounded-full bg-primary-container" />
          SPEED TREND
        </h3>

        <span
          className="font-mono text-[11px] font-medium uppercase tracking-wider"
          style={{ color: trendColor }}
        >
          {trendLabel}
        </span>
      </div>

      <div className="relative h-32 w-full">
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          aria-label="Speed trend chart"
          role="img"
        >
          <defs>
            <linearGradient id={`dl-${gradientId}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`ul-${gradientId}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines at 25%, 50%, 75% */}
          {[25, 50, 75].map((pct) => {
            const y = padT + graphH - (pct / 100) * graphH;
            return (
              <g key={pct}>
                <line
                  x1={padL}
                  y1={y}
                  x2={w - padR}
                  y2={y}
                  stroke="#00f0ff"
                  strokeOpacity="0.06"
                  strokeWidth="1"
                />
                <text
                  x={padL - 4}
                  y={y + 3}
                  textAnchor="end"
                  fill="#00f0ff"
                  fontSize="8"
                  fontFamily="monospace"
                  opacity="0.4"
                >
                  {Math.round(maxSpeed * (pct / 100))}
                </text>
              </g>
            );
          })}

          {/* Download area */}
          <path d={dlArea} fill={`url(#dl-${gradientId})`} />

          {/* Download line */}
          <polyline
            points={dlPoints}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="glow-cyan"
          />

          {/* Upload line */}
          <polyline
            points={ulPoints}
            fill="none"
            stroke="#00ff88"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 3"
            opacity="0.7"
          />

          {/* Download dots */}
          {sorted.map((e, i) => (
            <circle
              key={e.id}
              cx={mapX(i)}
              cy={mapY(e.download)}
              r="2.5"
              fill="#00f0ff"
              className="glow-cyan"
            />
          ))}

          {/* X-axis date labels */}
          {labelIndices.map((i) => (
            <text
              key={i}
              x={mapX(i)}
              y={h - 4}
              textAnchor="middle"
              fill="#00f0ff"
              fontSize="7"
              fontFamily="monospace"
              opacity="0.4"
            >
              {formatDate(sorted[i].timestamp)}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-xs flex items-center gap-md font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/40">
        <span className="flex items-center gap-xs">
          <span className="inline-block h-2 w-3 rounded-sm bg-[#00f0ff]" />
          Download
        </span>
        <span className="flex items-center gap-xs">
          <span className="inline-block h-0.5 w-3 border-t border-dashed border-[#00ff88]" />
          Upload
        </span>
        <span className="ml-auto">
          Last {sorted.length} tests
        </span>
      </div>
    </div>
  );
}
