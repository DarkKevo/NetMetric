"use client";

import { useEffect, useState } from "react";

interface ServerInfo {
  id: string;
  name: string;
  location: string;
  country: string;
  url: string;
}

interface ServerSelectResult {
  /** Display name for the selected server */
  serverName: string;
  /** Detected location (city, country or "Auto") */
  location: string;
  /** Currently loading */
  isLoading: boolean;
  /** All available servers */
  servers: ServerInfo[];
  /** Selected server ID */
  selectedId: string;
  /** Change selected server */
  selectServer: (id: string) => void;
}

export function useServerSelect(): ServerSelectResult {
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [location, setLocation] = useState("Detecting...");
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchServers() {
      try {
        const res = await fetch("/api/servers", { cache: "no-store" });
        const data = await res.json();

        if (cancelled) return;

        const detectedLocation = data.client?.city && data.client?.country
          ? `${data.client.city}, ${data.client.country}`
          : "Auto";

        setServers(data.servers);
        setLocation(detectedLocation);
        setSelectedId(data.servers[0]?.id || "default");
        setIsLoading(false);
      } catch {
        if (cancelled) return;
        // Fallback: show generic info
        setLocation("Auto");
        setServers([{ id: "default", name: "NetMetric Server", location: "Auto", country: "Unknown", url: "" }]);
        setSelectedId("default");
        setIsLoading(false);
      }
    }

    fetchServers();
    return () => { cancelled = true; };
  }, []);

  const selected = servers.find((s) => s.id === selectedId);
  const serverName = isLoading
    ? "Detecting..."
    : selected
      ? `${selected.name} // ${selected.location || selected.country}`
      : "NetMetric Server";

  return {
    serverName,
    location,
    isLoading,
    servers,
    selectedId,
    selectServer: setSelectedId,
  };
}
