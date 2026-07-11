"use client";

import { useState } from "react";
import { SERVERS } from "@/mocks";

export function ServerSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(SERVERS[0].value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-xs rounded-sm bg-surface-container-high px-base py-xs border border-outline/20 transition-[border-color,opacity,transform] duration-200 ease-out hover:border-primary-container/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container disabled:opacity-40 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined text-primary-container scale-75">
          dns
        </span>
        <span className="font-mono text-[12px] font-medium uppercase leading-none tracking-widest text-on-surface-variant">
          {selected}
        </span>
        <span
          className={`material-symbols-outlined text-on-surface-variant scale-75 transition-transform duration-200 ease-out ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          keyboard_arrow_down
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            className="absolute right-0 top-full z-50 mt-xs w-48 rounded-sm border border-outline-variant/20 bg-surface-container-high p-xs shadow-lg"
          >
            {SERVERS.map((server) => (
              <li key={server.id}>
                <button
                  role="option"
                  aria-selected={selected === server.value}
                  onClick={() => {
                    setSelected(server.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-xs rounded-sm px-base py-sm font-mono text-[12px] font-medium uppercase leading-none tracking-widest transition-[background-color,opacity,transform] duration-150 ease-out hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container disabled:opacity-40 disabled:cursor-not-allowed ${
                    selected === server.value
                      ? "text-primary-container"
                      : "text-on-surface-variant"
                  }`}
                >
                  {server.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
