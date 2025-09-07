# Cloudflare Worker for Vite SPA

Serves the built `billytrend.com` Vite app via Workers Assets.

- assets directory: `../billytrend.com/dist`
- SPA fallback enabled (serves `index.html` on not-found).

Scripts:

- `pnpm -C packages/cf-worker dev` – build app then run `wrangler dev`.
- `pnpm -C packages/cf-worker deploy` – build app then deploy to Cloudflare.

Ensure you are authenticated with Cloudflare:

- `npx wrangler login` (once), or set `CLOUDFLARE_API_TOKEN`.
