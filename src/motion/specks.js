/* specks.js — the ground's scatter of circuit dots (2026-09-29), as data.

   One source for two things: scripts/make-specks.mjs writes the tile the
   ground repeats (public/specks.svg), and src/motion/boot.js builds the home
   page's opening animation out of the very same marks, so the dots that fly
   back from it land exactly on the dots of the ground.

   Syed, replacing the stucco wall: "Make the theme clear off white (Near to
   white)... But on that, do the random spotting of maroon coloured tech tools
   (Very short ones). Something like the screenshot (Only spreading), but dont
   use that green dots, use some tech related things instead." The screenshot
   was a page sprinkled with small green dots.

   The first scatter here was tiny line icons — brackets, a gear, a chip, a
   cloud — and he rejected it the same day: "This looks very unprofessional. I
   did not ask you to spread the clear tech tools. Just spread some random dots
   but they should look somehow related to tech." Three dot-only scatters were
   rendered on the home page (square pixels in dot-matrix groups; dots joined
   into tiny node graphs; this one) and he chose this: dots as a sparse circuit
   board. Each site is one of (the odds, then the count this seed draws)
     - a trace (42%, 79): a pad, a short straight run, sometimes a 45° bend,
       and a ring at the end — the run stops at the ring, so the ring needs
       no fill;
     - a via (28%, 38): a ring on its own;
     - a dot (30%, 43).
   All in the site's one accent, drawn at 0.32–0.62 opacity — and the ground
   shows them at REST of that, 0.07–0.14, since he said the same evening: "in
   the background, make the nodes very fade. Should be barely visible. Right
   now, they are making the view somehow messy." So there are two tiles:
   public/specks.svg, the ground, faint; and public/specks-lit.svg, the same
   marks at full strength, which only the home page's opening flies (it dims
   each one to REST as it lands, which is exactly the ground). Text is judged
   against the flat ground colour: the marks barely register on it.

   One square tile, seamless: anything near an edge is drawn again on the far
   side, so the join cannot show. Placement is best-candidate sampling
   (Mitchell's), measured with wrap-around distance, so the sites spread
   evenly without a grid and never clump. A fixed seed makes every run give
   the same scatter — the one he chose; change SEED for a different one. */

export const TILE = 1200;   // px; repeats every 1200px, too far apart to notice
export const REST = 0.22;   // the ground's marks, as a share of the lit marks' opacity
const SEED = 20260929;
const COUNT = 160;          // sites per tile: one per ~95px on average
const INK = '#9C3712';      // the accent, iron oxide (theme.css --accent)
const RING = 2.1;           // radius of a trace's end ring, drawn with a 1px stroke

/* mulberry32: small, fast, and the same numbers for the same seed */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* The ground's tile (svg), the same marks at full strength (lit), and every
   site with the box its mark occupies (tile px; the box may run past the
   tile's edge where the mark wraps). */
export function specks() {
  const rand = rng(SEED);
  const wrapDist = (a, b) => {
    const dx = Math.min(Math.abs(a.x - b.x), TILE - Math.abs(a.x - b.x));
    const dy = Math.min(Math.abs(a.y - b.y), TILE - Math.abs(a.y - b.y));
    return Math.hypot(dx, dy);
  };

  /* best-candidate: of 24 random spots, keep the one furthest from every site.
     All sites are placed before any is drawn — the draw below takes its random
     numbers after these, and reordering either changes the scatter. */
  const sites = [];
  for (let i = 0; i < COUNT; i++) {
    let best = null, bestD = -1;
    for (let k = 0; k < 24; k++) {
      const c = { x: rand() * TILE, y: rand() * TILE };
      const d = sites.length ? Math.min(...sites.map((s) => wrapDist(s, c))) : Infinity;
      if (d > bestD) { bestD = d; best = c; }
    }
    sites.push(best);
  }

  const r1 = (n) => Math.round(n * 10) / 10;
  const parts = [];
  /* draw again across an edge, so the tile joins without a seam; reach is how
     far the element can extend from its site */
  const place = (s, reach, body) => {
    const xs = [0], ys = [0];
    if (s.x < reach) xs.push(TILE); else if (s.x > TILE - reach) xs.push(-TILE);
    if (s.y < reach) ys.push(TILE); else if (s.y > TILE - reach) ys.push(-TILE);
    for (const dx of xs) for (const dy of ys) parts.push(dx || dy ? `<g transform="translate(${dx} ${dy})">${body}</g>` : body);
  };
  /* the box a mark covers: its geometry, plus half a stroke and a pixel of
     anti-aliasing */
  const box = (pts) => ({
    x0: Math.min(...pts.map((p) => p[0] - p[2])) - 1, y0: Math.min(...pts.map((p) => p[1] - p[2])) - 1,
    x1: Math.max(...pts.map((p) => p[0] + p[2])) + 1, y1: Math.max(...pts.map((p) => p[1] + p[2])) + 1,
  });

  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  const marks = [];
  for (const s of sites) {
    const o = (0.32 + rand() * 0.3).toFixed(2);
    const x = r1(s.x), y = r1(s.y);
    const roll = rand();
    if (roll < 0.42) {
      // a straight run of 8–22px, then 6 times in 10 a 45° bend of 6–16px
      const d = DIRS[Math.floor(rand() * 4)];
      const l1 = 8 + rand() * 14;
      const pts = [[x, y], [x + d[0] * l1, y + d[1] * l1]];
      if (rand() < 0.6) {
        const side = rand() < 0.5 ? 1 : -1;
        const b = [d[0] - side * d[1], d[1] + side * d[0]];   // a diagonal, length √2
        const l2 = (6 + rand() * 10) / Math.SQRT2;
        const [px, py] = pts[1];
        pts.push([px + b[0] * l2, py + b[1] * l2]);
      }
      // the run stops where the end ring's stroke is centred
      const [ax, ay] = pts[pts.length - 2], [ex, ey] = pts[pts.length - 1];
      const len = Math.hypot(ex - ax, ey - ay);
      const cut = [ex - (ex - ax) / len * RING, ey - (ey - ay) / len * RING];
      const run = [...pts.slice(0, -1), cut].map(([px, py], i) => `${i ? 'L' : 'M'}${r1(px)} ${r1(py)}`).join('');
      place(s, 40, `<g opacity="${o}"><path class="t" d="${run}"/><circle class="p" cx="${x}" cy="${y}" r="1.6"/><circle class="t" cx="${r1(ex)}" cy="${r1(ey)}" r="${RING}"/></g>`);
      marks.push({ kind: 'trace', x, y, box: box([[x, y, 1.6], ...pts.slice(1, -1).map(([px, py]) => [r1(px), r1(py), 0.5]), [r1(ex), r1(ey), RING + 0.5]]) });
    } else if (roll < 0.7) {
      const r = r1(1.8 + rand() * 0.6);
      place(s, 5, `<circle class="t" cx="${x}" cy="${y}" r="${r}" opacity="${o}"/>`);
      marks.push({ kind: 'via', x, y, box: box([[x, y, r + 0.5]]) });
    } else {
      const r = r1(1.1 + rand() * 0.7);
      place(s, 4, `<circle class="p" cx="${x}" cy="${y}" r="${r}" opacity="${o}"/>`);
      marks.push({ kind: 'dot', x, y, box: box([[x, y, r]]) });
    }
  }

  const lit = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}">`
    + `<style>.t{fill:none;stroke:${INK}}.p{fill:${INK}}</style>${parts.join('')}</svg>\n`;
  const svg = lit.replace(/opacity="([0-9.]+)"/g, (m, a) => `opacity="${(a * REST).toFixed(3)}"`);
  return { svg, lit, marks, copies: parts.length };
}
