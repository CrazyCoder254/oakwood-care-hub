import { createStart, createMiddleware } from "@tanstack/react-start";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const FALLBACK_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>Something went wrong</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#faf7f2;color:#1a1a1a}main{text-align:center;padding:2rem;max-width:480px}h1{font-size:1.5rem;margin:0 0 .5rem}p{color:#555;margin:0 0 1.5rem}a{display:inline-block;padding:.6rem 1.2rem;background:#5b2a86;color:#fff;text-decoration:none;border-radius:.5rem}</style></head><body><main><h1>Something went wrong</h1><p>Please try again in a moment.</p><a href="/">Go home</a></main></body></html>`;

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    // Log detailed error information for debugging
    console.error('[TanStack Start] Server error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      error,
    });

    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    
    return new Response(FALLBACK_HTML, {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));
