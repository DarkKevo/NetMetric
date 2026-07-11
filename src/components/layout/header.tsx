import { ServerSelector } from "./server-selector";

export function Header() {
  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between px-gutter py-sm backdrop-blur-md border-b border-outline-variant/20 bg-surface/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-base">
        <span className="material-symbols-outlined text-primary-container text-lg">
          language
        </span>
        <h1 className="text-heading text-xl font-semibold tracking-tighter text-primary-container drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
          NETMETRIC
        </h1>
      </div>

      <ServerSelector />
    </header>
  );
}
