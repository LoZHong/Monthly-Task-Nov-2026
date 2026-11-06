// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages production URL — drives canonical and Open Graph URLs.
  site: 'https://monthly-task-nov-2026.pages.dev',
  output: 'static',
  build: {
    format: 'directory',
  },
});
