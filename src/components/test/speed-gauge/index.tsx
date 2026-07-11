"use client";

import { useMemo } from "react";
import type { TestPhase, TestStatus } from "@/types";
import { ProgressRing } from "@/icons";
import { MetricDisplay } from "./metric-display";

interface SpeedGaugeProps {
  value: number;
  unit?: string;
  label?: string;
  status: TestStatus;
  phase?: TestPhase;
  onStart: () => void;
  progress?: number;
}

const PHASE_LABELS: Record<string, string> = {
  ping: "PING",
  download: "DOWNLOAD",
  upload: "UPLOAD",
  "packet-loss": "LOSS",
};

export function SpeedGauge({
  value,
  unit = "Mbps",
  label = "DOWNLOAD",
  status,
  phase = "idle",
  onStart,
  progress = 0,
}: SpeedGaugeProps) {
  const buttonLabel = useMemo(() => {
    switch (status) {
      case "idle":
        return "START";
      case "testing":
        return PHASE_LABELS[phase] || "TESTING";
      case "results":
        return "DONE";
    }
  }, [status, phase]);

  const buttonDisabled = status === "testing";

  return (
    <div className="flex w-full flex-col items-center">
      <MetricDisplay label={label} value={value} unit={unit} />

      {/* Button + Ring */}
      <div className="relative flex items-center justify-center">
        {status === "testing" && (
          <div className="absolute inset-0 animate-pulse-cyan rounded-full bg-primary/5" />
        )}

        <button
          onClick={onStart}
          disabled={buttonDisabled}
          className="relative z-10 flex h-48 w-48 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-primary-container bg-surface-container-lowest/80 backdrop-blur-xl transition-[background-color,opacity,transform] duration-500 ease-out hover:bg-primary-container hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-inherit"
          aria-label={buttonLabel}
        >
          <span className="relative z-20 font-heading text-xl font-semibold tracking-widest text-primary-container transition-colors duration-500 ease-out group-hover:text-background">
            {buttonLabel}
          </span>
        </button>

        <ProgressRing
          progress={status === "idle" ? 0 : progress}
          className="absolute h-64 w-64"
        />
      </div>
    </div>
  );
}
