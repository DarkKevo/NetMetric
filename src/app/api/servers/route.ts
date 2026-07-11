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
 * Uses ipinfo.io to detect ISP from the user's real IP.
 * Falls back to Vercel geo headers if ipinfo fails.
 */
export async function GET(request: Request) {
  const headers = request.headers;

  // Extract user's real IP from Vercel forwarded headers
  const userIp =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("x-vercel-forwarded-for") ||
    null;

  let isp: string | null = null;
  let city: string | null = null;
  let region: string | null = null;
  let country: string | null = null;
  let loc: string | null = null;

  try {
    // Query ipinfo.io with the user's IP so it returns THEIR data
    const lookupUrl = userIp
      ? `https://ipinfo.io/${userIp}/json`
      : "https://ipinfo.io/json";

    const ipRes = await fetch(lookupUrl, {
      signal: AbortSignal.timeout(3000),
    });

    if (ipRes.ok) {
      const data: IpInfoResponse = await ipRes.json();
      city = data.city || null;
      region = data.region || null;
      country = data.country || null;
      loc = data.loc || null;

      // Extract ISP name (remove AS number prefix, e.g. "AS273090 HOLANET")
      if (data.org) {
        isp = data.org.replace(/^AS\d+\s+/, "");
      }
    }
  } catch {
    // Fallback: use Vercel geo headers only
    country = headers.get("x-vercel-ip-country") || null;
    region = headers.get("x-vercel-ip-country-region") || null;
    city = headers.get("x-vercel-ip-city") || null;
  }

  const baseUrl = new URL(request.url).origin;
  const locationLabel = [city, region].filter(Boolean).join(", ") || "Auto";
  const countryLabel = country || "Unknown";

  // Show ISP name + country in the server label (like Speedtest does)
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
      client: { isp, country, region, city, loc },
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
