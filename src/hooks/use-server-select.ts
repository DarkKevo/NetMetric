"use client";

import { useEffect, useState } from "react";

interface ServerInfo {
  id: string;
  name: string;
  location: string;
  country: string;
  url: string;
}

interface ClientInfo {
  isp: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  loc: string | null;
}

interface ServerSelectResult {
  /** Display name for the selected server (e.g. "HOLANET // VE") */
  serverName: string;
  /** Detected ISP name or null */
  isp: string | null;
  /** Detected location (city, region) */
  location: string;
  /** Currently loading */
  isLoading: boolean;
  /** All available servers */
  servers: ServerInfo[];
  /** Selected server ID */
  selectedId: string;
  /** Change selected server */
  selectServer: (id: string) => void;
  /** Pre-flight latency to the selected server in ms, or null */
  ping: number | null;
  /** Trigger a fresh pre-flight ping */
  refreshPing: () => void;
}

async function measureLatency(url: string): Promise<number> {
  const start = performance.now();
  await fetch(`${url}/api/ping`, { cache: "no-store" });
  return performance.now() - start;
}

export function useServerSelect(): ServerSelectResult {
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [location, setLocation] = useState("Detecting...");
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ping, setPing] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchServers() {
      try {
        const res = await fetch("/api/servers", { cache: "no-store" });
        const data = await res.json();

        if (cancelled) return;

        const ci = data.client;
        setClientInfo(ci);

        const detectedLocation = ci?.city
          ? [ci.city, ci.region].filter(Boolean).join(", ")
          : "Auto";
        const label = ci?.city
          ? `${ci.city}${ci?.country ? `, ${ci.country}` : ""}`
          : "Auto";

        setLocation(label);
        setServers(data.servers);
        setSelectedId(data.servers[0]?.id || "default");
        setIsLoading(false);
      } catch {
        if (cancelled) return;
        setLocation("Auto");
        setServers([
          {
            id: "default",
            name: "NetMetric Server",
            location: "Auto",
            country: "Unknown",
            url: "",
          },
        ]);
        setSelectedId("default");
        setIsLoading(false);
      }
    }

    fetchServers();
    return () => {
      cancelled = true;
    };
  }, []);

  // Measure pre-flight ping once servers are loaded
  useEffect(() => {
    if (isLoading || !servers.length) return;

    let cancelled = false;
    const selected = servers.find((s) => s.id === selectedId);

    if (selected?.url) {
      measureLatency(selected.url).then((ms) => {
        if (!cancelled) setPing(Math.round(ms));
      });
    }

    return () => {
      cancelled = true;
    };
  }, [isLoading, servers, selectedId]);

  const refreshPing = () => {
    const selected = servers.find((s) => s.id === selectedId);
    if (selected?.url) {
      setPing(null);
      measureLatency(selected.url).then((ms) => setPing(Math.round(ms)));
    }
  };

  const selected = servers.find((s) => s.id === selectedId);
  const serverName = isLoading
    ? "Detecting..."
    : selected
      ? selected.name
      : "NetMetric Server";

  return {
    serverName,
    isp: clientInfo?.isp ?? null,
    location,
    isLoading,
    servers,
    selectedId,
    selectServer: setSelectedId,
    ping,
    refreshPing,
  };
}
