import { useId } from "react";

interface ThroughputGraphProps {
  className?: string;
}

export function ThroughputGraph({ className = "" }: ThroughputGraphProps) {
  const gradientId = useId();

  return (
    <svg
      className={`h-full w-full ${className}`}
      viewBox="0 0 400 100"
      preserveAspectRatio="none"
      aria-label="Throughput chart showing download and upload speed over time"
      role="img"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d="M0,80 Q50,75 100,50 T200,60 T300,30 T400,20 L400,100 L0,100 Z"
        fill={`url(#${gradientId})`}
      />

      {/* Stroke line */}
      <path
        d="M0,80 Q50,75 100,50 T200,60 T300,30 T400,20"
        fill="none"
        stroke="#00f0ff"
        strokeWidth="2"
        className="glow-cyan"
      />
    </svg>
  );
}
