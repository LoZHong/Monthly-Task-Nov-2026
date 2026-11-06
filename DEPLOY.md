# Deploying SIGNAL/27

The site is a fully static Astro build. `npm run build` writes everything to `dist/`,
which is the directory Cloudflare Pages should publish.

## Local

```bash
# Node 22.23.4+ is required by Astro 7
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in ./dist
npm run preview    # serve ./dist at http://localhost:4321
```

## Cloudflare Pages (Git integration)

1. Push this repository to GitHub (the fork from the task instructions).
2. Log in to <https://dash.cloudflare.com> → **Workers & Pages** → **Create application**
   → **Pages** → **Connect to Git**.
3. Pick the repository and the branch to deploy (`main`).
4. Framework preset: **Astro**. Confirm the defaults:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `22` (set `NODE_VERSION=22` under *Environment variables* if the
     build image defaults to an older release).
5. **Save and Deploy**. The first build takes about a minute; the live URL is
   `https://<project-name>.pages.dev`.
6. Update `site` in `astro.config.mjs` to that URL (it drives canonical + Open Graph
   URLs), commit, and push — Cloudflare redeploys automatically. The `hello@signal27.my`
   address is fictional; swap it for the society's real inbox.

Because `src/pages/404.astro` is present, the build emits `dist/404.html`. Cloudflare
Pages serves it automatically for any unknown path — no extra routing config needed.

## Cloudflare Pages (CLI, optional)

```bash
npx wrangler pages deploy dist --project-name signal-27
```

The first run opens a browser to authorise Wrangler against your Cloudflare account.
This repository was built and verified locally; the actual Pages project must be
created under the account that will own the deployment.

## Post-deploy checklist

- [ ] `/` and `/about` load over HTTPS and the nav switches between them.
- [ ] `https://<project>.pages.dev/does-not-exist` returns the custom 404 page.
- [ ] View source: canonical URL and `og:image` point at the production domain.
- [ ] Fonts and `og.png` load (no 404s in the Network tab).
