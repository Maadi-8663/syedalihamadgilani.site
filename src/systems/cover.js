/* cover.js — which picture covers which system (2026-10-04).

   The drawing is src/pictures/covers.js (its header has his words and the
   rule: nothing in a cover is invented). This module chooses, for each of
   the sixteen systems, what its cover is drawn from, and checks that every
   word a cover prints is already on that system's own page:

     an export in graphs.json   the workflow its page's head names (data.js
                                `mini`), close up, with its counted nodes
     Lead-to-Cash (ported)      its Stage Change Router, which the ported
                                page names and counts; the graph is the
                                partial entry scripts/extract-systems.mjs
                                writes from src/data/instance.json
     AdWash                     the Platform Engineering picture (figures
                                measured against its live database)
     Just Grade Metrics         the scorecard, with the figure its page prints
     no export                  the steps of its write-up

   and the card over it is the system's first guard, word for word. A cover
   belongs to the system's group on the register, whose pigment it sits on
   (--pic-1 … --pic-6: imagery only, never a UI colour).

   Ids inside an <svg> are the page's, so every cover on a page needs its
   own: pass `id` when a system's cover is on the page twice (a wide and a
   narrow one on /work/, the head and a card on an expertise page). */

import { SYSTEMS, PORTED } from './data.js';
import { GLYPHS } from './glyphs.js';
import GRAPHS from './graphs.json';
import { canvasCover, stepsCover, gradeCover, pictureCover } from '../pictures/covers.js';
import { expertisePictures } from '../pictures/expertise.js';

/* the register's seven groups on the six pigments */
export const PIGMENT = { lead: 1, voice: 2, support: 3, backoffice: 4, content: 2, data: 6, product: 5 };
/* the two that take two columns in a gallery: the largest delivered system,
   and the platform built end to end */
export const FEATURED = new Set([PORTED.slug, 'adwash']);

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const strings = (v) => (typeof v === 'string' ? v : Array.isArray(v) ? v.map(strings).join(' \n ') : v && typeof v === 'object' ? Object.values(v).map(strings).join(' \n ') : '');

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

/* a picture from expertise.js as a drawing with ids of its own */
function borrowed(home, card, from, id) {
  const p = expertisePictures(home)[card];
  if (!p) throw new Error(`cover: no expertise picture "${card}"`);
  const body = p[1].replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  if (body === p[1] || !body.includes(`${from}-`)) throw new Error(`cover: the "${card}" picture is not the drawing this expects`);
  return body.split(`${from}-`).join(`${id}-p-`);
}

/* The cover of a system: { svg, pigment, alt }. `alt` says what the picture
   is, for the one place it stands alone (the head of the system's page). */
export function systemCover(slug, { home, system }, { id = `cv-${slug}`, wide = false, thumb = false } = {}) {
  const W = wide ? 780 : 480, opts = { W, thumb };

  if (slug === PORTED.slug) {
    const wf = GRAPHS[slug]?.workflows[0];
    /* the ported page names this workflow and counts it; the picture must agree */
    if (!wf || wf.name !== 'Stage Change Router' || !system.includes(`Stage Change Router, as exported`) || !system.includes(`${wf.nodes.length} nodes · ${wf.edges.length} connections`)) {
      throw new Error('cover: the Lead-to-Cash page and graphs.json disagree about the Stage Change Router');
    }
    const g = portedGuards(system)[0];
    return {
      pigment: PIGMENT.lead,
      alt: `The Stage Change Router workflow, as exported: ${wf.nodes.length} nodes`,
      svg: canvasCover(id, wf, GLYPHS, { ...opts, title: wf.name, note: `${wf.nodes.length} nodes, as exported`, guard: { t: decode(g.t), icon: g.icon } }),
    };
  }

  const sys = SYSTEMS.find((s) => s.slug === slug);
  if (!sys) throw new Error(`cover: no system ${slug}`);
  const pigment = PIGMENT[sys.group];
  if (!pigment) throw new Error(`cover: no pigment for the group ${sys.group}`);
  const first = sys.guards[0];
  if (!GLYPHS[first.g]) throw new Error(`cover: no drawing for the guard icon "${first.g}"`);
  const guard = { t: first.t, icon: GLYPHS[first.g] };

  if (slug === 'adwash') {
    /* its picture closes with "measured against the live database,
       2026-09-04", which the cover's frame cuts: so the pill says it, short
       enough to sit beside the guard */
    const note = 'measured 2026-09-04';
    const body = borrowed(home, 'Platform Engineering', 'px5', id);
    if (!body.includes('measured against the live database, 2026-09-04')) throw new Error('cover: the AdWash picture no longer says when it was measured');
    /* its window starts 22px lower than a cover's, and is 470 wide: on a
       wide cover it sits in the middle */
    return { pigment, alt: 'AdWash: its workspaces, campaigns and tracked ad spend, measured against the live database on 2026-09-04',
      svg: pictureCover(id, body, { ...opts, note, guard, dy: -22, dx: wide ? (W - 470) / 2 - 48 : 0 }) };
  }
  if (slug === 'just-grade-metrics') {
    const note = '31 tables under row-level security';
    if (!strings(sys).includes('31 tables')) throw new Error('cover: Just Grade Metrics no longer says 31 tables');
    return { pigment, alt: 'A graded call: a score that rests on a quote found verbatim in the transcript, or the call goes to a person', svg: gradeCover(id, { ...opts, title: sys.link ? sys.link[1] : sys.name, note, guard }) };
  }

  const g = GRAPHS[slug];
  if (g) {
    if (sys.mini == null) throw new Error(`cover: ${slug} has an export but names no workflow for its head`);
    const wf = g.workflows[sys.mini], name = sys.flows[sys.mini][0], how = sys.prov === 'built' ? 'built' : 'exported';
    return {
      pigment,
      alt: `The ${name} workflow, as ${how}: ${wf.nodes.length} nodes`,
      svg: canvasCover(id, wf, GLYPHS, { ...opts, title: name, note: `${wf.nodes.length} nodes, as ${how}`, guard }),
    };
  }
  return {
    pigment,
    alt: `How it runs, in ${sys.steps.length} steps`,
    svg: stepsCover(id, sys.steps, GLYPHS, { ...opts, title: 'How it runs', note: `${sys.steps.length} steps, from the write-up`, guard }),
  };
}

/* The cover as it heads a system's page: the picture stands alone there,
   so it says what it is. */
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
export function headCover(slug, sources) {
  const c = systemCover(slug, sources, { id: `hd-${slug}` });
  return `<div class="sys-cover cover pic pic--${c.pigment}" role="img" aria-label="${attr(c.alt)}">${c.svg}</div>`;
}

/* The ported Lead-to-Cash page opened on a small drawing of its Stage Change
   Router beside the title; the cover is that workflow close up, in its
   place. The head's grid becomes the one the built pages use. */
export function withSystemCover(page, sources) {
  const grid = '<div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px 64px;align-items:end">';
  const mini = /<div><p class="label">Stage Change Router, as exported<\/p>[\s\S]*?from the exported JSON<\/p><\/div>/;
  const at = page.indexOf(grid);
  if (at === -1 || at > page.indexOf('<section class="run"') || !mini.test(page)) throw new Error('cover: the Lead-to-Cash page\'s head has changed');
  const cover = headCover(PORTED.slug, { ...sources, system: page });
  return (page.slice(0, at) + '<div class="sys-head">' + page.slice(at + grid.length)).replace(mini, cover);
}

/* this site, for the one project that is not on the register (the Web
   Development page): the home card's picture of it, with its one figure */
export function siteCover(home, { id = 'cv-site', fig }) {
  let body = borrowed(home, 'Web Development', 'px4', id);
  /* the picture's own figure sits below the cover's frame: it becomes the pill */
  const own = /<g><rect x="40" y="316"[\s\S]*?<\/g>$/;
  if (!own.test(body) || !body.includes(fig)) throw new Error('cover: the Web Development picture no longer closes with its figure');
  body = body.replace(own, '');
  return { pigment: 4, svg: pictureCover(id, body, { note: fig, dy: -12 }) };
}
