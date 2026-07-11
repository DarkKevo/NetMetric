"use client";

import { useState } from "react";
import { useServerSelect } from "@/hooks/use-server-select";

export function ServerSelector() {
  const { serverName, location, isLoading, servers, selectedId, selectServer } =
    useServerSelect();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex cursor-pointer items-center gap-xs rounded-sm bg-surface-container-high px-base py-xs border border-outline/20 transition-[border-color,opacity,transform] duration-200 ease-out hover:border-primary-container/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container disabled:opacity-40 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined text-primary-container scale-75">
          dns
        </span>
        <span className="font-mono text-[12px] font-medium uppercase leading-none tracking-widest text-on-surface-variant">
          {serverName}
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
            className="absolute right-0 top-full z-50 mt-xs min-w-56 rounded-sm border border-outline-variant/20 bg-surface-container-high p-xs shadow-lg"
          >
            <li className="px-base py-xs border-b border-outline-variant/20 mb-xs">
              <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Your location
              </p>
              <p className="font-mono text-[12px] font-medium text-on-surface-variant">
                {location}
              </p>
            </li>

            {servers.map((server) => (
              <li key={server.id}>
                <button
                  role="option"
                  aria-selected={selectedId === server.id}
                  onClick={() => {
                    selectServer(server.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-xs rounded-sm px-base py-sm font-mono text-[12px] font-medium uppercase leading-none tracking-widest transition-[background-color,opacity,transform] duration-150 ease-out hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container disabled:opacity-40 disabled:cursor-not-allowed ${
                    selectedId === server.id
                      ? "text-primary-container"
                      : "text-on-surface-variant"
                  }`}
                >
                  {server.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
