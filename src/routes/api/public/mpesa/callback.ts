import { createFileRoute } from "@tanstack/react-router";

// Safaricom posts payment results here. We only acknowledge; status is confirmed via STK query.
export const Route = createFileRoute("/api/public/mpesa/callback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          console.log("[mpesa] callback", JSON.stringify(body).slice(0, 2000));
        } catch {
          /* ignore */
        }
        return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
      },
    },
  },
});
