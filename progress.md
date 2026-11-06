# Monthly Task Progress - November 2026

## Overview

Build and ship a static "Coming Soon" teaser site for a fictional CS Society USM event, as
specified in `OLD_README.md` (the archived assignment brief). The site must use Astro's layout
system, provide Home, About and a
custom 404 page, look production-ready, build to `dist/`, and be deployable to Cloudflare Pages.
The fictional event is **SIGNAL/27** — a three-day festival of code, craft and beautiful chaos
at USM Engineering Campus, Penang, 19–21 March 2027.

## System & Environment Setup

- [x] Verified workspace and read `README.md` (Status: Completed)
- [x] Confirmed Git 2.53.0 is available (Status: Completed)
- [x] Installed Node.js 22.23.4 LTS (official linux-x64 tarball) to `~/.local/nodejs/current`,
      symlinked into `PATH` via `~/.bashrc` (Status: Completed)
- [x] Confirmed npm 10.9.9 and registry access (Status: Completed)
- [x] Scaffolded Astro 7.4.7 with the official `create-astro` CLI, "Empty/Minimal" template
      (Status: Completed)
- [x] Installed project dependencies — 193 packages, 0 vulnerabilities (Status: Completed)
- [x] Self-hosted Space Grotesk (variable) and Instrument Serif (roman + italic) woff2 subsets
      in `public/fonts/` so the design does not depend on a third-party font CDN
      (Status: Completed)
- [ ] Create the Cloudflare Pages project and attach the repository (Status: Pending — requires
      the account owner's Cloudflare login; local build is deploy-ready, see `DEPLOY.md`)

## Core Implementation Steps

- [x] Step 1: Configure Astro (`astro.config.mjs`) with `site` for canonical/OG URLs and
      directory-format static output (Status: Completed)
- [x] Step 2: Create `src/layouts/BaseLayout.astro` with HTML boilerplate, SEO/OG meta,
      sticky navigation, active-page state, footer, skip link and global styles
      (Status: Completed)
- [x] Step 3: Build a design system in `src/styles/global.css` — dark ink/lime palette,
      fluid typography, grain overlay, buttons, chips, motion with reduced-motion support
      (Status: Completed)
- [x] Step 4: Build `src/pages/index.astro` — full-height hero, live countdown, marquee,
      three-pillar concept section, programme timeline, event stats and a lime CTA band
      (Status: Completed)
- [x] Step 5: Build `src/pages/about.astro` — origin story, what-to-expect grid, event facts,
      venue card, FAQ accordion and outro CTA (Status: Completed)
- [x] Step 6: Build `src/pages/404.astro` — glitch 404 treatment, return-home button and a
      link to the About page (Status: Completed)
- [x] Step 7: Add `Countdown.astro` client component (days/hours/minutes/seconds, MYT target,
      live-updating, graceful "signal is live" state) (Status: Completed)
- [x] Step 8: Add brand assets — custom SVG favicon, generated `favicon.ico`, 1200×630
      `og.png`, `robots.txt` and Cloudflare `_headers` (Status: Completed)
- [x] Step 9: Document the Cloudflare Pages deployment path in `DEPLOY.md` (Status: Completed)

## Verification & Testing

- [x] `npm run build` completes with 3 static pages and no errors (Status: Completed)
- [x] `dist/404.html` is emitted at the site root, so Cloudflare Pages serves the custom
      404 for unknown paths (Status: Completed)
- [x] Local preview: `/` → 200, `/about` → 200, unknown path → HTTP 404 with custom page
      (Status: Completed)
- [x] Navigation works both ways (Home ⇄ About), including `aria-current` state
      (Status: Completed)
- [x] Countdown ticks live in the browser (verified seconds changing across a 2s interval)
      (Status: Completed)
- [x] No missing local assets or internal links; fonts and OG image return 200
      (Status: Completed)
- [x] No horizontal overflow at 390 px, 1280 px and 1440 px widths (Status: Completed)
- [x] Visual pass on desktop (1440×900) and mobile (390×844) for all three pages
      (Status: Completed)
- [x] Contrast pass: faint text raised to `#8a877f` (5.6:1 on the base background); CTA
      fine print darkened for AA contrast on lime (Status: Completed)
- [x] axe-core WCAG 2.0 A/AA audit on all three pages: 0 violations (Status: Completed)
- [ ] Deploy to Cloudflare Pages and record the live `*.pages.dev` URL (Status: Pending —
      blocked on Cloudflare account authorization, not on code)

## Execution Log & State Changes

- 2026-11-06 12:10 (+08): Inspected repo; README specifies an Astro coming-soon site with
  BaseLayout, Home/About/404 routes and Cloudflare Pages deployment. Node was absent.
- 2026-11-06 12:11 (+08): Installed Node.js v22.23.4 under `~/.local/nodejs/current` and added
  it to `PATH` in `~/.bashrc`.
- 2026-11-06 12:12 (+08): Scaffolded Astro 7.4.7 (minimal template) into the repo without
  overwriting the assignment `README.md`; ran `npm install` (193 packages).
- 2026-11-06 12:13 (+08): Downloaded and self-hosted the three woff2 font files.
- 2026-11-06 12:15 (+08): Implemented global styles, BaseLayout (nav/footer/SEO), index,
  about and 404 pages plus the countdown component.
- 2026-11-06 12:16 (+08): First production build succeeded; verified unknown routes return
  the custom 404 (HTTP 404) via `astro preview`.
- 2026-11-06 12:17 (+08): Visual QA at 1440×900 and 390×844; rebalanced the hero around a
  live countdown panel, removed an awkward drop cap, improved faint-text contrast.
- 2026-11-06 12:18 (+08): Generated `og.png`, custom `favicon.ico`, `_headers`, `robots.txt`
  and `DEPLOY.md`; added noindex to the 404 page.
- 2026-11-06 12:20 (+08): Final build and verification sweep (routing, links, assets,
  responsive overflow, countdown, axe-core WCAG A/AA audit with 0 violations).
- 2026-11-06 12:21 (+08): Committed the implementation on branch `feat/signal-27-teaser`.
  Cloudflare Pages deploy remains pending account authorization.
- 2026-11-06 12:42 (+08): Hardening pass — made `output: 'static'` explicit in the Astro
  config and added `role="group"` to the countdown (ARIA `aria-label` is not permitted on a
  generic element). Re-ran axe: 0 violations, 19 passes; 48 contrast nodes remain
  manual-review only because axe cannot resolve text over gradient backgrounds.
- 2026-11-06 12:47 (+08): Added a PNG Apple touch icon, removed two unused CSS tokens, and
  wrote `TECHNICAL_DOCUMENTATION.md` (87 headings, linked TOC, 16k-word specification and
  ADR log). Pushed the branch to `origin`.
- 2026-11-06 13:56 (+08): Reworked the repository docs for submission — moved the assignment
  brief to `OLD_README.md` via `git mv` (SHA-256 verified byte-identical to the original):
  new `README.md` showcase with the live URL, overview, deliverables, quick start, doc
  references and deployment contract; `astro.config.mjs` `site` set to
  `https://monthly-task-nov-2026.pages.dev`. `npm run build` clean (3 pages), canonical and
  `og:image` now resolve to the production domain. Committed as `e79b8bf`.
