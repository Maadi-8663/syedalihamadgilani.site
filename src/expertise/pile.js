/* pile.js — the home page's "What I do" as a pile of full-width cards
   (2026-10-08).

   He sent a screen recording of another portfolio, whose project cards pile
   up as the page scrolls — each a wide card that sticks near the top while
   the next slides up over it, leaving its top edge showing — and said: "I
   like the animation and UI of the cards getting in a pile.... I guess we
   should use this same animation for the What I do section..... Make each
   skill a full width card and make it like that."

   So each of the six cards is rebuilt here, at build time, from the ported
   one (home.html stays as ported), in the recording's order: a number, the
   title (still the link to its expertise page, stretched over the card), the
   card's own sentence, the counts its expertise page prints (expertiseFacts,
   the same code, so they cannot disagree), its tools as named pills where
   the recording had tags, and a "See the work" button; the picture stands
   on the right where the recording had its panel. Nothing new is said: the
   words are the card's and the figures its page's. The pile itself is CSS
   (src/styles/cards.css). Throws unless all six cards are found and rebuilt. */

import { EXPERTISE } from './data.js';
import { expertiseFacts } from './page.js';

const CARD = /<article class="skill rv"><div class="pic (pic--\d)">(<img [^>]+>)<\/div><h3>(<a class="skill-a" href="\/expertise\/([a-z-]+)\/">[^<]+<\/a>)<span class="skill-go" aria-hidden="true">[\s\S]*?<\/span><\/h3><p>([^<]+)<\/p><span class="stack">([\s\S]*?)<\/span><\/article>/g;
const MARK = /<span title="([^"]+)">(<svg[\s\S]*?<\/svg>)<\/span>/g;
const ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const UP = '<svg class="up" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
const pad = (n) => String(n).padStart(2, '0');

/* a card's tools: its marks, named, then the ones set in type ("GoHighLevel · Twilio") */
function tools(stack) {
  const named = [...stack.matchAll(MARK)].map(([, name, svg]) => `<li>${svg}${name}</li>`);
  const typed = (stack.match(/<i>([^<]+)<\/i>/)?.[1] || '').split(' · ').filter(Boolean).map((name) => `<li>${name}</li>`);
  if (!named.length) throw new Error('skill pile: a card with no tool marks — the card markup changed');
  return named.concat(typed).join('');
}

/* Each card's top edge is a tab with its number and name, which is what
   shows of it once the pile is over it; clicking it scrolls back to where
   that card comes to rest on top (his ask, the same morning: "On the top of
   each card, when piled up, there should be written its number and name of
   the expertise, and clicking it should scroll back to that card."). A
   pinned card is already on screen as far as the browser knows, so the tab
   links to a marker in the flow just above where the card rests — `pile-at`,
   whose scroll margin (cards.css) lands the card on its resting place. */
export function withSkillPile(page, sources) {
  let i = 0;
  const out = page.replace(CARD, (m, pic, img, link, slug, text, stack) => {
    const x = EXPERTISE.find((e) => e.slug === slug);
    if (!x) throw new Error(`skill pile: no expertise page /expertise/${slug}/`);
    const at = `do-${slug}`;
    return `<span class="pile-at" id="${at}" style="--i:${i}"></span>`
      + `<article class="skill" style="--i:${i++}">`
      + `<a class="skill-tab" href="#${at}"><span class="sr">Back to </span><b>${pad(x.n)}</b> ${x.card}${UP}</a>`
      + `<div class="skill-body"><h3>${link}</h3><p class="skill-p">${text}</p>`
      + `<p class="skill-facts">${expertiseFacts(slug, sources)}</p>`
      + `<ul class="skill-tools" aria-label="Tools">${tools(stack)}</ul>`
      + `<span class="skill-go" aria-hidden="true">See the work${ARROW}</span>`
      + `</div><div class="pic ${pic}">${img}</div></article>`;
  });
  if (i !== EXPERTISE.length) throw new Error(`skill pile: rebuilt ${i} of ${EXPERTISE.length} cards — the card markup changed`);
  return out;
}
