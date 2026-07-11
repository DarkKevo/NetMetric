import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SpeedTestPanel } from "@/components/test/speed-test-panel";
import { HistoryList } from "@/components/ui/history-list";
import { MOCK_HISTORY } from "@/mocks";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-on-surface">
      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      {/* Grid background */}
      <div className="fixed inset-0 z-0 grid-bg opacity-30" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-gutter pb-32 pt-xl max-w-container-max">
        <SpeedTestPanel />

        {/* History */}
        <HistoryList entries={MOCK_HISTORY} />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
