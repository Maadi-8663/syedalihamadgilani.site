/* scenes.js — the picture that covers each system (2026-10-04).

   One isometric scene for each of the sixteen systems, and one for this
   site, drawn with iso.js (its header has his words). A scene says what the
   system does, with the things it handles — a storefront's inbox, a call, an
   invoice — and the real marks of the tools it is built from (logos.js).
   Nothing in a scene is a figure or a screenshot: no word or number is
   printed, no client is named, nothing is drawn that reads as a chart (a
   row of bars meant as a voice did, and went), and a tool is shown only if
   the system's own page lists it — checked as the pictures are written
   (checkSceneMarks in src/systems/cover.js).

   Every scene is the same stage (a pale disc), the same light and the same
   few materials, so the seventeen read as one set. `SCENES[slug](L, wide)`
   returns an <svg> string; L is the logo set (anything with a `get`), and
   `wide` asks for the wide drawing the two featured systems also have. ALT,
   at the foot of the file, says what each picture shows. After changing a
   scene: node scripts/sheet-covers.mjs, and look. */

import { scene, F, M, INK, rr, circ, arc, turn, art, f1, mix } from './iso.js';
import { logoSvg } from './logos.js';
import { GLYPHS } from '../systems/glyphs.js';

/* a place on the ground, from where it is on the stage: across and down from
   the disc's centre. Lf / Rf / Bx give the corner a thing is placed by, for a
   thing facing left, facing right, or lying as a box, centred on that place */
const g = (sx, sy) => [f1(sx / 1.7320508 + sy), f1(sy - sx / 1.7320508)];
const Lf = (sx, sy, w, z = 0) => { const [x, y] = g(sx, sy); return [f1(x - w / 2), y, z]; };
const Rf = (sx, sy, w, z = 0) => { const [x, y] = g(sx, sy); return [x, f1(y + w / 2), z]; };
const Bx = (sx, sy, w, d, z = 0) => { const [x, y] = g(sx, sy); return [f1(x - w / 2), f1(y - d / 2), z]; };
const GLASS = '#C3D6DB';
const STONE = { hi: '#F6F2E8', mid: '#E4DDCC', lo: '#CBC2AC' };
/* drawing order: a thing that stands on another is drawn after it, whatever
   their places on the ground — a layer up for each thing it stands on */
const L1 = 1000, L2 = 2000, L3 = 3000, L4 = 4000;

/* ---- outlines ---------------------------------------------------------------- */
const bubblePts = (w, h, r, tx) => { const p = rr(w, h, r); p.splice(10, 0, [w * (tx + 0.2), h], [w * tx - 1, h + 9], [w * tx, h]); return p; };
const pinPts = (r) => [...arc(r, r, r, 150, 390, 18), [r, r * 2.8]];
const cloudPts = (w) => { const u = w / 10; return [...arc(2.6 * u, 4.4 * u, 2.2 * u, 90, 270, 8), ...arc(4.7 * u, 3 * u, 2.6 * u, 200, 330, 8), ...arc(7.3 * u, 4.2 * u, 2.4 * u, 250, 450, 9)]; };
const moonPts = (r) => [...arc(r, r, r, 65.5, 294.5, 20), ...arc(r * 1.55, r, r * 0.92, 261.5, 98.5, 14)];
const starPts = (R, r = R * 0.45) => Array.from({ length: 10 }, (_, i) => { const a = ((-90 + i * 36) * Math.PI) / 180, q = i % 2 ? r : R; return [R + q * Math.cos(a), R + q * Math.sin(a)]; });
const folderPts = (w, h) => [[0, 5], [3, 0], [w * 0.38, 0], [w * 0.46, 6], [w - 3, 6], [w, 9], [w, h], [0, h]];

/* ---- flat art ---------------------------------------------------------------- */
const lines = (x, y, w, n, gap = 7, c = INK.line) => Array.from({ length: n }, (_, i) => art.bar(x, y + i * gap, w * [1, 0.82, 0.92, 0.6, 0.86, 0.74][i % 6], c)).join('');
const calArt = (w, h, pick = 6) => {
  let a = art.rect(0, 0, w, 14, INK.oxide, 5) + art.rect(0, 8, w, 6, INK.oxide) + art.dot(w * 0.28, 6.5, 2, '#FFFFFF') + art.dot(w * 0.72, 6.5, 2, '#FFFFFF');
  const cw = (w - 10) / 4, ch = (h - 24) / 3;
  for (let i = 0; i < 12; i++) a += art.rect(6 + (i % 4) * cw, 19 + Math.floor(i / 4) * ch, cw - 3, ch - 3, i === pick ? INK.oxide : INK.soft, 2.4);
  return a;
};
const clockArt = (r, hand = INK.black) => art.dot(r, r, r - 2.8, '#FFFFFF') + art.line(`M${r} ${r}V${f1(r * 0.44)}M${r} ${r}L${f1(r * 1.4)} ${f1(r * 1.2)}`, hand, 2) + art.dot(r, r, 1.8, INK.oxide);
const winArt = (w, body = '', bar = '') => art.rect(0, 0, w, 12, '#E8E5DD', 4) + art.rect(0, 7, w, 5, '#E8E5DD') + [6.5, 12, 17.5].map((cx) => art.dot(cx, 6, 1.7, '#C2BFB6')).join('') + bar + `<g transform="translate(0 12)">${body}</g>`;
const tick = (cx, cy, r, c = '#FFFFFF') => art.line(`M${f1(cx - r * 0.45)} ${f1(cy + r * 0.05)}l${f1(r * 0.32)} ${f1(r * 0.32)} ${f1(r * 0.6)}${f1(-r * 0.66)}`, c, r * 0.3);
const glyphSvg = (name, x, y, size, color = INK.oxide, sw = 1.9) => `<g transform="translate(${x} ${y}) scale(${f1(size / 2.4) / 10})" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${GLYPHS[name]}</g>`;
const person = (cx, cy, r, c = INK.oxide, bg = INK.wash) => art.dot(cx, cy, r, bg) + art.dot(cx, cy - r * 0.2, r * 0.36, c) + art.path(`M${f1(cx - r * 0.62)} ${f1(cy + r * 0.74)}a${f1(r * 0.62)} ${f1(r * 0.56)} 0 0 1 ${f1(r * 1.24)} 0z`, c);
/* a record: a face, a name, a line */
const recordArt = (w, c = INK.oxide) => person(9, 10, 5.4, c) + art.bar(18, 6.4, w - 26, INK.dark, 3) + art.bar(18, 12, w - 32, INK.line, 2.6);

/* ============================================================================
   THE KIT — the things a scene is built from. Each puts itself among the
   other things and casts its own shadow. `kk` moves a thing later in the
   drawing order: what stands on top of something is drawn after it.
   ============================================================================ */
function kit(L, o) {
  const s = scene(o), k = { s };

  /* a flat thing standing up, facing left — a card, a sheet, a window — or facing right */
  /* a floating thing is let down until its top is inside the picture */
  const inside = (z, top) => (z > 0 ? Math.max(0, Math.min(z, z + s.P(top)[1] - 7)) : z);
  k.panel = ([x, y, z0 = 0], { w, h, r = 4, t = 2.5, m = M.paper, face, a = '', kk = 0, pts, sh = true }) => {
    const z = inside(z0, [x, y, z0 + h]);
    s.put([x + w, y, z], s.solid(F.left(x, y, z + h), pts || rr(w, h, r), t, m, { face, art: a }), kk);
    if (sh) s.shadow(x + w / 2 + z * 0.1, y - 1, w * 0.48, 6, z > 12 ? 0.5 : 0.9);
  };
  k.panelR = ([x, y, z0 = 0], { w, h, r = 4, t = 2.5, m = M.paper, face, a = '', kk = 0, pts, sh = true }) => {
    const z = inside(z0, [x, y - w, z0 + h]);
    s.put([x, y, z], s.solid(F.right(x, y, z + h), pts || rr(w, h, r), t, m, { face, art: a }), kk);
    if (sh) s.shadow(x - 1, y - w / 2, 6, w * 0.48, z > 12 ? 0.5 : 0.9);
  };
  /* a tool's own mark, on a white tile; or a plain sign where a tool has no mark to show */
  k.tile = (label, at, { size = 36, face = 'left', kk = 0 } = {}) => {
    const pad = size * (label === 'n8n' ? 0.1 : 0.2);   // n8n's mark is wide and low: at the others' size it reads as a hairline
    (face === 'left' ? k.panel : k.panelR)(at, { w: size, h: size, r: size * 0.26, t: 5, face: '#FFFFFF', kk, a: logoSvg(L, label, f1(pad), f1(pad), f1(size - pad * 2)) });
  };
  k.sign = (name, at, { size = 32, face = 'left', kk = 0, color = INK.oxide } = {}) => {
    const pad = size * 0.22;
    (face === 'left' ? k.panel : k.panelR)(at, { w: size, h: size, r: size * 0.26, t: 5, face: '#FFFFFF', kk, a: glyphSvg(name, f1(pad), f1(pad), size - pad * 2, color) });
  };
  /* a box on the ground, or a slab, with art for its top and the two sides it shows */
  k.box = ([x, y, z = 0], { w = 44, d = 44, h = 36, m = M.kraft, r = 3, top = '', left = '', right = '', kk = 0, face, sh = true } = {}) => {
    s.put([x + w, y + d, z], s.solid(F.top(x, y, z + h), rr(w, d, r), h, m, { art: top, face })
      + (left ? s.on(F.left(x, y + d, z + h), left) : '') + (right ? s.on(F.right(x + w, y + d, z + h), right) : ''), kk);
    if (sh && !z) s.shadowArt(`<rect x="${x - 2}" y="${y + 2}" width="${w + 8}" height="${d + 6}" rx="${r + 4}"/>`);
  };
  k.cyl = ([x, y, z = 0], r, h, m, { top = '', n = 30, kk = 0, sh = true, face } = {}) => {
    s.put([x + r * 0.71, y + r * 0.71, z], s.solid(F.top(x, y, z + h), circ(r, n), h, m, { art: top, face }), kk);
    if (sh && !z) s.shadow(x + 2, y + 2, r + 3);
  };
  /* a round thing standing: a clock, a seal, a tick */
  k.badge = ([x, y, z0 = 0], r, m, a = '', { face = 'left', t = 3.5, kk = 0, fill, pts } = {}) => {
    const z = inside(z0, face === 'left' ? [x - r, y, z0 + 2 * r] : [x, y - r, z0 + 2 * r]);
    const fr = face === 'left' ? F.left(x - r, y, z + 2 * r) : F.right(x, y + r, z + 2 * r);
    s.put(face === 'left' ? [x + r, y, z] : [x, y + r, z], s.solid(fr, pts || circ(r, 28, r, r), t, m, { art: a, face: fill }), kk);
    if (face === 'left') s.shadow(x + z * 0.1, y - 1, r * 0.9, 5, z > 12 ? 0.5 : 0.9); else s.shadow(x - 1, y, 5, r * 0.9, z > 12 ? 0.5 : 0.9);
  };
  k.check = (at, r = 10, o2 = {}) => k.badge(at, r, M.oxide, tick(r, r, r), o2);
  k.bubble = ([x, y, z = 0], { w = 46, h = 30, r = 9, m = M.oxide, a = '', face = 'left', tx = 0.24, kk = 0, fill } = {}) => {
    (face === 'left' ? k.panel : k.panelR)([x, y, z], { w, h: h + 9, t: 3.5, m, a, kk, face: fill, pts: bubblePts(w, h, r, tx) });
  };
  /* a sheet lying flat */
  k.mat = ([x, y, z = 0], { w, d, t = 2, r = 4, m = M.paper, a = '', kk = 0, face } = {}) => {
    s.put([x + w, y + d, z], s.solid(F.top(x, y, z + t), rr(w, d, r), t, m, { art: a, face }), kk);
    if (!z) s.shadowArt(`<rect x="${x - 1}" y="${y + 1}" width="${w + 5}" height="${d + 4}" rx="${r + 3}"/>`);
  };
  k.laptop = ([x, y], { w = 120, d = 78, sh = 82, tilt = 13, screen = '' } = {}) => {
    let keys = '';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 11; c++) keys += art.rect(11 + c * 9, 12 + r * 7, 7.4, 5.4, '#6A6862', 1.4);
    const deck = art.rect(8, 9, w - 16, 31, '#262522', 3) + keys + art.rect(w / 2 - 19, 47, 38, 21, '#3F3D39', 3);
    s.put([x + w, y + d], s.solid(F.top(x, y, 6), rr(w, d, 9), 6, M.graphite, { art: deck }));
    s.put([x + w, y + 6], s.solid(F.lean(x + 3, y + 5, 6, sh, tilt), rr(w - 6, sh, 7), 3.5, M.graphite,
      { art: art.rect(5, 5, w - 16, sh - 11, INK.screen, 3.5) + `<g transform="translate(5 5)">${screen}</g>` }));
    s.shadowArt(`<rect x="${x - 3}" y="${y + 2}" width="${w + 10}" height="${d + 8}" rx="12"/>`);
  };
  /* a phone, standing; `screen` is flat art for its display, w - 8 wide */
  k.phone = (at, { w = 58, h = 112, face = 'left', screen = '', kk = 0 } = {}) => {
    const a = art.rect(4, 4, w - 8, h - 8, INK.screen, 7.5) + `<g transform="translate(4 4)">${screen}</g>` + art.rect(w / 2 - 8, 7, 16, 3.6, '#262522', 1.8);
    (face === 'left' ? k.panel : k.panelR)(at, { w, h, r: 11.5, t: 6, m: M.graphite, a, kk });
  };
  /* an envelope, standing, facing left; open, with a letter in it */
  k.envelope = ([x, y, z = 0], { w = 62, h = 40, open = false, m = M.cream, letter = '', mark = '', kk = 0 } = {}) => {
    const line = mix(m.lo, '#000000', 0.12);
    if (open) {
      s.put([x + w, y - 5, z], s.solid(F.left(x, y - 5, z + h * 1.62), [[0, h * 0.62], [w / 2, 0], [w, h * 0.62], [w, h * 1.62], [0, h * 1.62]], 1.5, M.oxide), kk);
      s.put([x + w, y - 3, z], s.solid(F.left(x + 5, y - 3, z + h * 1.5), rr(w - 10, h * 1.3, 3), 1.5, M.paper, { face: '#FFFFFF', art: letter }), kk);
    }
    s.put([x + w, y, z], s.solid(F.left(x, y, z + h), rr(w, h, 3.5), 4, m, { art: art.line(`M1.5 2L${f1(w / 2)} ${f1(h * 0.56)}L${f1(w - 1.5)} 2`, line, 1.4) + mark }), kk);
    s.shadow(x + w / 2 + z * 0.1, y - 2, w * 0.5, 8, z > 12 ? 0.5 : 1);
  };
  k.pin = ([x, y, z = 0], r = 8, m = M.oxide, kk = 0) => {
    s.put([x + r, y, z], s.solid(F.left(x - r, y, z + r * 2.8), pinPts(r), 3, m, { art: art.dot(r, r, r * 0.38, '#FFFFFF') }), kk);
    s.shadow(x + 1, y + 1, 4.5, 4.5);
  };
  /* a dome: a bell, a hard hat. Discs, one on another, lighter towards the top */
  k.dome = ([x, y, z = 0], R, m, { n = 10, kk = 0, sq = 1 } = {}) => {
    let out = '';
    for (let i = 0; i < n; i++) {
      const lat = ((i / n) * Math.PI) / 2;
      out += s.solid(F.top(x, y, z + R * sq * Math.sin(lat)), circ(R * Math.cos(lat), 26), 0, m, { face: mix(m.lo, m.hi, 0.2 + 0.8 * (i / (n - 1))) });
    }
    s.put([x + R * 0.71, y + R * 0.71, z], out, kk);
  };
  k.coins = ([x, y, z = 0], n = 5, r = 12, m = M.ochre, kk = 0) => {
    for (let i = 0; i < n; i++) k.cyl([x, y, z + i * 4.4], r, 3.6, m, { kk: kk + i * 0.01, sh: i === 0, top: `<circle r="${f1(r * 0.62)}" fill="none" stroke="${m.lo}" stroke-width="1"/>` });
  };
  /* a store of records: three drums */
  k.drums = ([x, y], r, m, { n = 3, h = 11, gap = 3.5, kk = 0 } = {}) => {
    for (let i = 0; i < n; i++) k.cyl([x, y, i * (h + gap)], r, h, m, { kk: kk + i * 0.01, sh: i === 0, top: `<circle r="${f1(r * 0.66)}" fill="none" stroke="${mix(m.hi, '#FFFFFF', 0.5)}" stroke-width="1.6"/>` });
  };
  k.house = ([x, y], { w = 30, d = 26, h = 20, roof = 13, m = M.paper, rm = M.oxide } = {}) => {
    k.box([x, y], { w, d, h, m, r: 1.5,
      left: art.rect(w / 2 - 4, h - 12, 8, 12, mix(m.lo, '#000000', 0.3), 1) + art.rect(4, 5, 6, 6, GLASS, 1) + art.rect(w - 10, 5, 6, 6, GLASS, 1),
      right: art.rect(d / 2 - 4, 6, 8, 7, GLASS, 1) });
    s.put([x + w, y + d, h], s.solid(F.left(x - 2, y + d + 2, h + roof), [[0, roof], [(w + 4) / 2, 0], [w + 4, roof]], d + 4, rm), 0.5);
  };
  k.van = ([x, y], { m = M.paper, kk = 0, u = 1.2 } = {}) => {
    const w = 64 * u, d = 30 * u, h = 30 * u, z = 5 * u, wr = 7 * u;
    const side = art.rect(0, h - 10 * u, w, 4.5 * u, INK.oxide) + art.rect(w - 21 * u, 4 * u, 15 * u, 11 * u, GLASS, 2.5) + art.rect(6 * u, 5 * u, 24 * u, 9 * u, mix(m.mid, '#000000', 0.07), 2) + art.line(`M${f1(w - 25 * u)} 3V${f1(h - 2)}`, mix(m.lo, '#000000', 0.25), 0.8);
    const front = art.rect(4 * u, 4 * u, d - 8 * u, 11 * u, GLASS, 2.5) + art.rect(3 * u, h - 9 * u, 5 * u, 3 * u, '#F6E7B8', 1) + art.rect(d - 8 * u, h - 9 * u, 5 * u, 3 * u, '#F6E7B8', 1);
    s.put([x + w, y + d, 0], s.solid(F.top(x, y, z + h), rr(w, d, 6 * u), h, m) + s.on(F.left(x, y + d, z + h), side) + s.on(F.right(x + w, y + d, z + h), front), kk);
    for (const wx of [x + 13 * u, x + w - 13 * u]) s.put([wx + wr, y + d + 2, 0], s.solid(F.left(wx - wr, y + d + 1.5, wr * 2), circ(wr, 20, wr, wr), 3.5, M.graphite, { art: art.dot(wr, wr, wr * 0.4, '#8E8C85') }), kk + 0.5);
    s.shadowArt(`<rect x="${f1(x - 2)}" y="${f1(y + 3)}" width="${f1(w + 8)}" height="${f1(d + 6)}" rx="8"/>`);
  };
  k.magnifier = ([x, y, z], r = 15, kk = 0) => {
    const fr = F.left(x - r, y, z + 2 * r), handle = turn(rr(6.5, 22, 3), -45, 3, 0).map(([u, v]) => [u + r * 1.6, v + r * 1.6]);
    s.put([x + r, y, z], s.solid(fr, handle, 3.5, M.graphite) + s.solid(fr, circ(r, 28, r, r), 3.5, M.graphite,
      { art: art.dot(r, r, r - 3.4, '#EEF4F5') + art.line(`M${f1(r * 0.55)} ${f1(r * 0.95)}A${f1(r * 0.5)} ${f1(r * 0.5)} 0 0 1 ${f1(r * 0.95)} ${f1(r * 0.55)}`, '#FFFFFF', 1.8) }), kk);
    s.shadow(x + z * 0.1, y - 1, r * 0.9, 5, 0.5);
  };
  /* a gate things pass through to be checked: two posts and a beam, across a path along x */
  k.gate = ([x, y0, y1], { h = 58, m = M.oxide, kk = L1 } = {}) => {
    k.box([x, y0 - 9], { w: 9, d: 9, h, m, r: 2 });
    k.box([x, y1], { w: 9, d: 9, h, m, r: 2, kk });
    k.box([x, y0 - 9, h], { w: 9, d: y1 - y0 + 18, h: 8, m, r: 2, kk: kk + 10 });
  };
  /* dashes on the ground, with an arrowhead: which way things go */
  k.flow = (a, c, b, color = INK.oxide) => {
    const ang = Math.atan2(b[1] - c[1], b[0] - c[0]);
    const hd = (da) => `${f1(b[0] - 8 * Math.cos(ang + da))} ${f1(b[1] - 8 * Math.sin(ang + da))}`;
    s.floor(`<path d="M${a[0]} ${a[1]}Q${c[0]} ${c[1]} ${b[0]} ${b[1]}" stroke="${color}" stroke-width="2.6" stroke-dasharray=".1 7" stroke-linecap="round"/>`
      + `<path d="M${hd(0.5)}L${b[0]} ${b[1]}L${hd(-0.5)}" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`);
  };
  /* small square tiles lying about the floor: the stage's furniture */
  k.chips = (list) => { for (const [sx, sy, c = M.oxide, n = 9] of list) { const [x, y] = g(sx, sy); s.put([x + n, y + n], s.solid(F.top(x, y, 2), rr(n, n, 2), 2, c)); } };
  return k;
}

/* ============================================================================
   THE SCENES. Two of them — the two that take two columns in a gallery —
   can also be drawn wide: the same things, spread across a longer stage.
   ============================================================================ */
const starArt = (cx, cy, R, c = '#D0AA6C') => art.path(`M${starPts(R).map(([u, v]) => `${f1(u + cx - R)} ${f1(v + cy - R)}`).join('L')}Z`, c);

/* 01 · Lead-to-Cash: every source of a lead comes into one hub, and the stage
   a lead is at drives what happens next, for three contractors */
function leadToCash(L, wide = false) {
  const k = kit(L, wide ? { W: 780 } : undefined);
  const at = wide
    ? { meta: [-252, -22, 58], phone: [-268, 24, 26], doc: [-218, 62, 6], chat: [-160, 88, 0], cal: [-174, -70, 62], h1: [150, 46], h2: [196, 16], h3: [118, 82], env: [226, -48, 38], star: [268, -8, 18], ads: [172, -84, 40], coins: [40, 86], n8n: [54, 10, 0] }
    : { meta: [-150, -30, 66], phone: [-156, 16, 32], doc: [-124, 58, 8], chat: [-80, 88, 0], cal: [-104, -76, 70], h1: [86, 44], h2: [124, 16], h3: [58, 78], env: [124, -62, 40], star: [152, -22, 26], ads: [100, -100, 50], coins: [14, 80], n8n: [36, 8, 0] };
  /* the hub: one board, a lead moving along it */
  const [mx, my] = Lf(6, -34, 150);
  let board = art.rect(0, 0, 140, 90, INK.screen, 4);
  for (let c = 0; c < 4; c++) {
    board += art.rect(6 + c * 33.5, 7, 28, 78, '#F1EEE7', 4) + art.bar(10 + c * 33.5, 12, 15, c === 2 ? INK.oxide : INK.dark, 3.2);
    for (let r = 0; r < [3, 2, 3, 1][c]; r++) {
      const hot = c === 2 && r === 0;
      board += art.rect(9 + c * 33.5, 21 + r * 19, 22, 15, hot ? INK.oxide : '#FFFFFF', 3) + art.bar(12 + c * 33.5, 25 + r * 19, 13, hot ? '#FFFFFF' : INK.mid, 2.4) + art.bar(12 + c * 33.5, 30 + r * 19, 9, hot ? '#F6D9CB' : INK.line, 2.4);
    }
  }
  k.box([mx + 55, my - 12], { w: 40, d: 24, h: 4, m: M.graphite, r: 5 });
  k.box([mx + 70, my - 4, 4], { w: 10, d: 7, h: 12, m: M.graphite, r: 2, kk: L1 });
  k.panel([mx, my, 14], { w: 150, h: 100, r: 7, t: 4, m: M.graphite, a: `<g transform="translate(5 5)">${board}</g>`, kk: L2, sh: false });
  /* where leads come from: lead ads, tracked calls, forms, a chat widget, bookings */
  k.tile('Meta', Lf(at.meta[0], at.meta[1], 34, at.meta[2]), { size: 34 });
  k.sign('phone', Lf(at.phone[0], at.phone[1], 30, at.phone[2]), { size: 30 });
  k.sign('doc', Lf(at.doc[0], at.doc[1], 30, at.doc[2]), { size: 30 });
  k.sign('chat', Lf(at.chat[0], at.chat[1], 30, at.chat[2]), { size: 30 });
  k.sign('calendar', Lf(at.cal[0], at.cal[1], 28, at.cal[2]), { size: 28 });
  if (wide) {
    k.sign('browser', Lf(-112, 48, 30, 0), { size: 30 });
    k.flow(g(-206, 32), g(-140, 24), g(-74, 4));
    k.flow(g(-136, 80), g(-90, 54), g(-50, 22));
    k.flow(g(76, 14), g(104, 30), g(122, 44));
  } else {
    k.flow(g(-124, 30), g(-90, 22), g(-58, 2));
    k.flow(g(-70, 80), g(-50, 50), g(-36, 20));
  }
  /* the three contractors it runs for */
  k.house(Bx(at.h1[0], at.h1[1], 30, 26));
  k.house(Bx(at.h2[0], at.h2[1], 26, 24), { h: 17, roof: 11 });
  k.house(Bx(at.h3[0], at.h3[1], 28, 24), { h: 18, roof: 12 });
  /* what a stage sets off: a letter chasing an estimate, a review asked for,
     a won job sent back to the ad platform, a job paid */
  k.envelope(Lf(at.env[0], at.env[1], 42, at.env[2]), { w: 42, h: 27 });
  k.panelR(Rf(at.star[0], at.star[1], 30, at.star[2]), { w: 30, h: 30, r: 8, t: 5, face: '#FFFFFF', a: starArt(15, 15, 9.5) });
  k.tile('Google Ads', Rf(at.ads[0], at.ads[1], 32, at.ads[2]), { size: 32, face: 'right' });
  k.coins(g(at.coins[0], at.coins[1]), 5);
  k.tile('n8n', Lf(at.n8n[0], at.n8n[1], 30, at.n8n[2]), { size: 30 });
  k.chips(wide ? [[-40, 94, M.oxide], [250, 40, M.steel, 7], [-300, -10, M.paper, 7]] : [[-24, 94, M.oxide], [150, 30, M.steel, 7]]);
  return k.s.render(wide ? { wide: 1.62 } : undefined);
}

/* 02 · Voice agents for a training academy: a call is answered or placed by
   an agent, the details go out while the caller is on the line, and the
   outcome is written to the CRM */
function voice(L) {
  const k = kit(L);
  const wave = [6, 13, 21, 10, 26, 16, 8, 19, 12].map((h, i) => art.rect(7 + i * 4.4, 62 - h / 2, 2.8, h, INK.oxide, 1.4)).join('');
  k.phone(Lf(-22, 8, 58), { screen: art.dot(25, 28, 13, INK.wash) + art.dot(25, 28, 7.6, INK.oxide) + art.bar(11, 46, 28, INK.dark, 3.4) + wave
    + art.dot(15, 90, 7, INK.soft) + art.dot(35, 90, 7, INK.oxide) + art.rect(31, 88.6, 8, 2.8, '#FFFFFF', 1.4) });
  /* what it says while the call runs */
  k.bubble(Lf(56, 2, 46, 70), { w: 46, h: 28, a: [14, 23, 32].map((cx) => art.dot(cx, 14, 2.7, '#FFFFFF')).join('') });
  /* the academy: a cap on its books */
  const [bx, by] = Bx(-110, 34, 56, 40);
  k.box([bx, by], { w: 56, d: 40, h: 10, m: M.oxide, r: 2, left: art.rect(4, 3, 48, 4, '#F8E8DD', 1) });
  k.box([bx + 3, by + 2, 10], { w: 49, d: 35, h: 9, m: M.cream, r: 2, left: art.rect(4, 2.6, 41, 3.6, '#FFFFFF', 1), kk: L1 });
  k.cyl([bx + 28, by + 19, 19], 13, 10, M.graphite, { kk: L2 });
  k.mat([bx + 4, by - 5, 29], { w: 48, d: 48, t: 3.4, r: 2, m: M.graphite, kk: L3, a: art.dot(24, 24, 2.6, INK.oxide) + art.line('M24 24L44 44', INK.oxide, 1.8) });
  /* the outcome, in the CRM */
  k.panelR(Rf(118, -32, 62), { w: 62, h: 72, r: 5, face: '#FFFFFF', a: art.rect(0, 0, 62, 9, INK.oxide, 5) + art.rect(0, 5, 62, 4, INK.oxide) + person(14, 22, 7.5)
    + art.bar(27, 17, 24, INK.dark, 3.6) + art.bar(27, 24.5, 16, INK.line) + [0, 1, 2].map((i) => art.rect(6, 37 + i * 11, 50, 8, INK.soft, 4) + art.bar(10, 39.4 + i * 11, 20 + i * 5, INK.mid, 3) + art.check(49, 41 + i * 11, 2.9)).join('') });
  k.tile('ElevenLabs', Lf(-118, -38, 36, 66));
  k.tile('Twilio', Rf(60, -92, 30, 60), { size: 30, face: 'right' });
  k.tile('WhatsApp', Lf(-58, 90, 34, 4), { size: 34 });
  k.flow(g(24, 10), g(64, -6), g(92, -22));
  k.chips([[6, 90, M.oxide], [150, 24, M.steel, 7], [-150, 6, M.paper, 7]]);
  return k.s.render();
}

/* 03 · Shopify support inbox: mail comes in, is read against the store's own
   order, and goes out as an answer, a replacement, or a message to a person */
function shopify(L) {
  const k = kit(L);
  const screen = logoSvg(L, 'Shopify', 7, 8, 30)
    + art.bar(44, 12, 34, INK.dark, 4) + art.bar(44, 21, 22, INK.mid)
    + [0, 1, 2].map((i) => art.rect(7, 44 + i * 9.4, 90, 7, i === 0 ? INK.wash : INK.soft, 3.5)
      + art.bar(12, 46 + i * 9.4, 30 + ((i * 13) % 22), i === 0 ? INK.oxide : INK.mid, 3) + art.check(90, 47.5 + i * 9.4, 2.6, i === 2 ? INK.mid : INK.oxide)).join('');
  k.laptop([-66, -62], { screen });
  /* the inbox: the customer's letter, open, and two more behind it */
  k.envelope([-126, 22, 30], { w: 40, h: 26 });
  k.envelope([-104, 46, 14], { w: 46, h: 30 });
  k.envelope([-70, 84], { w: 66, h: 42, open: true, mark: logoSvg(L, 'Gmail', 24, 21, 18),
    letter: art.bar(8, 9, 30, INK.dark, 3.4) + lines(8, 17, 40, 3) });
  /* the replacement, boxed and sent once */
  k.box([62, -6], { w: 46, d: 46, h: 36, top: art.rect(19, 0, 8, 46, '#F2E3C8'),
    left: art.rect(19, 0, 8, 13, '#E3CFAE') + art.rect(5, 18, 15, 11, '#FFFFFF', 1.5) + art.bar(7, 21, 9, INK.mid, 2) + art.bar(7, 25, 6, INK.line, 2) });
  k.check([96, 42, 44], 10);
  /* what reads the mail, and where a person hears of it */
  k.tile('OpenAI', [-134, -34, 64]);
  k.tile('Telegram', [74, -112, 58], { face: 'right' });
  k.tile('n8n', [18, -128, 96], { size: 28, face: 'right' });
  k.flow([-34, 96], [-4, 70], [6, 36]);
  k.chips([[-100, 78, M.oxide], [-40, 90, M.paper, 7], [112, 70, M.steel, 7]]);
  return k.s.render();
}

/* 04 · Local Services Ads: a paid lead is answered in minutes, inside
   Google's own thread, and booked into a slot a technician really has */
function lsa(L) {
  const k = kit(L);
  k.phone(Lf(-62, 12, 58), { screen: logoSvg(L, 'Google Search', 6, 11, 13) + art.bar(24, 13, 20, INK.dark, 3.6) + art.bar(24, 20, 12, INK.line, 2.8)
    + art.rect(5, 32, 32, 15, INK.soft, 6) + art.bar(10, 36.6, 20, INK.mid, 2.8) + art.bar(10, 41.4, 13, INK.mid, 2.8)
    + art.rect(13, 51, 32, 21, INK.oxide, 6) + art.bar(18, 56, 21, '#FFFFFF', 2.8) + art.bar(18, 61, 15, '#F6D9CB', 2.8) + art.bar(18, 66, 19, '#F6D9CB', 2.8)
    + art.rect(5, 76, 23, 12, INK.soft, 6) + [11, 16.5, 22].map((cx) => art.dot(cx, 82, 1.7, INK.mid)).join('') });
  /* minutes, not hours */
  k.badge([...g(-132, -10), 62], 19, M.graphite, clockArt(19) + art.rect(16, -5, 6, 6, INK.black, 1.5));
  /* a slot the calendar really has, and the technician who takes it */
  k.panel(Lf(50, -48, 76), { w: 76, h: 72, r: 6, face: '#FFFFFF', a: calArt(76, 72, 6) });
  k.check([...g(92, -34), 64], 10);
  k.van(Bx(80, 40, 77, 36));
  k.tile('Google Ads', Lf(-130, 54, 36, 6));
  k.tile('Google Gemini', Rf(104, -98, 30, 58), { size: 30, face: 'right' });
  k.flow(g(-22, 16), g(14, -4), g(28, -30));
  k.flow(g(64, -20), g(96, -8), g(98, 12));
  k.chips([[-30, 92, M.oxide], [-150, 16, M.steel, 7], [150, -8, M.paper, 7]]);
  return k.s.render();
}

/* 05 · Construction outreach: firms found on a map, then a four-step sequence
   of mail that stops the moment someone answers */
function construction(L) {
  const k = kit(L);
  const [mx, my] = Bx(-14, -24, 150, 104);
  k.mat([mx, my], { w: 150, d: 104, t: 4, r: 6, m: M.cream, a: art.rect(4, 4, 142, 96, '#F4EFE0', 4) + art.rect(12, 12, 50, 34, '#C5D8BA', 4) + art.rect(94, 60, 46, 34, '#BAD4DD', 4)
    + art.line('M4 54H146M74 4V100M4 24L74 54L146 34', '#DDD5C2', 7) + art.line('M4 54H146M74 4V100M4 24L74 54L146 34', '#FFFFFF', 3.4) });
  k.pin([mx + 40, my + 34, 4], 10, M.oxide, L1);
  k.pin([mx + 98, my + 42, 4], 8, M.graphite, L1);
  k.pin([mx + 108, my + 78, 4], 9, M.oxide, L1);
  /* a hard hat, in front of it */
  const [hx, hy] = g(-108, 50);
  k.cyl([hx, hy], 23, 3, M.ochre);
  k.dome([hx - 2, hy - 2, 3], 17.5, M.ochre, { kk: L1, sq: 1.05 });
  /* the sequence: four letters, and the reply that stops it */
  [[-12, 78], [40, 64], [90, 46], [134, 22]].forEach(([sx, sy], i) => {
    k.envelope(Lf(sx, sy, 46, i * 2), { w: 46, h: 30, m: i === 3 ? M.paper : M.cream, mark: Array.from({ length: i + 1 }, (_, j) => art.dot(7 + j * 5.4, 24, 1.8, INK.oxide)).join('') });
  });
  { const [cx, cy] = g(134, 22); k.badge([cx + 8, cy + 2, 34], 11, M.oxide, art.rect(7, 7, 8, 8, '#FFFFFF', 1.6), { kk: L1 }); }
  k.tile('Google Maps', Rf(44, -102, 34, 46), { size: 34, face: 'right' });
  k.tile('Gmail', Rf(152, -30, 32, 50), { size: 32, face: 'right' });
  k.tile('Google Sheets', Lf(-142, -8, 30, 44), { size: 30 });
  k.chips([[-58, 96, M.oxide], [150, 44, M.steel, 7]]);
  return k.s.render();
}

/* 06 · Labor-law outreach: every four hours the firm's sheet is read, the
   mailbox is checked for replies, and only what is due goes out */
function laborLaw(L) {
  const k = kit(L);
  /* the firm */
  const bx = -110, by = -40;
  k.box([bx, by], { w: 104, d: 64, h: 5, m: STONE, r: 2 });
  k.box([bx + 6, by + 6, 5], { w: 92, d: 52, h: 4, m: STONE, r: 2, kk: 10 });
  k.box([bx + 14, by + 10, 9], { w: 76, d: 34, h: 38, m: STONE, r: 1, kk: 20, left: art.rect(30, 12, 16, 26, mix(STONE.lo, '#000000', 0.35), 2) });
  for (let i = 0; i < 4; i++) k.cyl([bx + 20 + i * 21.4, by + 51, 9], 4.8, 38, STONE, { kk: L1 + i, sh: false, n: 16 });
  k.box([bx + 8, by + 8, 47], { w: 88, d: 50, h: 6, m: STONE, r: 1, kk: L2 });
  k.s.put([bx + 98, by + 58, 53], k.s.solid(F.left(bx + 6, by + 58, 75), [[0, 22], [46, 0], [92, 22]], 50, STONE, { art: art.dot(46, 14.5, 4.2, INK.oxide) }), L3);
  /* the cycle */
  k.badge([...g(72, -88), 54], 20, M.graphite, clockArt(20) + art.line('M6.5 27A14.5 14.5 0 0 0 33.5 27', INK.oxide, 2.2));
  /* the state of every prospect, where the firm can read it */
  const [sx0, sy0] = Bx(-6, 70, 80, 54);
  k.mat([sx0, sy0], { w: 80, d: 54, t: 3, r: 5, a: art.rect(0, 0, 80, 11, '#E2F0E6', 5) + art.rect(0, 6, 80, 5, '#E2F0E6') + logoSvg(L, 'Google Sheets', 4, 1.6, 8)
    + [0, 1, 2, 3].map((i) => art.bar(6, 17 + i * 9, 30 + ((i * 11) % 14), INK.mid, 3) + art.bar(46, 17 + i * 9, 14, INK.line, 3) + art.dot(70, 18.6 + i * 9, 3, i === 1 ? INK.oxide : i === 3 ? INK.mid : '#7FB58F')).join('') });
  /* what is due goes out; a reply comes back, and stops it */
  k.envelope(Lf(96, 22, 48, 4), { w: 48, h: 31 });
  k.envelope(Lf(138, -10, 38, 26), { w: 38, h: 25 });
  k.envelope(Lf(112, 66, 44, 0), { w: 44, h: 29, m: M.paper });
  k.check([...g(134, 70), 26], 10, { kk: L1 });
  k.tile('Gmail', Rf(150, -58, 32, 60), { size: 32, face: 'right' });
  k.tile('Google Sheets', Lf(-62, 94, 30, 0), { size: 30 });
  k.flow(g(-10, 4), g(30, 10), g(64, 20));
  k.chips([[-126, 54, M.oxide], [36, 100, M.steel, 7]]);
  return k.s.render();
}

/* 07 · LinkedIn lead pipeline: people found, watched through the scrape,
   enriched, and checked against what is already held before a row is written */
function linkedin(L) {
  const k = kit(L);
  const bx = -124, by = -14;
  k.box([bx, by], { w: 200, d: 44, h: 12, m: M.graphite, r: 6,
    top: art.rect(5, 5, 190, 34, '#262522', 4) + Array.from({ length: 12 }, (_, i) => art.line(`M${14 + i * 15.6} 11l5 11-5 11`, '#45433F', 1.6)).join('') + art.rect(96, 5, 16, 34, '#B8532E', 0, ' opacity=".55"') });
  /* each person, as a card on the line; past the gate, the ones that are new */
  const card = (x, ok) => k.panel([x, by + 24, 12], { w: 32, h: 40, r: 4, face: '#FFFFFF', kk: 500, sh: false,
    a: person(16, 13, 8, ok ? INK.oxide : INK.dark, ok ? INK.wash : INK.soft) + art.bar(7, 26, 18, INK.dark, 3) + art.bar(7, 32, 12, INK.line, 2.6) + (ok ? art.check(26, 6, 3.6) : '') });
  card(bx + 10, false); card(bx + 52, false); card(bx + 124, true); card(bx + 162, true);
  k.gate([bx + 98, by, by + 44], { h: 60 });
  k.magnifier([bx + 26, by + 60, 22], 16, L2);
  /* one that was already held, set aside */
  const [dx, dy] = Bx(-34, 84, 36, 26);
  k.mat([dx, dy], { w: 36, d: 26, r: 4, a: person(9, 9, 5.4, INK.mid, INK.soft) + art.bar(18, 6, 12, INK.mid, 3) + art.bar(18, 12, 8, INK.line, 2.6) + art.line('M22 15l8 8M30 15l-8 8', INK.oxide, 2) });
  /* where they are kept */
  k.drums([100, 8], 22, M.oxide);
  k.tile('LinkedIn', Lf(-152, -46, 36, 44));
  k.tile('Google Search', Rf(-44, -92, 30, 60), { size: 30, face: 'right' });
  k.tile('Google Sheets', Rf(140, 0, 32, 56), { size: 32, face: 'right' });
  k.chips([[60, 90, M.oxide], [-124, 60, M.steel, 7], [150, 50, M.paper, 7]]);
  return k.s.render();
}

/* 08 · AdWash: campaigns written and launched, bids moved with the weather,
   spend held to the plan, booked revenue traced back to the click */
function adwash(L, wide = false) {
  const k = kit(L, wide ? { W: 780 } : undefined);
  const at = wide
    ? { sun: [-238, -44, 78], cloud: [-218, -20, 56], target: [-178, 68], coins: [206, 46], card: [150, 68], stripe: [262, -22, 38] }
    : { sun: [-128, -52, 80], cloud: [-112, -28, 60], target: [-92, 72], coins: [118, 44], card: [74, 66], stripe: [152, -28, 44] };
  const ad = (x) => art.rect(x, 26, 58, 36, '#FFFFFF', 4, ` stroke="${INK.line}" stroke-width="1"`) + art.bar(x + 6, 32, 34, INK.dark, 3.4) + art.bar(x + 6, 39, 44, INK.line) + art.bar(x + 6, 45, 38, INK.line) + art.rect(x + 6, 51, 22, 7, INK.oxide, 3.5);
  k.panel(Lf(12, -34, 144, 8), { w: 144, h: 100, r: 6, t: 3.5, face: '#FFFFFF', a: winArt(144, logoSvg(L, 'Google Ads', 9, 6, 15) + art.bar(30, 9, 40, INK.dark, 4) + art.bar(30, 17, 24, INK.mid)
    + ad(9) + ad(76) + art.line('M11 76H133', INK.line, 4) + art.line('M11 76H92', INK.oxide, 4) + art.dot(92, 76, 6, '#FFFFFF', ` stroke="${INK.oxide}" stroke-width="2.4"`)) });
  /* the weather a bid follows */
  k.badge([...g(at.sun[0], at.sun[1]), at.sun[2]], 16, M.ochre, Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return art.line(`M${f1(16 + 21 * Math.cos(a))} ${f1(16 + 21 * Math.sin(a))}L${f1(16 + 26 * Math.cos(a))} ${f1(16 + 26 * Math.sin(a))}`, '#D0AA6C', 3); }).join(''));
  k.panel(Lf(at.cloud[0], at.cloud[1], 62, at.cloud[2]), { w: 62, h: 41, t: 4, face: '#FFFFFF', pts: cloudPts(62),
    a: [18, 31, 44].map((x, i) => art.line(`M${x} ${47 + (i % 2) * 3}l-3 8`, '#8FB3C0', 2.6)).join('') });
  /* the plan's ceiling on spend, and the revenue that came of a click */
  k.coins(g(at.coins[0], at.coins[1]), 6, 13);
  k.panel(Lf(at.card[0], at.card[1], 52), { w: 52, h: 33, r: 5, m: M.oxide, a: art.rect(6, 8, 10, 8, '#EBCB8B', 2) + art.bar(6, 22, 26, '#F6D9CB', 3) + art.bar(36, 22, 10, '#F6D9CB', 3) });
  k.badge([...g(at.target[0], at.target[1]), 0], 21, M.paper, art.dot(21, 21, 16.5, INK.oxide) + art.dot(21, 21, 11.5, '#FFFFFF') + art.dot(21, 21, 6.5, INK.oxide) + art.dot(21, 21, 2.2, '#FFFFFF'), { fill: '#FFFFFF' });
  k.tile('Stripe', Rf(at.stripe[0], at.stripe[1], 34, at.stripe[2]), { size: 34, face: 'right' });
  if (wide) {
    /* the booked job the revenue came from */
    k.van(Bx(196, -30, 77, 36));
    k.flow(g(-186, 4), g(-124, 16), g(-70, 8));
    k.flow(g(-40, 44), g(-100, 66), g(-150, 64));
    k.flow(g(96, -6), g(126, -14), g(150, -24));
  } else {
    k.flow(g(-84, -4), g(-66, 10), g(-48, 8));
    k.flow(g(-30, 40), g(-50, 58), g(-66, 62));
  }
  k.chips(wide ? [[-20, 96, M.oxide], [280, 30, M.steel, 7], [-290, 20, M.paper, 7]] : [[-10, 94, M.oxide], [156, 22, M.steel, 7]]);
  return k.s.render(wide ? { wide: 1.62 } : undefined);
}

/* 09 · Just Grade Metrics: every call graded against the customer's own
   scorecard, and a score stands only if its quote is in the transcript */
function gradeMetrics(L) {
  const k = kit(L);
  /* the scorecard */
  const row = (i, ok) => art.rect(9, 30 + i * 15, 58, 11, i === 1 ? INK.wash : '#F4F2EC', 4) + art.bar(13, 33.8 + i * 15, 22 + ((i * 9) % 13), i === 1 ? INK.oxide : INK.mid, 3.2)
    + (ok ? art.check(59, 35.5 + i * 15, 3.6) : art.dot(59, 35.5 + i * 15, 3.6, INK.black) + art.line(`M57.4 ${33.9 + i * 15}l3.2 3.2m0-3.2l-3.2 3.2`, '#FFFFFF', 1.1));
  k.panel(Lf(22, -22, 80), { w: 80, h: 106, r: 6, t: 4, m: M.kraft, a: art.rect(5, 9, 70, 92, '#FFFFFF', 4) + art.rect(27, 2, 26, 11, '#8E8C85', 3) + art.bar(14, 19, 34, INK.dark, 4) + row(0, true) + row(1, true) + row(2, true) + row(3, false) });
  /* the transcript, and the line a score quotes */
  k.panel(Lf(-96, 22, 62), { w: 62, h: 84, r: 5, face: '#FFFFFF', a: art.bar(8, 9, 26, INK.dark, 3.6) + lines(8, 19, 46, 3) + art.rect(5, 39, 52, 13, INK.wash, 3) + art.rect(5, 39, 3, 13, INK.oxide, 1.5) + art.bar(12, 43.6, 38, INK.oxide, 3.4) + lines(8, 58, 46, 3) });
  k.badge([...g(-62, 34), 58], 11, M.oxide, art.path('M6 8h3.6v3.4c0 2.4-1.4 3.9-3.6 4.4zM12 8h3.6v3.4c0 2.4-1.4 3.9-3.6 4.4z', '#FFFFFF'), { kk: L1 });
  /* the call it came from */
  k.sign('phone', Lf(-58, 74, 30), { size: 30 });
  /* who may see the grade */
  [[92, 46], [118, 34], [144, 20]].forEach(([sx, sy], i) => k.badge([...g(sx, sy), 0], 11, M.paper, person(11, 11, 8, i === 0 ? INK.oxide : INK.dark, i === 0 ? INK.wash : INK.soft), { fill: '#FFFFFF' }));
  k.tile('OpenAI', Rf(96, -92, 34, 50), { size: 34, face: 'right' });
  k.tile('Supabase', Rf(152, -40, 32, 46), { size: 32, face: 'right' });
  k.flow(g(-56, 24), g(-36, 12), g(-22, -4));
  k.chips([[36, 96, M.oxide], [-146, 0, M.steel, 7]]);
  return k.s.render();
}

/* 10 · AI Front Desk: the call nobody could take is answered, kept within a
   price table, and booked into the real calendar, after hours too */
function frontDesk(L) {
  const k = kit(L);
  const [cx, cy] = Bx(-6, 14, 124, 30);
  k.box([cx + 96, cy - 42], { w: 28, d: 42, h: 38, m: M.cream, r: 2 });
  k.box([cx, cy], { w: 124, d: 30, h: 38, m: M.cream, r: 2, left: art.rect(7, 8, 110, 24, INK.oxide, 4) + art.rect(7, 8, 110, 5, '#E8875D', 2.5) });
  /* its top: one counter over both */
  k.box([cx + 93, cy - 45, 38], { w: 34, d: 46, h: 3.5, m: M.kraft, r: 3, kk: L1, sh: false });
  k.box([cx - 3, cy - 3, 38], { w: 130, d: 36, h: 3.5, m: M.kraft, r: 3, kk: L1 + 1, sh: false });
  /* the bell, and the line that is ringing */
  k.cyl([cx + 30, cy + 15, 41.5], 12, 3, M.graphite, { kk: L2, sh: false });
  k.dome([cx + 30, cy + 15, 44.5], 9.6, M.ochre, { kk: L3 });
  k.cyl([cx + 30, cy + 15, 54], 2.4, 3, M.graphite, { kk: L4, sh: false, n: 12 });
  k.phone([cx + 66, cy + 16, 41.5], { w: 32, h: 60, kk: L2, screen: art.dot(12, 22, 8.5, INK.oxide) + glyphSvg('phone', 6.8, 16.8, 10.4, '#FFFFFF', 2.2) + art.bar(5, 37, 14, INK.dark, 3) + art.bar(7, 43, 10, INK.line, 2.6) });
  k.s.put([cx + 100, cy + 16, 41.5], k.s.on(F.left(cx + 100, cy + 16, 108), art.line('M4 12a9 9 0 0 1 0 14M10 6a17 17 0 0 1 0 26', INK.oxide, 2.6)), L3);
  /* after hours */
  k.badge([...g(-122, -52), 86], 17, M.ochre, '', { pts: moonPts(17) });
  k.badge([...g(-80, -74), 92], 6, M.ochre, '', { pts: starPts(6), t: 2 });
  k.badge([...g(-150, -22), 70], 4.5, M.ochre, '', { pts: starPts(4.5), t: 2 });
  /* the booking */
  k.panel(Lf(96, -52, 70), { w: 70, h: 66, r: 6, face: '#FFFFFF', a: calArt(70, 66, 9) });
  k.check([...g(134, -40), 58], 10);
  k.tile('Twilio', Lf(-128, 40, 34, 8), { size: 34 });
  k.tile('ElevenLabs', Lf(-84, 84, 32, 0), { size: 32 });
  k.tile('Slack', Rf(152, 14, 32, 22), { size: 32, face: 'right' });
  k.tile('OpenAI', Rf(40, -108, 30, 70), { size: 30, face: 'right' });
  k.chips([[40, 94, M.oxide], [120, 60, M.steel, 7]]);
  return k.s.render();
}

/* 11 · Invoice intake: an invoice in the mail is read to a fixed shape, its
   sums are checked, it is matched and posted to the books once */
function invoice(L) {
  const k = kit(L);
  k.envelope(Lf(-118, 34, 62), { w: 62, h: 40, open: true, mark: logoSvg(L, 'Gmail', 22.5, 20, 17), letter: art.bar(8, 9, 26, INK.dark, 3.4) + lines(8, 17, 38, 3) });
  /* the invoice, passing the check */
  const gx = -30;
  k.panel([gx - 34, 4, 10], { w: 58, h: 76, r: 5, face: '#FFFFFF', kk: 500, a: art.bar(8, 9, 22, INK.dark, 4) + art.rect(38, 6, 13, 9, INK.wash, 2) + lines(8, 22, 42, 2)
    + [0, 1, 2].map((i) => art.bar(8, 39 + i * 7, 24, INK.line, 3) + art.bar(40, 39 + i * 7, 10, INK.mid, 3)).join('') + art.line('M8 61H50', INK.line, 1) + art.bar(8, 65, 16, INK.dark, 3.4) + art.bar(36, 65, 14, INK.oxide, 3.4) });
  k.gate([gx, -34, 38], { h: 96 });
  k.badge([gx + 4, 6, 110], 13, M.paper, glyphSvg('sum', 5.6, 5.6, 14.8, INK.oxide, 2.4), { fill: '#FFFFFF', kk: L3 });
  /* the books */
  const [lx, ly] = Bx(96, 16, 70, 52);
  k.box([lx, ly], { w: 70, d: 52, h: 13, m: M.graphite, r: 3, left: art.rect(3, 3, 64, 7, '#F3F1EB', 1.5), right: art.rect(3, 3, 46, 7, '#E0DCD3', 1.5) });
  k.box([lx + 3, ly + 3, 13], { w: 64, d: 46, h: 11, m: M.oxide, r: 3, kk: L1, left: art.rect(3, 2.6, 58, 6, '#F8E8DD', 1.5), right: art.rect(3, 2.6, 40, 6, '#EBD3C6', 1.5) });
  k.tile('Xero', [lx + 14, ly + 30, 24], { size: 40, kk: L2 });
  k.check([lx + 64, ly + 36, 48], 9, { kk: L3 });
  k.tile('OpenAI', Lf(-84, -70, 30, 84), { size: 30 });
  k.tile('Google Drive', Rf(154, -46, 32, 40), { size: 32, face: 'right' });
  k.flow(g(-74, 40), g(-56, 30), g(-46, 22));
  k.flow(g(18, 12), g(40, 16), g(52, 14));
  k.chips([[-20, 96, M.oxide], [44, 86, M.steel, 7], [-150, -8, M.paper, 7]]);
  return k.s.render();
}

/* 12 · Knowledge assistant: asked in Slack, it answers from the company's own
   documents, with the passage it used, or says it does not know */
function knowledge(L) {
  const k = kit(L);
  /* the documents */
  const spine = (w, h, c) => art.rect(w / 2 - 4.5, 8, 9, 22, c, 2) + art.dot(w / 2, h - 10, 3.2, c);
  k.box([-114, 14], { w: 24, d: 50, h: 62, m: M.oxide, r: 2, left: spine(24, 62, '#F8E8DD') });
  k.box([-89, 14], { w: 22, d: 50, h: 54, m: M.cream, r: 2, left: spine(22, 54, INK.oxide) });
  k.box([-66, 14], { w: 26, d: 50, h: 66, m: M.graphite, r: 2, left: spine(26, 66, '#8E8C85') });
  k.panel(Lf(-112, 46, 58), { w: 58, h: 42, t: 3, m: M.ochre, pts: folderPts(58, 42), a: art.rect(8, 14, 26, 4, '#F6E7B8', 2) });
  k.badge([...g(-90, 48), 6], 10, M.oxide, glyphSvg('lock', 4.4, 4, 11.2, '#FFFFFF', 2.4), { kk: L1 });
  /* the question, and the answer with its passage */
  k.panel(Lf(72, -40, 128, 6), { w: 128, h: 98, r: 6, t: 3.5, face: '#FFFFFF', a: winArt(128,
    art.rect(54, 7, 66, 15, INK.soft, 7) + art.bar(60, 12.6, 48, INK.mid, 3.4)
    + art.rect(8, 28, 96, 50, '#FFFFFF', 7, ` stroke="${INK.line}" stroke-width="1.2"`) + art.bar(15, 35, 62, INK.dark, 3.4)
    + art.rect(15, 43, 82, 15, INK.wash, 3) + art.rect(15, 43, 3, 15, INK.oxide, 1.5) + art.bar(22, 46.6, 66, INK.oxide, 3) + art.bar(22, 52, 44, '#E3A88E', 3)
    + art.rect(15, 63, 40, 10, INK.soft, 5) + glyphSvg('doc', 18, 64.6, 7, INK.dark, 2.4) + art.bar(28, 66.4, 22, INK.mid, 3),
    logoSvg(L, 'Slack', 108, 1.6, 9)) });
  k.magnifier([...g(-24, 44), 26], 16);
  k.tile('Google Drive', Lf(-132, -36, 34, 74), { size: 34 });
  k.tile('OpenAI', Lf(-40, -92, 30, 70), { size: 30 });
  k.tile('Supabase', Rf(150, 22, 32, 10), { size: 32, face: 'right' });
  k.flow(g(-34, 22), g(-6, 14), g(18, 4));
  k.chips([[60, 90, M.oxide], [-40, 96, M.steel, 7], [156, -30, M.paper, 7]]);
  return k.s.render();
}

/* 13 · Client onboarding: from a signed contract to a kicked-off project —
   the payment, the folder, the channel — each step made once */
function onboarding(L) {
  const k = kit(L);
  const x0 = -96, y0 = -10, sw = 40, H = (i) => 14 + i * 16;
  for (let i = 0; i < 5; i++) {
    const t = i / 4, m = { hi: mix(M.cream.hi, M.oxide.hi, t), mid: mix(M.cream.mid, M.oxide.mid, t), lo: mix(M.cream.lo, M.oxide.lo, t) };
    k.box([x0 + i * sw, y0], { w: sw, d: 54, h: H(i), m, r: 2, kk: i });
  }
  /* signed, paid, filed, a channel opened */
  k.panel([x0 + 5, y0 + 38, H(0)], { w: 30, h: 40, r: 3, face: '#FFFFFF', kk: L1, sh: false, a: art.bar(5, 6, 15, INK.dark, 3) + lines(5, 13, 20, 2, 6) + art.line('M5 31c3-5 5 3 8-1s4-3 10 0', INK.oxide, 1.9) });
  k.tile('Stripe', [x0 + sw + 5, y0 + 38, H(1)], { size: 30, kk: L1 + 1 });
  k.tile('Google Drive', [x0 + sw * 2 + 5, y0 + 38, H(2)], { size: 30, kk: L1 + 2 });
  k.tile('Slack', [x0 + sw * 3 + 5, y0 + 38, H(3)], { size: 30, kk: L1 + 3 });
  /* kickoff */
  k.cyl([x0 + sw * 4 + 20, y0 + 28, H(4)], 1.7, 48, M.graphite, { kk: L1 + 4, sh: false, n: 10 });
  k.s.put([x0 + sw * 4 + 52, y0 + 28, H(4)], k.s.solid(F.left(x0 + sw * 4 + 21, y0 + 28, H(4) + 48), [[0, 0], [32, 10], [0, 20]], 1.6, M.oxide, { face: '#E8875D' }), L1 + 5);
  /* the welcome that follows; the one line that says where every client stands */
  k.envelope(Lf(140, 30, 46, 0), { w: 46, h: 30, mark: logoSvg(L, 'Gmail', 16.5, 14.5, 13) });
  k.tile('Google Sheets', Lf(-134, -52, 34, 70), { size: 34 });
  k.check([...g(-70, -84), 84], 11);
  k.flow(g(-110, 62), g(-40, 92), g(50, 84));
  k.chips([[-150, 10, M.oxide], [96, 92, M.steel, 7], [150, -20, M.paper, 7]]);
  return k.s.render();
}

/* 14 · The weekly number: five sources pulled into one row a week, the sums
   done in the sheet, the report written and sent */
function weekly(L) {
  const k = kit(L);
  const src = (i) => art.dot(13, 37.6 + i * 9.6, 3, [INK.oxide, INK.dark, INK.mid, '#8FB3C0', '#D0AA6C'][i]) + art.bar(20, 36 + i * 9.6, 34 + ((i * 17) % 20), INK.line, 3.2) + art.bar(78, 36 + i * 9.6, 16, INK.mid, 3.2);
  k.panel(Lf(44, -34, 108, 4), { w: 108, h: 118, r: 6, t: 3.5, face: '#FFFFFF', a: art.rect(0, 0, 108, 24, '#E2F0E6', 6) + art.rect(0, 14, 108, 10, '#E2F0E6') + logoSvg(L, 'Google Sheets', 8, 5, 14) + art.bar(28, 9, 44, INK.dark, 4)
    + [0, 1, 2, 3, 4].map(src).join('') + art.rect(7, 84, 94, 13, INK.wash, 4) + art.rect(7, 84, 3.4, 13, INK.oxide, 1.7) + glyphSvg('sum', 14, 85.6, 9.6, INK.oxide, 2.6) + art.bar(28, 88.6, 40, INK.oxide, 3.6) + art.bar(78, 88.6, 18, INK.oxide, 3.6)
    + lines(9, 103, 80, 2, 6) });
  /* the five it is pulled from */
  k.tile('Google Ads', Lf(-132, -38, 34, 72), { size: 34 });
  k.tile('Meta', Lf(-152, 4, 32, 36), { size: 32 });
  k.tile('HubSpot', Lf(-124, 48, 34, 8), { size: 34 });
  k.tile('Stripe', Lf(-78, -78, 30, 84), { size: 30 });
  k.sign('phone', Lf(-74, 84, 30, 0), { size: 30 });
  k.flow(g(-104, 20), g(-70, 14), g(-38, 2));
  k.flow(g(-60, 66), g(-40, 44), g(-26, 22));
  /* the week, and where the report goes */
  k.panelR(Rf(140, -34, 50), { w: 50, h: 48, r: 5, face: '#FFFFFF', a: calArt(50, 48, 3) });
  k.tile('Slack', Rf(134, 34, 32, 4), { size: 32, face: 'right' });
  k.chips([[20, 96, M.oxide], [96, 70, M.steel, 7]]);
  return k.s.render();
}

/* 15 · Content repurposing: one long recording in; posts, captions and a
   newsletter out, and one way to publishing — through a person */
function content(L) {
  const k = kit(L);
  /* the recording */
  k.panel(Lf(-98, 8, 90), { w: 90, h: 64, r: 6, t: 4, m: M.graphite, a: art.rect(5, 5, 80, 54, '#262522', 4) + art.dot(45, 27, 12, INK.oxide) + art.path('M41.5 20.5v13l10.5-6.5z', '#FFFFFF')
    + art.line('M12 50H78', '#55534E', 3) + art.line('M12 50H40', INK.oxide, 3) + art.dot(40, 50, 3.4, '#FFFFFF') });
  /* what it becomes */
  const post = (sx, sy, z, c, tall) => k.panel(Lf(sx, sy, 38, z), { w: 38, h: tall ? 52 : 46, r: 4, face: '#FFFFFF', a: art.rect(4, 4, 30, tall ? 14 : 20, c, 3) + lines(5, tall ? 23 : 29, 26, tall ? 4 : 2, 6) });
  post(8, -52, 46, '#8F9C86'); post(54, -38, 30, '#47536E', true); post(100, -22, 16, '#CAA467'); post(142, -4, 4, '#677C7A', true);
  /* the one way out: a person says yes */
  k.badge([...g(26, 40), 0], 17, M.paper, person(17, 17, 12.5), { fill: '#FFFFFF' });
  k.check([...g(46, 46), 26], 9, { kk: L1 });
  k.tile('Slack', Lf(-6, 76, 30, 0), { size: 30 });
  k.tile('Buffer', Rf(150, 34, 34, 6), { size: 34, face: 'right' });
  k.tile('OpenAI', Rf(-30, -96, 30, 66), { size: 30, face: 'right' });
  k.tile('Google Drive', Lf(-140, -46, 32, 60), { size: 32 });
  k.flow(g(-44, 22), g(-14, 28), g(6, 36));
  k.flow(g(50, 34), g(80, 24), g(104, 18));
  k.chips([[90, 80, M.oxide], [-150, 40, M.steel, 7]]);
  return k.s.render();
}

/* 16 · CRM rebuild and migration: one object model, moved across with a dry
   run and a way back, and the follow-up rebuilt on top */
function migration(L) {
  const k = kit(L);
  const [ox, oy] = g(-98, 20), [nx, ny] = g(96, -10);
  k.drums([ox, oy], 25, M.steel);
  k.drums([nx, ny], 27, M.oxide, { h: 12 });
  /* records on their way across */
  [[-44, 4, 44], [-2, -10, 58], [40, -22, 48]].forEach(([sx, sy, z]) => k.panel(Lf(sx, sy, 38, z), { w: 38, h: 20, r: 4, face: '#FFFFFF', a: recordArt(38) }));
  /* the same person held twice, before; the dry run that looks first; the way back */
  const [dx, dy] = Bx(-44, 72, 36, 22);
  k.mat([dx - 8, dy - 6], { w: 36, d: 22, r: 4, a: recordArt(36, INK.mid) });
  k.mat([dx, dy, 2], { w: 36, d: 22, r: 4, a: recordArt(36, INK.mid), kk: L1 });
  k.badge([...g(0, -66), 84], 14, M.paper, glyphSvg('eye', 5.2, 5.2, 17.6, INK.oxide, 2.2), { fill: '#FFFFFF' });
  k.badge([...g(40, 62), 0], 14, M.graphite, glyphSvg('undo', 5.6, 5.6, 16.8, '#FFFFFF', 2.2));
  k.tile('HubSpot', Rf(150, -52, 34, 62), { size: 34, face: 'right' });
  k.tile('PostgreSQL', Rf(58, -104, 30, 60), { size: 30, face: 'right' });
  k.tile('Google Sheets', Lf(-146, -26, 32, 56), { size: 32 });
  k.flow(g(-66, 22), g(0, 30), g(58, 6));
  k.chips([[110, 60, M.oxide], [-110, 70, M.steel, 7], [-150, 44, M.paper, 7]]);
  return k.s.render();
}

/* This site, for the one project on the expertise pages that is not a
   system: its home page on a laptop and on a phone — the name's three lines,
   the typewriter's, the three figures, the cluster of marks — built with
   Astro, and with no JavaScript in it */
function thisSite(L) {
  const k = kit(L);
  const dots = (x, y, s) => [[0, 0, 5.2, '#EA4B71'], [9, -6, 3.4, '#3178C6'], [10, 6, 3.4, '#34A853'], [-9, 6, 3.4, '#EA4335'], [-10, -5, 3.4, '#4285F4'], [0, -11, 2.8, '#8E75B2'], [0, 11.5, 2.8, '#26A5E4'], [17, 0, 2.6, '#FF7A59'], [-17, 1, 2.6, '#3FCF8E']]
    .map(([dx, dy, r, c]) => art.dot(x + dx * s, y + dy * s, r * s, '#FFFFFF', ` stroke="${INK.line}" stroke-width=".8"`) + art.dot(x + dx * s, y + dy * s, r * s * 0.42, c)).join('');
  const name = (x, y, u) => [26, 21, 24].map((w, i) => art.bar(x, y + i * 5.6 * u, w * u, INK.black, 4 * u)).join('');
  const figs = (x, y, u) => [0, 1, 2].map((i) => art.rect(x + i * 15 * u, y, 4.4 * u, 4.4 * u, INK.black, 1) + art.bar(x + i * 15 * u + 5.6 * u, y + 1 * u, 6.5 * u, INK.mid, 2.4 * u)).join('');
  k.laptop([-80, -56], { screen: art.dot(8, 7, 3, 'none', ` stroke="${INK.oxide}" stroke-width="1.4"`) + [0, 1, 2, 3].map((i) => art.bar(58 + i * 11, 6, 8, INK.mid, 2.4)).join('')
    + art.bar(7, 18, 30, INK.mid, 2.2) + name(7, 24, 1.3) + art.bar(7, 49, 34, INK.dark, 2.8) + art.bar(7, 54, 26, INK.dark, 2.8) + art.rect(35, 53.6, 2.2, 3.6, INK.oxide) + figs(7, 62, 0.95) + dots(78, 40, 1.15) });
  k.phone(Lf(96, 40, 54), { w: 54, h: 104, screen: art.dot(8, 13, 2.8, 'none', ` stroke="${INK.oxide}" stroke-width="1.3"`) + art.bar(32, 11.5, 9, INK.mid, 2.4)
    + name(7, 24, 1.15) + art.bar(7, 45, 30, INK.dark, 2.6) + art.bar(7, 50, 23, INK.dark, 2.6) + figs(7, 58, 0.86)
    + Array.from({ length: 12 }, (_, i) => art.dot(10 + (i % 4) * 9.4, 73 + Math.floor(i / 4) * 9, 3.4, '#FFFFFF', ` stroke="${INK.line}" stroke-width=".8"`) + art.dot(10 + (i % 4) * 9.4, 73 + Math.floor(i / 4) * 9, 1.4, ['#EA4B71', '#3178C6', '#34A853', '#EA4335', '#4285F4', '#8E75B2'][i % 6])).join('') });
  /* what it is built with, and what it ships none of */
  k.tile('Astro', Lf(-124, -42, 36, 66));
  k.panelR(Rf(126, -66, 36, 52), { w: 36, h: 36, r: 9.4, t: 5, face: '#FFFFFF', a: logoSvg(L, 'JavaScript', 7.2, 7.2, 21.6)
    + art.dot(18, 18, 13.5, 'none', ` stroke="${INK.oxide}" stroke-width="2.8"`) + art.line('M8.5 27.5L27.5 8.5', INK.oxide, 2.8) });
  k.flow(g(-6, 62), g(30, 70), g(58, 58));
  k.chips([[-110, 70, M.oxide], [-40, 92, M.paper, 7], [150, 30, M.steel, 7]]);
  return k.s.render();
}

/* ============================================================================
   THE EXPERTISE PICTURES (2026-10-06). The home page's six "What I do" cards,
   and the head of each expertise page, carried dark screens drawn from his
   systems while every project was covered by a scene; he found the pages
   "non consistent and messy". So each kind of work is a scene too, in the
   same light and materials, on a 4:3 stage (the cards' shape). Its marks are
   tools of that expertise's own stack only (src/expertise/data.js, which the
   build already holds to evidence), checked as the picture is written
   (checkSceneMarks in src/systems/cover.js).
   ============================================================================ */
const X = { H: 360, oy: 226 };
/* a board standing on a foot: the screen a scene is about */
const board = (k, [sx, sy], { w, h, a, z = 14, m = M.graphite }) => {
  const [mx, my] = Lf(sx, sy, w);
  k.box([mx + w / 2 - 20, my - 12], { w: 40, d: 24, h: 4, m, r: 5 });
  k.box([mx + w / 2 - 5, my - 4, 4], { w: 10, d: 7, h: z - 2, m, r: 2, kk: L1 });
  k.panel([mx, my, z], { w, h, r: 7, t: 4, m, a: `<g transform="translate(6 6)">${a}</g>`, kk: L2, sh: false });
};

/* 1 · AI Automation: mail comes in, the workflow reads it, a model sorts it,
   a gate decides, a sheet is written and a team told */
function xAutomation(L) {
  const k = kit(L, X);
  const W = 148, Hh = 92;
  const node = (x, y, inner) => art.rect(x, y, 22, 22, '#FFFFFF', 5.5, ` stroke="${INK.line}" stroke-width="1.2"`) + inner;
  const wire = (d) => art.line(d, '#BCB6A9', 1.5);
  let wf = art.rect(0, 0, W, Hh, '#F6F4EE', 4);
  for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) wf += art.dot(8 + i * 19, 7 + j * 16, 0.85, '#D8D2C4');
  wf += wire('M31 46H40') + wire('M62 46H72') + wire('M94 46C101 46 100 29 107 29') + wire('M94 46C101 46 100 63 107 63');
  wf += art.path('M7.6 40.5l-3.2 5.4h2.3l-1 4.6 4-6.1H7.4z', INK.oxide);
  wf += node(9, 35, logoSvg(L, 'Gmail', 13, 39, 14)) + node(40, 35, logoSvg(L, 'OpenAI', 44, 39, 14))
    + node(72, 35, glyphSvg('split', 76, 39, 14, '#3F8A2B', 2.4))
    + node(107, 18, logoSvg(L, 'Google Sheets', 111, 22, 14)) + node(107, 52, logoSvg(L, 'Slack', 111, 56, 14));
  board(k, [8, -40], { w: 160, h: 104, a: wf });
  /* the mail it reads, and the record it keeps */
  k.envelope(Lf(-128, 40, 52), { w: 52, h: 33, open: true, letter: art.bar(7, 8, 26, INK.dark, 3) + lines(7, 15, 28, 3, 6), mark: logoSvg(L, 'Gmail', 19, 15.5, 14) });
  k.panelR(Rf(134, 30, 64), { w: 64, h: 54, r: 5, face: '#FFFFFF', a: art.rect(0, 0, 64, 15, '#E2F0E6', 5) + art.rect(0, 9, 64, 6, '#E2F0E6')
    + logoSvg(L, 'Google Sheets', 6, 3, 10) + art.bar(21, 6, 26, INK.dark, 3)
    + [0, 1, 2, 3].map((i) => art.bar(7, 22 + i * 8, 14, INK.mid, 3) + art.bar(25, 22 + i * 8, 20 - (i % 2) * 6, INK.line, 3) + art.bar(49, 22 + i * 8, 9, i === 0 ? INK.oxide : INK.line, 3)).join('') });
  k.flow(g(-92, 34), g(-70, 22), g(-50, 10));
  k.flow(g(70, 4), g(90, 14), g(104, 24));
  k.tile('n8n', Lf(-118, -70, 40, 96), { size: 40 });
  k.tile('Google Gemini', Rf(118, -88, 32, 92), { size: 32, face: 'right' });
  k.chips([[-30, 100, M.oxide], [150, -40, M.steel, 7], [-160, 4, M.paper, 7]]);
  return k.s.render();
}

/* 2 · Voice & Chat Agents: a call answered, the conversation had, the job booked */
function xVoice(L) {
  const k = kit(L, X);
  const wave = [6, 12, 20, 9, 25, 15, 7, 18, 11].map((h, i) => art.rect(7 + i * 4.4, 62 - h / 2, 2.8, h, INK.oxide, 1.4)).join('');
  k.phone(Lf(-62, 10, 58), { screen: art.dot(25, 28, 13, INK.wash) + art.dot(25, 28, 7.6, INK.oxide) + art.bar(11, 46, 28, INK.dark, 3.4) + wave
    + art.dot(15, 90, 7, INK.soft) + art.dot(35, 90, 7, INK.oxide) + art.rect(31, 88.6, 8, 2.8, '#FFFFFF', 1.4) });
  /* what is said, both ways */
  k.bubble(Lf(14, -46, 56, 70), { w: 56, h: 32, a: [16, 28, 40].map((cx) => art.dot(cx, 16, 3, '#FFFFFF')).join('') });
  k.bubble(Lf(44, -8, 66, 30), { w: 66, h: 36, m: M.paper, fill: '#FFFFFF', tx: 0.7, a: art.bar(9, 9, 40, INK.dark, 3.4) + lines(9, 17, 48, 2, 7) });
  /* what it books */
  k.panelR(Rf(140, -18, 56), { w: 56, h: 54, r: 5, face: '#FFFFFF', a: calArt(56, 54, 6) });
  k.check([...g(136, -62), 66], 10, { face: 'right' });
  k.tile('ElevenLabs', Lf(-140, -52, 34, 80), { size: 34 });
  k.tile('Twilio', Lf(-132, 56, 32, 6), { size: 32 });
  k.tile('OpenAI', Rf(100, -98, 30, 92), { size: 30, face: 'right' });
  k.flow(g(-22, 46), g(44, 72), g(108, 44));
  k.chips([[70, 100, M.oxide], [-170, 10, M.steel, 7], [160, 52, M.paper, 7]]);
  return k.s.render();
}

/* 3 · LLM Systems: sources go in, a model reads them under rules, and what
   comes out has a fixed shape and says where it came from */
function xLLM(L) {
  const k = kit(L, X);
  /* the sources: a pile of documents, searched */
  for (let i = 0; i < 4; i++) k.mat([...Bx(-108, 34, 60, 46).slice(0, 2), i * 4.5], { w: 60, d: 46, t: 3.5, m: M.paper, face: '#FFFFFF', kk: i, a: i === 3 ? art.bar(8, 8, 30, INK.dark, 3.4) + lines(8, 16, 42, 3, 7) + art.rect(6, 36, 46, 7, INK.wash, 2) + art.rect(6, 36, 2.5, 7, INK.oxide, 1) : '' });
  k.magnifier([...g(-80, 14), 34], 15, L1);
  /* the model, as a block, under its rules */
  const spark = glyphSvg('spark', 13, 13, 28, INK.oxide, 2.2);
  k.box(Bx(-2, -6, 56, 56), { w: 56, d: 56, h: 46, m: M.graphite, r: 7, top: `<g transform="translate(0 0)">${art.rect(4, 4, 48, 48, '#34332F', 6)}${spark}</g>` });
  /* what comes out: a fixed shape, each answer with its source */
  const schema = art.line('M11 9c-4 0-4 3-4 6v6c0 3-2 4-3.5 4 1.5 0 3.5 1 3.5 4v6c0 3 0 6 4 6', INK.oxide, 2)
    + art.line('M69 9c4 0 4 3 4 6v6c0 3 2 4 3.5 4-1.5 0-3.5 1-3.5 4v6c0 3 0 6-4 6', INK.oxide, 2)
    + [0, 1, 2, 3].map((i) => art.bar(16, 11 + i * 9, 14, INK.oxide, 3.2) + art.bar(34, 11 + i * 9, 18 + (i % 2) * 10, INK.mid, 3.2)).join('')
    + art.rect(12, 50, 56, 12, INK.soft, 3) + glyphSvg('doc', 15, 51.6, 9, INK.dark, 2.2) + art.bar(28, 54.4, 30, INK.mid, 3);
  k.panelR(Rf(128, -10, 80, 6), { w: 80, h: 68, r: 5, face: '#FFFFFF', a: schema });
  k.check([...g(140, 36), 0], 11, { face: 'right' });
  k.flow(g(-54, 30), g(-38, 22), g(-24, 12));
  k.flow(g(44, 0), g(64, -4), g(84, -2));
  k.tile('OpenAI', Lf(-40, -104, 34, 96), { size: 34 });
  k.tile('Google Gemini', Lf(-142, -40, 32, 78), { size: 32 });
  k.tile('Supabase', Rf(108, 66, 32, 0), { size: 32, face: 'right' });
  k.chips([[20, 100, M.oxide], [160, 20, M.steel, 7], [-170, 30, M.paper, 7]]);
  return k.s.render();
}

/* 4 · Web Development: the code, the page it makes, the same page on a phone */
function xWeb(L) {
  const k = kit(L, X);
  const C = ['#E07A4F', '#8FB3C0', '#D0AA6C', '#A9C4A0', '#C9C4B8'];
  let code = art.rect(0, 0, 112, 78, '#262522', 4) + [6.5, 12, 17.5].map((cx) => art.dot(cx, 6, 1.7, '#55534E')).join('');
  [[8, 26, 0], [14, 18, 1], [14, 30, 2], [20, 22, 3], [14, 14, 1], [8, 20, 4], [8, 30, 0], [14, 24, 2]].forEach(([x, w, c], i) => {
    code += art.bar(x, 15 + i * 7.4, w, C[c], 3) + art.bar(x + w + 4, 15 + i * 7.4, 30 - (i % 3) * 7, '#4A4844', 3);
  });
  k.panel(Lf(-70, -34, 112, 16), { w: 112, h: 84, r: 6, t: 3.5, m: M.graphite, a: `<g transform="translate(0 3)">${code}</g>` });
  const page = (w) => art.rect(8, 6, w - 16, 26, INK.wash, 3) + art.bar(14, 12, 40, INK.oxide, 4) + art.bar(14, 20, 58, INK.mid, 3)
    + [0, 1, 2].map((i) => art.rect(8 + i * ((w - 16) / 3 + 1), 38, (w - 16) / 3 - 4, 24, '#F1EEE7', 3) + art.bar(12 + i * ((w - 16) / 3 + 1), 44, 18, INK.dark, 3)).join('')
    + lines(8, 68, w - 24, 2, 6);
  k.panelR(Rf(118, -44, 124, 10), { w: 124, h: 92, r: 6, t: 3.5, face: '#FFFFFF', a: winArt(124, page(124)) });
  k.phone(Lf(28, 58, 46), { w: 46, h: 86, screen: art.rect(4, 12, 30, 14, INK.wash, 2) + art.bar(7, 15, 18, INK.oxide, 3) + art.bar(7, 21, 22, INK.mid, 2.4)
    + art.rect(4, 31, 30, 16, '#F1EEE7', 2) + art.rect(4, 51, 30, 16, '#F1EEE7', 2) + lines(5, 71, 24, 1, 6) });
  k.flow(g(-36, 26), g(-6, 40), g(10, 50));
  k.tile('React', Lf(-146, 30, 32, 10), { size: 32 });
  k.tile('Next.js', Lf(-128, -88, 32, 92), { size: 32 });
  k.tile('Tailwind CSS', Rf(148, 44, 30, 0), { size: 30, face: 'right' });
  k.tile('TypeScript', Rf(72, -110, 30, 98), { size: 30, face: 'right' });
  k.chips([[-60, 100, M.oxide], [100, 92, M.steel, 7]]);
  return k.s.render();
}

/* 5 · Platform Engineering: the product, the database and servers under it,
   who may see what, and how it is paid for */
function xPlatform(L) {
  const k = kit(L, X);
  const dash = art.rect(0, 0, 26, 84, '#F1EEE7', 0) + [0, 1, 2, 3, 4].map((i) => art.bar(6, 10 + i * 9, i === 1 ? 15 : 12, i === 1 ? INK.oxide : INK.mid, 3)).join('')
    + [0, 1, 2].map((i) => art.rect(32 + i * 37, 8, 33, 24, '#FFFFFF', 3, ` stroke="${INK.line}" stroke-width="1"`) + art.bar(37 + i * 37, 13, 16, INK.dark, 3.2) + art.bar(37 + i * 37, 21, 22, INK.line, 3)).join('')
    + [0, 1, 2, 3].map((i) => art.bar(32, 40 + i * 9, 108, i === 0 ? INK.mid : INK.line, 3)).join('');
  k.panel(Lf(8, -42, 150, 12), { w: 150, h: 100, r: 6, t: 3.5, face: '#FFFFFF', a: winArt(150, dash) });
  /* underneath: the database, the servers */
  k.drums(g(-110, 44), 22, M.oxide);
  const rack = (n) => art.rect(4, 4, 40, n === 0 ? 10 : 10, '#34332F', 2) + art.dot(9, 9, 1.8, '#9CCB8F') + art.dot(15, 9, 1.8, '#E8875D') + art.bar(22, 7.6, 18, '#55534E', 2.8);
  k.box(Bx(-50, 70, 48, 30), { w: 48, d: 30, h: 16, m: M.graphite, r: 2, left: rack(0) });
  k.box([...Bx(-50, 70, 48, 30).slice(0, 2), 16], { w: 48, d: 30, h: 16, m: M.graphite, r: 2, left: rack(1), kk: L1 });
  /* who may see what: a lock on the product itself */
  k.badge([...g(86, 26), 22], 15, M.oxide, glyphSvg('lock', 7, 6.6, 16, '#FFFFFF', 2.4), { kk: L3 });
  /* how it is paid for */
  k.panel(Lf(122, 56, 54), { w: 54, h: 34, r: 5, m: M.oxide, a: art.rect(6, 8, 10, 8, '#EBCB8B', 2) + art.bar(6, 22, 26, '#F6D9CB', 3) + art.bar(36, 22, 10, '#F6D9CB', 3) });
  k.flow(g(-82, 34), g(-60, 20), g(-40, 6));
  k.tile('Supabase', Lf(-150, -30, 34, 74), { size: 34 });
  k.tile('PostgreSQL', Lf(-162, 32, 30, 64), { size: 30 });
  k.tile('Stripe', Rf(150, 14, 32, 22), { size: 32, face: 'right' });
  k.tile('Next.js', Rf(112, -100, 30, 94), { size: 30, face: 'right' });
  k.chips([[40, 100, M.oxide], [170, -30, M.steel, 7]]);
  return k.s.render();
}

/* 6 · CRM & API Integration: one record, and the systems wired into it */
function xCRM(L) {
  const k = kit(L, X);
  const rec = person(18, 18, 11, INK.oxide, INK.wash) + art.bar(36, 11, 44, INK.dark, 4) + art.bar(36, 20, 30, INK.mid, 3)
    + [['New', 0], ['Quoted', 1], ['Won', 2]].map(([, i]) => art.rect(8 + i * 34, 38, 30, 11, i === 1 ? INK.oxide : INK.soft, 5.5)).join('')
    + [0, 1, 2].map((i) => art.dot(12, 62 + i * 10, 2.6, i === 0 ? INK.oxide : INK.mid) + art.bar(20, 60.5 + i * 10, 56 - i * 10, INK.line, 3)).join('');
  board(k, [4, -34], { w: 110, h: 96, a: art.rect(0, 0, 98, 84, INK.screen, 4) + `<g transform="translate(2 0)">${rec}</g>` });
  /* the systems around it, each wired in */
  k.tile('HubSpot', Lf(-140, -14, 34, 18), { size: 34 });
  k.tile('Shopify', Lf(-118, 62, 32, 0), { size: 32 });
  k.tile('Stripe', Rf(122, 64, 32, 0), { size: 32, face: 'right' });
  k.tile('Xero', Rf(150, -4, 34, 16), { size: 34, face: 'right' });
  k.flow(g(-112, 4), g(-82, 4), g(-56, 0));
  k.flow(g(-92, 66), g(-62, 54), g(-40, 36));
  k.flow(g(100, 60), g(74, 50), g(56, 34));
  k.flow(g(120, 2), g(92, 4), g(66, 2));
  k.tile('Google Ads', Lf(-66, -104, 30, 96), { size: 30 });
  k.tile('Meta', Rf(96, -98, 30, 90), { size: 30, face: 'right' });
  k.chips([[0, 102, M.oxide], [-170, 40, M.steel, 7], [170, 30, M.paper, 7]]);
  return k.s.render();
}

/* slug -> the scene. Each takes the logo set; the two featured ones also
   take `wide`. */
export const SCENES = {
  'lead-to-cash-crm': leadToCash,
  'aesthetics-voice-agent': voice,
  'shopify-support-automation': shopify,
  'lsa-lead-responder': lsa,
  'construction-lead-outreach': construction,
  'labor-law-outreach': laborLaw,
  'linkedin-lead-pipeline': linkedin,
  adwash,
  'just-grade-metrics': gradeMetrics,
  'ai-front-desk': frontDesk,
  'invoice-document-intake': invoice,
  'knowledge-assistant': knowledge,
  'client-onboarding-pipeline': onboarding,
  'weekly-ops-report': weekly,
  'content-repurposing-line': content,
  'crm-rebuild-migration': migration,
  'this-site': thisSite,
  /* the six kinds of work, for the home page's cards and the expertise pages */
  'x-ai-automation': xAutomation,
  'x-voice-chat-agents': xVoice,
  'x-llm-systems': xLLM,
  'x-web-development': xWeb,
  'x-platform-engineering': xPlatform,
  'x-crm-api-integration': xCRM,
};
/* the ones that have a wide drawing */
export const WIDE = new Set(['lead-to-cash-crm', 'adwash']);

/* What each picture shows, for someone who cannot see it. Said where the
   picture stands alone: at the head of its system's page. */
export const ALT = {
  'lead-to-cash-crm': 'Lead sources — ads, calls, forms, chat and bookings — arriving at one pipeline board, beside three contractors’ houses and the follow-ups each stage sends.',
  'aesthetics-voice-agent': 'A phone on a live call with a voice agent, a graduation cap on a stack of books, and the call’s outcome written to a CRM record.',
  'shopify-support-automation': 'Customer emails arriving at a laptop that shows a Shopify order, with a replacement parcel ready beside it.',
  'lsa-lead-responder': 'A phone answering a Google lead in a chat thread, a stopwatch, a calendar with a booked slot and a technician’s van.',
  'construction-lead-outreach': 'A map with pinned firms, a hard hat, and a row of four emails, the last one stopped by a reply.',
  'labor-law-outreach': 'A courthouse, a clock, a sheet of prospects and emails going out, one of them answered.',
  'linkedin-lead-pipeline': 'Profile cards on a conveyor, passing a checking gate into a database, with a magnifier over the first.',
  adwash: 'An ads dashboard with a bid slider, a sun and a rain cloud beside it, a payment card, coins and a target.',
  'just-grade-metrics': 'A scorecard on a clipboard beside a call transcript with one quoted line marked.',
  'ai-front-desk': 'A reception desk with a bell and a ringing phone under a night sky, and a calendar with a booking.',
  'invoice-document-intake': 'An invoice passing a checking gate, between an opened email and a stack of ledgers marked Xero.',
  'knowledge-assistant': 'Binders and a folder beside a chat window whose answer marks the passage it quotes.',
  'client-onboarding-pipeline': 'Five rising steps — a signed contract, a payment, a folder, a channel — ending at a flag.',
  'weekly-ops-report': 'Five sources feeding one spreadsheet report with its total row marked, beside a weekly calendar.',
  'content-repurposing-line': 'A video recording turning into a row of post cards, with a person’s approval between them.',
  'crm-rebuild-migration': 'Records moving from an old database to a new one, watched by a dry-run check.',
  'this-site': 'A laptop and a phone showing this site’s home page, with the Astro mark and a struck-out JavaScript mark.',
  'x-ai-automation': 'An n8n workflow on a screen — mail read, a model’s call, a gate, a sheet written, a team told — between an opened email and a spreadsheet.',
  'x-voice-chat-agents': 'A phone on a call, the conversation in two speech bubbles, and a calendar with the job booked.',
  'x-llm-systems': 'A pile of documents searched with a magnifier, a model as a block, and an answer in a fixed shape that cites its source.',
  'x-web-development': 'A code editor, the page it builds in a browser, and the same page on a phone.',
  'x-platform-engineering': 'A product dashboard, the database and servers beneath it, a lock, and a payment card.',
  'x-crm-api-integration': 'A contact record with its stage, wired to the systems around it: HubSpot, Shopify, Stripe and Xero.',
};
