"use client";

import { useEffect, useState } from "react";
import { useServerSelect } from "@/hooks/use-server-select";

interface ServerSelectorProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function ServerSelector({ forceOpen, onClose }: ServerSelectorProps) {
  const {
    serverName,
    isp,
    location,
    isLoading,
    servers,
    selectedId,
    selectServer,
    ping,
    refreshPing,
  } = useServerSelect();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync external forceOpen with internal state
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  // Handle close from outside
  useEffect(() => {
    if (!isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  const close = () => {
    close();
    onClose?.();
  };

  // Ensure client-only rendering after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR / first paint, render a static placeholder
  // to avoid hydration mismatch with client-only data
  if (!mounted) {
    return (
      <div className="relative">
        <button
          disabled
          className="flex cursor-not-allowed items-center gap-xs rounded-sm bg-surface-container-high px-base py-xs border border-outline/20 opacity-40"
        >
          <span className="material-symbols-outlined text-primary-container scale-75">
            dns
          </span>
          <span className="font-mono text-[10px] sm:text-[12px] font-medium uppercase leading-none tracking-widest text-on-surface-variant">
            Detecting...
          </span>
          <span className="material-symbols-outlined text-on-surface-variant scale-75">
            keyboard_arrow_down
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
          onClick={() => {
            if (isLoading) return;
            if (isOpen) {
              close();
            } else {
              setIsOpen(true);
            }
          }}
        disabled={isLoading}
        className="flex cursor-pointer items-center gap-xs rounded-sm bg-surface-container-high px-base py-xs border border-outline/20 transition-[border-color,opacity,transform] duration-200 ease-out hover:border-primary-container/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container disabled:opacity-40 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined text-primary-container scale-75">
          dns
        </span>
        <div className="flex flex-col items-start">
          <span className="font-mono text-[10px] sm:text-[12px] font-medium uppercase leading-none tracking-widest text-on-surface-variant">
            {serverName}
          </span>
          {ping !== null && (
            <span className="font-mono text-[9px] uppercase tracking-wider text-primary/50">
              {ping}ms
            </span>
          )}
        </div>
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
            onClick={() => close()}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            className="absolute right-0 top-full z-50 mt-xs min-w-64 rounded-sm border border-outline-variant/20 bg-surface-container-high p-xs shadow-lg"
          >
            <li className="px-base py-xs border-b border-outline-variant/20 mb-xs space-y-xs">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  ISP
                </p>
                <p className="font-mono text-[12px] font-medium text-on-surface-variant">
                  {isp || "Detecting..."}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  Location
                </p>
                <p className="font-mono text-[12px] font-medium text-on-surface-variant">
                  {location}
                </p>
              </div>
              {ping !== null && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                    Latency
                  </p>
                  <p className="font-mono text-[12px] font-medium text-primary-container">
                    {ping}ms
                  </p>
                </div>
              )}
            </li>

            {servers.map((server) => (
              <li key={server.id}>
                <button
                  role="option"
                  aria-selected={selectedId === server.id}
                  onClick={() => {
                    selectServer(server.id);
                    close();
                  }}
                  className={`flex w-full cursor-pointer items-center gap-xs rounded-sm px-base py-sm font-mono text-[12px] font-medium uppercase leading-none tracking-widest transition-[background-color,opacity,transform] duration-150 ease-out hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container disabled:opacity-40 disabled:cursor-not-allowed ${
                    selectedId === server.id
                      ? "text-primary-container"
                      : "text-on-surface-variant"
                  }`}
                >
                  {server.name}
                  {selectedId === server.id && (
                    <span className="ml-auto text-primary-container material-symbols-outlined scale-75">
                      check
                    </span>
                  )}
                </button>
              </li>
            ))}

            <li className="border-t border-outline-variant/20 mt-xs pt-xs">
              <button
                onClick={() => {
                  refreshPing();
                  close();
                }}
                className="flex w-full cursor-pointer items-center gap-xs rounded-sm px-base py-sm font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60 transition-[background-color,opacity,transform] duration-150 ease-out hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container"
              >
                <span className="material-symbols-outlined scale-75">
                  refresh
                </span>
                Measure latency
              </button>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
