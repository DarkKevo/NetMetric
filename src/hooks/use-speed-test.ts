"use client";

import { useCallback, useRef, useState } from "react";
import type { HistoryEntry, MetricData, TestPhase, TestStatus } from "@/types";
import {
  calculateJitter,
  calculateMbps,
  calculatePacketLoss,
  median,
} from "@/lib/speed-measure";
import { saveEntry } from "@/lib/history-storage";
import { useServerSelect } from "./use-server-select";

interface UseSpeedTestReturn {
  status: TestStatus;
  phase: TestPhase;
  progress: number;
  metrics: MetricData | null;
  liveSamples: number[];
  runTest: () => void;
  reset: () => void;
  history: HistoryEntry[];
}

const PING_COUNT = 10;
const DOWNLOAD_SIZE_MB = 25;
const UPLOAD_SIZE_MB = 5;
const PACKET_LOSS_COUNT = 20;

async function measurePings(count: number): Promise<number[]> {
  const pings: number[] = [];
  for (let i = 0; i < count; i++) {
    const start = performance.now();
    await fetch("/api/ping", { cache: "no-store" });
    pings.push(performance.now() - start);
  }
  return pings;
}

async function measureDownload(
  sizeMb: number,
  onProgress: (speedMbps: number, fraction: number) => void,
): Promise<{ speed: number; samples: number[] }> {
  const response = await fetch(`/api/download?size=${sizeMb}`, {
    cache: "no-store",
  });
  const reader = response.body!.getReader();
  const contentLength = Number.parseInt(
    response.headers.get("content-length") || "0",
  );

  let received = 0;
  let lastReceived = 0;
  const samples: number[] = [];
  const startTime = performance.now();

  const sampleInterval = setInterval(() => {
    const elapsed = performance.now() - startTime;
    // Instantaneous speed: bytes received in the last 250ms interval
    const intervalBytes = received - lastReceived;
    lastReceived = received;
    const speed = calculateMbps(intervalBytes, 250);
    samples.push(speed);
    const fraction = contentLength > 0 ? received / contentLength : 0;
    onProgress(speed, fraction);
  }, 250);

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.length;
    }
  } finally {
    clearInterval(sampleInterval);
    // Push a final sample with the remaining data for completeness
    const remainingBytes = received - lastReceived;
    if (remainingBytes > 0) {
      const finalSpeed = calculateMbps(remainingBytes, 250);
      samples.push(finalSpeed);
    }
  }

  const totalTime = performance.now() - startTime;
  const speed = calculateMbps(received, totalTime);

  return { speed, samples };
}

async function measureUpload(
  sizeMb: number,
  onProgress: (fraction: number) => void,
): Promise<number> {
  const totalBytes = sizeMb * 1024 * 1024;
  const payload = new Uint8Array(totalBytes);

  const MAX_CHUNK = 65536;
  for (let offset = 0; offset < totalBytes; offset += MAX_CHUNK) {
    const chunk = payload.subarray(offset, offset + MAX_CHUNK);
    crypto.getRandomValues(chunk);
  }

  const startTime = performance.now();

  await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: payload,
    cache: "no-store",
  });

  const totalTime = performance.now() - startTime;
  onProgress(1);
  return calculateMbps(totalBytes, totalTime);
}

async function measurePacketLoss(
  count: number,
  onProgress: (fraction: number) => void,
): Promise<number> {
  let timeouts = 0;

  for (let i = 0; i < count; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    try {
      await fetch("/api/ping", {
        cache: "no-store",
        signal: controller.signal,
      });
    } catch {
      timeouts++;
    } finally {
      clearTimeout(timeoutId);
    }
    onProgress((i + 1) / count);
  }

  return calculatePacketLoss(count, timeouts);
}

export function useSpeedTest(): UseSpeedTestReturn {
  const [status, setStatus] = useState<TestStatus>("idle");
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [liveSamples, setLiveSamples] = useState<number[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const runningRef = useRef(false);
  const { serverName } = useServerSelect();

  const reset = useCallback(() => {
    runningRef.current = false;
    setStatus("idle");
    setPhase("idle");
    setProgress(0);
    setMetrics(null);
    setLiveSamples([]);
  }, []);

  const runTest = useCallback(() => {
    if (runningRef.current) return;

    runningRef.current = true;
    setStatus("testing");
    setProgress(0);
    setMetrics(null);
    setLiveSamples([]);

    void (async () => {
      try {
        // ── Phase 1: Ping (0% → 10%) ──
        setPhase("ping");
        setProgress(1);

        const pings = await measurePings(PING_COUNT);
        const pingVal = median(pings);
        const jitterVal = calculateJitter(pings);
        setProgress(10);

        // ── Phase 2: Download (10% → 55%) ──
        setPhase("download");
        setProgress(11);

        const downloadResult = await measureDownload(
          DOWNLOAD_SIZE_MB,
          (speed, fraction) => {
            setLiveSamples((prev) => [...prev, speed]);
            setProgress(10 + fraction * 45);
          },
        );
        setProgress(55);

        // ── Phase 3: Upload (55% → 85%) ──
        setPhase("upload");
        setProgress(56);

        const uploadSpeed = await measureUpload(UPLOAD_SIZE_MB, (fraction) => {
          setProgress(55 + fraction * 30);
        });
        setProgress(85);

        // ── Phase 4: Packet Loss (85% → 100%) ──
        setPhase("packet-loss");
        setProgress(86);

        const packetLoss = await measurePacketLoss(
          PACKET_LOSS_COUNT,
          (fraction) => {
            setProgress(85 + fraction * 15);
          },
        );
        const finalSamples = downloadResult.samples;
        setLiveSamples(finalSamples);

        const entry: HistoryEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          download: downloadResult.speed,
          upload: uploadSpeed,
          ping: pingVal,
          jitter: jitterVal,
          packetLoss,
          server: serverName,
          timestamp: Date.now(),
        };

        setMetrics(entry);

        // Persist to localStorage and update UI list
        saveEntry(entry);
        setHistory((prev) => [entry, ...prev]);

        setPhase("results");
        setStatus("results");
        setProgress(100);
      } catch (err) {
        console.error("[NetMetric] Test failed:", err);
        runningRef.current = false;
        setStatus("idle");
        setPhase("idle");
        setProgress(0);
      }
    })();
  }, [serverName]);

  return { status, phase, progress, metrics, liveSamples, runTest, reset, history };
}
