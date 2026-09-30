/* links.js — every link to a system goes to its page (2026-09-30).

   The ported pages link to the systems as anchors: each register row pointed
   at itself (#adwash), and the home and sector pages at the row
   (/work/#adwash), because only the Lead-to-Cash CRM had a page. Now all
   sixteen do, so at build time — like the site's other additions, leaving
   the ported fragments as the port script writes them — this points those
   links at the pages. The rows keep their ids, so an old /work/#adwash still
   lands on the row. It throws unless it finds every link it expects, so a
   markup change cannot silently leave one behind. */

import { SLUGS, nextOf } from './page.js';
import { PORTED } from './data.js';

const count = (page, s) => page.split(s).length - 1;

export function withSystemLinks(page, where) {
  if (where === 'work') {
    for (const slug of SLUGS) {
      const from = `<a class="row" id="${slug}" href="#${slug}"`;
      if (count(page, from) !== 1) throw new Error(`links: the register row for ${slug} was not found once`);
      page = page.replace(from, `<a class="row" id="${slug}" href="/work/${slug}/"`);
    }
    return page;
  }
  if (where === 'system') {
    /* the Lead-to-Cash page's "next system" pointed at the register's group */
    const next = nextOf(PORTED.slug);
    const from = `<a class="link" href="/work/#voice" style="display:inline-block;margin-top:8px;font-size:16px">${next.name} →</a>`;
    if (count(page, from) !== 1) throw new Error('links: the Lead-to-Cash page\'s "Next system" link has changed');
    return page.replace(from, from.replace('/work/#voice', `/work/${next.slug}/`));
  }
  /* home and sector: /work/#<slug> → /work/<slug>/ (group anchors such as
     /work/#product are left alone) */
  let found = 0;
  for (const slug of SLUGS) {
    const from = `href="/work/#${slug}"`;
    found += count(page, from);
    page = page.split(from).join(`href="/work/${slug}/"`);
  }
  const expected = { home: 4, sector: 6 }[where];
  if (found !== expected) throw new Error(`links: expected ${expected} system links on the ${where} page, found ${found}`);
  return page;
}
