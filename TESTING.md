# Testing Steps

## Quick Start
Follow these steps to verify the fixes work before deploying to Vercel.

## Prerequisites
- Bun package manager installed (`curl https://bun.sh | bash`)
- All environment variables set in `.env` file

## Local Testing

### 1. Clean Install
```bash
# Remove old dependencies and build
rm -rf node_modules dist .output .tanstack .nitro
bun install --force
```

### 2. Build for Production
```bash
# Build (this is what Vercel runs)
bun run build

# Check build output exists
ls -la dist/server/server.js
ls -la dist/client/index.html
```

**Expected Output:**
- ✅ Build completes without errors
- ✅ Both `dist/server/server.js` and `dist/client/index.html` exist
- ✅ No Supabase environment variable warnings

**If it fails:**
- Check console for specific errors
- Verify `.env` file has all required variables
- Run `bun run lint` to check for TypeScript errors

### 3. Preview Production Build
```bash
# Start production preview server
bun run preview

# Should output something like:
# Preview server running at: http://localhost:4173
```

### 4. Test in Browser

Open `http://localhost:4173` and test:

#### Homepage
- [ ] Page loads without errors
- [ ] No console errors in DevTools (F12)
- [ ] Styles load correctly

#### Auth Page (`/auth`)
- [ ] Click "Sign in" tab
- [ ] Page loads without crashing
- [ ] Form is visible and interactive

#### Error Handling
- [ ] Try invalid login (should show error message)
- [ ] Try signup with weak password (should show validation)
- [ ] Try signup with existing email (should show error)

#### Check Console
1. Open DevTools (F12)
2. Go to Console tab
3. **Should NOT see:**
   - ❌ `Missing Supabase environment variable`
   - ❌ `TypeError: server.fetch is not a function`
   - ❌ Any red error messages

4. **OK to see:**
   - ✅ `[AuthListener] Failed to initialize Supabase auth listener` (means it's skipping on server)
   - ✅ Network requests to Supabase

### 5. Stop Server
```bash
# Press Ctrl+C to stop the preview server
```

## Deployment Checklist

Before pushing to Vercel:

- [ ] Local build succeeds without errors
- [ ] `bun run preview` starts successfully
- [ ] Homepage loads in browser
- [ ] No red console errors
- [ ] Auth page loads
- [ ] Check environment variables in Vercel are set

## Push to Vercel

```bash
# Commit changes
git add .
git commit -m "Fix: Resolve Vercel serverless function crash - SSR Supabase initialization"

# Push to trigger deployment
git push origin main
```

Wait for Vercel to deploy, then visit your production URL and test the same steps above.

## Vercel Testing

After deployment:

1. Visit `https://oakwoodhospitalofficial.vercel.app`
2. Test the same steps as "Test in Browser" section above
3. Check Vercel Logs if anything fails:
   - Go to Vercel Dashboard
   - Select your project
   - Click on the deployment
   - View Logs → Function Logs

## Rollback Plan

If something goes wrong:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Vercel will auto-redeploy with previous version
```

## Common Issues

### Build Fails
- Error: `Cannot find module @supabase/supabase-js`
  - Fix: `bun install`
- Error: `VITE environment variables not found`
  - Fix: Ensure `.env` file exists with all variables

### Preview Crashes
- Port 4173 already in use
  - Fix: `lsof -i :4173` then `kill -9 <PID>`
- Supabase initialization error
  - Fix: Verify `.env` has correct values

### Deployment Fails
- Function crashes with 500 error
  - Fix: Check Vercel Logs for specific error
  - Verify all env vars set in Vercel
  - Ensure `NITRO_PRESET=vercel` is set

## Success Indicators

✅ **Build succeeds locally**
- No errors in console
- Both client and server bundles created

✅ **Preview works**
- Homepage loads
- No 500 errors
- No console errors

✅ **Vercel deployment succeeds**
- Production URL is accessible
- No 500 errors
- Auth page loads and works

If all these are green, you're good to go! 🎉
