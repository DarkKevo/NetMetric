import { NextResponse } from "next/server";

interface ServerInfo {
  id: string;
  name: string;
  location: string;
  country: string;
  url: string;
}

/**
 * GET /api/servers
 * Returns available test servers and the user's detected location.
 */
export async function GET(request: Request) {
  const headers = request.headers;

  // Vercel/Edge geolocation headers (available when deployed)
  const country = headers.get("x-vercel-ip-country") || null;
  const region = headers.get("x-vercel-ip-country-region") || null;
  const city = headers.get("x-vercel-ip-city") || null;

  // Construct the base URL from the request
  const baseUrl = new URL(request.url).origin;

  const servers: ServerInfo[] = [
    {
      id: "default",
      name: "NetMetric Server",
      location: city ? `${city}, ${country}` : "Auto",
      country: country || "Unknown",
      url: baseUrl,
    },
  ];

  return NextResponse.json(
    {
      client: {
        country,
        region,
        city,
        ip: headers.get("x-forwarded-for") || null,
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
