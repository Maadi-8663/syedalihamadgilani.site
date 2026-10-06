/* expertise.js — the pictures on the home page's six expertise cards, and at
   the head of each expertise page (2026-09-27; redrawn 2026-10-06).

   Until 2026-10-06 each was a screen drawn from one of his systems — an n8n
   canvas at its exported node positions, the AI Front Desk on a call, the
   Knowledge Assistant answering, this site, AdWash with its measured
   figures, the Lead-to-Cash staff dashboard — in a style of its own, beside
   project covers drawn as isometric scenes. Of the pages then he said: "very
   laggy and non consistent and messy". So each kind of work is now a scene
   in the covers' own style (src/pictures/scenes.js, `x-<slug>`), written
   out as /covers/x-<slug>.svg like them and shown as an image
   (expertiseCover in src/systems/cover.js, which also holds its marks to
   that expertise's stack). Git has the screens (e7b2183 and before).

   withPictures() puts each card's picture in place of its icon well at
   build time; home.html stays exactly as ported. */

import { EXPERTISE } from '../expertise/data.js';
import { expertiseCover } from '../systems/cover.js';

/* card title, as home.html sets it -> [pigment, the picture as an image].
   `described` and `first` are for the head of an expertise page, where the
   picture stands alone and is in the first screen. */
export function expertisePictures(page, opts = {}) {
  return Object.fromEntries(EXPERTISE.map((x) => {
    const c = expertiseCover(x.slug, opts);
    return [x.card, [c.pigment, c.html]];
  }));
}

export function withPictures(page) {
  const pictures = expertisePictures(page);
  let placed = 0;
  const out = page.replace(/<article class="skill rv"><span class="g">[\s\S]*?<\/span><h3>([^<]+)<\/h3>/g, (m, title) => {
    const p = pictures[title];
    if (!p) throw new Error(`expertise pictures: no picture for the card "${title}"`);
    placed++;
    return `<article class="skill rv"><div class="pic pic--${p[0]}">${p[1]}</div><h3>${title}</h3>`;
  });
  if (placed !== Object.keys(pictures).length) {
    throw new Error(`expertise pictures: placed ${placed} of ${Object.keys(pictures).length} — the card markup changed`);
  }
  return out;
}
