// Vercel serverless function that hosts the TanStack Start SSR + server-fn handler.
// The built SSR bundle exports `{ fetch }` (Web-standard). Vercel Node 20 supports
// returning a Response from a (Request) handler.
// @ts-expect-error - resolved at deploy time from the build output
import server from "../dist/server/server.js";

export const config = {
  runtime: "nodejs",
};

export default async function handler(request: Request): Promise<Response> {
  return server.fetch(request);
}
