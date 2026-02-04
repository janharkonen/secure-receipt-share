# HOW TO SETUP

1. 'bun create better-t-stack@latest'
2. run 'bun run dev:setup'
3. When choosing cloud deployment, added env variables to packages/backend/.env.local
4. Add BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SITE_URL to convex cloud env variables.
5. Add VITE_CONVEX_URL, VITE_CONVEX_SITE_URL to /apps/web/.env
6. run 'bun run dev'
