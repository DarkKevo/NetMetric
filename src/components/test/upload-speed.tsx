"use client";

interface UploadSpeedProps {
  value: number;
}

export function UploadSpeed({ value }: UploadSpeedProps) {
  return (
    <div className="mb-md animate-fade-in w-full max-w-4xl text-center">
      <p className="mb-xs font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-primary/60">
        UPLOAD
      </p>
      <p className="font-mono text-4xl font-bold leading-tight tracking-tight text-primary-container">
        {value.toFixed(1)}{" "}
        <span className="font-heading text-xl font-medium">Mbps</span>
      </p>
    </div>
  );
}
