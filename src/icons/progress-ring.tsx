const CIRCUMFERENCE = 301.59; // 48 * 2 * Math.PI

interface ProgressRingProps {
  progress: number; // 0–100
  size?: number;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 256,
  className = "",
}: ProgressRingProps) {
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <svg
      className={`pointer-events-none -rotate-90 ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      {/* Dashed background ring */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#00f0ff"
        strokeWidth="0.5"
        strokeDasharray="1 4"
        opacity="0.4"
      />

      {/* Active progress ring */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#00f0ff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        className="transition-[stroke-dashoffset] duration-300 ease-in-out"
      />
    </svg>
  );
}
