/* links.js — each card of the home page's "What I do" opens its expertise
   page (2026-10-04).

   His words: "when someone clicks the card of Automation, it should open the
   page of Automation". The card's title becomes the link — so that is what a
   screen reader and a search engine read — and the stylesheet stretches it
   over the whole card (src/styles/cards.css), with an arrow at the end of
   the title's line to say that it goes somewhere.

   Done at build time, after the pictures are in (src/pictures/expertise.js
   finds each card by its bare title), so home.html stays exactly as ported.
   Throws unless every card finds its page and every page its card. */

import { EXPERTISE } from './data.js';

const CARD = /(<article class="skill rv">[\s\S]*?<h3>)([^<]+)(<\/h3>)/g;
const GO = '<span class="skill-go" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
  + 'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';

export function withExpertiseLinks(page) {
  const linked = new Set();
  const out = page.replace(CARD, (m, open, title, close) => {
    const x = EXPERTISE.find((e) => e.card === title);
    if (!x) throw new Error(`expertise links: no page for the card "${title}"`);
    linked.add(x.slug);
    return `${open}<a class="skill-a" href="/expertise/${x.slug}/">${title}</a>${GO}${close}`;
  });
  if (linked.size !== EXPERTISE.length) {
    throw new Error(`expertise links: linked ${linked.size} of ${EXPERTISE.length} cards — the card markup changed`);
  }
  return out;
}
