"use client";

import { useEffect, useRef } from "react";
import { SpeedGauge } from "@/components/test/speed-gauge";
import { UploadSpeed } from "@/components/test/upload-speed";
import { SecondaryMetrics } from "@/components/test/secondary-metrics";
import { ThroughputChart } from "@/components/test/throughput-chart";
import { useSpeedTest } from "@/hooks/use-speed-test";

interface SpeedTestPanelProps {
  onTestComplete?: () => void;
}

export function SpeedTestPanel({ onTestComplete }: SpeedTestPanelProps) {
  const { status, phase, progress, metrics, liveSamples, runTest, reset } =
    useSpeedTest();

  const prevStatus = useRef(status);

  useEffect(() => {
    if (status === "results" && prevStatus.current !== "results") {
      onTestComplete?.();
    }
    prevStatus.current = status;
  }, [status, onTestComplete]);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-xl w-full">
        <SpeedGauge
          value={metrics?.download ?? 0}
          status={status}
          phase={phase}
          onStart={status === "results" ? reset : runTest}
          progress={progress}
        />
      </div>

      {status === "results" && metrics && (
        <UploadSpeed value={metrics.upload} />
      )}

      <SecondaryMetrics metrics={metrics} />

      <div className="mb-xl w-full max-w-4xl">
        <ThroughputChart samples={liveSamples} />
      </div>
    </div>
  );
}
