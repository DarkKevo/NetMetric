"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SpeedTestPanel } from "@/components/test/speed-test-panel";
import { HistoryList } from "@/components/ui/history-list";
import { ThroughputChart } from "@/components/test/throughput-chart";
import { loadHistory } from "@/lib/history-storage";
import { NavContext } from "@/lib/nav-context";
import type { HistoryEntry } from "@/types";

export default function Home() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const historyRef = useRef<HTMLElement>(null);
  const [serverOpen, setServerOpen] = useState(false);

  // Load history after hydration to avoid SSR mismatch
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleNewTest = () => {
    setHistory(loadHistory());
  };

  const scrollTo = useCallback((section: "dashboard" | "history") => {
    if (section === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const openServers = useCallback(() => {
    setServerOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <NavContext.Provider value={{ openServers }}>
      <div className="relative min-h-screen bg-background text-on-surface">
        <div className="scanline-overlay" />
        <div className="fixed inset-0 z-0 grid-bg opacity-30" />

        <Header serverForceOpen={serverOpen} onServerClose={() => setServerOpen(false)} />

        <main className="relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-gutter pb-32 pt-xl max-w-container-max">
          <section id="dashboard-section">
            <SpeedTestPanel onTestComplete={handleNewTest} />
          </section>

          <ThroughputChart entries={history} />

          <section ref={historyRef} id="history-section">
            <HistoryList entries={history} />
          </section>
        </main>

        <BottomNav onNavigate={scrollTo} />
      </div>
    </NavContext.Provider>
  );
}
