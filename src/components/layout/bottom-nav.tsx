"use client";

import { useNavContext } from "@/lib/nav-context";

interface BottomNavProps {
  onNavigate: (section: "dashboard" | "history") => void;
}

export function BottomNav({ onNavigate }: BottomNavProps) {
  const { openServers } = useNavContext();

  const items = [
    {
      icon: "speed",
      label: "DASHBOARD",
      action: () => onNavigate("dashboard"),
    },
    {
      icon: "history",
      label: "HISTORY",
      action: () => onNavigate("history"),
    },
    {
      icon: "hub",
      label: "SERVERS",
      action: openServers,
    },
  ] as const;

  return (
    <nav className="fixed bottom-0 z-50 flex w-full items-center justify-around border-t border-primary/10 bg-surface-container-lowest/80 px-base py-md backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,240,255,0.1)] lg:hidden">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          className="flex cursor-pointer flex-col items-center justify-center text-on-surface-variant/50 transition-[color,opacity,transform] duration-200 ease-out hover:text-primary-container focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container"
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="mt-xs font-mono text-[12px] font-medium uppercase leading-none tracking-widest">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
