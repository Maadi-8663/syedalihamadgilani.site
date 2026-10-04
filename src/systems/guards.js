/* guards.js — a system's guards as cards that turn (2026-10-04).

   The guards were a list of paragraphs, a ring and a name beside each: 179
   words on the Shopify page, nothing to look at. In the approved proposal
   each became a card — its symbol and its name on the face, and what it
   prevents on the back, which a pointer or a keyboard's focus turns to. On a
   phone there is no hover and a card that must be tapped hides its words,
   so there a card does not turn: symbol, name and text together, as on the
   Integrations page.

   Every word is the page's own: the fifteen built pages pass their guards
   from data.js, and the ported Lead-to-Cash page's are read out of its
   markup (cover.js) and set again. Limits stay text: they are caveats, and
   should read as such. Styles and the arrival are src/styles/gallery.css. */

import { portedGuards } from './cover.js';

/* a guard's drawing at a size; each shape measured as 1, so its strokes can
   be drawn on as the card arrives */
const drawing = (icon, size) => `<svg class="sy" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" `
  + `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>`;
const traced = (icon) => icon.replace(/<(path|circle|rect|ellipse)\b(?![^>]*pathLength)/g, '<$1 pathLength="1"');

/* items: [{ icon: a 24-unit drawing, t: the guard's name, d: what it prevents }], t and d as HTML */
export function guardCards(items) {
  const cards = items.map(({ icon, t, d }) => `<li class="gcard" tabindex="0"><div class="flip">`
    + `<div class="side front"><span class="gring">${drawing(traced(icon), 28)}</span><b class="gname">${t}</b></div>`
    + `<div class="side back"><p class="bt" aria-hidden="true">${drawing(icon, 16)}<span>${t}</span></p><p class="tx">${d}</p></div>`
    + `</div></li>`).join('');
  /* how to read them, where a card turns: the word is the input's (mobile.css) */
  const hint = '<p class="g-hint"><span class="if-hover">Hover</span><span class="if-touch">Tap</span> a card to read what it prevents.</p>';
  return `${hint}<ul class="gcards" data-n="${items.length}">${cards}</ul>`;
}

/* the ported Lead-to-Cash page: its list, set as cards */
export function withGuardCards(page) {
  const items = portedGuards(page);
  const list = page.match(/<ul class="guards">[\s\S]*?<\/ul>/);
  if (page.split('<ul class="guards">').length !== 2) throw new Error('guards: expected one list of guards on the Lead-to-Cash page');
  return page.replace(list[0], guardCards(items));
}
