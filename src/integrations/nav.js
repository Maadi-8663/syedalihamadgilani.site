/* nav.js — the Integrations link, in every page's nav (2026-09-29).

   The nav is written into each ported page by scripts/port-pages.mjs. The
   link is added here instead, at build time, like the site's other
   additions: the ported pages stay byte for byte as the port script makes
   them, and nothing else built from those pages picks up a link to a page
   it does not have. The link goes after
   Work, in the row and in the phone menu, and this throws unless it finds
   both. On the Integrations page itself it is the current one. */

const WORK = /<li><a href="\/work\/"( aria-current="page")?>Work<\/a><\/li>/g;

export function withIntegrationsLink(page, { current = false } = {}) {
  const link = `<li><a href="/integrations/"${current ? ' aria-current="page"' : ''}>Integrations</a></li>`;
  let found = 0;
  const out = page.replace(WORK, (m) => {
    found++;
    return (current ? m.replace(' aria-current="page"', '') : m) + link;
  });
  if (found !== 2) throw new Error(`nav: expected the Work link twice (row and phone menu), found ${found}`);
  return out;
}
