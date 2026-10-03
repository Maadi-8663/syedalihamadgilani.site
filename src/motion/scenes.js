/* scenes.js — the markup behind the scroll motion (2026-10-02, reworked
   2026-10-03).

   2026-10-02: "Use all four, as on the page" — four ways for items to
   arrive, which src/styles/scenes.css runs:

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

   That evening every section was a pinned screen the next one slid over.
   2026-10-03 he turned that down: "It is like turning the pages... and is
   not smooth. It should not like shifting the pages..... We should feel like
   scrolling down, with the animated transitions of item first.... Just only
   On Home Page, For the first page..... Keep the page turning animation.
   But just for the First View Port....." So now the page scrolls as a page,
   and each item arrives as it comes up the screen — still scrubbed by the
   scroll, still running backwards when it is scrolled back. The one screen
   left is the home page's first: it holds while the next section slides
   over it (see src/motion/plans.js).

   This module only writes markup, at build time — there is still no
   JavaScript on any page. markItems() marks each item (class "it k-a" etc.)
   and gives it what its kind needs; screen() wraps the home page's first
   screen in

     <div class="track pin-620 t-home first">          the scroll it owns
       <div class="scene">                             held still (sticky)
         <div class="panel"> … </div>                  the screen itself
       </div>
     </div>

   and own() wraps the section that slides over it. Every pattern must
   match: a markup change throws here rather than quietly losing an item. */

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
export function classAt(html, at, cls) {
  const open = html.slice(at).match(/^<[^>]+>/)[0];
  return html.slice(0, at) + addClass(open, cls) + html.slice(at + open.length);
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

/* The items inside html, in document order: `items` is a list of
   [opening-tag pattern, kind]. A pattern that finds nothing throws. An item
   inside another (a card's own small print) belongs to the card. */
function findItems(html, items) {
  const found = [];
  for (const [re, kind] of items) {
    const g = new RegExp(re.source, 'g');
    let m, n = 0;
    while ((m = g.exec(html))) { found.push({ at: m.index, kind }); n++; }
    if (!n) throw new Error(`scenes: no item matched ${re}`);
  }
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

/* Mark the items in html (a section, usually) */
export function markItems(html, items) {
  let out = '', last = 0;
  findItems(html, items).forEach((f, i) => {
    const open = html.slice(f.at).match(/^<[^>]+>/)[0];
    const end = elementEnd(html, f.at);
    let item = addStyle(addClass(open, `it k-${f.kind}`), `--i:${i}`) + html.slice(f.at + open.length, end);
    if (PREP[f.kind]) item = PREP[f.kind](item);
    out += html.slice(last, f.at) + item;
    last = end;
  });
  return out + html.slice(last);
}

/* The home page's first screen: held where it opened while the next section
   slides over it, then let go. `t` is the page type, for how far the screen
   reaches past its column. */
export function screen(html, start, end, { t = 'home', pin = 620 } = {}) {
  return html.slice(0, start)
    + `<div class="track pin-${pin} t-${t} first"><div class="scene"><div class="panel">${html.slice(start, end)}</div></div></div>`
    + html.slice(end);
}

/* the section that slides over it */
export function own(html, start, end, { t = 'home' } = {}) {
  return html.slice(0, start) + `<div class="track own t-${t}">${html.slice(start, end)}</div>` + html.slice(end);
}
