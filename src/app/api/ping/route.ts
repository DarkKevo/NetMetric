import { NextResponse } from "next/server";

/**
 * GET /api/ping
 * Lightweight endpoint for latency measurement.
 * Returns a minimal JSON payload with a server timestamp.
 */
export async function GET() {
  const timestamp = Date.now();

  return new NextResponse(
    JSON.stringify({ pong: true, timestamp }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
