// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Replace with the Cloudflare Pages production URL after the first deploy,
  // e.g. https://signal-27.pages.dev
  site: 'https://signal-27.pages.dev',
  build: {
    format: 'directory',
  },
});
