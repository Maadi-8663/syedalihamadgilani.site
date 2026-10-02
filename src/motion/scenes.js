/* scenes.js — every section a screen (2026-10-02).

   Syed, on the scroll motion: "I want that the items appear with scrolling
   down... a card should keep moving towards its place and from faded to
   visibile, when I scroll up, it should again, go back... The view port
   should scroll up, when all items are visible on there...... then same
   again for the next View port." Shown a prototype that did exactly that,
   "This is good, but I want beautiful animatic appearances... not this
   simple ones"; shown four styles on his own cards, "Use all four, as on the
   page, and deploy". The four (src/styles/scenes.css runs them):

     a  Stand up        cards           the card stands up off the floor, out
                                        of shadow; its picture rises, its
                                        wires draw, its title comes up word
                                        by word, its text inks in
     b  Flip and trace  logos           the tile turns over from an oxide
                                        back; its logo is traced, then filled
     c  Ink line        rows            the row's rule is drawn in oxide and
                                        cools; its mark drops in with a ring;
                                        the name comes up out of the line
     d  Out of depth    photographs     the card comes forward out of a blur;
                                        the photo develops from black and white
     t  (text)          paragraphs      inks in, top to bottom

   This module only writes markup, at build time — there is still no
   JavaScript on any page. It wraps a run of a page's HTML in

     <div class="track pin-620" style="--hold:…">     the scroll it owns
       <div class="scene">                            held still (sticky)
         <div class="panel"> … </div>                 the screen itself
       </div>
     </div>

   and marks each item in it (class "it k-a" etc.) with its share of the
   held scroll: --a to --b, in svh from the moment the screen starts to slide
   in. Where the browser cannot pin (a phone, a short window, no scroll
   timelines, reduced motion) the three wrappers are display:contents, so the
   page lays out exactly as it did without them, and each item arrives on its
   own view timeline instead.

   Every pattern must match: a markup change throws here rather than quietly
   losing a screen. */

/* the held scroll, in svh: what each kind of item needs, and the still beat
   after the last one before the next screen may cover it */
export const WEIGHT = { a: 22, b: 12, c: 18, d: 20, t: 14 };
const BASE = 34;
/* Items start arriving while the screen is 72% of the way in, and are all in
   place by 82% of the hold; each takes 36% of that span, so about two move at
   once — the prototype's pacing, which he approved. */
function windows(weights) {
  const H = Math.round(weights.reduce((s, w) => s + w, 0) + BASE);
  const start = 72, end = 100 + 0.82 * H, span = end - start, n = weights.length;
  const win = n > 1 ? span * 0.36 : span * 0.7;
  const cum = [];
  let c = 0;
  for (const w of weights) { cum.push(c); c += w; }
  const last = cum[n - 1] || 1;
  const r = (v) => Math.round(v * 10) / 10;
  return { H, items: weights.map((w, i) => { const a = start + (n > 1 ? (span - win) * cum[i] / last : 0); return [r(a), r(a + win)]; }) };
}

/* the end of the element whose opening tag starts at `start` (same-name
   nesting counted; the fragments are well formed) */
export function elementEnd(html, start) {
  const tag = html.slice(start).match(/^<([a-zA-Z][a-zA-Z0-9-]*)/)[1];
  const re = new RegExp(`<(/?)${tag}(?=[\\s>/])[^>]*>`, 'gi');
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    if (m[1]) { if (--depth === 0) return m.index + m[0].length; }
    else if (!m[0].endsWith('/>')) depth++;
  }
  throw new Error(`scenes: <${tag}> at ${start} never closes`);
}

/* the first element at or after `from` whose opening tag matches `re` */
export function find(html, re, from = 0) {
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  g.lastIndex = from;
  const m = g.exec(html);
  if (!m) throw new Error(`scenes: nothing matched ${re}`);
  return { start: m.index, end: elementEnd(html, m.index) };
}

function addClass(open, cls) {
  return /\sclass="/.test(open)
    ? open.replace(/\sclass="([^"]*)"/, (m, c) => ` class="${c} ${cls}"`)
    : open.replace(/^<([a-zA-Z0-9-]+)/, `<$1 class="${cls}"`);
}
function addStyle(open, css) {
  return /\sstyle="/.test(open)
    ? open.replace(/\sstyle="([^"]*)"/, (m, s) => ` style="${s.replace(/;?\s*$/, ';')}${css}"`)
    : open.replace(/^<([a-zA-Z0-9-]+)/, `<$1 style="${css}"`);
}

/* a title's words, each in a mask, for the "comes up word by word" stage */
function splitWords(inner) {
  let j = 0;
  return inner.split(/(<[^>]+>)/).map((part) => (part.startsWith('<') ? part
    : part.replace(/[^\s<>]+/g, (w) => `<span class="w"><span style="--j:${j++}">${w}</span></span>`))).join('');
}

/* what each kind needs in its markup */
const PREP = {
  a(item) {
    // the title's words; a picture's wires, so they can draw themselves
    return item
      .replace(/<h3([^>]*)>([\s\S]*?)<\/h3>/, (m, a, t) => (t.includes('class="w"') ? m : `<h3${a}>${splitWords(t)}</h3>`))
      .replace(/<path\b([^>]*\bfill="none"[^>]*)>/g, (m, attrs) => (/\sclass=|pathLength/.test(attrs) ? m : `<path class="wire" pathLength="1"${attrs}>`));
  },
  b(item) {
    // the logo, traced: its outline measured as 1 so the stroke can run along it
    const mark = /<span class="mark">[\s\S]*?<\/span>|<span class="face">[\s\S]*?<\/span>/;
    return item.replace(mark, (m) => m.replace(/<path (?![^>]*pathLength)/g, '<path pathLength="1" '));
  },
};

/* The items inside a screen's html, in document order: `items` is a list of
   [opening-tag pattern, kind]. A pattern that finds nothing throws. */
function findItems(html, items) {
  const found = [];
  for (const [re, kind, w] of items) {
    const g = new RegExp(re.source, 'g');
    let m, n = 0;
    while ((m = g.exec(html))) { found.push({ at: m.index, kind, w: w || WEIGHT[kind] }); n++; }
    if (!n) throw new Error(`scenes: no item matched ${re}`);
  }
  // an item inside another (a card's own small print) belongs to the card
  found.sort((x, y) => x.at - y.at);
  const out = [];
  let reach = -1;
  for (const f of found) {
    if (f.at < reach) continue;
    out.push(f);
    reach = elementEnd(html, f.at);
  }
  return out;
}

/* A run of html as a screen. opts:
     t      the page type, for how far the screen reaches past its column:
            'home', 'reg' (a system or sector page), 'wrap' (Work, Integrations)
     pin    the shortest window, in px, the screen fits in (pin-620 etc.):
            shorter than that, it is not pinned
     first  the page's first screen: on view when the page opens, so it
            neither slides in nor is laid out anew
     own    a section with a pinned stage of its own (How it runs, the
            sector's hero, the architecture): it only slides in
     items  [pattern, kind] pairs, matched inside the run
     label  a copy of the section's label, shown in the screen only when it
            is pinned (a section split over screens)
     grid   wrap the run in a .pgrid, laid out only when pinned */
export function build(inner, opts) {
  if (opts.own) return `<div class="track own t-${opts.t}">${inner}</div>`;
  const found = findItems(inner, opts.items || []);
  const { H, items: w } = windows(found.map((f) => f.w));
  let out = '', last = 0;
  found.forEach((f, i) => {
    const open = inner.slice(f.at).match(/^<[^>]+>/)[0];
    const iEnd = elementEnd(inner, f.at);
    let item = inner.slice(f.at, iEnd);
    const tagged = addStyle(addClass(open, `it k-${f.kind}`), `--i:${i};--a:${w[i][0]};--b:${w[i][1]}`);
    item = tagged + item.slice(open.length);
    if (PREP[f.kind]) item = PREP[f.kind](item);
    out += inner.slice(last, f.at) + item;
    last = iEnd;
  });
  out += inner.slice(last);
  // a section that opens the screen and has an id (a nav link's target)
  // says how long its items take, so the link can land with them all in
  out = out.replace(/^(\s*)(<[a-zA-Z][^>]*\sid="[^"]*"[^>]*>)/, (m, ws, open) => ws + addStyle(open, `--anc:${found.length ? H : 0}`));
  if (opts.grid) out = `<div class="pgrid">${out}</div>`;
  const cls = ['track', `pin-${opts.pin || 620}`, `t-${opts.t}`, opts.first ? 'first' : ''].filter(Boolean).join(' ');
  const label = opts.label ? `<div class="plab" aria-hidden="true">${opts.label}</div>` : '';
  return `<div class="${cls}" style="--hold:${found.length ? H : 0}"><div class="scene"><div class="panel">${label}${out}</div></div></div>`;
}

export function screen(html, start, end, opts) {
  return html.slice(0, start) + build(html.slice(start, end), opts) + html.slice(end);
}

/* Wrap the element that `re` finds (searching from `from`), or the run of
   consecutive elements from it through the one `until` finds. */
export function wrap(html, re, opts = {}, until = null, from = 0) {
  const a = find(html, re, from);
  const end = until ? find(html, until, a.start).end : a.end;
  return screen(html, a.start, end, opts);
}

/* the elements matching `re` inside [start, end) of html, as {start, end} */
export function within(html, start, end, re) {
  const out = [];
  const g = new RegExp(re.source, 'g');
  g.lastIndex = start;
  let m;
  while ((m = g.exec(html)) && m.index < end) {
    const e = elementEnd(html, m.index);
    out.push({ start: m.index, end: e });
    g.lastIndex = e;
  }
  if (!out.length) throw new Error(`scenes: nothing matched ${re}`);
  return out;
}

/* add a class to the opening tag that starts at `at` */
export function styleAt(html, at, css) {
  const open = html.slice(at).match(/^<[^>]+>/)[0];
  return html.slice(0, at) + addStyle(open, css) + html.slice(at + open.length);
}

export function classAt(html, at, cls) {
  const open = html.slice(at).match(/^<[^>]+>/)[0];
  return html.slice(0, at) + addClass(open, cls) + html.slice(at + open.length);
}
