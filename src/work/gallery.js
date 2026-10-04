/* gallery.js — /work/ as a gallery (2026-10-04).

   The register was sixteen rows of text under seven sticky group headers:
   912 words and no picture (measured on the built page, 1440 x 900). Syed
   asked for "visuals instead of text everywhere", and approved a proposal
   in which the page became a gallery: a card for every system, its cover
   drawn from its own data, the two flagships across two columns, and the
   Delivered / Built filter kept.

   So at build time, like the site's other additions, the groups in the
   ported fragment are replaced by one grid of cards (cards.js), and
   work.html stays as the port script writes it. What a card says is its
   row's, read by register.js; the head of the page, its legend and its
   filter are the ported ones, untouched.

   Order: the catalogue's (delivered first, then built), as the proposal
   showed it. A two-column card that would not fit the end of a row of
   three changes places with the card after it, in the HTML itself, so the
   order a keyboard walks is the order on the screen and no row has a hole.
   Where there are two columns no card spans, for the same reason.

   The rows' ids are the cards', so /work/#adwash still lands on AdWash; the
   groups' ids (/work/#lead, which the system pages' crumbs link to) sit in
   the first card of each group. */

import { SYSTEMS, PORTED } from '../systems/data.js';
import { FEATURED } from '../systems/cover.js';
import { toolMarks } from '../pictures/cluster.js';
import { integrationMarks } from '../integrations/marks.js';
import { expertiseMarks } from '../expertise/marks.js';
import { registerRows } from './register.js';
import { projectCard } from './cards.js';

/* every tool mark the site has, by name */
export const allMarks = (home) => new Map([...toolMarks(home), ...integrationMarks(), ...expertiseMarks()]);

/* The sixteen systems as card records, in the catalogue's order. A system's
   tools are its page's (data.js); the ported one's are its row's. */
export function systemRecords(work) {
  const rows = registerRows(work);
  const row = (slug) => {
    const r = rows.get(slug);
    if (!r) throw new Error(`gallery: ${slug} has no row on the register`);
    return r;
  };
  const recs = SYSTEMS.map((sys) => {
    const r = row(sys.slug);
    if (r.group !== sys.group) throw new Error(`gallery: ${sys.slug} is under "${r.group}" on the register and "${sys.group}" in data.js`);
    if ((sys.prov === 'delivered') !== (r.prov === 'Delivered')) throw new Error(`gallery: ${sys.slug} is ${sys.prov} in data.js and ${r.prov} on the register`);
    return { ...r, n: sys.n, tools: sys.tools, href: `/work/${sys.slug}/` };
  });
  const p = row(PORTED.slug);
  recs.push({ ...p, n: PORTED.n, tools: [...p.marked, ...p.texts], href: `/work/${PORTED.slug}/` });
  return recs.sort((a, b) => a.n - b.n);
}

/* three columns, a featured card two of them: no card left hanging off the
   end of a row. Returns the records in their order on the page, each with
   the column it starts in. */
function packed(recs) {
  const left = [...recs], out = [];
  let col = 0;
  while (left.length) {
    let i = 0;
    if (FEATURED.has(left[0].slug) && col === 2) {
      i = left.findIndex((r) => !FEATURED.has(r.slug));
      if (i === -1) i = 0;
    }
    const [r] = left.splice(i, 1);
    const span = FEATURED.has(r.slug) ? 2 : 1;
    if (col + span > 3) col = 0;
    out.push({ r, col });
    col = (col + span) % 3;
  }
  return out;
}

export function withGallery(page, { home }) {
  const recs = systemRecords(page);
  const marks = allMarks(home);

  const seen = new Set();
  const cards = packed(recs).map(({ r, col }, i) => {
    /* the register's old group anchor, in the group's first card */
    const anchor = seen.has(r.group) ? '' : `<span class="ganchor" id="${r.group}"></span>`;
    seen.add(r.group);
    return projectCard(r, marks, {
      wide: FEATURED.has(r.slug),
      eager: i < 2,                    // the first row is on screen when the page opens
      attrs: ` id="${r.slug}" style="--c3:${col};--c2:${i % 2}"`,
      inner: anchor,
    });
  });

  const start = page.indexOf('<section class="group"');
  const main = page.indexOf('</main>');
  const end = page.lastIndexOf('</section>', main) + '</section>'.length;
  if (start === -1 || main === -1 || end < start) throw new Error('gallery: the register\'s groups were not found in work.html');
  /* nothing but the groups may sit in what is replaced */
  const between = page.slice(start, end).replace(/<section class="group"[\s\S]*?<\/section>/g, '').trim();
  if (between) throw new Error('gallery: something other than the groups sits between them in work.html');

  /* the groups' headings went with the groups: a heading that is read but
     not shown keeps the cards' names (h3) one level under something */
  return `${page.slice(0, start)}<section class="group gal" aria-labelledby="systems">
        <h2 class="gal-h" id="systems">The systems</h2>
        <span class="snode" style="top:40px" aria-hidden="true"></span>
        <div class="gallery">
        ${cards.join('\n        ')}
        </div>
      </section>${page.slice(end)}`;
}
