import { NextResponse } from "next/server";

/**
 * GET /api/download?size=25
 * Streams random data for download speed measurement.
 *
 * @param size  Size in megabytes (default: 25, max: 100)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sizeMb = Math.min(
    Math.max(parseInt(searchParams.get("size") || "25"), 1),
    100,
  );
  const sizeBytes = sizeMb * 1024 * 1024;

  const stream = new ReadableStream({
    start(controller) {
      let bytesSent = 0;
      const chunkSize = 65536; // 64KB

      function push() {
        try {
          while (bytesSent < sizeBytes) {
            const remaining = sizeBytes - bytesSent;
            const size = Math.min(chunkSize, remaining);
            const chunk = new Uint8Array(size);
            crypto.getRandomValues(chunk);
            controller.enqueue(chunk);
            bytesSent += size;
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }

      push();
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": sizeBytes.toString(),
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
