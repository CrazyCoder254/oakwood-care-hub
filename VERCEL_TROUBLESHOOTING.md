# Vercel 500 Error Troubleshooting Guide

## The Problem
Your serverless function is crashing with `FUNCTION_INVOCATION_FAILED`. This guide helps diagnose and fix the issue.

## Debugging Steps

### 1. Check Vercel Logs
Go to: `https://oakwoodhospitalofficial.vercel.app/_logs?requestId=<YOUR_REQUEST_ID>`

**Common error patterns:**
- `SUPABASE_URL is not defined` → Missing environment variables
- `Cannot find module` → Build output issue
- `TypeError: server.fetch is not a function` → SSR bundle not built correctly

### 2. Verify Environment Variables

**Check that these are set in Vercel Project Settings:**

```
✓ VITE_SUPABASE_URL
✓ VITE_SUPABASE_PUBLISHABLE_KEY  
✓ VITE_SUPABASE_PROJECT_ID
✓ SUPABASE_URL
✓ SUPABASE_PUBLISHABLE_KEY
✓ SUPABASE_PROJECT_ID
✓ SUPABASE_SERVICE_ROLE_KEY
✓ NITRO_PRESET=vercel
```

**To add variables:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Add each variable

### 3. Test Local Build

Run locally to reproduce the error:

```bash
# Install dependencies
bun install

# Build for production
bun run build

# Check build outputs exist
ls -la dist/client
ls -la dist/server

# Preview production build
bun run preview
```

**If build fails:**
- Check console output for specific errors
- Verify all imports are correct
- Ensure no circular dependencies

**If build succeeds but preview fails:**
- Server bundle may not be exporting correctly
- Check `dist/server/server.js` exists and is not empty

### 4. Common Causes & Fixes

#### Missing Environment Variables
**Symptom:** Supabase error in logs  
**Fix:** Add all 8 environment variables to Vercel

#### Build Output Issues
**Symptom:** "Cannot find module ../dist/server/server.js"  
**Fix:**
```bash
# Rebuild locally
rm -rf dist/
bun run build

# Verify output
ls dist/server/server.js
ls dist/client/index.html
```

#### Nitro Not Configured for Vercel
**Symptom:** Build succeeds but function crashes  
**Fix:** Ensure `vercel.json` contains:
```json
"env": {
  "NITRO_PRESET": "vercel"
}
```

#### Module Not Initializing Properly
**Symptom:** Server bundle loads but crashes on first request  
**Fix:**
- Check Supabase client initialization (now includes fallback)
- Verify auth middleware is client-only (now fixed)
- Check for unhandled errors in middleware

### 5. Redeploy with Fixes

After making changes:

```bash
# Commit changes
git add .
git commit -m "Fix: Improve Vercel error handling and env var fallback"

# Push to trigger Vercel redeploy
git push origin main
```

Or use Vercel CLI:
```bash
vercel deploy --prod --env-file .env
```

## Error Handling Improvements Made

✅ **auth-attacher.ts** - Now checks for server environment and gracefully skips  
✅ **client.ts** - Falls back to dummy client on server instead of throwing  
✅ **api/ssr.ts** - Added error logging and validation  
✅ **start.ts** - Enhanced error logging with context  

## Next Steps if Still Failing

1. **Check Vercel Function Runtime Logs:**
   ```
   Click "Logs" in Vercel Dashboard → Recent Deployments → Select Deployment → Function Logs
   ```

2. **Look for specific error messages:**
   - Search logs for "Error:", "Exception", "TypeError"
   - Note the exact line number and module

3. **Enable Debug Mode (if available):**
   - Some Vercel projects support verbose logging
   - Check project settings

4. **Verify File Permissions:**
   - Ensure `dist/server/server.js` is readable
   - Check `api/ssr.ts` is at correct path

5. **Test with Minimal Setup:**
   - Create a test endpoint that doesn't use Supabase
   - Verify basic SSR works before adding features

## Support Resources

- [Vercel Error Codes](https://vercel.com/docs/errors/FUNCTION_INVOCATION_FAILED)
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Nitro Deployment Guide](https://nitro.unjs.io/deploy/vercel)
- [Supabase Integration Docs](https://supabase.com/docs)
