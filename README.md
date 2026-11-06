# SIGNAL/27 — Coming Soon Teaser

**Live Deployment:** <https://monthly-task-nov-2026.pages.dev/>

A production-ready static teaser site for **SIGNAL/27**, a fictional three-day festival of code,
craft and beautiful chaos at USM Engineering Campus, Penang — 19–21 March 2027.

Built with **Astro 7**, **TypeScript** and **pure CSS design tokens**. No UI framework, no
client-side runtime, no CSS-in-JS — just semantic HTML, a single hand-written stylesheet and one
small inline script for the countdown.

---

## Project Overview

The brief was deliberately open: build a "Coming Soon" teaser for a fictional society event,
prove the Astro layout system works, ship working navigation, and deploy it to Cloudflare Pages.

SIGNAL/27 is the answer to that brief. Rather than a single centred "coming soon" placeholder,
the site presents a complete pre-launch experience: a full-bleed hero with a live countdown, a
marquee ticker, three programme pillars, a day-by-day timeline, event statistics, an origin story
on the About page, an FAQ accordion, and a custom 404 with a glitch treatment.

**Mission:** demonstrate that a small static site can look and feel like a funded product launch
while shipping zero framework bytes to the browser.

### Tech stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Meta-framework | **Astro 7.4.7** | Static output, file-based routing, scoped styles |
| Language | **TypeScript** | Typed component props; `@ts-check` in config |
| Styling | **Pure CSS custom properties** | One global token sheet, no Tailwind, no CSS-in-JS |
| Fonts | Self-hosted WOFF2 | Space Grotesk + Instrument Serif, no third-party CDN |
| Hosting | **Cloudflare Pages** | Static asset hosting, global edge |

---

## Key Deliverables & Verification

### Routes

All three routes are pre-rendered to static HTML at build time:

| Route | File | Output | Purpose |
| --- | --- | --- | --- |
| `/` | `src/pages/index.astro` | `dist/index.html` | Hero, countdown, pillars, timeline, stats, CTA |
| `/about` | `src/pages/about.astro` | `dist/about/index.html` | Origin story, what to expect, venue, FAQ |
| `/404` | `src/pages/404.astro` | `dist/404.html` | Custom error page, returns to home |

`dist/404.html` sits at the site root, so Cloudflare Pages serves the custom page automatically
for any unknown path (e.g. `/does-not-exist`) — no redirect rules required.

### Countdown mechanics

`src/components/Countdown.astro` renders four static cells (`--` placeholders) at build time and
then hydrates them with a ~40-line inline vanilla script:

- Target instant is fixed in the markup: `2027-03-19T09:00:00+08:00` (MYT).
- Ticks once per second; days/hours/minutes/seconds are derived from a single timestamp diff.
- Zero-padded output, wrapped in a `role="group"` with an `aria-label`.
- When the diff reaches zero the interval clears itself, the cells lock to `00`, and the note
  changes to a "signal is live" message — no runaway timer.
- If JavaScript never runs, the static placeholders and the human-readable "Doors open" note
  still communicate the date.

### Zero-JS and accessibility

- **Zero framework JavaScript.** No React/Vue/Svelte, no islands, no hydration, no third-party
  scripts. The only executable code shipped is the inline countdown described above.
- **No render-blocking requests** beyond one local stylesheet and self-hosted fonts.
- **WCAG 2.1 AA contrast.** Muted text was raised to `#8a877f` (5.6:1 on the base background);
  fine print on the lime CTA band was darkened to pass AA.
- **axe-core audit: 0 violations** across `/`, `/about` and the 404 page (WCAG 2.0 A/AA ruleset).
- Skip-to-content link, semantic landmarks, `aria-current` on the active nav item, visible focus
  rings, and `prefers-reduced-motion` handling for every transition and the marquee.
- Responsive and overflow-free at 390 px, 1280 px and 1440 px widths.
- Verified locally: `/` → 200, `/about` → 200, unknown path → HTTP 404 with the custom page;
  navigation works in both directions; countdown seconds advance live.

---

## Quick Start & Local Development

Requires **Node.js >= 22.23.4** (declared in `package.json` under `engines`).

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:4321)
npm run dev

# 3. Type-check-free production build into ./dist
npm run build

# 4. Preview the production build locally (http://localhost:4321)
npm run preview
```

Useful extras:

```bash
npm run astro -- --version   # confirm the Astro version
npm run build && ls dist     # inspect emitted pages
```

---

## Architecture & Documentation Reference

- **[`TECHNICAL_DOCUMENTATION.md`](./TECHNICAL_DOCUMENTATION.md)** — the full deep dive:
  framework semantics, component hierarchy, toolchain decisions, performance and accessibility
  methodology, deployment operations, and the numbered **Architecture Decision Records (ADRs)**
  with context, decision and consequences for each choice.
- **[`OLD_README.md`](./OLD_README.md)** — the original November 2026 assignment brief, preserved
  verbatim: objectives, step-by-step task instructions, success metrics and grading criteria.
- **[`DEPLOY.md`](./DEPLOY.md)** — the operational deployment runbook and post-deploy checklist.

Repository shape:

```
src/
├── components/Countdown.astro   # countdown markup + inline ticker
├── layouts/BaseLayout.astro     # HTML shell, SEO/OG meta, nav, footer, skip link
├── pages/
│   ├── index.astro              # /
│   ├── about.astro              # /about
│   └── 404.astro                # /404
└── styles/global.css            # design tokens + all base styling
public/                          # fonts, favicons, og.png, robots.txt, _headers
```

---

## Deployment Details

The site is deployed as a **fully static Cloudflare Pages** project.

`astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://monthly-task-nov-2026.pages.dev',
  output: 'static',
  build: { format: 'directory' },
});
```

- `output: 'static'` — every route is pre-rendered; there is no server runtime, adapter or SSR.
- `build.format: 'directory'` — `/about` is emitted as `about/index.html` for clean URLs.
- `site` — drives canonical URLs and absolute Open Graph/Twitter image URLs; it must match the
  production domain exactly, which is why it points at the live Pages URL.
- **Build command:** `npm run build` · **Output directory:** `dist/`
- `public/_headers` adds `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` and a
  strict `Permissions-Policy`, plus immutable one-year caching for `/_astro/*` and `/fonts/*`.

Pushing to the connected branch triggers an automatic rebuild and redeploy on Cloudflare Pages.

---

## Assignment Context

This repository is the November 2026 CSS technical task submission. The original brief —
Astro setup, `BaseLayout`, Home/About/404 pages, and Cloudflare Pages deployment — is retained
unmodified in [`OLD_README.md`](./OLD_README.md). This document is the submission showcase.
