/* plans.js — which runs of each page are screens, and what arrives in them
   (2026-10-02). The mechanism is src/motion/scenes.js; the motion is
   src/styles/scenes.css. A screen's `pin` is the shortest window (px, CSS)
   it was measured to fit in at 1024px wide and up — `node
   scripts/check-motion.mjs` fails if a pinned screen's contents ever
   overflow it. Every pattern must match, or the build throws. */
import { find, build, wrap, within, classAt, styleAt, elementEnd } from './scenes.js';

const lab = (text) => `<p class="lab"><span>${text}</span></p>`;
const openTag = (html, at) => html.slice(at).match(/^<[^>]+>/)[0];
const tagName = (open) => open.match(/^<([a-zA-Z0-9-]+)/)[1];
/* does html[a, b) hold a match for re */
function has(html, re, a = 0, b = html.length) {
  const g = new RegExp(re.source, 'g');
  g.lastIndex = a;
  const m = g.exec(html);
  return !!m && m.index < b;
}

/* A section whose items are more than one screen holds is split into the
   section and continuations of it (class "cont", no id, no node, no label),
   each a screen; a continuation carries a copy of the section's label,
   shown only when it is pinned. Unpinned, the continuations read on as the
   same list. `container` finds the list the items sit in. */
function splitSection(html, container, item, per, opts, label) {
  const box = find(html, container);
  const kids = within(html, box.start, box.end, item);
  if (kids.length <= per) return build(html, opts);
  const secOpen = openTag(html, 0), boxOpen = openTag(html, box.start);
  const boxClose = `</${tagName(boxOpen)}>`, secClose = `</${tagName(secOpen)}>`;
  // every element still open where the list starts (a .wrap, a margin div),
  // outermost first, so a continuation can reopen them
  const opens = [];
  const re = /<(\/?)([a-zA-Z0-9-]+)\b[^>]*>/g;
  re.lastIndex = secOpen.length;
  let m;
  while ((m = re.exec(html)) && m.index < box.start) {
    if (/^(br|img|input|hr|meta|link|source|wbr|path|circle|rect|line|use)$/i.test(m[2]) || m[0].endsWith('/>')) continue;
    if (m[1]) opens.pop(); else opens.push(m[0]);
  }
  const closeAll = opens.slice().reverse().map((o) => `</${tagName(o)}>`).join('');
  const chunk = (a, b) => kids.slice(a, b).map((k) => html.slice(k.start, k.end)).join('\n');
  const contOpen = secOpen.replace(/\s+id="[^"]*"/, '').replace(/\s+style="[^"]*"/, '').replace(/class="([^"]*)"/, 'class="$1 cont"');
  // each screen's items are found in its own part (opts.itemsFor), or are
  // the same pattern throughout (opts.items)
  const make = (h, extra = {}) => build(h, { ...opts, ...(opts.itemsFor ? { items: opts.itemsFor(h) } : {}), ...extra });
  // whatever followed the list (the sector's product, after its rows) is a
  // screen of its own
  const trailing = html.slice(box.end).replace(new RegExp('(\\s*</[a-zA-Z0-9-]+>){' + (opens.length + 1) + '}\\s*$'), '');
  let out = make(html.slice(0, box.start) + boxOpen + chunk(0, per) + boxClose + closeAll + secClose);
  for (let i = per; i < kids.length; i += per) {
    out += make(contOpen + opens.join('') + boxOpen + chunk(i, i + per) + boxClose + closeAll + secClose, { label });
  }
  if (/<[a-zA-Z]/.test(trailing)) out += make(contOpen + opens.join('') + trailing + closeAll + secClose, { label });
  return out;
}

/* Split the children of the element `container` finds (inside the section
   `section` finds) into screens of `per`, each wrapped by `build`. */
function splitInside(page, section, container, child, per, opts) {
  const sec = find(page, section);
  const box = find(page, container, sec.start);
  const kids = within(page, box.start, box.end, child);
  const groups = [];
  for (let i = 0; i < kids.length; i += per) groups.push(kids.slice(i, i + per));
  let out = page.slice(0, groups[0][0].start);
  groups.forEach((g, k) => {
    out += build(page.slice(g[0].start, g[g.length - 1].end), typeof opts === 'function' ? opts(k) : opts);
  });
  out += page.slice(groups[groups.length - 1][groups[groups.length - 1].length - 1].end);
  // the section's anchor lands when its first screen's items are all in
  const hold = (out.slice(sec.start).match(/<div class="track [^"]*" style="--hold:(\d+)"/) || [0, 0])[1];
  return styleAt(classAt(out, sec.start, 'split'), sec.start, `--anc:${hold}`);
}

/* ---- / ------------------------------------------------------------------- */
function homeScenes_(page) {
  page = wrap(page, /<header class="hero">/, { t: 'home', first: true });
  // what I do: two screens of three cards, inside the row a phone swipes
  page = splitInside(page, /<section class="sec" id="expertise">/, /<div class="skills">/, /<article class="skill/, 3,
    { t: 'home', pin: 620, grid: true, label: lab('What I do'), items: [[/<article class="skill/, 'a']] });
  // contact: the ways to reach him, then the message he can be sent — side by
  // side they need a 700px window, one after the other they fit in 620
  page = splitInside(page, /<section class="sec" id="contact">/, /<div class="contact">/, /<(?:div class="rv"|form class="compose)/, 1,
    (k) => ({ t: 'home', pin: 620, label: lab('Start a conversation'),
      items: k === 0 ? [[/<(?:a|span) class="way"/, 'c']] : [[/<form class="compose/, 'a']] }));
  // experience: the timeline as two lists, a screen each
  {
    const sec = find(page, /<section class="sec" id="experience">/);
    const ul = find(page, /<ul class="xp">/, sec.start);
    const lis = within(page, ul.start, ul.end, /<li\b/);
    const edu = find(page, /<p class="edu/, ul.end);
    const label = lab('Experience');
    const li = (from, to) => lis.slice(from, to).map((x) => page.slice(x.start, x.end)).join('\n  ');
    const a = build(`<ul class="xp xp-a">${li(0, 3)}</ul>`, { t: 'home', pin: 620, label, items: [[/<li\b/, 'c']] });
    const b = build(`<ul class="xp xp-b">${li(3, lis.length)}</ul>\n  ${page.slice(edu.start, edu.end)}`,
      { t: 'home', pin: 620, label, items: [[/<li\b/, 'c'], [/<p class="edu/, 't']] });
    const hold = (a.match(/style="--hold:(\d+)"/) || [0, 0])[1];
    page = styleAt(classAt(page.slice(0, ul.start) + a + b + page.slice(edu.end), sec.start, 'split'), sec.start, `--anc:${hold}`);
  }
  page = wrap(page, /<section class="sec last" id="niches">/,
    { t: 'home', pin: 620, items: [[/<a class="sect/, 'd'], [/<p class="note/, 't']] });
  return page;
}

/* ---- the register pages: systems, Lead-to-Cash, the sector ----------------
   Their sections are all <section class="run">, built from a small set of
   parts; each part's items arrive in its kind. A section with a pinned
   stage of its own is an "own" track. */
const PARTS = [
  // [pattern of an item, kind, weight (svh of hold; default by kind)]
  [/<li class="wfc"/, 'a'],
  [/<li><span class="ring">/, 'c'],          // guards, gates, the lead's path
  [/<li>(?=[^<])/, 'c'],                      // limits: a sentence each
  [/<a class="row/, 'c'],
  [/<li class="tnode/, 'b', 7],
  [/<div class="(?:inv|invkey)"/, 't', 9],
  [/<div class="dash"/, 'd'],
  [/<article class="screen"/, 'd'],
  [/<p class="body sys-body"/, 't'],
  [/<p class="body"/, 't'],
  [/<p class="wfc-key/, 't', 8],
  [/<div class="legend"/, 't', 8],
  [/<a class="gh"/, 'c', 10],
  [/<p class="small"/, 't', 10],
  [/<div style="text-align:right/, 't', 10],
];
/* what one screen holds, for the lists that can run long */
const PER = [
  [/<ul class="wfcs"/, /<li class="wfc"/, 2],
  [/<ul class="guards"/, /<li><span class="ring">/, 6],
  [/<ul class="limits"/, /<li>(?=[^<])/, 4],
  [/<div style="margin-top:12px">/, /<a class="row/, 2],
];
function partsIn(html) {
  const out = [];
  for (const [re, kind, w] of PARTS) if (has(html, re)) out.push(w ? [re, kind, w] : [re, kind]);
  return out;
}
const slabelCopy = (html) => {
  const m = html.match(/<(?:p|h2) class="label-m slabel"[^>]*>([\s\S]*?)<\/(?:p|h2)>/);
  return m ? `<p class="label-m slabel">${m[1]}</p>` : '';
};

function registerScenes_(page, { pin = 620 } = {}) {
  const run = find(page, /<div class="body-run[^"]*">/);
  const firstSec = find(page, /<section class="run"/, run.start);
  // the head, when the page has one before its first section
  if (has(page, /<div class="wrap"/, run.start, firstSec.start)) {
    const head = find(page, /<div class="wrap"/, run.start);
    page = page.slice(0, head.start) + build(page.slice(head.start, head.end), { t: 'reg', pin, first: true }) + page.slice(head.end);
  }
  let from = run.start;
  for (;;) {
    const g = /<section class="run"[^>]*>/g;
    g.lastIndex = from;
    const m = g.exec(page);
    if (!m) break;
    const end = elementEnd(page, m.index);
    const html = page.slice(m.index, end);
    let out;
    if (/class="(?:flow|arch-track)"/.test(html)) out = build(html, { t: 'reg', own: true });
    else {
      const opts = { t: 'reg', pin, items: partsIn(html), itemsFor: partsIn };
      const split = PER.find(([box, item]) => has(html, box) && has(html, item));
      out = split ? splitSection(html, split[0], split[1], split[2], opts, slabelCopy(html)) : build(html, opts);
    }
    page = page.slice(0, m.index) + out + page.slice(end);
    from = m.index + out.length;
  }
  return page;
}

/* ---- /work/ and /integrations/: groups under sticky headers -------------- */
function groupScenes(page, { pin, item, kind, per, weight }) {
  const run = find(page, /<div class="body-run[^"]*">/);
  const wrapEl = find(page, /<div class="wrap"/, run.start);
  const firstGroup = find(page, /<section class="group"/, wrapEl.start);
  // the head: the label, the title, the lede (and the filters)
  const headStart = find(page, /<p class="label">/, wrapEl.start).start;
  page = page.slice(0, headStart) + build(page.slice(headStart, firstGroup.start).trimEnd(), { t: 'wrap', pin, first: true }) + '\n      ' + page.slice(firstGroup.start);
  let from = headStart;
  for (;;) {
    const g = /<section class="(?:group|more)"[^>]*>/g;
    g.lastIndex = from;
    const m = g.exec(page);
    if (!m) break;
    const end = elementEnd(page, m.index);
    const html = page.slice(m.index, end);
    let out;
    if (/class="more"/.test(html)) {
      out = build(html, { t: 'wrap', pin, items: [[/<p class="body rv"/, 't'], [/<form class="more-form/, 'a']] });
    } else {
      const name = (html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [0, ''])[1].replace(/<[^>]+>/g, '');
      const label = `<p class="label-m slabel cont-label">${name}</p>`;
      const box = has(html, /<ul class="icards"/) ? /<ul class="icards"/ : null;
      const opts = { t: 'wrap', pin, items: [[item, kind, weight]] };
      out = box ? splitSection(html, box, item, per, opts, label) : splitRows(html, item, per, opts, label);
    }
    page = page.slice(0, m.index) + out + page.slice(end);
    from = m.index + out.length;
  }
  return page;
}
/* a register group's rows sit straight in the section, after its header:
   split them like a list, the continuations without node or header */
function splitRows(html, item, per, opts, label) {
  const kids = within(html, 0, html.length, item);
  if (kids.length <= per) return build(html, opts);
  const secOpen = openTag(html, 0), secClose = `</${tagName(secOpen)}>`;
  const contOpen = secOpen.replace(/\s+id="[^"]*"/, '').replace(/class="([^"]*)"/, 'class="$1 cont"');
  const chunk = (a, b) => kids.slice(a, b).map((k) => html.slice(k.start, k.end)).join('');
  let out = build(html.slice(0, kids[0].start) + chunk(0, per) + '\n      ' + secClose, opts);
  for (let i = per; i < kids.length; i += per) out += build(contOpen + chunk(i, i + per) + '\n      ' + secClose, { ...opts, label });
  return out;
}

function workScenes_(page) {
  return groupScenes(page, { pin: 620, item: /<a class="row/, kind: 'c', per: 3 });
}
function integrationsScenes_(page) {
  return groupScenes(page, { pin: 700, item: /<li class="icard/, kind: 'b', per: 8 });
}

/* Every plan must leave the page's elements as balanced as it found them: a
   screen that closed one tag too many would quietly pull the next section
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
