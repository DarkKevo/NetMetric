"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SpeedTestPanel } from "@/components/test/speed-test-panel";
import { HistoryList } from "@/components/ui/history-list";
import { ThroughputChart } from "@/components/test/throughput-chart";
import { loadHistory } from "@/lib/history-storage";
import type { HistoryEntry } from "@/types";

export default function Home() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history after hydration to avoid SSR mismatch
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleNewTest = () => {
    setHistory(loadHistory());
  };

  return (
    <div className="relative min-h-screen bg-background text-on-surface">
      <div className="scanline-overlay" />
      <div className="fixed inset-0 z-0 grid-bg opacity-30" />

      <Header />

      <main className="relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-gutter pb-32 pt-xl max-w-container-max">
        <SpeedTestPanel onTestComplete={handleNewTest} />

        <ThroughputChart entries={history} />

        <HistoryList entries={history} />
      </main>

      <BottomNav />
    </div>
  );
}
