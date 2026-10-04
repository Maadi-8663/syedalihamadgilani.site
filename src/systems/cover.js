/* cover.js — the picture that stands for a system, wherever the site shows one
   (2026-10-04).

   Every system has a cover: on its card in the gallery (/work/ and the
   expertise pages), at the head of its own page, and beside the role that
   produced it on the home page's timeline. The first covers were the
   system's workflow in a dark window; of the Shopify one Syed said: "This
   picture ... is not good. I want a real picture, like a modern thumbnail of
   the project which should be explaining that what have we done", and sent
   an isometric illustration as the kind he meant. So a cover is now a scene
   (src/pictures/scenes.js, drawn with iso.js): what the system handles and
   the real marks of the tools it is built from.

   The scenes are files, not markup: src/pages/covers/[file].svg.js writes
   each one out at build time, and a page shows it as an image. That keeps a
   page's HTML small (the first gallery carried sixteen drawings inline), lets
   the browser fetch a picture once for every page that shows it, and gives
   each picture a description of its own. An image cannot use the page's
   fonts, so a scene has no words in it.

   A cover sits on the pigment of its system's group on the register
   (--pic-1 … --pic-6: imagery only, never a UI colour). */

import { SYSTEMS, PORTED } from './data.js';
import { SCENES, WIDE, ALT } from '../pictures/scenes.js';
import { registerRows } from '../work/register.js';

/* the register's seven groups on the six pigments */
export const PIGMENT = { lead: 1, voice: 2, support: 3, backoffice: 4, content: 2, data: 6, product: 5 };
/* the two that take two columns in a gallery: the largest delivered system,
   and the platform built end to end. Each has a wide scene as well. */
export const FEATURED = new Set([PORTED.slug, 'adwash']);
for (const slug of FEATURED) if (!WIDE.has(slug)) throw new Error(`cover: ${slug} takes two columns but has no wide scene`);

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/* The Lead-to-Cash page is ported, so its guards are read from its markup:
   [{ icon: the ring's drawing, t: the name, d: what it prevents }], as HTML. */
export function portedGuards(system) {
  const ul = system.match(/<ul class="guards">([\s\S]*?)<\/ul>/);
  if (!ul) throw new Error('cover: the Lead-to-Cash page has no list of guards');
  const items = [...ul[1].matchAll(/<li><span class="ring"><svg[^>]*>([\s\S]*?)<\/svg><\/span><span><b>([\s\S]*?)<\/b><p>([\s\S]*?)<\/p><\/span><\/li>/g)]
    .map(([, icon, t, d]) => ({ icon, t, d }));
  if (items.length !== 6) throw new Error(`cover: expected six guards on the Lead-to-Cash page, found ${items.length}`);
  return items;
}

/* The picture, as an image. `described` gives it its description: where the
   picture stands alone (the head of a system's page). Inside a card or a
   link that already names the system it is left empty, so the name is not
   read twice. `eager` is for a picture in the first screen, which should not
   wait to be scrolled to; `first` for the one a page opens on. */
function picture(file, { described = false, eager = false, first = false, wide = false } = {}) {
  if (!ALT[file]) throw new Error(`cover: the picture "${file}" has no description`);
  const img = `<img src="/covers/${file}.svg" alt="${described ? attr(ALT[file]) : ''}" width="480" height="300" ${first ? 'fetchpriority="high" ' : ''}${eager || first ? '' : 'loading="lazy" '}decoding="async">`;
  /* two columns wide, the picture is the scene's wide drawing; on a narrower screen the card is one column and the picture the usual one */
  return wide ? `<picture><source media="(min-width:1180px)" srcset="/covers/${file}-wide.svg" width="780" height="300">${img}</picture>` : img;
}

/* The cover of a system: { html, pigment }. */
export function systemCover(slug, opts = {}) {
  if (!SCENES[slug]) throw new Error(`cover: no scene for ${slug}`);
  const group = slug === PORTED.slug ? 'lead' : SYSTEMS.find((s) => s.slug === slug)?.group;
  const pigment = PIGMENT[group];
  if (!pigment) throw new Error(`cover: no pigment for ${slug}`);
  if (opts.wide && !WIDE.has(slug)) throw new Error(`cover: ${slug} has no wide scene`);
  return { pigment, html: picture(slug, opts) };
}

/* The cover as it heads a system's page: in the first screen, and described. */
export function headCover(slug) {
  const c = systemCover(slug, { described: true, first: true });
  return `<div class="sys-cover cover pic pic--${c.pigment}">${c.html}</div>`;
}

/* The ported Lead-to-Cash page opened on a small drawing of its Stage Change
   Router beside the title; the cover takes its place. The head's grid becomes
   the one the built pages use. */
export function withSystemCover(page) {
  const grid = '<div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px 64px;align-items:end">';
  const mini = /<div><p class="label">Stage Change Router, as exported<\/p>[\s\S]*?from the exported JSON<\/p><\/div>/;
  const at = page.indexOf(grid);
  if (at === -1 || at > page.indexOf('<section class="run"') || !mini.test(page)) throw new Error('cover: the Lead-to-Cash page\'s head has changed');
  return (page.slice(0, at) + '<div class="sys-head">' + page.slice(at + grid.length)).replace(mini, headCover(PORTED.slug));
}

/* A picture is a claim, as the cluster's logos are: a scene may carry a
   tool's mark only if its system's own page lists that tool (data.js; for
   the ported Lead-to-Cash page, its row on the register). Three scenes also
   carry the mark of where their leads are found — not a tool of the system,
   but named in its own text, and the phrase is checked here. The route that
   writes the pictures (src/pages/covers/[file].svg.js) calls this with the
   marks a scene drew, so a mark nobody can account for stops the build. */
const SOURCE_MARKS = {
  'lsa-lead-responder': ['Google Search', 'Google Local Services'],   // the Google G on the phone: the leads are Google's
  'construction-lead-outreach': ['Google Maps', 'Google Maps'],
  'linkedin-lead-pipeline': ['LinkedIn', 'LinkedIn'],
};
/* this site's scene: what it is built with, and the mark of what it ships none of (struck out) */
const SITE_MARKS = ['Astro', 'JavaScript'];
export function checkSceneMarks(slug, used, work) {
  let listed, said = '';
  if (slug === 'this-site') listed = SITE_MARKS;
  else {
    const row = registerRows(work).get(slug), sys = SYSTEMS.find((s) => s.slug === slug);
    if (!row || (!sys && slug !== PORTED.slug)) throw new Error(`cover: no system ${slug} to check its scene against`);
    listed = sys ? sys.tools : [...row.marked, ...row.texts];
    said = `${row.text} ${sys ? JSON.stringify(sys) : ''}`;
  }
  for (const mark of used) {
    if (listed.includes(mark)) continue;
    const from = SOURCE_MARKS[slug];
    if (from && from[0] === mark && said.includes(from[1])) continue;
    throw new Error(`cover: the scene for ${slug} carries the mark of ${mark}, which its page does not list`);
  }
}

/* this site, for the one project that is not on the register (the Web
   Development page): its own scene, on the ochre the home card's picture has */
export function siteCover() {
  return { pigment: 4, html: picture('this-site') };
}
