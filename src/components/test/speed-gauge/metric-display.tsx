"use client";

interface MetricDisplayProps {
  label: string;
  value: number;
  unit?: string;
  valueClassName?: string;
}

export function MetricDisplay({
  label,
  value,
  unit = "Mbps",
  valueClassName = "",
}: MetricDisplayProps) {
  return (
    <div className="mb-[4rem] animate-fade-in text-center mt-xl">
      <p className="mb-xs font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-primary/60">
        {label}
      </p>
      <h2
        className={`font-mono text-[64px] font-bold leading-[1.1] tracking-tight text-primary-container drop-shadow-[0_0_15px_rgba(0,240,255,0.6)] ${valueClassName}`}
      >
        {value.toFixed(1)}
      </h2>
      <p className="font-heading text-xl font-medium text-primary-container">
        {unit}
      </p>
    </div>
  );
}
