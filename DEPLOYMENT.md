# Vercel Deployment Guide

## Prerequisites

- Vercel account connected to your GitHub repository
- Supabase project with credentials
- Bun package manager

## Environment Variables

The following environment variables must be set in your Vercel project settings:

### Required for Client-Side (Browser)
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon (public) key
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID

### Required for Server-Side (API Routes)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon (public) key  
- `SUPABASE_PROJECT_ID` - Your Supabase project ID
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin operations)

## Steps to Deploy

### 1. Set Up Vercel Project
```bash
# Connect your GitHub repository to Vercel
# https://vercel.com/new
```

### 2. Add Environment Variables
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all the variables listed above from your Supabase project
4. Make sure the `NITRO_PRESET` is set to `vercel` (this is configured in vercel.json)

### 3. Deploy
Push to your main branch or use the Vercel CLI:
```bash
# Using Vercel CLI
vercel deploy --prod
```

## Project Configuration

### Build Configuration
- **Framework**: Custom (TanStack Start + Nitro)
- **Build Command**: `bun run build`
- **Install Command**: `bun install`
- **Output Directory**: `dist/client`
- **Runtime**: Node.js 20

### Architecture
- **Frontend**: React + TanStack Router (compiled to `dist/client`)
- **Backend**: Nitro serverless functions (compiled to `dist/server`)
- **SSR Handler**: `api/ssr.ts` - handles all requests via rewrite

### Key Files
- `vercel.json` - Vercel deployment configuration
- `.vercelignore` - Files to exclude from deployment
- `vite.config.ts` - Build configuration
- `api/ssr.ts` - Serverless function entry point
- `.env.example` - Template for environment variables

## Development

### Local Development
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Environment Variables Locally
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials
3. The `.env` file in your repo is for documentation/defaults only

## Troubleshooting

### Build Fails
- Check that all required environment variables are set in Vercel
- Ensure `NITRO_PRESET=vercel` is configured
- Verify that Supabase credentials are correct

### Runtime Errors
- Check the Vercel deployment logs for error details
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set for server-side operations
- Verify Supabase RLS policies if using authenticated operations

### Cold Start Optimization
- The Nitro serverless function may have cold starts on first request
- Consider using Vercel's edge caching for static assets
- Monitor performance in Vercel Analytics

## Best Practices

1. **Never commit `.env` with real secrets** - Use `.env.local` locally and Vercel's environment variable UI
2. **Test locally before deploying** - Run `bun run build` and `bun run preview` locally
3. **Monitor deployment logs** - Check Vercel deployment logs for build or runtime errors
4. **Keep dependencies updated** - Regularly update packages while testing compatibility
5. **Use preview deployments** - Test changes on preview deployments before merging to main

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Nitro Deployment](https://nitro.unjs.io/deploy/vercel)
- [TanStack Start](https://tanstack.com/start/latest)
- [Supabase Documentation](https://supabase.com/docs)
