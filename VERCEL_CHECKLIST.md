# Vercel Pre-Deployment Checklist

Use this checklist to ensure your Oakwood Care Hub project is ready for Vercel deployment.

## Configuration Files ✓
- [x] `vercel.json` - Configured for Vercel deployment with:
  - `buildCommand`: `bun run build`
  - `installCommand`: `bun install`
  - `outputDirectory`: `dist/client`
  - `NITRO_PRESET`: `vercel`
  - SSR function configured at `api/ssr.ts`
  - Rewrites configured for SSR

- [x] `vite.config.ts` - Build configuration includes:
  - TanStack Start plugin
  - React plugin
  - Tailwind CSS plugin
  - TypeScript path aliases

- [x] `.vercelignore` - Files excluded from deployment to optimize build size

- [x] `.env.example` - Template for required environment variables

- [x] `.gitignore` - Properly excludes `.env` files to prevent secret leaks

## Environment Variables (Set in Vercel Dashboard)
Before deploying, add these to your Vercel project settings:

### Client-Side Variables
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_SUPABASE_PROJECT_ID`

### Server-Side Variables  
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_PUBLISHABLE_KEY`
- [ ] `SUPABASE_PROJECT_ID`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

## Project Structure ✓
- [x] Frontend code in `src/`
- [x] Server function at `api/ssr.ts`
- [x] Build outputs configured:
  - Client build: `dist/client`
  - Server build: `dist/server`

## Deployment Method
Choose one:
- [ ] Connect GitHub repository to Vercel (automatic deploys on push)
- [ ] Use Vercel CLI: `vercel deploy --prod`

## Post-Deployment
- [ ] Test the deployed URL
- [ ] Verify authentication flows work
- [ ] Check that Supabase connection works
- [ ] Review Vercel analytics and logs
- [ ] Set up error monitoring (optional: Sentry, DataDog, etc.)

## Troubleshooting
If deployment fails:
1. Check Vercel deployment logs for specific errors
2. Verify all environment variables are set correctly
3. Ensure `NITRO_PRESET=vercel` is configured
4. Check that Supabase credentials are valid
5. Run `bun run build` locally to reproduce any build errors

## Documentation
- See `DEPLOYMENT.md` for detailed deployment instructions
- See `.env.example` for environment variable requirements
- See `vercel.json` for build configuration details
