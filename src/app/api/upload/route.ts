import { NextResponse } from "next/server";

/**
 * POST /api/upload
 * Accepts uploaded data for upload speed measurement.
 * Measures the time from first byte to last byte.
 */
export async function POST(request: Request) {
  const startTime = Date.now();
  let totalBytes = 0;

  try {
    const reader = request.body?.getReader();
    if (!reader) {
      return NextResponse.json(
        { error: "No request body" },
        { status: 400 },
      );
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.length;
    }

    const elapsedMs = Date.now() - startTime;
    const speedMbps = elapsedMs > 0
      ? ((totalBytes * 8) / elapsedMs / 1000).toFixed(2)
      : "0";

    return NextResponse.json(
      {
        bytes: totalBytes,
        elapsedMs,
        speedMbps: Number.parseFloat(speedMbps),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Upload interrupted" },
      { status: 500 },
    );
  }
}

/**
 * OPTIONS /api/upload
 * CORS preflight.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
