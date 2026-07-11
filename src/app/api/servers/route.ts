import { NextResponse } from "next/server";

interface ServerInfo {
  id: string;
  name: string;
  location: string;
  country: string;
  url: string;
}

interface IpInfoResponse {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
  loc?: string;
}

/**
 * GET /api/servers
 * Returns available test servers, user's ISP, and detected location.
 *
 * Uses ipinfo.io to detect ISP/org from the user's IP.
 * Falls back to Vercel headers if ipinfo fails.
 */
export async function GET(request: Request) {
  const headers = request.headers;

  // Try ipinfo.io for ISP + precise location
  let isp: string | null = null;
  let city: string | null = null;
  let region: string | null = null;
  let country: string | null = null;
  let loc: string | null = null;

  try {
    const ipRes = await fetch("https://ipinfo.io/json", {
      // Vercel forwards the client IP automatically
      signal: AbortSignal.timeout(3000),
    });
    if (ipRes.ok) {
      const data: IpInfoResponse = await ipRes.json();
      city = data.city || null;
      region = data.region || null;
      country = data.country || null;
      loc = data.loc || null;

      // Extract ISP name from org (remove AS number prefix)
      if (data.org) {
        isp = data.org.replace(/^AS\d+\s+/, "");
      }
    }
  } catch {
    // Fallback: use Vercel geo headers
    country = headers.get("x-vercel-ip-country") || null;
    region = headers.get("x-vercel-ip-country-region") || null;
    city = headers.get("x-vercel-ip-city") || null;
  }

  const baseUrl = new URL(request.url).origin;
  const locationLabel = [city, region].filter(Boolean).join(", ") || "Auto";
  const countryLabel = country || "Unknown";

  // Build server name: include ISP if detected
  const serverName = isp
    ? `${isp} // ${countryLabel}`
    : `NetMetric // ${countryLabel}`;

  const servers: ServerInfo[] = [
    {
      id: "default",
      name: serverName,
      location: locationLabel,
      country: countryLabel,
      url: baseUrl,
    },
  ];

  return NextResponse.json(
    {
      client: {
        isp,
        country,
        region,
        city,
        loc,
      },
      servers,
      selected: servers[0].id,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
