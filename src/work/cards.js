/* cards.js — a system as a card: its cover, then its words (2026-10-04).

   Syed: "I want to keep visuals instead of text everywhere, that too modern
   and professional", and of the proposal that followed, "Do all four". The
   register's rows became these cards, on /work/ (gallery.js) and on the
   expertise pages (src/expertise/page.js): the picture first, then the same
   facts the row carried — delivered or built, the group, the name, one
   line, the figure with where it was counted from and the legend's mark
   beside it, and the tools.

   A card is built from its row on the register (register.js) and the
   system's cover (src/systems/cover.js); nothing is typed here. The tools
   are the ones the system's own page lists (src/systems/data.js), shown as
   marks only: a tool the site sets in type is on the system's page. Styles
   are src/styles/gallery.css; a card arrives standing up, as cards do
   (scenes.js kind a), its cover's run path drawing as it lands. */

import { systemCover } from '../systems/cover.js';

const sized = (svg, px) => svg.replace(/width="\d+" height="\d+"/, `width="${px}" height="${px}"`);

/* the marks of a system's tools, as the register's rows set them */
export function toolIcons(tools, marks, max = 6) {
  return tools.filter((t) => marks.has(t)).slice(0, max).map((t) => `<span title="${t}">${sized(marks.get(t), 16)}</span>`).join('');
}

/* rec:  the system's row (register.js) with `tools` (names) and `href`
   opts: line   the card's sentence, as HTML (the row's own unless given)
         wide   two columns: a wider cover beside the usual one, which
                narrower screens show
         ids    a prefix for the cover's ids, when the system's cover is
                elsewhere on the page too
         attrs  what else the card's tag carries (its id, its column)
         inner  markup to open the card with (the register's old anchors) */
export function projectCard(rec, sources, marks, { line = rec.line, wide = false, ids = 'cv', attrs = '', inner = '', cover } = {}) {
  const c = cover || systemCover(rec.slug, sources, { id: `${ids}-${rec.slug}` });
  const pics = wide
    ? systemCover(rec.slug, sources, { id: `${ids}w-${rec.slug}`, wide: true }).svg.replace('<svg ', '<svg class="cv-wide" ') + c.svg.replace('<svg ', '<svg class="cv-narrow" ')
    : c.svg;
  const delivered = rec.prov === 'Delivered';
  const body = `${inner}
          <div class="cover pic pic--${c.pigment}">${pics}</div>
          <div class="pbody">
            <p class="pmeta"><span class="pst ${delivered ? 'd' : 'b'}">${rec.prov}</span><span>${rec.groupTitle}</span></p>
            <h3 class="pname">${rec.name}</h3>
            <p class="pline">${line}</p>
            <div class="pfoot"><div class="pfig">${rec.dot}<div>${rec.col3}</div></div><div class="stack">${toolIcons(rec.tools, marks)}</div></div>
          </div>
        `;
  const open = `class="pcard${wide ? ' wide' : ''}" data-prov="${rec.prov}"${attrs}`;
  return rec.href ? `<a ${open} href="${rec.href}">${body}</a>` : `<div ${open}>${body}</div>`;
}
