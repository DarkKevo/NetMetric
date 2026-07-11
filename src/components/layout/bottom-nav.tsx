"use client";

import { NAV_ITEMS } from "@/mocks";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 z-50 flex w-full items-center justify-around border-t border-primary/10 bg-surface-container-lowest/80 px-base py-md backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,240,255,0.1)]">
      {NAV_ITEMS.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={`flex flex-col items-center justify-center transition-[color,opacity,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container ${
            item.active
              ? "scale-110 font-bold text-primary drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]"
              : "text-on-surface-variant/50 hover:text-primary-container"
          }`}
          aria-current={item.active ? "page" : undefined}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="mt-xs font-mono text-[12px] font-medium uppercase leading-none tracking-widest">
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
