/* plans.js — what arrives on each page, and in which of the four kinds
   (2026-10-02; since 2026-10-03 nothing is pinned but the home page's first
   screen — src/motion/scenes.js has his words). The mechanism is scenes.js,
   the motion src/styles/scenes.css. Every pattern must match, or the build
   throws; every plan must leave the page's tags as balanced as it found
   them, or the build throws. */
import { find, elementEnd, markItems, screen, own } from './scenes.js';

/* does html[a, b) hold a match for re */
function has(html, re, a = 0, b = html.length) {
  const g = new RegExp(re.source, 'g');
  g.lastIndex = a;
  const m = g.exec(html);
  return !!m && m.index < b;
}

/* mark the items of the element `re` finds */
function markIn(page, re, items, from = 0) {
  const el = find(page, re, from);
  return page.slice(0, el.start) + markItems(page.slice(el.start, el.end), items) + page.slice(el.end);
}

/* ---- / ------------------------------------------------------------------- */
function homeScenes_(page) {
  // what arrives, section by section — not "What I do": since 2026-10-08
  // its cards are a pile (src/expertise/pile.js), which is their motion
  page = markIn(page, /<section class="sec" id="contact">/, [[/<(?:a|span) class="way"/, 'c'], [/<form class="compose/, 'a']]);
  page = markIn(page, /<section class="sec" id="experience">/, [[/<li\b/, 'c'], [/<p class="edu/, 't']]);
  page = markIn(page, /<section class="sec last" id="niches">/, [[/<a class="sect/, 'd'], [/<p class="note/, 't']]);
  // the first screen holds while "What I do" slides up over it (on a
  // desktop tall enough; elsewhere both simply scroll)
  const exp = find(page, /<section class="sec" id="expertise">/);
  page = own(page, exp.start, exp.end);
  const hero = find(page, /<header class="hero">/);
  return screen(page, hero.start, hero.end);
}

/* ---- the register pages: systems, Lead-to-Cash, the sector ----------------
   Their sections are all <section class="run">, built from a small set of
   parts; each part's items arrive in its kind. */
const PARTS = [
  [/<li class="wfc"/, 'a'],
  [/<(?:a|div) class="pcard/, 'a'],          // the sector page's systems, since 2026-10-06
  [/<li class="gcard"/, 'b'],                 // the guards, since 2026-10-04: cards that turn
  [/<li><span class="ring">/, 'c'],          // gates, the lead's path
  [/<li>(?=[^<])/, 'c'],                      // limits: a sentence each
  [/<a class="row/, 'c'],
  [/<li class="tnode/, 'b'],
  [/<div class="(?:inv|invkey)"/, 't'],
  [/<div class="dash"/, 'd'],
  [/<article class="screen"/, 'd'],
  [/<p class="body sys-body"/, 't'],
  [/<p class="body"/, 't'],
  [/<p class="wfc-key/, 't'],
  [/<div class="legend"/, 't'],
  [/<a class="gh"/, 'c'],
  [/<p class="small"/, 't'],
  [/<div style="text-align:right/, 't'],
];
const partsIn = (html) => PARTS.filter(([re]) => has(html, re));

function registerScenes_(page) {
  const run = find(page, /<div class="body-run[^"]*">/);
  let from = run.start;
  for (;;) {
    const g = /<section class="run"[^>]*>/g;
    g.lastIndex = from;
    const m = g.exec(page);
    if (!m) break;
    const end = elementEnd(page, m.index);
    const html = page.slice(m.index, end);
    // a section with a pinned stage of its own (How it runs, the
    // architecture) keeps its own choreography
    const out = /class="(?:flow|arch-track)"/.test(html) ? html : markItems(html, partsIn(html));
    page = page.slice(0, m.index) + out + page.slice(end);
    from = m.index + out.length;
  }
  return page;
}

/* ---- /integrations/: groups under sticky headers; /work/: one gallery ---- */
function groupScenes(page, item, kind) {
  const run = find(page, /<div class="body-run[^"]*">/);
  let from = run.start;
  for (;;) {
    const g = /<section class="(?:group|more)"[^>]*>/g;
    g.lastIndex = from;
    const m = g.exec(page);
    if (!m) break;
    const end = elementEnd(page, m.index);
    const html = page.slice(m.index, end);
    const out = /class="more"/.test(html)
      ? markItems(html, [[/<p class="body rv"/, 't'], [/<form class="more-form/, 'a']])
      : markItems(html, [[item, kind]]);
    page = page.slice(0, m.index) + out + page.slice(end);
    from = m.index + out.length;
  }
  return page;
}
/* the systems are cards with a cover (src/work/gallery.js): they stand up */
const workScenes_ = (page) => groupScenes(page, /<a class="pcard/, 'a');
const integrationsScenes_ = (page) => groupScenes(page, /<li class="icard/, 'b');

/* ---- /expertise/<slug>/ ----------------------------------------------------
   Sections like the register pages', with parts of their own: the stack's
   tools turn over and are traced, as logos do; the projects stand up as
   cards; the notes ink in, and the booking form stands up too
   (src/expertise/page.js). */
const EXPERTISE_PARTS = [
  [/<li class="icard/, 'b'],
  [/<(?:a|div) class="pcard/, 'a'],
  [/<p class="body ex-intro"/, 't'],
  [/<div class="ex-also"/, 't'],
  [/<p class="small ex-built-note"/, 't'],
  [/<p class="body ex-book-p"/, 't'],
  [/<form class="more-form/, 'a'],
  [/<ul class="ex-pills ex-others"/, 't'],
];
function expertiseScenes_(page) {
  const run = find(page, /<div class="body-run[^"]*">/);
  let from = run.start, sections = 0;
  for (;;) {
    const g = /<section class="run[^"]*"[^>]*>/g;
    g.lastIndex = from;
    const m = g.exec(page);
    if (!m) break;
    const end = elementEnd(page, m.index);
    const html = page.slice(m.index, end);
    const out = markItems(html, EXPERTISE_PARTS.filter(([re]) => has(html, re)));
    page = page.slice(0, m.index) + out + page.slice(end);
    from = m.index + out.length;
    sections++;
  }
  if (sections < 4) throw new Error(`plans: an expertise page has ${sections} sections; expected the stack, the projects, the booking and the others`);
  return page;
}

/* Every plan must leave the page's elements as balanced as it found them: a
   wrapper that closed one tag too many would quietly pull the next section
   into it (it did, once, 2026-10-02). */
const TAGS = ['div', 'section', 'ul', 'ol', 'li', 'article', 'a', 'p', 'form'];
function balance(html) {
  return TAGS.map((t) => (html.match(new RegExp('<' + t + '[\\s>]', 'g')) || []).length - (html.match(new RegExp('</' + t + '>', 'g')) || []).length).join(',');
}
function checked(name, fn) {
  return (page, ...rest) => {
    const before = balance(page);
    const out = fn(page, ...rest);
    const after = balance(out);
    if (after !== before) throw new Error(`plans: ${name} unbalanced the page (${TAGS.join(',')}: ${before} -> ${after})`);
    return out;
  };
}
export const homeScenes = checked('homeScenes', homeScenes_);
export const registerScenes = checked('registerScenes', registerScenes_);
export const workScenes = checked('workScenes', workScenes_);
export const integrationsScenes = checked('integrationsScenes', integrationsScenes_);
export const expertiseScenes = checked('expertiseScenes', expertiseScenes_);
