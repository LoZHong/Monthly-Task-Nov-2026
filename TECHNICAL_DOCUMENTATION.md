# SIGNAL/27 — Technical Specification and Architecture Decision Record

| Field | Value |
| --- | --- |
| Document status | Accepted — implementation complete, deployment pending account authorization |
| Version | 1.0.0 |
| Date | 2026-11-06 |
| Repository | `Monthly-Task-Nov-2026` (fork: `LoZHong/Monthly-Task-Nov-2026`) |
| Working branch | `feat/signal-27-teaser` |
| Framework | Astro 7.4.7 (static output) |
| Runtime | Node.js 22.23.4 LTS, npm 10.9.9 |
| Deployment target | Cloudflare Pages |
| Audience | Maintainers, reviewers, future contributors, society technical leads |

This document is the authoritative technical description of the November 2026 task implementation. It records what was built, why each architectural choice was made, how the system behaves at build time and in the browser, and what evidence supports the verification claims. Requirements language from the assignment `README.md` is treated as the source of truth; where the implementation goes beyond it, that is called out explicitly.

---

## 1. Table of Contents

- [1. Table of Contents](#1-table-of-contents)
- [2. Project Overview and Specification Alignment](#2-project-overview-and-specification-alignment)
  - [2.1 Mission Statement](#21-mission-statement)
  - [2.2 Scope and Non-Goals](#22-scope-and-non-goals)
  - [2.3 Design Goals](#23-design-goals)
  - [2.4 Requirement Traceability Matrix](#24-requirement-traceability-matrix)
  - [2.5 User Journeys and Conversion Model](#25-user-journeys-and-conversion-model)
- [3. Core Framework and Language Semantics](#3-core-framework-and-language-semantics)
  - [3.1 Astro 7 Architectural Rationale](#31-astro-7-architectural-rationale)
  - [3.2 Compilation Model](#32-compilation-model)
  - [3.3 Zero JavaScript by Default](#33-zero-javascript-by-default)
  - [3.4 Frontmatter and Client Execution Boundaries](#34-frontmatter-and-client-execution-boundaries)
  - [3.5 Islands Architecture and Partial Hydration](#35-islands-architecture-and-partial-hydration)
  - [3.6 Semantic HTML5 Structure](#36-semantic-html5-structure)
  - [3.7 CSS Custom Properties and Token System](#37-css-custom-properties-and-token-system)
  - [3.8 Fluid Typography](#38-fluid-typography)
  - [3.9 Layout Paradigms](#39-layout-paradigms)
- [4. Toolchain, Runtime and Environment Decisions](#4-toolchain-runtime-and-environment-decisions)
  - [4.1 Node.js 22 LTS Baseline](#41-nodejs-22-lts-baseline)
  - [4.2 ES Module Resolution](#42-es-module-resolution)
  - [4.3 Build Performance](#43-build-performance)
  - [4.4 Dependency Minimalism Audit](#44-dependency-minimalism-audit)
  - [4.5 Cloudflare Pages Target](#45-cloudflare-pages-target)
  - [4.6 Static Build Contract](#46-static-build-contract)
  - [4.7 Edge Serving and Cold Starts](#47-edge-serving-and-cold-starts)
  - [4.8 Environment Decision Summary](#48-environment-decision-summary)
- [5. Component Hierarchy and Architectural Patterns](#5-component-hierarchy-and-architectural-patterns)
  - [5.1 Component Tree](#51-component-tree)
  - [5.2 BaseLayout Component](#52-baselayout-component)
    - [5.2.1 Shell and Slot Orchestration](#521-shell-and-slot-orchestration)
    - [5.2.2 Metadata and SEO Injection](#522-metadata-and-seo-injection)
    - [5.2.3 Navigation State](#523-navigation-state)
    - [5.2.4 Skip Link and Landmarks](#524-skip-link-and-landmarks)
  - [5.3 Home Page](#53-home-page)
    - [5.3.1 Hero Composition](#531-hero-composition)
    - [5.3.2 Marquee Mechanics](#532-marquee-mechanics)
    - [5.3.3 Programme Grid](#533-programme-grid)
    - [5.3.4 Conversion Funnel](#534-conversion-funnel)
  - [5.4 About Page](#54-about-page)
    - [5.4.1 Information Hierarchy](#541-information-hierarchy)
    - [5.4.2 Details Accordion](#542-details-accordion)
  - [5.5 404 Page](#55-404-page)
    - [5.5.1 HTTP Status Handling](#551-http-status-handling)
    - [5.5.2 Glitch Effect Mechanics](#552-glitch-effect-mechanics)
    - [5.5.3 Navigation Fallback](#553-navigation-fallback)
  - [5.6 Countdown Component](#56-countdown-component)
    - [5.6.1 Time Model and Timezone Pinning](#561-time-model-and-timezone-pinning)
    - [5.6.2 Drift and Throttling](#562-drift-and-throttling)
    - [5.6.3 Execution Boundary](#563-execution-boundary)
    - [5.6.4 Layout Shift Prevention](#564-layout-shift-prevention)
- [6. Performance, Accessibility and Quality Assurance](#6-performance-accessibility-and-quality-assurance)
  - [6.1 Asset Delivery](#61-asset-delivery)
  - [6.2 Webfont Pipeline](#62-webfont-pipeline)
  - [6.3 Image and Icon Pipeline](#63-image-and-icon-pipeline)
  - [6.4 Accessibility Model](#64-accessibility-model)
  - [6.5 Contrast Validation](#65-contrast-validation)
  - [6.6 Responsive and Layout Stability](#66-responsive-and-layout-stability)
  - [6.7 Measured Baseline](#67-measured-baseline)
  - [6.8 QA Methodology](#68-qa-methodology)
  - [6.9 Known Quality Gaps](#69-known-quality-gaps)
- [7. Repository and Deployment Operations](#7-repository-and-deployment-operations)
  - [7.1 Branching Model](#71-branching-model)
  - [7.2 Commit History](#72-commit-history)
  - [7.3 Cloudflare Pages CI/CD](#73-cloudflare-pages-cicd)
  - [7.4 Environment Variables](#74-environment-variables)
  - [7.5 Caching and Security Headers](#75-caching-and-security-headers)
  - [7.6 Routing Conventions](#76-routing-conventions)
  - [7.7 Release Runbook](#77-release-runbook)
  - [7.8 Rollback Procedure](#78-rollback-procedure)
- [8. Architecture Decision Records](#8-architecture-decision-records)
  - [8.1 ADR-001 Astro as the Static Site Framework](#81-adr-001-astro-as-the-static-site-framework)
  - [8.2 ADR-002 Plain CSS Instead of Tailwind](#82-adr-002-plain-css-instead-of-tailwind)
  - [8.3 ADR-003 Self-Hosted Webfonts](#83-adr-003-self-hosted-webfonts)
  - [8.4 ADR-004 No UI Framework Islands](#84-adr-004-no-ui-framework-islands)
  - [8.5 ADR-005 Fixed UTC Offset Timestamp](#85-adr-005-fixed-utc-offset-timestamp)
  - [8.6 ADR-006 Directory Routing and Root 404](#86-adr-006-directory-routing-and-root-404)
  - [8.7 ADR-007 Cloudflare Pages as Host](#87-adr-007-cloudflare-pages-as-host)
  - [8.8 ADR-008 Mailto Calls to Action](#88-adr-008-mailto-calls-to-action)
  - [8.9 ADR-009 Global Tokens with Scoped Page Styles](#89-adr-009-global-tokens-with-scoped-page-styles)
  - [8.10 ADR-010 Documentation as a First-Class Artifact](#810-adr-010-documentation-as-a-first-class-artifact)
- [9. Appendices](#9-appendices)
  - [9.1 File Manifest](#91-file-manifest)
  - [9.2 Design Token Reference](#92-design-token-reference)
  - [9.3 Command Reference](#93-command-reference)
  - [9.4 Verification Evidence](#94-verification-evidence)
  - [9.5 Glossary](#95-glossary)

---

## 2. Project Overview and Specification Alignment

### 2.1 Mission Statement

SIGNAL/27 is a fictional three-day festival of "code, craft and beautiful chaos" hosted by the Computer Science Society at Universiti Sains Malaysia. The site is a pre-launch teaser: its job is to make the event legible, desirable, and memorable in under five seconds, then route interested visitors toward the one action that exists before tickets go on sale — joining the update list.

The technical mission is narrower and more demanding: prove that a student team can ship a production-quality, statically generated, accessible, edge-hosted Astro site with a clean layout architecture, without a runtime server, a database, or a JavaScript framework.

### 2.2 Scope and Non-Goals

In scope:

- A static multi-page site with three routes: `/`, `/about`, `/does-not-exist` (custom 404).
- A shared `BaseLayout.astro` owning document shell, navigation, footer, metadata, and accessibility scaffolding.
- A live countdown to the fictional event date, computed client-side.
- A distinctive visual system: dark editorial palette, lime accent, display typography, fluid layout, motion with reduced-motion support.
- Build-time quality gates: deterministic static output, verified routing, link integrity, responsive overflow checks, and an axe-core WCAG audit.
- Deployment documentation for Cloudflare Pages and a static artifact that requires no adapter.

Explicit non-goals:

- Ticketing, payments, authentication, or attendee accounts.
- A CMS, database, form backend, or email-list integration. Update CTAs are `mailto:` links by design.
- Analytics, tracking pixels, cookies, or consent management.
- Server-side rendering, edge functions, personalization, or geo-routing.
- Localization. The site is English-only with Malaysian English editorial voice.
- Real event logistics. Dates, venue, pricing, and schedules are fictional but internally consistent.

These non-goals are architectural constraints, not omissions: they are the reason the site can be delivered as 15 static files with a single 881-byte inline script.

### 2.3 Design Goals

| ID | Goal | Technical expression | Acceptance signal |
| --- | --- | --- | --- |
| G1 | Zero-runtime delivery | Static pre-rendering, no framework runtime, no hydration | `dist` contains zero `.js` files; one 881-byte inline module |
| G2 | Instant comprehension | Oversized hero title, explicit date/place chips, countdown above the fold at 1280×800 | Visual QA at 1280×800 and 1440×900 |
| G3 | Editorial distinctiveness | Instrument Serif italic + Space Grotesk, lime accent, grain, grid, conic glow | Screenshot review; consistent tokens |
| G4 | Accessibility | WCAG 2.0 A/AA, landmarks, contrast, keyboard path, reduced motion | axe-core: 0 violations |
| G5 | Layout stability | No horizontal overflow, no cumulative layout shift from the timer | `scrollWidth === innerWidth` at 390/768/1280/1440; CLS 0 |
| G6 | Deploy determinism | `output: 'static'`, directory routing, root `404.html`, pinned Node floor | Clean build in 0.7–1.7 s; 3 routes emitted |
| G7 | Honest conversion | No fake forms or fabricated social proof; `mailto:` CTAs only | Code review of all CTAs |
| G8 | Maintainability | 2,467 lines across six source files; tokenized CSS; data-driven sections | File manifest and ADR-009 |

Performance budgets derived from these goals:

| Budget | Target | Measured |
| --- | --- | --- |
| HTML per page (uncompressed) | ≤ 20 KB | 8.4–15.6 KB |
| Individual CSS chunk (uncompressed) | ≤ 12 KB | 7.2–9.8 KB per chunk; 19 KB for the home route |
| Client JavaScript | ≤ 1 KB | 881 B inline |
| Font payload | ≤ 70 KB | 65,448 B across three files |
| Initial subresource transfer (home) | ≤ 60 KB | 51,448 B over 5 requests |
| Cumulative Layout Shift | 0 | 0 |

### 2.4 Requirement Traceability Matrix

The assignment `README.md` is the requirement baseline. Every instruction is mapped to an implemented artifact and a verification method.

| README requirement | Interpretation | Delivered artifact | Verification | Status |
| --- | --- | --- | --- | --- |
| Fork the repository | Work must live in a fork, not upstream | `origin` = `git@github.com:LoZHong/Monthly-Task-Nov-2026.git`; upstream history preserved | `git remote -v`, `git log` | Complete |
| Clone locally | Local working copy with full history | Repository at `/home/lzh/Desktop/task_eval/nov/Monthly-Task-Nov-2026` | `git status`, `git log` | Complete |
| Initialise Astro with `npm create astro@latest .` (Empty template) | Astro project rooted in the repo without destroying the brief | Astro 7.4.7 scaffold generated in a scratch directory with the `minimal` template (the CLI's name for "Empty"), copied in except `README.md` | `package.json`, `astro.config.mjs`, build success | Complete |
| Create `src/layouts/BaseLayout.astro` | Single shell with boilerplate, nav, footer | 363-line layout with props, SEO head, sticky header, primary nav, footer, skip link | Imported by all three pages; rendered on every route | Complete |
| `index.astro` landing page | Catchy title, short event description, Coming Soon message | Hero `SIGNAL/27`, lede, "Coming soon" status chip, live countdown, programme, CTA | Homepage screenshot; DOM inspection | Complete |
| `about.astro` explanatory page | Creative explanation of the event | Origin story, four experience pillars, event facts, venue, FAQ | `/about` returns 200; content reviewed | Complete |
| `404.astro` custom error page with home button | Branded error state with a route back | Glitch `404`, "Return to base" primary button, About secondary link | Random path returns HTTP 404 with custom markup | Complete |
| Styling via `<style>` or Tailwind | Any coherent styling approach | Plain CSS: global token sheet plus Astro-scoped page styles (ADR-002) | CSS emitted per route; visual QA | Complete |
| Commit and push branch | Version-controlled delivery | Branch `feat/signal-27-teaser` with a focused commit series, pushed to `origin` | `git log`, `git ls-remote origin` | Complete |
| Open a PR to USM CSS repo | Reviewable change set | Branch published; PR not opened from this environment | N/A | Pending account authorization |
| Cloudflare Pages Git integration | Automated build and deploy on push | `DEPLOY.md` runbook, `_headers`, static build contract, `output: 'static'` | Build output matches Cloudflare contract | Documented, not activated |
| Framework preset Astro; build `npm run build`; output `dist` | Exact Pages settings | `package.json` build script; `dist/` verified | `npm run build` emits 3 routes | Complete |
| Live `*.pages.dev` URL | Public deployment | Not created — requires the account owner's Cloudflare authorization | N/A | Pending account |
| Working Home ↔ About navigation | Client-side navigation between routes | Header nav with `aria-current`, brand link home, footer links | Click test: `/` → `/about` → `/` | Verified |
| Random URL shows custom 404 | Host-level 404 routing | `dist/404.html` at repository root | `GET /does-not-exist` → 404 + custom content | Verified |

The traceability matrix makes the remaining gaps explicit: the code and build satisfy every local requirement, the branch is published to the fork, but the public URL and the upstream PR require account authorization this environment does not hold. No URL is fabricated.

### 2.5 User Journeys and Conversion Model

Three journeys drive the information architecture.

**Journey A — cold visitor arrives from Instagram or a poster QR code.** The hero answers four questions without scrolling: what (SIGNAL/27), when (19–21 March 2027), where (Penang, MY), and how soon (days/hours/minutes/seconds). The primary CTA "Read the transmission" leads to `/about` for depth; the secondary "Get updates" opens a pre-addressed email. This is a two-step funnel: attention → context → intent.

**Journey B — evaluator or society reviewer.** The header exposes Home and About immediately; the 404 route demonstrates host-level error handling. The About page carries the details a reviewer would otherwise ask for: format, cost, eligibility, venue, FAQ. No login, no cookie banner, no interstitial.

**Journey C — lost visitor.** Any mistyped URL lands on the branded 404 with two exits: home and About. The header remains available, so the failure state is never a dead end.

The conversion model deliberately stops at intent. Without a backend, the only truthful action is opening the visitor's mail client with a prefilled subject. The final lime CTA repeats that action at the point of maximum interest. There is no fake "subscribed" confirmation, no localStorage pretence, and no third-party form that would silently collect data.

---

## 3. Core Framework and Language Semantics

### 3.1 Astro 7 Architectural Rationale

Astro is a content-first meta-framework that compiles component files into pre-rendered HTML and ships JavaScript only where explicitly requested. That model matches the problem exactly:

- The site is a multi-page document, not an application. Each route is independently addressable, indexable, and cacheable.
- The only interactive element is a clock. A React/Vue runtime would cost tens of kilobytes to update four text nodes once per second.
- The assignment explicitly requires Astro project structure, layouts, and routing.
- Cloudflare Pages serves static files with no adapter, no function bundle, and no cold-start surface.

The alternative architectures were considered and rejected in ADR-001. In short: Next.js/Remix would add a server or hydration runtime the site does not need; Eleventy would satisfy static generation but not the assignment's Astro requirement or component-scoped styling; hand-written HTML would discard the layout system the task is designed to teach.

Astro's file-based routing, layout slots, scoped styles, and build-time frontmatter give the project a component architecture without paying a client runtime tax.

### 3.2 Compilation Model

An `.astro` file is a single-file component with two regions:

1. A frontmatter fence (`--- ... ---`) that executes once in Node.js during the build. It can import modules, read files, compute data, and define the component's props. It never reaches the browser.
2. A template region that is compiled into a render function producing an HTML string. Expressions, loops, and conditionals are evaluated at build time for a static route.

The build pipeline observed in this project:

| Stage | Observed output | Responsibility |
| --- | --- | --- |
| Type generation | `[types] Generated 340ms` | Generate `.astro/types.d.ts` for editor/type support |
| Build info collection | `Collecting build info...` | Discover routes, integrations, and rendering mode |
| Static entrypoint build | `[vite] built in ~300ms` | Transform components, bundle scripts, extract CSS |
| Asset rearrangement | `Rearranging server assets...` | Prepare emitted chunks and static assets |
| Route generation | `/404.html`, `/about/index.html`, `/index.html` | Render each route to its output path |
| Completion | `3 page(s) built in ~1s` | Write `dist/` |

Two consequences matter:

- **Scoped CSS is extracted per route.** Astro hashes selectors and emits only the CSS a route needs. The build produced `BaseLayout.*.css` (shared shell), `index.*.css`, and `about.*.css`. The 404 page's CSS is small enough that Astro inlined it into `404.html` as a single `<style>` block, eliminating a render-blocking request.
- **Scripts are processed by Vite.** The countdown `<script>` is TypeScript, minified, and — because it is under the inlining threshold — emitted as an 881-byte inline `type="module"` block. There are no separate `.js` files in `dist`.

### 3.3 Zero JavaScript by Default

Astro ships zero client JavaScript unless a component opts in. This project preserves that baseline:

- `find dist -name '*.js'` returns 0 files.
- The home page contains exactly one inline module (881 bytes, minified) for the countdown.
- The About and 404 pages contain no JavaScript at all.
- There is no framework runtime, no router, no hydration bootstrap, and no polyfill bundle.

The no-JS fallback is graceful: the countdown cells render `--` placeholders, while the static note "Doors open 19 March 2027, 09:00 MYT" and all date chips remain readable. Navigation is ordinary anchor navigation. The accordion uses native `<details>`, so it works without JavaScript. The site loses only the ticking numbers when scripting is unavailable.

This is a purposeful trade: the timer enhances a page that is complete without it, rather than a page that depends on it.

### 3.4 Frontmatter and Client Execution Boundaries

The build-time/client boundary is explicit in the code.

Build-time (frontmatter) responsibilities:

- Page metadata props and defaults in `BaseLayout.astro`.
- Content arrays in `index.astro` (`marquee`, `pillars`, `days`, `stats`) and `about.astro` (`expectations`, `facts`, `faqs`).
- URL construction for canonical and Open Graph tags via `new URL(...)`.
- Conditional rendering such as `{noindex && <meta name="robots" content="noindex" />}`.
- Loops that expand arrays into static markup.

Client-time responsibilities:

- Reading `data-target` from the countdown element.
- Computing the remaining duration and writing four text nodes.
- Switching the note text when the target has passed.

Only one scalar crosses the boundary: the ISO timestamp in `data-target="2027-03-19T09:00:00+08:00"`. The content arrays are never serialized into the HTML as JSON, so there is no duplicated data payload and no risk of leaking build-time values. No environment variables or secrets exist in the project at all.

Astro's `<script>` handling is also part of the boundary: scripts are bundled as ES modules, deferred by default, and executed after the document is parsed. The countdown therefore cannot block first paint and does not need a `DOMContentLoaded` wrapper.

### 3.5 Islands Architecture and Partial Hydration

Astro's islands architecture allows individual interactive components to be hydrated independently while the rest of the page remains static HTML. Hydration directives control when that happens:

| Directive | When the island hydrates | Typical use |
| --- | --- | --- |
| `client:load` | Immediately on page load | Critical, above-the-fold interactivity |
| `client:idle` | When the main thread is idle | Secondary widgets |
| `client:visible` | When the island enters the viewport | Below-the-fold interactivity |
| `client:media` | When a media query matches | Mobile-only controls |
| `client:only` | Skip server rendering, render on client | Browser-only components |

This project uses **zero islands**. There is no React, Preact, Svelte, Vue, or Solid integration installed. The countdown is a plain Astro component with a vanilla module script, not a hydrated framework component. That distinction is deliberate:

- A vanilla script has no component runtime, no props serialization, no virtual DOM, and no hydration mismatch class of bugs.
- The script is executed once, queries the DOM, and updates text content directly. Its entire cost is 881 bytes.
- The page has exactly one interactive region, so partial hydration would add machinery without improving anything.

If the project later grows a filterable schedule or a saved-agenda feature, the correct move is to introduce a single framework island with `client:visible`, not to convert the whole page into an SPA. The current architecture leaves that door open without paying for it now.

### 3.6 Semantic HTML5 Structure

The markup uses elements for meaning, not for default appearance:

| Element | Location | Why it matters |
| --- | --- | --- |
| `<header>` | Layout shell | Banner landmark for the brand, nav, and CTA |
| `<nav aria-label="Primary">` | Layout shell | Named navigation landmark; distinguishes it from footer link groups |
| `<main id="main">` | Layout shell | Single main landmark and skip-link target |
| `<footer>` | Layout shell | Contentinfo landmark with contact and legal copy |
| `<section>` | Every page band | Thematic grouping; each section has an accessible heading |
| `<article>` | Pillars, expectation cards | Self-contained content units |
| `<aside>` | Stats panel, venue card | Complementary content related to the main flow |
| `<h1>`–`<h3>` | Page hierarchy | Exactly one `h1` per page; no skipped levels |
| `<ol>` / `<li>` | Programme days | Ordered sequence is semantically meaningful |
| `<dl>` / `<dt>` / `<dd>` | Event facts | Term/description pairs for date, venue, cost, format |
| `<details>` / `<summary>` | FAQ | Native disclosure widget with keyboard and screen-reader behavior |
| `<blockquote>` / `<cite>` | Story pull quote | Quotation semantics and attribution |
| `<time>` | Not used | Date ranges are displayed as text chips; adding machine-readable `datetime` values is a future improvement |

Decorative layers — grid background, glows, rotating orb, marquee duplication, glitch layers — are `aria-hidden="true"` and never carry meaning. The giant "404" is hidden from assistive technology because the `h1` already states "Error 404 — This page drifted out of orbit."

### 3.7 CSS Custom Properties and Token System

All design decisions that repeat are expressed as custom properties on `:root` in `src/styles/global.css`. There is no preprocessor and no CSS-in-JS. Tokens fall into four groups:

**Color**

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#070709` | Page background, near-black with a blue bias |
| `--bg-soft` | `#0c0c10` | Alternating section background |
| `--bg-raised` | `#121217` | Hover state for cards |
| `--ink` | `#f2efe6` | Primary text, warm off-white |
| `--muted` | `#a09d95` | Body copy on dark surfaces |
| `--faint` | `#8a877f` | Small labels; meets AA at 5.61:1 |
| `--line` | `rgba(242,239,230,.14)` | Structural borders |
| `--line-soft` | `rgba(242,239,230,.08)` | Subtle dividers |
| `--lime` | `#d9ff3f` | Single accent, CTAs, live status |
| `--violet` | `#a78bfa` | Secondary glow only, never body text |
| `--black` | `#08080a` | Text on lime surfaces |

**Typography**

| Token | Value |
| --- | --- |
| `--sans` | `'Space Grotesk', ui-sans-serif, system-ui, ...` |
| `--serif` | `'Instrument Serif', 'Iowan Old Style', Georgia, serif` |

**Layout**

| Token | Value | Role |
| --- | --- | --- |
| `--container` | `1180px` | Maximum content width |
| `--gutter` | `clamp(1.25rem, 4vw, 3rem)` | Fluid page padding |
| `--header-h` | `76px` | Sticky header height, reused in hero height calculations |

**Motion**

| Token | Value |
| --- | --- |
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` |

Tokens are consumed by both global primitives (buttons, chips, sections) and Astro-scoped page styles. Because custom properties inherit through the shadow-less scope boundary, page styles can reference the same palette without importing a Sass file or duplicating hex values. Theming the entire site — for example, a future light mode — would require changing the token block, not hunting through six files.

Two tokens (`--lime-dim`, `--ease-out`) were removed during the final pass because they had zero references. The token sheet now contains only values that are actually consumed.

### 3.8 Fluid Typography

Typography scales with the viewport using `clamp(min, preferred, max)` rather than discrete breakpoint overrides. Representative formulas:

| Element | Formula | Behavior |
| --- | --- | --- |
| Hero title | `clamp(3.4rem, 15vw, 12.5rem)` | 54 px at 360 px wide, 200 px at 1440 px, capped on ultrawide |
| Hero year mark | `0.22em` of title | Keeps the `/27` proportional at every size |
| Page h1 | `clamp(2.9rem, 8.4vw, 7rem)` | About/404 display scale |
| Section h2 | `clamp(2.8rem, 7vw, 5.4rem)` | Idea headline |
| CTA h2 | `clamp(2.9rem, 8vw, 6.5rem)` | Lime band statement |
| Lede | `clamp(1.02rem, 1.45vw, 1.22rem)` | Body copy that grows gently |
| Countdown digits | `clamp(1.6rem, 3.4vw, 2.15rem)` | Stable within fixed grid cells |

The display face uses tight tracking (`letter-spacing: -0.06em` to `-0.075em`) and sub-1 line heights (`0.78`–`0.98`). That is safe because the words are short and set in a geometric sans; it would be inappropriate for long-form paragraph text, which stays at `1.6`–`1.75` line height.

Paragraphs use `text-wrap: pretty` and headings use `text-wrap: balance` where supported. Both are progressive enhancements: browsers without support fall back to normal wrapping with no layout breakage.

The mobile hero overrides the fluid formula at `max-width: 640px` (`clamp(3.2rem, 19vw, 6rem)`) to keep "SIGNAL" on one line at 390 px without shrinking the year mark into illegibility.

### 3.9 Layout Paradigms

The layout uses CSS Grid for two-dimensional composition and Flexbox for one-dimensional distribution.

Grid responsibilities:

- Hero foot: `minmax(0, 1.1fr) minmax(0, 0.9fr)` with a `clamp()` gap.
- Idea section: `1.05fr / 0.95fr` editorial split.
- Pillars: three equal columns with a 1 px gap; the gap is the border color, creating hairline dividers without extra elements.
- Programme: `1.6fr / 0.8fr` for days and stats.
- Facts: `130px / 1fr` label-value rows.
- Venue/expecation cards: two-column grids that collapse to one.

Flexbox responsibilities:

- Header: brand, nav, and CTA distributed with `justify-content: space-between`.
- Chip rows and button groups: wrapping flex rows with consistent gaps.
- Footer: brand block and link columns with `flex-wrap`.
- Countdown cells: vertical stacks inside fixed grid columns.

Responsive collapse is controlled by component-level media queries rather than a global breakpoint utility layer:

| Width | Change |
| --- | --- |
| ≤ 900 px | Hero switches from fixed viewport height to auto; hero foot and major two-column sections collapse to one column; pillars stack |
| ≤ 720 px | Header hides the "CS Society USM" descriptor; nav CTA shortens to "Updates" |
| ≤ 680 px | About expectation grid and fact rows collapse |
| ≤ 640 px | Hero title gets a mobile-specific scale; programme day rows stack; countdown/actions stack; 404 height becomes auto |
| ≤ 420 px | Header gaps and nav typography tighten |

The 1 px-gap technique deserves a note: setting `gap: 1px` on a grid whose background is `var(--line)` and whose children have `background: var(--bg)` produces crisp internal hairlines without border-collapse hacks. `overflow: hidden` plus `border-radius` clips the outer corners cleanly.

---

## 4. Toolchain, Runtime and Environment Decisions

### 4.1 Node.js 22 LTS Baseline

Astro 7.4.7 declares `"node": ">=22.23.4"` in its own package manifest. The project pins the same floor in `package.json`:

```json
"engines": { "node": ">=22.23.4" }
```

The build environment initially had no Node.js binary and no apt candidate. Rather than adding a third-party apt repository, the official Linux x64 tarball for Node 22.23.4 LTS ("Jod") was installed under the user's home:

- Extract to `~/.local/nodejs/node-v22.23.4-linux-x64`.
- Symlink `~/.local/nodejs/current` to the versioned directory.
- Prepend `~/.local/nodejs/current/bin` to `PATH` in `~/.bashrc`.

This avoids root-owned system paths, keeps the runtime disposable, and makes the exact version reproducible. The `engines` field is not decorative: Cloudflare Pages reads it (and the `NODE_VERSION` environment variable) when selecting a build image, and npm warns when the constraint is violated locally.

Why Node 22 and not 20 or 24: Astro 7's floor excludes Node 20; Node 22 is the current LTS line and is what Cloudflare's build image defaults to; Node 24 would work but is newer than the verified baseline. Pinning to the minimum supported LTS minimizes surprise.

### 4.2 ES Module Resolution

The project is ESM-only:

- `package.json` sets `"type": "module"`.
- `astro.config.mjs` uses `import { defineConfig } from 'astro/config'` and `export default`.
- Source components import layouts and components with relative specifiers and no file extensions where Astro's resolver permits it (`import BaseLayout from '../layouts/BaseLayout.astro'` does include the extension for clarity).
- Vite 8.3.6, bundled with Astro 7, performs dependency resolution and transformation.

There is no CommonJS interop layer, no `require()`, and no Babel configuration. The countdown `<script>` is TypeScript, which Vite transpiles and minifies; the emitted module uses modern syntax (optional chaining, nullish coalescing, template literals) without downleveling for legacy browsers.

The practical implication for contributors: any new config file should use `.mjs` or ESM syntax, and any Node script added to the repo must either be ESM or explicitly use `.cjs`.

### 4.3 Build Performance

Measured on the target environment (Kali Linux, x86_64):

| Operation | Time | Notes |
| --- | --- | --- |
| `npm install` (cold) | ~60 s | 193 packages, 0 vulnerabilities |
| Astro type generation | ~340 ms | Observed on the first build |
| Vite transform/build | ~300 ms | 3 static entrypoints |
| Route generation | 65–139 ms | Three routes |
| Total `npm run build` | 0.66–1.69 s | Across six runs; last build 0.66 s |
| `astro preview` startup | ~2 s | Serves `dist` on port 4321 |

The build is fast because there is almost nothing to bundle: three HTML routes, three CSS chunks, one inline script, and static assets. There is no image optimization pass (no content images), no sitemap generation, no RSS, and no framework compilation.

This has a CI consequence: a Cloudflare Pages build should complete in well under a minute even on a cold npm cache, and incremental deploys are dominated by dependency installation rather than Astro itself.

### 4.4 Dependency Minimalism Audit

| Category | Count | Detail |
| --- | --- | --- |
| Direct `dependencies` | 1 | `astro@^7.4.7` (a build-time tool, not a browser runtime) |
| Direct `devDependencies` | 0 | No test runner, linter, formatter, or CSS toolchain |
| Lockfile package entries | 283 | Includes Astro's transitive graph and platform-optional binaries |
| Packages installed in `node_modules` | 193 | 182 MB on disk, build-time only |
| Client-side runtime packages | 0 | Nothing ships to the browser |
| Production `dist` files | 15 | 260,742 bytes total, including the 111 KB OG image |

Astro is listed under `dependencies` rather than `devDependencies` because the build command needs it in production build environments; Cloudflare installs both groups regardless, but the classification matches the project's build contract. Nothing in `node_modules` is uploaded to the edge.

The audit conclusion: the dependency surface is one package and its transitive graph. There is no Tailwind/PostCSS pipeline, no icon package, no animation library, no font package, no analytics SDK, and no test framework. Every visual effect is hand-written CSS; the only script is hand-written TypeScript.

Recommendation for CI: use `npm ci` rather than `npm install` to guarantee lockfile fidelity. Cloudflare Pages detects `package-lock.json` and performs a clean install; the lockfile is committed.

### 4.5 Cloudflare Pages Target

Cloudflare Pages is a static-asset platform with Git-connected builds, atomic deployments, global CDN distribution, automatic TLS, and per-branch preview URLs. The project fits its contract without an adapter:

- Framework preset: Astro.
- Build command: `npm run build`.
- Output directory: `dist`.
- Node version: 22.23.4+ via `NODE_VERSION`.
- No Pages Functions, no `_worker.js`, no `@astrojs/cloudflare` adapter.
- No runtime environment variables or secrets.

Why this target: the assignment mandates it; it is free for this scale; Git integration provides CI/CD without a workflow file; preview deployments make review easy; and static hosting eliminates server patching, scaling, and cold-start concerns. Alternatives are weighed in ADR-007.

### 4.6 Static Build Contract

The contract is explicit in `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://signal-27.pages.dev',
  output: 'static',
  build: { format: 'directory' },
});
```

`output: 'static'` guarantees that every route is pre-rendered at build time and that no server entrypoint is emitted. The build produces:

```
dist/
├── index.html
├── about/index.html
├── 404.html
├── _astro/*.css
├── fonts/*.woff2
├── favicon.ico
├── favicon.svg
├── apple-touch-icon.png
├── og.png
├── robots.txt
└── _headers
```

`build.format: 'directory'` produces clean URLs (`/about/` backed by `about/index.html`) and — critically — Astro special-cases `src/pages/404.astro` to emit `404.html` at the site root rather than `404/index.html`. Cloudflare Pages serves that file, with a 404 status, for any unmatched path.

The `site` value is a production placeholder. It exists so canonical and Open Graph URLs are absolute at build time; it must be replaced with the real `*.pages.dev` (or custom domain) URL after the first deploy. Until then, preview builds emit canonical URLs pointing at the placeholder domain — harmless for local QA, incorrect for production SEO.

### 4.7 Edge Serving and Cold Starts

Because the output is static, there is no function invocation in the request path. "Cold start" in the serverless sense does not apply: Cloudflare serves the asset from its edge cache or fetches it from Pages storage on a cache miss, then caches it at that PoP. There is no process to boot, no dependency to load, and no per-request compute billing.

Serving characteristics:

- HTTP/2 and HTTP/3 with TLS termination at the edge.
- Brotli or gzip negotiation for text assets (Cloudflare compresses HTML, CSS, JS, and SVG automatically).
- Hashed `/_astro/*` assets can be cached immutably for a year; HTML stays revalidated so new deployments are visible immediately.
- Atomic deploys: a new build becomes active only after all assets are uploaded, so users never see a half-updated site.
- Global anycast routing places assets close to Malaysian visitors without a regional origin.

The trade-off is the absence of dynamic behavior. Anything requiring state — a real mailing list, ticket inventory, personalized schedules — would need a Pages Function, a Worker, or an external API. That is out of scope and intentionally deferred.

### 4.8 Environment Decision Summary

| Decision | Choice | Rationale | Rejected alternatives |
| --- | --- | --- | --- |
| Framework | Astro 7.4.7 | Static-first, layout system, zero JS baseline | Next.js, Eleventy, plain HTML |
| Language | TypeScript in `.astro` frontmatter and script | Astro's default; catches prop/shape errors in editor | Plain JS |
| Styling | Plain CSS with custom properties | No build plugin; full control; 27 KB total CSS | Tailwind, Sass, CSS-in-JS |
| Runtime | Node 22.23.4 LTS | Astro engine floor; Cloudflare support | Node 20 (unsupported), Node 24 (unverified) |
| Package manager | npm 10.9.9, lockfile v3 | Preinstalled with Node; Cloudflare native | pnpm, Yarn |
| Rendering | Static pre-render | No server, no cold start, cacheable | SSR, ISR, SPA |
| Interactivity | One vanilla module | 881 B; no hydration runtime | React/Preact island |
| Hosting | Cloudflare Pages | Assignment target; Git CI; global edge | Netlify, Vercel, GitHub Pages |

---

## 5. Component Hierarchy and Architectural Patterns

### 5.1 Component Tree

```
BaseLayout.astro                      (document shell, props, SEO, nav, footer)
├── <head>                            meta, canonical, OG/Twitter, icons, font preloads
├── <header>                          brand, primary nav, updates CTA
├── <main id="main">
│   ├── index.astro
│   │   ├── hero section              eyebrow, h1, lede, chips, actions
│   │   │   └── Countdown.astro       four cells + note + inline module
│   │   ├── ticker                    duplicated marquee groups
│   │   ├── idea section              headline, copy, three pillar articles
│   │   ├── programme section         ordered day list + stats aside
│   │   └── CTA section               lime band, mailto action
│   ├── about.astro
│   │   ├── page hero                 h1, lede, meta chips
│   │   ├── story section             sticky kicker, copy, pull quote
│   │   ├── expectations section      four-card grid
│   │   ├── details section           facts dl + venue aside
│   │   ├── FAQ section               native details/summary list
│   │   └── outro section             home + updates actions
│   └── 404.astro
│       └── notfound section          glitch 404, h1, copy, two actions
└── <footer>                          wordmark, link columns, legal line
```

There are no nested layout components. The shell is a single layout; pages own their sections. This is appropriate for three routes: an extra layer of layout composition would add indirection without reuse.

### 5.2 BaseLayout Component

`src/layouts/BaseLayout.astro` is the only layout. It receives three meaningful props and one optional flag:

```ts
interface Props {
  title?: string;
  description?: string;
  active?: 'home' | 'about';
  noindex?: boolean;
}
```

Defaults provide a complete home-page metadata set, so `index.astro` can render `<BaseLayout active="home">` without repeating strings. About and 404 override title and description; 404 also sets `noindex`.

#### 5.2.1 Shell and Slot Orchestration

The layout renders the full document: `<!doctype html>`, `<html lang="en">`, head, body, skip link, header, `<main id="main"><slot /></main>`, and footer. Pages supply only their section markup. This guarantees:

- Consistent landmarks and navigation on every route.
- One `<main>` per document, which assistive technology relies on.
- No page can accidentally omit the footer or duplicate the header.
- Global CSS is imported once (`import '../styles/global.css'`), so token definitions and resets are guaranteed to load before page styles.

The sticky header uses `position: sticky; top: 0; z-index: 50` with a translucent background and `backdrop-filter: blur(16px) saturate(140%)`. The grain overlay sits at `z-index: 9999` with `pointer-events: none`, so it textures the entire viewport without intercepting clicks. Decorative hero backgrounds use `z-index: -1` inside an `isolation: isolate` stacking context, preventing them from painting over content.

#### 5.2.2 Metadata and SEO Injection

Head order and purpose:

| Tag | Value / source | Why |
| --- | --- | --- |
| `charset` | `utf-8` | Must appear within the first 1024 bytes |
| `viewport` | `width=device-width, initial-scale=1` | Correct mobile layout |
| `generator` | `Astro.generator` | Framework provenance |
| `theme-color` | `#070709` | Browser chrome matches the page |
| `title` | `title` prop, default `SIGNAL/27 — Coming Soon` | Unique per page |
| `description` | `description` prop | Concise and unique per page |
| `robots` | `noindex` only on 404 | Keeps error pages out of indexes |
| `canonical` | `new URL(Astro.url.pathname, Astro.site ?? Astro.url)` | Absolute, self-referencing |
| `og:type`, `og:site_name` | `website`, `SIGNAL/27` | Social graph basics |
| `og:title`, `og:description`, `og:url` | Mirrors page metadata | Consistent share cards |
| `og:image` | `new URL('/og.png', site)` | 1200×630 social card |
| `og:image:width/height/alt` | `1200`, `630`, descriptive alt | Prevents layout guessing in unfurlers |
| `twitter:card` | `summary_large_image` | Large image card |
| `twitter:title/description/image` | Mirrors OG | X/Twitter compatibility |
| icon links | SVG, ICO, Apple touch PNG | Cross-platform tab and home-screen icons |
| font preloads | Space Grotesk, Instrument Serif italic | Removes late font discovery |

The canonical logic is worth calling out: `Astro.site` is defined in `astro.config.mjs`, so the result is absolute even during local builds. `Astro.url` is the fallback when no site is configured, which keeps the layout usable in a fresh clone. In production, the placeholder must be replaced — the code comment and `DEPLOY.md` both flag this.

#### 5.2.3 Navigation State

The header contains three navigation targets: the brand (home), Home, and About. The `active` prop drives `aria-current`:

```astro
<a href="/" aria-current={active === 'home' ? 'page' : undefined}>Home</a>
<a href="/about" aria-current={active === 'about' ? 'page' : undefined}>About</a>
```

The visual underline is driven by the same attribute selector, so the accessible state and the visual state cannot diverge:

```css
.nav-links a[aria-current='page'] { color: var(--ink); }
.nav-links a[aria-current='page']::after { transform: scaleX(1); }
```

`aria-current="page"` is the correct token for the current page in a set of navigation links. It is exposed to screen readers as "current page" and is preferable to a class-only active state.

#### 5.2.4 Skip Link and Landmarks

The first focusable element is a skip link:

```html
<a class="skip-link" href="#main">Skip to content</a>
```

It is visually positioned off-screen (`top: -100px`) and revealed on `:focus` (`top: 1rem`). Keyboard users can jump past the header and nav on every page. The target is `<main id="main">`, which is focusable as a landmark target in modern browsers.

Landmarks in the shell: `<header>` (banner), `<nav aria-label="Primary">`, `<main>`, `<footer>` (contentinfo). The footer's link groups use `<h2>` headings ("Explore", "Contact") but are not wrapped in `<nav>`; they are a short set of secondary links, and adding a second navigation landmark would require another label without improving discoverability.

Focus styling is global: `:focus-visible { outline: 2px solid var(--lime); outline-offset: 4px; }`. The lime outline is visible against every dark surface and on the lime CTA band (where focus rings inherit the same lime, slightly lower contrast but still visible against black text/button edges).

### 5.3 Home Page

`src/pages/index.astro` is the largest page (733 lines including scoped CSS). Content is data-driven from four frontmatter arrays, keeping markup repetitive-free.

#### 5.3.1 Hero Composition

The hero is a single `<section>` with layered decoration and a three-part vertical rhythm: eyebrow row, display title, foot row containing lede and the event panel.

- **Eyebrow row:** "CS Society USM presents" with a pulsing lime dot, and coordinates `05.35°N / 100.30°E` on the right. The coordinates are decorative flavour, not data.
- **Title:** `<h1>` with "SIGNAL" at `clamp(3.4rem, 15vw, 12.5rem)`, weight 600, tracking −0.075em, line-height 0.78, and a lime `/27` at 22% of the title size. The slash is part of the brand mark, not punctuation.
- **Foot:** a two-column grid. Left: the lede with an italic serif phrase. Right: three status chips ("Coming soon", date, location), the countdown, a timezone note, and two CTAs.

Decoration is CSS-only: a masked 92 px grid, two blurred radial glows (lime and violet), and a conic-gradient orb rotating every 26 s, masked to a soft ring. The orb is `aria-hidden` and sits behind the title via `z-index: -1` and `isolation: isolate`.

Entrance motion uses a single `rise` keyframe (opacity + 24 px translate) applied with staggered delays (0, 0.08 s, 0.18 s, 0.28 s). Durations are under 1 s and the animation is disabled entirely under `prefers-reduced-motion`.

Height behavior: `min-height: calc(100svh - var(--header-h))` on desktop, with `justify-content: center`. Below 900 px, `min-height: auto` and reduced padding prevent the countdown from being pushed below the fold on short or mobile viewports. This was a deliberate correction after testing at 1280×577, where a fixed viewport hero clipped the primary conversion panel.

#### 5.3.2 Marquee Mechanics

The ticker is a full-bleed lime band between the hero and the idea section. It renders the same five phrases twice:

```astro
{[0, 1].map(() => (
  <div class="ticker-group">...</div>
))}
```

The track has `width: max-content` and animates `translate3d(0, 0, 0)` → `translate3d(-50%, 0, 0)` over 34 s, linear, infinite. Because the two groups are identical and laid out in a single flex row, translating by exactly half the track width produces a seamless loop with no visible jump.

Performance properties:

- Only `transform` is animated. There is no layout, paint, or width animation, so the browser can run the animation on the compositor.
- `translate3d` requests a composited layer, avoiding repaints of the surrounding page.
- The band is `aria-hidden="true"`; the text is decorative repetition, and the same facts are available in the hero and About page.
- `overflow: hidden` on the container prevents the wide track from creating a horizontal scrollbar.
- The global reduced-motion rule collapses the animation duration to 0.01 ms, effectively freezing the marquee at its start position.

The marquee is intentionally not a carousel: there are no controls, no pause button, and no semantic content. WCAG 2.2.2 (Pause, Stop, Hide) applies to moving content that starts automatically and lasts more than five seconds; the band is decorative and aria-hidden, but the reduced-motion override ensures users who request less motion do not see it move. A stricter interpretation would add a pause control; that is noted in the quality gaps.

#### 5.3.3 Programme Grid

The programme section is a two-column grid: an ordered list of three days on the left, a 2×2 stats panel on the right.

- The `<ol>` carries sequence semantics. Each row has a 108 px stamp column ("Day 01" / "19 Mar") and a copy column with an `h3` and paragraph.
- The stats `<aside aria-label="Event at a glance">` presents four numbers with short labels. The 2×2 grid uses `:nth-child(2n)` to remove right borders and `:nth-last-child(-n + 2)` to remove bottom borders, producing a clean internal lattice.
- On mobile, day rows collapse to a single column and the stats panel spans full width.

This section is the "proof of substance" band: it shifts the page from a single poster statement to an event with an actual shape, without requiring a real schedule.

#### 5.3.4 Conversion Funnel

Three conversion points exist, all honest about the absence of a backend:

1. **Hero primary:** "Read the transmission →" to `/about`. This is education, not conversion; it captures visitors who need more than a date.
2. **Hero secondary:** "Get updates" → `mailto:hello@signal27.my?subject=Keep%20me%20in%20the%20loop...`. The subject is prefilled so replies are sortable.
3. **Final CTA:** a full lime band with "Join the transmission list →" and a `mailto:` with a different subject. The fine print says "One email when tickets drop. Nothing else. Promise."

There is no form, no fake success state, no localStorage flag, and no third-party embed. This is a deliberate integrity decision (ADR-008): a real list requires consent, storage, and a privacy story that the project does not have. The mailto approach is lower-converting but truthful, and it keeps the site fully static.

The lime band uses black text on `#d9ff3f` (17.6:1), an outlined italic "soon." via `-webkit-text-stroke`, and a dark button that inverts the page palette. It is the visual and conversion climax of the page.

### 5.4 About Page

`src/pages/about.astro` (634 lines) carries the narrative and logistics. Its job is to answer objections: What is this? Who is it for? What will it feel like? What does it cost? Where is it?

#### 5.4.1 Information Hierarchy

The page follows a deliberate density gradient:

1. **Page hero:** one `h1` ("The signal behind the noise."), a 3-sentence lede, and three meta chips (date, place, capacity). Low density, high impact.
2. **Story:** a two-column editorial spread. The left column is a sticky serif kicker ("Built by students who kept waiting for someone else to build it."); the right column is three paragraphs and a pull quote. The sticky kicker holds context while the longer copy scrolls.
3. **Expectations:** a 2×2 grid of four experience pillars (build floor, stage, labs, yard), each with a number, title, paragraph, and meta line. This is the highest-density scannable block.
4. **Details:** a definition list of five facts (when, where, who, cost, format) beside a venue card with an abstract CSS map and an external Google Maps link.
5. **FAQ:** four native disclosures covering team formation, beginner eligibility, overnight policy, and what to bring.
6. **Outro:** a short return path to the homepage and the updates mailto.

The hierarchy uses one `h1`, section-level `h2`s, and card-level `h3`s. No heading level is skipped. The sticky kicker is a `<p>`, not a heading, because it is a display statement rather than a section label.

#### 5.4.2 Details Accordion

The FAQ uses native `<details>` / `<summary>` rather than a scripted accordion:

```html
<details class="faq-item">
  <summary><span>Question</span><span class="faq-icon" aria-hidden="true"></span></summary>
  <p>Answer</p>
</details>
```

Technical consequences:

- **Keyboard and screen-reader behavior is free.** Enter/Space toggles, the expanded state is exposed, and the browser manages focus.
- **Content is always in the DOM.** Search engines and find-in-page can see answers even when collapsed, unlike JS accordions that mount content on open.
- **No JavaScript, no state management, no ARIA authoring.** The native element is the accessibility contract.
- **Visual customization:** `summary` removes the default marker (`list-style: none` plus `::-webkit-details-marker { display: none }`), and a two-bar plus icon is built from pseudo-elements. `details[open] .faq-icon::after { transform: scaleY(0); }` collapses the vertical bar into a minus, using only CSS state.

Multiple items can be open at once. That is acceptable for four short answers; an exclusive accordion would require the `name` attribute (supported in modern browsers) or JavaScript, and exclusivity offers no benefit here.

### 5.5 404 Page

The 404 page is a first-class route, not a redirect. It exists to keep a mistyped URL inside the brand experience and to provide a clear recovery path.

#### 5.5.1 HTTP Status Handling

`src/pages/404.astro` is emitted by Astro as `dist/404.html` at the site root. Cloudflare Pages uses that file as the error document for unmatched paths and returns an HTTP 404 status with it. This was verified locally:

- `GET /` → 200
- `GET /about` → 200
- `GET /does-not-exist` → 404, body contains the custom 404 copy

Testing `/404` directly is not a valid test: that route exists and returns 200. The correct test is a random path. This distinction is recorded in the QA methodology because it is a common false positive.

The page also sets `noindex` through the layout, so search engines do not index the error document. Its canonical tag currently resolves to `/404/` rather than the requested URL; this is harmless for a noindex page, but a future refinement is to omit the canonical entirely on 404 responses.

#### 5.5.2 Glitch Effect Mechanics

The visual is three stacked copies of "404":

- A base layer in `--ink`.
- A lime layer at 55% opacity.
- A violet layer at 45% opacity.

The two coloured layers are absolutely positioned over the base, `aria-hidden`, and animated with `clip-path: inset(...)` slices at specific keyframe windows (82–96% of the cycle). Outside those windows they are untransformed and fully clipped to the base position, so the number reads cleanly most of the time. The animation uses only `transform` and `clip-path`, no layout properties.

The effect is decorative: the accessible heading is "Error 404 — This page drifted out of orbit," with "Error 404 —" in a visually hidden span. The page also includes scanlines and a masked grid, both `aria-hidden`. Under `prefers-reduced-motion`, the global rule stops the glitch animation, leaving a static layered 404 that still reads correctly.

#### 5.5.3 Navigation Fallback

Two exits are provided:

- Primary: "Return to base →" to `/`.
- Secondary: "About the event" to `/about`.

The global header and footer remain visible, so there are effectively six recovery links. The page title and description are unique ("404 — Signal lost · SIGNAL/27"), and the copy explains the failure without blaming the user.

### 5.6 Countdown Component

`src/components/Countdown.astro` (139 lines including styles and script) is the only interactive component. It renders four cells and a note, and updates once per second.

Markup:

```html
<div class="countdown" data-countdown data-target="2027-03-19T09:00:00+08:00"
     role="group" aria-label="Countdown to SIGNAL/27">
  <div class="cd-cell"><span data-days>--</span><span>Days</span></div>
  ...
</div>
<p data-cd-note>Doors open 19 March 2027, 09:00 MYT</p>
```

`role="group"` is required: `aria-label` is not permitted on a generic `div` under ARIA 1.2, and axe-core flags it as a prohibited attribute. The group role gives the label a valid host without turning the timer into a live region that would announce every second.

#### 5.6.1 Time Model and Timezone Pinning

The target is an ISO 8601 timestamp with an explicit UTC offset:

```
2027-03-19T09:00:00+08:00
```

`new Date(...)` parses this to an absolute epoch instant. The countdown computes `target - Date.now()`, a duration that is independent of the visitor's local timezone. A visitor in London and a visitor in Penang see the same remaining time; only the static human-readable note differs in interpretation.

Malaysia observes UTC+8 year-round and has no daylight-saving transitions, so a fixed offset is semantically correct. This is why the component does not depend on `Intl.DateTimeFormat` or the IANA `Asia/Kuala_Lumpur` zone database: the event date is a single instant, and the offset cannot drift with DST.

If the event ever moves to a DST-observing zone, the correct change is to store an IANA zone and resolve the instant with `Temporal.ZonedDateTime` or `Intl.DateTimeFormat`, not to hand-edit an offset. That is recorded as a future-proofing note.

The timestamp is duplicated in content: the `data-target`, the note, the hero chips, the About facts, and the meta description all mention the date. There is no single event-config module yet. This is a content-coupling risk (see 6.9): a date change requires a search across the repo. A future `src/data/event.ts` exporting the date, venue, and copy would remove the duplication.

#### 5.6.2 Drift and Throttling

The timer recomputes from the absolute target on every tick:

```js
const diff = target - Date.now();
const totalSeconds = Math.floor(diff / 1000);
```

It never decrements a local counter. Consequences:

- **No cumulative error.** Even if a tick fires late, the displayed value is derived from the clock, not from the previous value.
- **Background throttling self-heals.** Browsers clamp `setInterval` in hidden tabs (to 1 Hz or less, and more aggressively under intensive throttling). When the tab becomes visible, the next tick recomputes the correct remaining time. The user never sees a counter that has fallen behind.
- **Sleep/wake is handled.** After a laptop sleeps, the next tick computes the true remaining duration.
- **System clock error is not corrected.** If the visitor's device clock is wrong by ten minutes, the countdown is wrong by ten minutes. There is no server-time handshake, NTP query, or trusted time API. For a teaser, this is an acceptable trade; the fallback note always states the canonical date. A stricter implementation would fetch a `Date` header from the origin or use a time API, adding a request and a failure mode for marginal benefit.

The interval is cleared when the target is reached. The component then sets all cells to `00`, adds `is-live`, and replaces the note with "The signal is live — see you there."

#### 5.6.3 Execution Boundary

There is no hydration directive and no framework runtime. Astro compiles the `<script>` into a deferred ES module; because it is small, the build inlines it into `index.html` as a single 881-byte `type="module"` block. Execution order:

1. HTML is parsed; cells show `--`.
2. The module executes after parsing (modules are deferred by default).
3. `document.querySelector('[data-countdown]')` finds the instance.
4. The first `render()` writes real values before the next paint in practice, then a 1 s interval continues.

The component assumes a single instance per page (`querySelector`, not `querySelectorAll`). That is true today. If a second countdown is added — for example, a compact header timer — the selector and the note lookup must be scoped to each root, or converted to `querySelectorAll` with per-instance state. This is documented rather than generalized preemptively.

#### 5.6.4 Layout Shift Prevention

Cumulative Layout Shift from a ticking clock is a real risk: digits change width, fonts load late, and cells can resize. Four measures prevent it:

- **Fixed grid columns.** The countdown is `grid-template-columns: repeat(4, 1fr)` inside a fixed-width container; each cell occupies a stable fraction regardless of digit count.
- **Tabular numerals.** `font-variant-numeric: tabular-nums` and `font-feature-settings: 'tnum'` give every digit the same advance width, so `1` and `8` occupy identical space.
- **Centered text in fixed cells.** Values are centered, so even proportional fallback glyphs do not push siblings.
- **Font preload + `font-display: swap`.** Space Grotesk is preloaded, so the swap window is short; the fallback stack has similar metrics, and the fixed cells absorb any difference.

Measured result: CLS = 0 at 1440×900 with a `layout-shift` PerformanceObserver across load and the first three seconds.

---

## 6. Performance, Accessibility and Quality Assurance

### 6.1 Asset Delivery

The production artifact is deliberately small. Excluding the social card (never loaded by the page), the entire site is roughly 149 KB on disk, and the home page transfers about 50 KB over five subresource requests.

| Asset | Raw bytes | Compressed | Loaded by page | Cache policy |
| --- | --- | --- | --- | --- |
| `index.html` | 15,587 | 3,674 gzip / 2,973 br | Yes (document) | Revalidate |
| `about/index.html` | 13,848 | 3,573 gzip / 2,811 br | On navigation | Revalidate |
| `404.html` | 8,420 | 2,531 gzip / 2,038 br | On error | Revalidate |
| `BaseLayout.*.css` | 9,192 | 2,799 gzip / 2,435 br | Yes | 1 year immutable |
| `index.*.css` | 9,777 | 2,354 gzip / 2,038 br | Home | 1 year immutable |
| `about.*.css` | 7,222 | 1,804 gzip / 1,550 br | About | 1 year immutable |
| Space Grotesk woff2 | 22,288 | woff2 (precompressed) | Yes, preloaded | 1 year immutable |
| Instrument Serif italic woff2 | 22,128 | woff2 | Yes, preloaded | 1 year immutable |
| Instrument Serif roman woff2 | 21,032 | woff2 | Only if roman serif used | 1 year immutable |
| `og.png` | 111,445 | PNG | No (social crawlers) | 1 day/default |
| `favicon.ico` | 8,580 | ICO | Browser tab | 1 day/default |
| `favicon.svg` | 329 | SVG | Browser tab | 1 day/default |
| `apple-touch-icon.png` | 10,569 | PNG | iOS home screen | 1 day/default |

The CSS is split by Astro: the shared layout chunk plus one page chunk. A visitor who only reads the home page never downloads the About page's 7.2 KB CSS. The 404 page's CSS is inlined because it is below Astro's inlining threshold, saving a request on the error path.

There are no raster content images, no icon fonts, no video, and no third-party embeds. The visual richness comes from CSS gradients, masks, and typography.

### 6.2 Webfont Pipeline

Three woff2 files are self-hosted in `public/fonts/`:

| File | Family | Style | Weight | Bytes |
| --- | --- | --- | --- | --- |
| `space-grotesk-latin.woff2` | Space Grotesk | normal | 300–700 variable | 22,288 |
| `instrument-serif-regular.woff2` | Instrument Serif | normal | 400 | 21,032 |
| `instrument-serif-italic.woff2` | Instrument Serif | italic | 400 | 22,128 |

Implementation details:

- `@font-face` uses `format('woff2-variations')` for the variable Space Grotesk file and a weight range of `300 700`.
- Both above-the-fold faces (Space Grotesk and Instrument Serif italic) are preloaded with `as="font"`, `type="font/woff2"`, and `crossorigin`. The roman serif is not preloaded because the design uses the italic for all display accents; the roman is available as a fallback for any future editorial copy.
- `font-display: swap` ensures text is readable immediately, even on a slow font fetch.
- The subsets are latin-only, which is sufficient for the English copy and keeps each file near 22 KB instead of 60–100 KB for full character sets.
- Both families are licensed under the SIL Open Font License, so self-hosting and redistribution are permitted. Attribution is not required in the UI but is good practice in the repository.
- No request goes to `fonts.googleapis.com` or `fonts.gstatic.com`. That removes a third-party connection, a privacy consideration, and a failure mode where the CDN is blocked.

Fallback stacks are metrics-compatible enough that the swap does not shift the fixed-grid countdown; the hero title, however, will reflow slightly when the display face loads. Preloading keeps that window short. A future improvement is `size-adjust`/`ascent-override` fallback tuning, but the measured CLS is already 0.

### 6.3 Image and Icon Pipeline

- **Favicon SVG:** hand-authored 64×64 vector with a lime rounded square and black "S/" mark. Scales cleanly and is the primary icon for modern browsers.
- **Favicon ICO:** generated from a 256×256 PIL render with sizes 16, 32, 48, and 64 for legacy tabs and bookmarks.
- **Apple touch icon:** 180×180 PNG generated from the same 512 px master. iOS does not reliably support SVG for `apple-touch-icon`, so a PNG is required; this was added during the documentation pass after the initial SVG-only link was identified as a gap.
- **Open Graph image:** 1200×630 PNG rendered from a dedicated dark composition with the display fonts, captured at exact pixel dimensions via CDP clipping. It is referenced by absolute URL and includes width, height, and alt metadata. It is not loaded by the page itself, so it does not affect runtime performance.

No content imagery is used. The venue "map" is an abstract CSS composition (grid, radial glow, pulsing ring, pin) rather than a real map embed, which avoids a third-party iframe, cookie banner, and layout shift. The "Open in Maps" link hands off to Google Maps in a new tab with `rel="noopener noreferrer"`.

### 6.4 Accessibility Model

The implementation targets WCAG 2.0 A/AA and was audited with axe-core 4.10.2 at 390 px and 1440 px viewports.

Structural accessibility:

- `lang="en"` on the document.
- One `<h1>` per page; heading levels descend without skips.
- Banner, navigation, main, and contentinfo landmarks on every route.
- Skip link as the first focusable element, targeting `#main`.
- `aria-current="page"` on the active nav item.
- Named primary navigation (`aria-label="Primary"`).
- Decorative layers marked `aria-hidden="true"`; no meaningful content is hidden.
- The countdown is a labelled `role="group"`, not a live region, so it does not announce every second.
- The 404's giant numeral is decorative; the `h1` carries the error meaning in text.
- Native `<details>` provides keyboard operation and expanded-state semantics for the FAQ.
- All interactive elements are native anchors; there are no clickable `<div>`s, no custom keyboard handlers, and no focus traps.
- `:focus-visible` outlines are defined globally with a 2 px lime outline and 3–4 px offset.
- External links include `rel="noopener noreferrer"` and, where relevant, `target="_blank"` with visible ↗ affordance.
- Motion respects `prefers-reduced-motion`: all animations and transitions collapse to 0.01 ms, and smooth scrolling is disabled.

Audit result:

| Viewport | Violations | Passes | Incomplete | Notes |
| --- | --- | --- | --- | --- |
| 390×844 | 0 | 16 | 2 (before ARIA fix) | aria-prohibited-attr on countdown and color-contrast |
| 1440×900 | 0 | 19 | 48 color-contrast | After adding `role="group"`; contrast items are manual-review only |

The 48 color-contrast "incomplete" results are not failures. axe-core cannot compute an effective background when text sits over gradients, blended layers, or the grain overlay, so it defers to manual review. The palette was validated numerically (section 6.5), and the combinations used for body text all exceed 4.5:1.

### 6.5 Contrast Validation

Relative luminance and contrast ratios were computed against the actual background values, not estimated:

| Foreground | Background | Ratio | WCAG AA normal text | Use |
| --- | --- | --- | --- | --- |
| `--ink` `#f2efe6` | `--bg` `#070709` | 17.51:1 | Pass | Headings, primary copy |
| `--muted` `#a09d95` | `--bg` `#070709` | 7.43:1 | Pass | Body paragraphs |
| `--faint` `#8a877f` | `--bg` `#070709` | 5.61:1 | Pass | Small labels, meta |
| `--lime` `#d9ff3f` | `--bg` `#070709` | 17.56:1 | Pass | Accent, links, live state |
| `--black` `#08080a` | `--lime` `#d9ff3f` | 17.58:1 | Pass | Text on CTA band |
| CTA copy at 72% black | `--lime` | 7.92:1 | Pass | Lime-band paragraph |
| CTA fine print at 68% black | `--lime` | 6.84:1 | Pass | Legal microcopy |
| CTA eyebrow at 62% black | `--lime` | 5.51:1 | Pass | Section label on lime |

Two corrections were made during QA:

- `--faint` was originally `#6d6a64`, which measures 3.73:1 on `#070709` and fails AA for normal text. It was raised to `#8a877f` (5.61:1).
- The lime band's fine print was originally 55% black (4.34:1, just under 4.5). It was darkened to 68% (6.84:1).

The violet accent (`#a78bfa`) is used only in decorative glows and the glitch layer, never for text, so it does not carry a contrast requirement.

### 6.6 Responsive and Layout Stability

Breakpoints are component-scoped rather than globally standardized, but they cluster around four practical widths:

| Breakpoint | Scope | Behavior |
| --- | --- | --- |
| 900 px | Home hero, About story/details, programme | Two-column layouts collapse; hero height becomes auto |
| 720 px | Header | Brand descriptor hidden; CTA shortens |
| 680 px | About expectations, facts | Grids collapse to one column |
| 640 px | Home hero, day rows, 404 | Mobile title scale; stacked actions; auto 404 height |
| 420 px | Header | Tighter gaps and nav type |

Tested viewports and results:

| Viewport | `scrollWidth` | `innerWidth` | Horizontal overflow | Notes |
| --- | --- | --- | --- | --- |
| 390×844 | 390 | 390 | None | Mobile hero, stacked countdown, single-column cards |
| 768×1024 | 768 | 768 | None | Stacked hero, two-column cards remain |
| 1280×800 | 1280 | 1280 | None | Desktop hero, countdown in right panel |
| 1440×900 | 1440 | 1440 | None | Maximum container, hero centered |

Sources of potential overflow and their containment:

- The 200 px hero title is clamped by viewport width; the container has `overflow-x: hidden` on `body` as a final guard.
- The marquee track is wider than the viewport but clipped by `.ticker { overflow: hidden }`.
- The rotating orb extends beyond the hero but is clipped by `.hero { overflow: hidden }` and masked.
- Long unbroken strings (email addresses) are short enough not to overflow; no `overflow-wrap` is needed, but adding it to prose would be harmless.

Layout stability is reinforced by reserving space for the sticky header (`--header-h`), using `min-height` rather than fixed heights for sections, and keeping the countdown in fixed grid cells. CLS measured 0 at 1440×900.

### 6.7 Measured Baseline

Environment: Kali Linux x86_64, Chromium via CDP, viewport 1440×900, local `astro preview`, cold cache per navigation.

| Metric | Value | Method |
| --- | --- | --- |
| Build time | 0.66–1.69 s | `npm run build` wall clock across runs |
| Static routes | 3 | Build log |
| `dist` size | 260,742 B / 15 files | `du -sb dist` |
| Home HTML | 15,587 B (2,973 B brotli) | File + compression |
| Home CSS | 9,192 B + 9,777 B (4,473 B brotli combined) | Two chunks |
| Fonts | 65,448 B total | File sizes |
| Initial subresources | 5 requests / 51,448 B | `performance.getEntriesByType('resource')` |
| Client JS | 881 B inline | HTML inspection |
| CLS | 0 | `layout-shift` PerformanceObserver, 3 s |
| axe violations | 0 | axe-core 4.10.2, WCAG 2.0 A/AA |
| DOM nodes (home) | 215 | `document.getElementsByTagName('*').length` |

The 51 KB subresource total is dominated by the two preloaded fonts (45 KB). HTML and CSS together are about 7.4 KB compressed (Brotli) on the home route. This is close to the practical floor for a custom-typography static page.

### 6.8 QA Methodology

The verification is reproducible with the commands below. It deliberately combines compiler checks, HTTP checks, DOM checks, and visual/accessibility audits.

1. **Build:** `npm run build`. Assert exit code 0 and three generated routes.
2. **Artifact inspection:** `ls dist` must contain `index.html`, `about/index.html`, `404.html`, and `_astro/`. Confirm `404.html` is at the root, not under `404/`.
3. **Serve production output:** `npm run preview -- --host 127.0.0.1 --port 4321`. Preview serves `dist`, not the dev server, so it tests the real artifact.
4. **HTTP status matrix:** `curl -s -o /dev/null -w '%{http_code}'` for `/`, `/about`, and a random path. Expect 200, 200, 404.
5. **404 body assertion:** fetch the random path and assert it contains "This page drifted" and "Return to base".
6. **Navigation click test:** click Home → About → brand; assert `location.pathname` and that exactly one link has `aria-current="page"`.
7. **Countdown liveness:** read `[data-seconds]`, wait 2 s, read again; assert the value changed or wrapped.
8. **Link crawl:** parse every `href` in the built HTML, resolve internal targets against `dist`, and assert no missing files. External links (`mailto:`, Google Maps) are checked for correct scheme.
9. **Overflow matrix:** at 390, 768, 1280, and 1440 px, assert `document.documentElement.scrollWidth === window.innerWidth`.
10. **Accessibility audit:** inject axe-core 4.10.2, run `axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] })`, and assert zero violations. Review any incomplete items manually.
11. **Visual QA:** full-page screenshots at desktop and mobile, inspected for clipping, spacing, and contrast. Screenshots are taken at least 1.5 s after navigation so entrance animations have finished.
12. **Performance sampling:** `performance.getEntriesByType('resource')` for request count/transfer, and a `layout-shift` observer for CLS.

All twelve checks passed on the final artifact except the deployment-specific checks (public URL, PR), which require external credentials.

### 6.9 Known Quality Gaps

| Gap | Impact | Mitigation / next step |
| --- | --- | --- |
| No public `*.pages.dev` deployment | Success metric "live URL" unmet | `DEPLOY.md` runbook; requires Cloudflare authorization |
| No PR to upstream | Review workflow incomplete | Branch is published; open the PR from the fork |
| Countdown trusts device clock | Wrong local clock shows wrong remaining time | Static date note is always correct; add server-time endpoint if precision matters |
| Event data duplicated across copy | Date/venue changes require multi-file edits | Introduce `src/data/event.ts` as single source |
| No automated test suite | Regressions rely on manual QA | Add Playwright smoke tests for routes, nav, 404, countdown |
| No `astro check` in CI | Type errors in `.astro` frontmatter are not gated | Add `@astrojs/check` + `typescript` and a `check` script |
| No sitemap | Search engines discover pages via links only | Add `@astrojs/sitemap` and reference it in `robots.txt` |
| 404 canonical points to `/404/` | Minor SEO inconsistency on an error page | Omit canonical or set it to the site root for 404 |
| Footer year hardcoded to 2026 | Stale in 2027 | Compute at build time with `new Date().getFullYear()` |
| `site` is a placeholder | Canonical/OG URLs wrong until edited | Update after first deploy (documented) |
| No CSP | Static security headers only | Add a CSP with hashes for the inline script/style if policy requires |
| Marquee has no pause control | Strict WCAG 2.2.2 interpretation | Decorative + aria-hidden + reduced-motion; add pause if content becomes meaningful |
| 48 axe contrast items are "incomplete" | Manual review burden | Numeric palette validation covers current text; recheck after theme changes |

None of these gaps blocks the site's core function. The first two are the only ones that prevent the assignment's "Definition of Done" from being fully satisfied, and both are credential-bound rather than code-bound.

---

## 7. Repository and Deployment Operations

### 7.1 Branching Model

The repository preserves upstream history. `main` is the upstream baseline (`8c6b5e1`, the November 2026 README merge). All implementation work lives on `feat/signal-27-teaser`, created from `main` before the first commit.

```
main       8c6b5e1  Merge pull request #2 ... (assignment baseline)
└── feat/signal-27-teaser
           858aca3  Build SIGNAL/27 coming-soon site with Astro
           4d5b203  Align Node engine with Astro 7 and record accessibility audit
           e08468d  Make static output explicit and fix countdown ARIA role
           8eaa2d3  Remove unused design tokens
           36eda66  Add PNG apple-touch-icon for iOS
           95eb7e1  Add technical specification and architecture decision record
```

The branch is intentionally narrow in scope: one feature, a focused commit series, no unrelated changes to the assignment README. This keeps a future PR reviewable and makes revert straightforward.

Remote layout:

- `origin` → `git@github.com:LoZHong/Monthly-Task-Nov-2026.git` (the fork).
- Upstream baseline history is intact; no force-push or history rewrite occurred.
- The feature branch is pushed to `origin`; the remote branch tracks the implementation commits. No pull request was opened from this environment.

### 7.2 Commit History

| Commit | Message | Scope |
| --- | --- | --- |
| `858aca3` | Build SIGNAL/27 coming-soon site with Astro | Layout, three pages, countdown, global CSS, fonts, favicon, OG image, headers, deployment guide, progress log |
| `4d5b203` | Align Node engine with Astro 7 and record accessibility audit | `engines` floor corrected to `>=22.23.4`; progress log updated with axe results |
| `e08468d` | Make static output explicit and fix countdown ARIA role | `output: 'static'`; `role="group"` on countdown; progress log |
| `8eaa2d3` | Remove unused design tokens | Deleted `--lime-dim` and `--ease-out` (zero references) |
| `36eda66` | Add PNG apple-touch-icon for iOS | 180×180 PNG and layout link |
| `95eb7e1` | Add technical specification and architecture decision record | This document, progress log, branch push |

Commit messages are imperative, scoped, and explain the change rather than the activity. The repository has no merge commits on the feature branch, no fixup commits, and no generated artifacts (`dist/`, `node_modules/`, `.astro/`) in version control.

`.gitignore` covers build output (`dist/`), generated types (`.astro/`), dependencies (`node_modules/`), logs, `.env` files, and editor/OS noise. The lockfile is committed; the build output is not.

### 7.3 Cloudflare Pages CI/CD

The pipeline is Git-driven; no workflow YAML is required.

**Initial setup**

1. Push `feat/signal-27-teaser` to the fork and open a PR to the upstream USM CSS repository.
2. In Cloudflare, open **Workers & Pages → Create application → Pages → Connect to Git**.
3. Authorize GitHub and select the fork (`LoZHong/Monthly-Task-Nov-2026`).
4. Select the production branch. For a task submission, `main` is conventional; the feature branch can be used for a preview deployment before merge.
5. Framework preset: **Astro**. Confirm:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
6. Environment variable: `NODE_VERSION=22.23.4` (or `22`). Without it, the build image may select an older Node that Astro 7 rejects.
7. Save and deploy.

**Build execution**

Cloudflare checks out the commit, restores the npm cache, installs dependencies from `package-lock.json`, runs `npm run build`, and uploads `dist` as an atomic deployment. Astro performs type generation, Vite bundling, and static route generation; no adapter or function bundle is produced. Expected build time is under a minute on a warm cache and dominated by `npm install` on a cold cache.

**Preview and production**

- Non-production branches get unique preview URLs (`<hash>.<project>.pages.dev`) with the same build settings.
- The production branch deploys to `<project>.pages.dev` and any attached custom domain.
- Each deployment is immutable and retained in deployment history.

**Post-deploy configuration**

1. Copy the assigned production URL.
2. Replace `site` in `astro.config.mjs` with that origin (no trailing slash).
3. Commit and push. This corrects canonical, Open Graph, and Twitter image URLs.
4. Replace the fictional `hello@signal27.my` address in all `mailto:` links and the footer with the society's real inbox.
5. Re-run the post-deploy checklist in `DEPLOY.md`.

**CLI alternative**

```bash
npx wrangler pages deploy dist --project-name signal-27
```

The first invocation opens a browser for OAuth. This path is useful for manual uploads but bypasses the Git integration; the Git flow is preferred because it gives previews and traceability.

### 7.4 Environment Variables

| Variable | Required | Value | Purpose |
| --- | --- | --- | --- |
| `NODE_VERSION` | Recommended | `22.23.4` | Pin the build image to a Node version Astro 7 supports |
| `NPM_VERSION` | No | — | npm bundled with Node is sufficient |
| Any `PUBLIC_*` | No | — | The site has no runtime configuration |
| Secrets | No | — | No API keys, tokens, or credentials are used |

Because there is no server runtime and no build-time secret, the site can be rebuilt from a clean clone with only Node installed. This is a security and operational advantage: there is no secret rotation, no environment drift, and no production-only code path.

### 7.5 Caching and Security Headers

`public/_headers` is copied verbatim into `dist/_headers` and interpreted by Cloudflare Pages:

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
```

| Header | Scope | Rationale |
| --- | --- | --- |
| `X-Content-Type-Options: nosniff` | All | Prevents MIME confusion attacks |
| `Referrer-Policy: strict-origin-when-cross-origin` | All | Sends only origin on cross-site navigation; full path same-origin |
| `X-Frame-Options: DENY` | All | Blocks clickjacking via framing; the site has no embed use case |
| `Permissions-Policy` | All | Explicitly disables camera, microphone, and geolocation |
| `Cache-Control: immutable` | Hashed assets, fonts | One-year cache is safe because filenames change on content change |

HTML is intentionally not given a long cache. Cloudflare's default revalidation ensures a new deployment is visible immediately, while hashed assets remain cached indefinitely. This is the standard static-site cache strategy: content-addressed assets are immutable; entry documents are fresh.

A Content Security Policy is not set. The page contains one inline module and inlined critical CSS on the 404 route, so a strict CSP would require hashes or nonces generated at build time. Given the absence of third-party scripts, user input, and dynamic content, the current header set is proportionate. A future hardening pass could add `default-src 'self'; script-src 'self' 'sha256-...'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'`.

### 7.6 Routing Conventions

| URL | File | Status | Notes |
| --- | --- | --- | --- |
| `/` | `dist/index.html` | 200 | Home |
| `/about` and `/about/` | `dist/about/index.html` | 200 | Directory format; Cloudflare resolves both |
| `/404` | `dist/404.html` | 200 | Direct route exists; not the error path under test |
| Any unmatched path | `dist/404.html` | 404 | Host-level error document |
| `/_astro/*` | Hashed CSS | 200 | Immutable cache |
| `/fonts/*` | woff2 | 200 | Immutable cache |

There is no SPA fallback rewrite (`/* /index.html 200`). Adding one would break the 404 contract by returning the homepage with a 200 status for every typo, which is precisely the behavior the assignment tests against. The site is a multi-page application; each URL maps to a real document.

`build.format: 'directory'` is chosen over `'file'` because it produces clean URLs and predictable relative asset paths. Astro still special-cases `404.astro` to the root, which is the behavior Cloudflare expects.

### 7.7 Release Runbook

**Pre-flight (local)**

1. `git status` is clean and on the intended branch.
2. `npm ci` (or `npm install`) completes with zero vulnerabilities.
3. `npm run build` exits 0 and reports 3 pages.
4. `ls dist` contains `index.html`, `about/index.html`, `404.html`, `_headers`.
5. `npm run preview` and run the HTTP matrix: 200 / 200 / 404.
6. Click nav both ways; confirm active state.
7. Confirm countdown ticks and the static date note is visible.
8. Run the 390/768/1280/1440 overflow checks.
9. Run axe; confirm zero violations.

**Deploy**

1. Push the branch and merge to the production branch (or push directly, depending on the workflow).
2. Cloudflare builds and deploys atomically.
3. Watch the build log for `3 page(s) built` and a successful upload.
4. Open the deployment URL.

**Post-flight**

1. `curl -I` the production `/` and `/about`; expect 200.
2. Request a random path; expect 404 and the custom page.
3. View source; confirm canonical and `og:image` use the production origin.
4. Confirm fonts load from the same origin (no third-party requests).
5. Test on a real phone: nav, countdown, `mailto:` behavior.
6. Share the URL in a social preview debugger if available; confirm the OG card renders.
7. Update `site` if the assigned URL differs from the placeholder and redeploy.

### 7.8 Rollback Procedure

Cloudflare retains every deployment. To roll back:

1. Open the Cloudflare dashboard at **Workers & Pages → project-name → Deployments**.
2. Select the last known-good deployment.
3. Choose **Rollback** (or "Promote to production"). The previous asset set becomes active atomically.

For code-level rollback:

```bash
git revert <commit>
git push
```

This creates a new commit rather than rewriting history, so the audit trail is preserved and Cloudflare deploys the reverted state normally. Because assets are content-hashed, stale caches cannot serve a mismatched HTML/CSS pair; the new HTML references new hashes.

If a bad deploy involved a header change, verify `_headers` after rollback with `curl -I`. If a custom domain or DNS change is involved, allow for TTL propagation; the Pages URL remains a reliable fallback.

---

## 8. Architecture Decision Records

Each ADR follows a lightweight Michael Nygard structure: context, decision, consequences, alternatives, status. The records are ordered by the sequence in which the decisions became relevant.

### 8.1 ADR-001 Astro as the Static Site Framework

**Status:** Accepted

**Context:** The assignment requires an Astro project with layouts, file-based routing, and Cloudflare Pages deployment. The product is a three-page teaser with one interactive clock. The team needs a framework that teaches component composition and produces a static artifact without a server.

**Decision:** Use Astro 7.4.7 with `output: 'static'`, file-based routing under `src/pages/`, and a single `BaseLayout.astro` for the document shell.

**Consequences:**

- Pages are pre-rendered to HTML at build time; there is no server runtime, no cold start, and no adapter.
- Component frontmatter runs in Node and never ships to the browser.
- Astro's scoped styles produce per-route CSS chunks, reducing payload on pages that do not need certain styles.
- The framework's engine floor (Node ≥ 22.23.4) becomes a hard environment constraint.
- Contributors must learn `.astro` syntax, but it is a thin layer over HTML/JSX-like expressions.

**Alternatives considered:**

- *Next.js/Remix:* more runtime and hydration than the site needs; deployment would require a server or a static export with extra configuration.
- *Eleventy:* excellent static generator, but not the assigned framework and lacks Astro's component-scoped styling and islands model.
- *Plain HTML/CSS:* would satisfy the output but not the assignment's learning objectives (layouts, routing, components).

### 8.2 ADR-002 Plain CSS Instead of Tailwind

**Status:** Accepted

**Context:** The README says Tailwind is "recommended" but explicitly allows plain CSS in `<style>` tags. The design is bespoke: editorial type, layered gradients, a marquee, and a glitch effect. Utility classes would either be heavily customized or supplemented with arbitrary values.

**Decision:** Use one global stylesheet for tokens, reset, typography, buttons, and shared primitives, plus Astro-scoped `<style>` blocks for page-specific layout.

**Consequences:**

- No Tailwind/PostCSS build step, no config file, no content-scanning overhead.
- Total CSS is about 26 KB uncompressed across three chunks; gzip/brotli brings the home route under 5 KB of CSS.
- Design tokens are centralized; page styles consume them without duplication.
- The team must maintain naming discipline and avoid selector sprawl. Scoped styles mitigate collisions but do not enforce a methodology.
- Responsive rules live next to the components they affect, which is easier to reason about for a small site but would not scale to a large design system without conventions.

**Alternatives considered:**

- *Tailwind CSS v4:* fast to prototype, but the design's custom gradients, masks, and keyframes would still require custom CSS; the added toolchain was not justified for three pages.
- *Sass:* variables and nesting are nice, but native custom properties and modern CSS nesting cover the needs; one less dependency.
- *CSS Modules:* Astro's scoped styles already provide isolation with zero configuration.

### 8.3 ADR-003 Self-Hosted Webfonts

**Status:** Accepted

**Context:** The design depends on a geometric sans (Space Grotesk) and a high-contrast serif (Instrument Serif). A Google Fonts link would add a third-party connection, a privacy consideration, and a render-blocking stylesheet on a slow network.

**Decision:** Download the latin woff2 subsets, store them in `public/fonts/`, declare `@font-face` locally, preload the two above-the-fold faces, and use `font-display: swap`.

**Consequences:**

- Fonts are served from the same origin, eliminating a third-party DNS/TLS handshake and any CDN blocking risk.
- Total font payload is 65,448 bytes for three files; only two are preloaded and typically fetched on the home page.
- Assets are same-origin and cacheable. No offline guarantee is implemented; there is no service worker.
- The repository carries binary font assets; licensing (SIL OFL) permits this, but attribution should be preserved.
- Font updates require re-downloading subsets and re-testing metrics.

**Alternatives considered:**

- *Google Fonts CDN:* simplest markup, but third-party dependency and privacy trade-offs.
- *System font stack only:* fastest, but loses the editorial identity that differentiates the teaser.
- *Fontsource npm packages:* convenient, but adds a dependency and often ships more subsets than needed.

### 8.4 ADR-004 No UI Framework Islands

**Status:** Accepted

**Context:** The only client interaction is a countdown. Astro supports React, Preact, Svelte, Vue, and Solid islands with selective hydration. Adding a framework would introduce a runtime, a build integration, and a hydration boundary for four text nodes.

**Decision:** Implement the countdown as a vanilla TypeScript module inside the Astro component. Use no client directives and install no UI framework.

**Consequences:**

- Client JavaScript is 881 bytes, inlined; there are zero `.js` requests and no hydration runtime.
- The script is straightforward DOM manipulation with no virtual DOM, props serialization, or mismatch risk.
- Testing is simple: query the DOM, wait, assert the text changed.
- If future features need complex state (filters, drag-and-drop, saved schedules), the team must either write more imperative code or introduce a framework island deliberately. The architecture does not prevent that; it simply does not pay for it now.
- The script assumes a single countdown instance per page.

**Alternatives considered:**

- *React/Preact island with `client:visible`:* idiomatic Astro, but adds 10–40 KB of runtime for a timer.
- *Web Component:* encapsulate the countdown, but adds lifecycle complexity and styling friction for little gain.
- *Pure CSS animation:* could animate a fake progress bar, but cannot display an accurate remaining duration.

### 8.5 ADR-005 Fixed UTC Offset Timestamp

**Status:** Accepted

**Context:** The event is in Penang, Malaysia, which observes UTC+8 year-round with no daylight-saving transitions. The countdown must mean the same instant for every visitor, regardless of their device timezone.

**Decision:** Store the target as an ISO 8601 string with an explicit offset (`2027-03-19T09:00:00+08:00`) and parse it with `new Date()`. Display the human-readable note as "09:00 MYT".

**Consequences:**

- The countdown is timezone-independent because the parsed value is an absolute epoch.
- No IANA timezone database or `Intl` formatting is needed.
- The fixed offset is correct for Malaysia but would be wrong for a DST-observing venue; the event is fictional and fixed, so this is acceptable.
- The date appears in multiple copy locations (hero chips, About facts, meta description, note). Changing it requires a coordinated edit until a central event config is introduced.

**Alternatives considered:**

- *IANA zone + `Intl.DateTimeFormat`:* robust for DST, but overkill for a fixed-offset venue and adds parsing complexity.
- *`Temporal.ZonedDateTime`:* the right long-term API, but browser support and polyfill cost are unnecessary here.
- *Server-provided time:* would require an API and a failure path; the countdown is decorative enough that device time is acceptable.

### 8.6 ADR-006 Directory Routing and Root 404

**Status:** Accepted

**Context:** Cloudflare Pages expects a `404.html` at the publish root for custom error handling. Astro supports `build.format: 'file' | 'directory'`, and its 404 handling differs from ordinary routes.

**Decision:** Use `build.format: 'directory'` and rely on Astro's special-case emission of `src/pages/404.astro` to `dist/404.html`.

**Consequences:**

- Clean URLs (`/about/`) and predictable relative paths.
- The 404 document is at the root and is served with a 404 status by Cloudflare for unmatched paths.
- The `/404` route itself also exists and returns 200; tests must use a random path, not `/404`.
- No SPA rewrite is needed or desirable; adding one would break the error contract.
- If Astro's 404 emission behavior changes in a future major, the build must be re-verified with `ls dist`.

**Alternatives considered:**

- *`build.format: 'file'`:* produces `/about.html`, which works but yields less clean URLs and different canonical paths.
- *Client-side 404 handling:* would require an SPA and return 200 for missing pages, violating the requirement.
- *Host rewrite rules:* unnecessary complexity when the framework already emits the right file.

### 8.7 ADR-007 Cloudflare Pages as Host

**Status:** Accepted

**Context:** The assignment mandates Cloudflare Pages. The site is fully static, has no server logic, and targets an audience in Malaysia. The society needs free hosting, TLS, and a Git-driven workflow.

**Decision:** Deploy to Cloudflare Pages via Git integration with the Astro preset, build `npm run build`, output `dist`, and Node 22.23.4+.

**Consequences:**

- Global CDN, automatic TLS, atomic deploys, and per-branch preview URLs at no cost.
- No adapter, no Functions, no cold starts, no server patching.
- Vendor lock-in is minimal because the artifact is plain static files; moving to Netlify, Vercel, or GitHub Pages would require only build settings.
- Cloudflare's build image Node version must be pinned explicitly to avoid picking an unsupported release.
- Deployment requires the account owner's authorization; this environment cannot create the project.

**Alternatives considered:**

- *Netlify:* comparable static hosting and Git workflow; not the assignment target.
- *Vercel:* excellent DX, but oriented toward Next.js and serverless; unnecessary for static files.
- *GitHub Pages:* free and simple, but custom 404 behavior and header control are less flexible; not the assignment target.

### 8.8 ADR-008 Mailto Calls to Action

**Status:** Accepted

**Context:** The teaser needs a "get updates" action before tickets exist. A real email capture requires a backend, a privacy policy, consent handling, and spam protection. The project has none of these, and the assignment does not ask for them.

**Decision:** Use `mailto:` links with prefilled subjects for all update CTAs. Do not render a form, do not fake a success state, and do not embed a third-party capture widget.

**Consequences:**

- The site remains fully static with no data collection, cookies, or privacy surface.
- The action depends on the visitor having a configured mail client; on shared or mobile devices this may be friction.
- Conversion is lower than a one-field form, but every conversion is real and intentional.
- The email address is exposed in markup and will attract spam; a role address with filtering is recommended.
- If a real list is added later, the CTA can be swapped for a form endpoint without changing the page architecture.

**Alternatives considered:**

- *Formspree/Netlify Forms:* quick capture, but introduces a third party, a privacy notice, and a dependency.
- *Cloudflare Pages Function + KV:* keeps it in-platform but adds server code, validation, rate limiting, and consent — out of scope.
- *Fake client-side form:* dishonest and worse than no form.

### 8.9 ADR-009 Global Tokens with Scoped Page Styles

**Status:** Accepted

**Context:** Three pages share a visual language but have different layouts. A single global stylesheet would grow into a monolith; fully scoped styles would duplicate palette and typography values.

**Decision:** Put design tokens, reset, typography primitives, buttons, chips, and shared layout utilities in `src/styles/global.css`. Put page-specific layout, decoration, and responsive rules in each page's scoped `<style>` block. Put component-specific styles (countdown) in the component.

**Consequences:**

- The palette and type scale have one source of truth.
- Astro emits per-route CSS, so unused page styles are not shipped to other routes.
- Media queries are page-local, which avoids a global breakpoint abstraction but can lead to near-duplicate rules across pages.
- Selector names are scoped by Astro, reducing collision risk without BEM-level discipline.

**Alternatives considered:**

- *One global stylesheet:* simpler mental model, but ships all page CSS everywhere and becomes hard to navigate.
- *CSS Modules:* similar isolation with more ceremony; Astro scoping is zero-config.
- *Tailwind:* see ADR-002.

### 8.10 ADR-010 Documentation as a First-Class Artifact

**Status:** Accepted

**Context:** The repository is a learning submission and a handoff. The assignment README describes the task, not the implementation. Future maintainers need deployment steps, verification evidence, and the reasoning behind non-obvious choices.

**Decision:** Maintain three documents alongside the code: `DEPLOY.md` for the operational runbook, `progress.md` for chronological state, and `TECHNICAL_DOCUMENTATION.md` (this file) for the specification and ADR log. Keep the assignment README untouched as the requirement baseline.

**Consequences:**

- Reviewers can verify claims without reverse-engineering the code.
- Deployment steps are explicit and do not depend on tribal knowledge.
- Documentation must be updated when behavior changes; stale docs are worse than none.
- The ADR log creates a decision trail but is not a substitute for automated tests.

**Alternatives considered:**

- *GitHub Wiki only:* good for browsing, but not versioned with the code or reviewable in a PR.
- *Code comments only:* too local for cross-cutting decisions.
- *No docs:* unacceptable for a handoff and for the assignment's review model.

---

## 9. Appendices

### 9.1 File Manifest

| Path | Lines | Bytes | Role |
| --- | --- | --- | --- |
| `src/layouts/BaseLayout.astro` | 363 | ~12 KB | Document shell, SEO, nav, footer, skip link |
| `src/pages/index.astro` | 733 | ~20 KB | Home page and scoped styles |
| `src/pages/about.astro` | 634 | ~16 KB | About page and scoped styles |
| `src/pages/404.astro` | 209 | ~8 KB | Error page and glitch styles |
| `src/components/Countdown.astro` | 139 | ~4 KB | Timer markup, styles, inline module |
| `src/styles/global.css` | 389 | ~8 KB | Tokens, reset, primitives, motion |
| **Total source** | **2,467** | **~68 KB** | Six files |
| `public/fonts/*.woff2` | — | 65,448 | Three self-hosted font files |
| `public/og.png` | — | 111,445 | 1200×630 social card |
| `public/favicon.svg` | — | 329 | Vector favicon |
| `public/favicon.ico` | — | 8,580 | Multi-size legacy icon |
| `public/apple-touch-icon.png` | — | 10,569 | 180×180 iOS icon |
| `public/_headers` | — | 302 | Cloudflare cache/security headers |
| `public/robots.txt` | — | 23 | Crawler policy |
| `DEPLOY.md` | — | ~2.1 KB | Cloudflare runbook |
| `progress.md` | — | ~5.5 KB | Chronological state log |
| `TECHNICAL_DOCUMENTATION.md` | — | this file | Specification and ADR log |

Generated output: 15 files, 260,742 bytes, including hashed CSS and copied public assets.

### 9.2 Design Token Reference

| Token | Value | Consumed by |
| --- | --- | --- |
| `--bg` | `#070709` | Body, cards, sections |
| `--bg-soft` | `#0c0c10` | Programme, expectations, FAQ bands |
| `--bg-raised` | `#121217` | Card hover |
| `--ink` | `#f2efe6` | Headings, primary text |
| `--muted` | `#a09d95` | Paragraphs, secondary copy |
| `--faint` | `#8a877f` | Labels, meta, fine print |
| `--line` | `rgba(242,239,230,0.14)` | Section borders, card lattice |
| `--line-soft` | `rgba(242,239,230,0.08)` | Internal dividers |
| `--lime` | `#d9ff3f` | Accent, CTAs, live status, ticker |
| `--violet` | `#a78bfa` | Decorative glows, glitch layer |
| `--black` | `#08080a` | Text on lime |
| `--sans` | Space Grotesk stack | Body, UI |
| `--serif` | Instrument Serif stack | Display italics, pull quote |
| `--container` | `1180px` | `.container` max width |
| `--gutter` | `clamp(1.25rem, 4vw, 3rem)` | Page padding |
| `--header-h` | `76px` | Header height, hero calculation |
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | Buttons, links, transitions |

### 9.3 Command Reference

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies (193 packages, ~60 s cold) |
| `npm ci` | Clean, lockfile-exact install for CI |
| `npm run dev` | Astro dev server with HMR |
| `npm run build` | Static build to `dist/` |
| `npm run preview -- --host 127.0.0.1 --port 4321` | Serve the production artifact |
| `npx astro check` | Type-check `.astro` files (requires `@astrojs/check`; not installed) |
| `npx wrangler pages deploy dist --project-name signal-27` | Manual Cloudflare deploy |
| `git log --oneline --decorate` | Inspect branch and commit history |
| `du -sb dist` | Measure build output size |
| `gzip -c file > file.gz` | Write a gzip-compressed copy for size inspection |
| `brotli -c file > file.br` | Write a Brotli-compressed copy for size inspection |

### 9.4 Verification Evidence

| Check | Method | Result |
| --- | --- | --- |
| Build succeeds | `npm run build` | 3 pages, exit 0, 0.66–1.69 s |
| Static routes exist | `ls dist` | `index.html`, `about/index.html`, `404.html` |
| Home status | `curl -o /dev/null -w '%{http_code}' /` | 200 |
| About status | Same, `/about` | 200 |
| Unknown path status | Same, `/does-not-exist` | 404 |
| Custom 404 body | Fetch unknown path, grep copy | Contains "This page drifted" and "Return to base" |
| Nav Home → About | Click `.nav-links a` | `location.pathname === '/about'`, active link = About |
| Nav About → Home | Click `.brand` | `location.pathname === '/'` |
| Countdown ticks | Read seconds, wait 2 s, read again | `01` → `59` (wrap observed) |
| No missing internal links | Crawl built HTML against `dist` | 0 missing targets |
| No broken subresources | Performance resource statuses | 0 responses ≥ 400 |
| Overflow 390 | `scrollWidth === innerWidth` | 390 = 390 |
| Overflow 768 | Same | 768 = 768 |
| Overflow 1280 | Same | 1280 = 1280 |
| Overflow 1440 | Same | 1440 = 1440 |
| CLS | Layout-shift observer, 3 s | 0 |
| axe violations | axe-core 4.10.2, WCAG 2.0 A/AA | 0 at 390 and 1440 |
| axe passes | Same | 19 rules passed at 1440 |
| Initial requests | Resource Timing | 5 subresources, 51,448 B |
| JS payload | `find dist -name '*.js'` | 0 files; 881 B inline module |

### 9.5 Glossary

| Term | Definition |
| --- | --- |
| **ADR** | Architecture Decision Record; a short document capturing a decision, its context, and consequences |
| **Astro component** | A `.astro` file with build-time frontmatter and an HTML-like template |
| **Canonical URL** | The preferred absolute URL for a page, used by search engines to deduplicate |
| **CLS** | Cumulative Layout Shift; a Core Web Vital measuring unexpected layout movement |
| **Cold start** | Latency when a serverless function initializes; not applicable to static assets |
| **Edge** | A CDN point of presence close to the visitor |
| **Frontmatter** | The fenced JavaScript/TypeScript block at the top of an `.astro` file, executed at build time |
| **Hydration** | The process of attaching a client framework's behavior to server-rendered markup |
| **Island** | An independently hydrated interactive component inside otherwise static HTML |
| **LCP** | Largest Contentful Paint; a Core Web Vital measuring main content render time |
| **MPA** | Multi-Page Application; each URL returns a full document |
| **OG** | Open Graph; metadata used by social platforms to render link previews |
| **SSG** | Static Site Generation; pre-rendering pages at build time |
| **TTFB** | Time to First Byte; latency until the first response byte arrives |
| **Variable font** | A single font file containing a continuous range of weights or styles |
| **WCAG** | Web Content Accessibility Guidelines; W3C standard for accessible web content |
| **woff2** | Web Open Font Format 2; compressed, widely supported webfont container |
| **Zero-JS** | A delivery model where a page ships no client JavaScript by default |

---

*End of document. Implementation branch: `feat/signal-27-teaser`. Deployment runbook: `DEPLOY.md`. Chronological log: `progress.md`.*
