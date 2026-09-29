/* boot.js — the home page's opening, built at build time (2026-09-29).

   Syed: "Make the loading animation. All the dots in the background should
   combine in the center.... Rotate... and then spread. Make it very
   professional and smooth", then "Even if everything gets loaded. Make this
   animation run at the start... first all the nodes should gather in center
   then rotate and spread, and then the items come one by one", and "When the
   nodes are in the center, they should become a connected giant nodal
   structure for a while.... And data should seem flowing through them in a
   glance (A lightening should pass through)".

   So it is an opening, not a loader: the page is ready at first paint, and
   this runs over it once. Still no JavaScript — src/styles/boot.css drives
   all of it. This module writes the markup:

   - the marks: one element for every dot of the ground inside the first
     2560x1440 of the page, each a window onto the very tile the ground
     repeats (public/specks.svg, from the same generator, src/motion/specks.js),
     at the same place. Where they start and where they come back to is
     therefore exactly the ground, pixel for pixel, so the hand-off at the end
     cannot be seen. Each carries its box and a size bucket, so a small screen
     only animates the marks it can show;
   - the network they become: a hub and 150 nodes spread evenly over a disc,
     joined as a relative neighbourhood graph (two nodes link when no third is
     nearer to both — an open web, never a mesh of triangles), the hub wired
     to its nearest six;
   - the lightning: the shortest paths from the hub to twelve nodes around the
     rim, each one polyline carrying a pulse, so the strikes branch where the
     paths part and flash where they land.

   The network is drawn in a 200-unit box centred on 0,0 and scaled to the
   screen by boot.css. */
import fs from 'node:fs';
import path from 'node:path';
import { specks, TILE, rng } from './specks.js';

const REGION = { w: 2560, h: 1440 };            // the largest screen the marks cover
const XB = [400, 768, 1024, 1280, 1600, 1920];  // width buckets: boot.css hides the ones past the screen
const YB = [700, 900, 1100];                    // height buckets
const r1 = (n) => Math.round(n * 10) / 10;

function marks() {
  const { svg, marks } = specks();
  const file = fs.readFileSync(path.join(process.cwd(), 'public', 'specks.svg'), 'utf8');
  if (file.replace(/\r\n/g, '\n') !== svg) throw new Error('boot.js: public/specks.svg is not what src/motion/specks.js draws — run node scripts/make-specks.mjs');
  const rand = rng(29092026);
  const out = [];
  for (let j = 0; j * TILE < REGION.h; j++) for (let i = 0; i * TILE < REGION.w; i++) {
    for (const m of marks) {
      const x0 = Math.floor(m.box.x0 + i * TILE), y0 = Math.floor(m.box.y0 + j * TILE);
      const x1 = Math.ceil(m.box.x1 + i * TILE), y1 = Math.ceil(m.box.y1 + j * TILE);
      if (x1 <= 0 || y1 <= 0 || x0 >= REGION.w || y0 >= REGION.h) continue;
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const bx = XB.filter((t) => cx >= t).length, by = YB.filter((t) => cy >= t).length;
      // --j: a few ms of lag each, so they do not leave as one sheet
      out.push(`<i class="bx${bx} by${by}" style="--x:${x0};--y:${y0};--w:${x1 - x0};--h:${y1 - y0};--j:${Math.round(rand() * 120)}"></i>`);
    }
  }
  return out;
}

function network() {
  const rand = rng(30092026);
  const N = 150, RMAX = 94;
  const pts = [{ x: 0, y: 0 }];                 // the hub
  for (let i = 1; i < N; i++) {
    let best = null, bestD = -1;
    for (let k = 0; k < 30; k++) {
      const a = rand() * Math.PI * 2, r = RMAX * Math.sqrt(rand());
      const c = { x: r * Math.cos(a), y: r * Math.sin(a) };
      const d = Math.min(...pts.map((p) => Math.hypot(p.x - c.x, p.y - c.y)));
      if (d > bestD) { bestD = d; best = c; }
    }
    pts.push(best);
  }
  const D = (a, b) => Math.hypot(pts[a].x - pts[b].x, pts[a].y - pts[b].y);

  const key = (a, b) => (a < b ? `${a},${b}` : `${b},${a}`);
  const edges = new Map();
  for (let a = 0; a < N; a++) for (let b = a + 1; b < N; b++) {
    const d = D(a, b);
    let open = true;
    for (let c = 0; c < N && open; c++) if (c !== a && c !== b && Math.max(D(a, c), D(b, c)) < d) open = false;
    if (open) edges.set(key(a, b), [a, b]);
  }
  [...pts.keys()].slice(1).sort((a, b) => D(0, a) - D(0, b)).slice(0, 6).forEach((b) => edges.set(key(0, b), [0, b]));

  // shortest paths from the hub over the web (Dijkstra; N is small)
  const nbr = pts.map(() => []);
  for (const [a, b] of edges.values()) { nbr[a].push(b); nbr[b].push(a); }
  const dist = pts.map(() => Infinity), prev = pts.map(() => -1), done = pts.map(() => false);
  dist[0] = 0;
  for (;;) {
    let u = -1;
    for (let v = 0; v < N; v++) if (!done[v] && dist[v] < Infinity && (u < 0 || dist[v] < dist[u])) u = v;
    if (u < 0) break;
    done[u] = true;
    for (const v of nbr[u]) if (dist[u] + D(u, v) < dist[v]) { dist[v] = dist[u] + D(u, v); prev[v] = u; }
  }
  // twelve strikes, one per 30°, each to the outermost node near that bearing
  const rim = [...pts.keys()].filter((i) => Math.hypot(pts[i].x, pts[i].y) > RMAX * 0.8);
  const turn = rand() * Math.PI * 2;
  const bolts = [];
  for (let k = 0; k < 12; k++) {
    const a = turn + (k * Math.PI) / 6;
    const off = (i) => Math.abs(Math.atan2(Math.sin(Math.atan2(pts[i].y, pts[i].x) - a), Math.cos(Math.atan2(pts[i].y, pts[i].x) - a)));
    const t = rim.filter((i) => off(i) < Math.PI / 12).sort((i, j) => Math.hypot(pts[j].x, pts[j].y) - Math.hypot(pts[i].x, pts[i].y))[0];
    if (t === undefined || dist[t] === Infinity) continue;
    const route = [];
    for (let v = t; v >= 0; v = prev[v]) route.unshift(v);
    bolts.push(route);
  }

  const P = (i) => `${r1(pts[i].x)} ${r1(pts[i].y)}`;
  const web = [...edges.values()].map(([a, b]) => `M${P(a)}L${P(b)}`).join('');
  const nodes = [...pts.keys()].slice(1).map((i) => `M${P(i)}h0`).join('');
  /* each strike is a pulse along its route — a glow, a trail and a bright
     head travelling together — and a ring that flashes where it lands */
  const strike = bolts.map((route, k) => {
    const d = route.map((v, i) => `${i ? 'L' : 'M'}${P(v)}`).join('');
    const end = pts[route[route.length - 1]];
    return ['gl', 'tr', 'hd'].map((c) => `<path class="${c}" pathLength="1" style="--b:${k}" d="${d}"/>`).join('')
      + `<circle class="tip" cx="${r1(end.x)}" cy="${r1(end.y)}" r="1.5" style="--b:${k}"/>`;
  }).join('');
  const box = 'viewBox="-100 -100 200 200" aria-hidden="true" focusable="false"';
  return {
    html: `<div class="boot-net">`
      + `<svg class="bn-edges" ${box}><path d="${web}"/></svg>`
      + `<svg class="bn-nodes" ${box}><path d="${nodes}"/><path class="bn-hub" d="M0 0h0"/><circle class="bn-ring" r="4.2"/></svg>`
      + `<svg class="bn-bolts" ${box}>${strike}</svg>`
      + `</div>`,
    stats: { nodes: N, edges: edges.size, bolts: bolts.length, hops: bolts.map((b) => b.length - 1) },
  };
}

/* The opening goes first in the page, before the nav, so it is parsed — and
   its animations start — with the first paint. */
export function withBoot(page) {
  const net = network();
  return `<div class="boot" aria-hidden="true"><div class="boot-ground"></div><div class="boot-field">${marks().join('')}${net.html}</div></div>\n${page}`;
}

export const bootStats = () => ({ marks: marks().length, ...network().stats });
