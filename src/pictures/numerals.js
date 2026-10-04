/* numerals.js — the hero's three figures, set as numerals (2026-10-04).

   Under his name the home page states three figures — automations in
   production, systems, platforms under real load — which the ported design
   set as one line of 12px type. In the proposal he approved ("visuals
   instead of text everywhere") they are numerals to be read at a glance:
   the number large, in the display face, and what it counts as a small
   label beside it.

   The figures are the ported copy's and are not typed here: each fact is
   split at its first space, and this throws unless it finds the three of
   them, each starting with a number. home.html stays as ported.

   Their block keeps the height the plain line had (47px) wherever the first
   screen is held — src/styles/navbar.css computes the flight of his name
   from the hero's geometry, and a taller block would move its start. The
   styles are src/styles/timeline.css. */

export function withNumerals(page) {
  const block = page.match(/<div class="facts">([\s\S]*?)<\/div>/);
  if (!block || page.split('<div class="facts">').length !== 2) throw new Error('numerals: the hero\'s facts were not found once');
  const facts = [...block[1].matchAll(/<span><svg class="mk"[\s\S]*?<\/svg>\s*([^<]+)<\/span>/g)].map((m) => m[1].trim());
  if (facts.length !== 3) throw new Error(`numerals: expected three facts in the hero, found ${facts.length}`);
  const items = facts.map((f) => {
    const m = f.match(/^(\d[\d,.]*)\s+(.+)$/);
    if (!m) throw new Error(`numerals: "${f}" does not start with a number`);
    return `<span><b>${m[1]}</b><i>${m[2]}</i></span>`;
  });
  return page.replace(block[0], `<div class="facts big">${items.join('')}</div>`);
}
