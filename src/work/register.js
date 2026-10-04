/* register.js — the register's rows, read from the ported /work/ fragment
   (2026-10-04).

   work.html is the approved design's register: sixteen rows in seven groups,
   each row with the system's name, sector, one line, its figure, where that
   figure was counted from, and the mark that says how far to trust it (the
   legend at the top of /work/). Since 2026-10-04 the page shows those
   systems as a gallery of cards (gallery.js) and the expertise pages show
   them the same way, but nothing about a system is typed a second time:
   every card is built from its row, read here. A markup change in the
   fragment throws rather than quietly dropping a field. */

import { GROUPS } from '../systems/data.js';

/* a fragment's text, as a reader sees it: tags out, entities back */
export const text = (html) => html.replace(/<(svg|style)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const SECTION = /<section class="group" id="([^"]+)"[^>]*>/g;
const ROW = /<a class="row" id="([^"]+)" href="[^"]*" data-prov="(Delivered|Built)">([\s\S]*?)<\/a>/g;

/* slug -> the row, in the register's order */
export function registerRows(work) {
  const starts = [...work.matchAll(SECTION)].map((m) => ({ id: m[1], at: m.index }));
  if (starts.length !== Object.keys(GROUPS).length) throw new Error(`register: expected ${Object.keys(GROUPS).length} groups in work.html, found ${starts.length}`);
  const rows = new Map();
  starts.forEach((g, i) => {
    if (!GROUPS[g.id]) throw new Error(`register: no group "${g.id}" in src/systems/data.js`);
    const end = i + 1 < starts.length ? starts[i + 1].at : work.length;
    const html = work.slice(g.at, end);
    /* the group's name on the page is the one the system pages print */
    const h2 = html.match(/<h2>([\s\S]*?)<\/h2>/);
    if (!h2 || text(h2[1]) !== GROUPS[g.id]) throw new Error(`register: the group ${g.id} is "${h2 && text(h2[1])}" on the page and "${GROUPS[g.id]}" in data.js`);
    for (const [, slug, prov, body] of html.matchAll(ROW)) {
      const one = (re, what) => {
        const m = body.match(re);
        if (!m) throw new Error(`register: the row for ${slug} has no ${what}`);
        return m[1];
      };
      const dot = one(/<span style="padding-top:5px">(<svg[\s\S]*?<\/svg>)<\/span>/, 'mark');
      rows.set(slug, {
        slug, prov, group: g.id, groupTitle: GROUPS[g.id],
        /* the legend's three marks: counted or measured, client-reported, no export */
        dot, trust: !dot.includes('fill="none"') ? 'counted' : dot.includes('<path') ? 'reported' : 'none',
        name: one(/<span class="name">([\s\S]*?)<\/span>/, 'name'),
        sector: one(/<div class="sector">([\s\S]*?)<\/div>/, 'sector'),
        line: one(/<div class="line">([\s\S]*?)<\/div>/, 'line'),
        /* the figure and where it was counted from, exactly as the register prints them */
        col3: one(/<span class="col3">([\s\S]*?)<\/span>\s*<span class="col4">/, 'figure column'),
        marked: [...body.matchAll(/<span title="([^"]+)">/g)].map((m) => m[1]),
        texts: (body.match(/<div class="texts">([\s\S]*?)<\/div>/) || [, ''])[1].split(/\s*·\s*/).filter(Boolean),
        text: text(body),
      });
    }
  });
  if (rows.size !== 16) throw new Error(`register: expected sixteen rows in work.html, found ${rows.size}`);
  return rows;
}
