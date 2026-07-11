"use client";

import { useEffect, useRef } from "react";
import { SpeedGauge } from "@/components/test/speed-gauge";
import { UploadSpeed } from "@/components/test/upload-speed";
import { SecondaryMetrics } from "@/components/test/secondary-metrics";
import { useSpeedTest } from "@/hooks/use-speed-test";

interface SpeedTestPanelProps {
  onTestComplete?: () => void;
}

export function SpeedTestPanel({ onTestComplete }: SpeedTestPanelProps) {
  const { status, phase, progress, metrics, runTest, reset } =
    useSpeedTest();

  const prevStatus = useRef(status);

  useEffect(() => {
    if (status === "results" && prevStatus.current !== "results") {
      onTestComplete?.();
    }
    prevStatus.current = status;
  }, [status, onTestComplete]);

  return (
    <div className="flex w-full flex-col items-center lg:flex-row lg:items-start lg:gap-xl lg:justify-center">
      <div className="mb-xl w-full lg:mb-0 lg:w-auto">
        <SpeedGauge
          value={metrics?.download ?? 0}
          status={status}
          phase={phase}
          onStart={status === "results" ? reset : runTest}
          progress={progress}
        />
      </div>

      <div className="flex w-full max-w-md flex-col items-center lg:items-start lg:pt-12">
        {status === "results" && metrics && (
          <UploadSpeed value={metrics.upload} />
        )}

        <SecondaryMetrics metrics={metrics} />
      </div>
    </div>
  );
}
