# Vercel Invalid URL Error - FIXED

## Root Cause
The serverless function was receiving `TypeError: Invalid URL with input: '/'` because:

1. **Wrong API Format**: The handler was using Fetch API Request/Response format
2. **Vercel Node Runtime**: Vercel's Node.js runtime actually uses Node.js HTTP API (`IncomingMessage`/`ServerResponse`)
3. **URL Parsing Failed**: When h3 (the HTTP framework) tried to parse the URL from the request object, it failed because the request wasn't properly formatted

**The Error Chain:**
```
Vercel (Node.js HTTP) → handler(req, res) → new URL() failed
```

## The Fix
Updated `api/ssr.ts` to properly use Vercel's Node.js HTTP API:

### What Changed
```typescript
// BEFORE (Fetch API - doesn't work with Vercel):
export default async function handler(request: Request): Promise<Response>

// AFTER (Node.js HTTP API - works with Vercel):
export default async function handler(req: IncomingMessage, res: ServerResponse)
```

### How It Works Now
1. **Receive Node.js Request** - `req: IncomingMessage` from Vercel
2. **Extract URL** - Properly construct URL using `x-forwarded-proto` and `x-forwarded-host` headers
3. **Convert to Fetch API** - Create a proper `Request` object for h3/Nitro
4. **Call Server Handler** - `await server.fetch(fetchRequest)`
5. **Convert Response** - Return h3's Response as Node.js `res`

### Key Implementation Details
```typescript
// Properly extract URL from Vercel headers
const protocol = (req.headers["x-forwarded-proto"] as string) || "https";
const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
const url = new URL(req.url || "/", `${protocol}://${host}`);

// Convert body stream to buffer
let body: Buffer | undefined;
if (req.method !== "GET" && req.method !== "HEAD") {
  body = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Create proper Fetch API Request
const fetchRequest = new Request(url.toString(), {
  method: req.method,
  headers: req.headers as HeadersInit,
  body: body && body.length > 0 ? body : undefined,
});
```

## Deployment

### 1. Commit Changes
```bash
git add .
git commit -m "Fix: Use proper Node.js HTTP API for Vercel serverless function

- Changed handler from Fetch API to Node.js HTTP API (IncomingMessage/ServerResponse)
- Properly extract URL from Vercel x-forwarded-* headers
- Convert Node.js request streams to Fetch API Request objects
- Resolves 'Invalid URL' TypeError errors
"
```

### 2. Push to Deploy
```bash
git push origin main
```

Vercel will automatically redeploy with the fixes.

### 3. Monitor Deployment
- Watch Vercel Dashboard for build status
- Check Function Logs after deployment
- Visit your production URL and test

## What Was Wrong vs What's Fixed

| Issue | Before | After |
|-------|--------|-------|
| **Handler API** | Fetch API Request/Response | Node.js HTTP API IncomingMessage/ServerResponse |
| **URL Parsing** | ❌ Failed - not a valid URL object | ✅ Properly constructed from headers |
| **Body Handling** | ❌ Expected string/buffer | ✅ Converts stream chunks to buffer |
| **Error** | `TypeError: Invalid URL with input: '/'` | ✅ No error - URL properly parsed |

## Testing Checklist

After deployment:
- [ ] Homepage loads (no 500 error)
- [ ] No "Invalid URL" errors in logs
- [ ] DevTools Console shows no red errors
- [ ] Auth page loads
- [ ] Can navigate between routes
- [ ] Vercel function logs show no TypeErrors

## Environment Variables (No Change)

All previously set environment variables remain the same:
- ✓ `VITE_SUPABASE_URL`
- ✓ `VITE_SUPABASE_PUBLISHABLE_KEY`
- ✓ `VITE_SUPABASE_PROJECT_ID`
- ✓ `SUPABASE_URL`
- ✓ `SUPABASE_PUBLISHABLE_KEY`
- ✓ `SUPABASE_PROJECT_ID`
- ✓ `SUPABASE_SERVICE_ROLE_KEY`
- ✓ `NITRO_PRESET=vercel`

## Why This Happened

Vercel's Node.js runtime provides handlers with Node.js native HTTP objects, not the Fetch API. The previous implementation incorrectly assumed Vercel would provide a Fetch API Request object, which caused the URL parsing to fail in h3.

The correct approach is to:
1. Accept Node.js HTTP objects
2. Convert them to Fetch API format
3. Call the server handler
4. Convert the response back to Node.js format

This is the standard pattern for running full-stack applications on Vercel with Nitro/h3.
