// Vercel serverless function that hosts the TanStack Start SSR + server-fn handler.
// Uses Node.js HTTP API (req, res) which is compatible with Vercel's Node runtime.
// @ts-expect-error - resolved at deploy time from the build output
import server from "../dist/server/server.js";
import type { IncomingMessage, ServerResponse } from "http";

export const config = {
  runtime: "nodejs",
};

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    if (!server || !server.fetch) {
      const errorMsg = "Server bundle not properly initialized. Check build output.";
      console.error("[SSR Handler] " + errorMsg);
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ error: errorMsg }));
      return;
    }

    // Convert Node.js request to Fetch API Request
    const protocol = (req.headers["x-forwarded-proto"] as string) || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
    const url = new URL(req.url || "/", `${protocol}://${host}`);

    // Convert body to buffer for Fetch API
    let body: Buffer | undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        req.on("end", () => resolve(Buffer.concat(chunks)));
        req.on("error", reject);
      });
    }

    // Create Fetch API Request
    const fetchRequest = new Request(url.toString(), {
      method: req.method,
      headers: req.headers as HeadersInit,
      body: body && body.length > 0 ? body : undefined,
    });

    // Call server handler
    const fetchResponse = await server.fetch(fetchRequest);

    // Convert Fetch Response to Node.js response
    res.statusCode = fetchResponse.status;
    fetchResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const responseBody = await fetchResponse.arrayBuffer();
    res.end(Buffer.from(responseBody));
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("[SSR Handler] Error:", {
      message: errorMsg,
      stack: errorStack,
      requestPath: req.url,
      requestMethod: req.method,
    });

    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        error: "Internal Server Error",
        message: errorMsg,
        timestamp: new Date().toISOString(),
      })
    );
  }
}
