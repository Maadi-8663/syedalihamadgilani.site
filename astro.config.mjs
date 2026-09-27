// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/* `site` is the production origin. Canonical URLs and the sitemap are built
   from it, so a wrong value here is a wrong value in Google's index.
   Deployed on Vercel (chosen 2026-09-26), so take it from the build
   environment rather than hard-coding a guess:

     VERCEL_PROJECT_PRODUCTION_URL  set by Vercel to the production domain —
                                    the .vercel.app one until a custom domain
                                    is assigned, then the custom domain.
     SITE_URL                       override, for building anywhere else.

   The fallback only applies to local builds. If you ever deploy from a local
   `npm run build`, set SITE_URL first or the canonicals will point at a
   hostname that is not yours. */
const site =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
