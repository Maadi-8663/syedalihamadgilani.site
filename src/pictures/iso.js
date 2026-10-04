/* iso.js — a small isometric drawing kit (2026-10-04).

   Syed, of the first covers (a workflow in a dark window): "This picture ...
   is not good. I want a real picture, like a modern thumbnail of the project
   which should be explaining that what have we done", with an isometric
   illustration as the example — "If you dont have or cant find relevant ones
   from internet, first do the graphic designing (Professional and eye
   pleasing pictures).... and then use those. Do this for all projects."

   Pictures from the internet would have been stock: not about these systems,
   not one set, and not ours to publish. So they are designed here: one
   scene for each system (scenes.js), all built from this kit so that they
   are plainly one family — the same projection, the same light, the same
   few materials, the same stage.

   The projection is the classic isometric one: x runs down to the right, y
   down to the left, z straight up. A solid is a flat outline on a plane,
   pushed back into depth; each side that faces the viewer is filled by how
   it faces the light (the top brightest, the left side next, the right side
   in shade), so a rounded corner shades itself. Whatever is drawn ON a face
   — a screen, a logo, the lines of a letter — is ordinary flat SVG, put
   there by the plane's matrix, so marks keep their real outlines.

   Pure functions, no state beyond a scene's own list: data in, an <svg>
   string out. */

const C = Math.cos(Math.PI / 6), S = 0.5;
export const f1 = (n) => { const r = Math.round(n * 10) / 10; return r === 0 ? 0 : r; };
const f3 = (n) => { const r = Math.round(n * 1000) / 1000; return r === 0 ? 0 : r; };
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];

/* ---- colour ---------------------------------------------------------------- */
const rgb = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mix = (a, b, t) => {
  const A = rgb(a), B = rgb(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
/* a material is three tones: lit from above, facing left, facing right */
export const M = {
  graphite: { hi: '#4B4944', mid: '#33322E', lo: '#201F1C' },
  paper: { hi: '#FFFFFF', mid: '#F3F1EB', lo: '#E0DCD3' },
  cream: { hi: '#F8F2E6', mid: '#ECE1CD', lo: '#D7C8AE' },
  oxide: { hi: '#EC8D63', mid: '#CF5F34', lo: '#A03C16' },
  kraft: { hi: '#E0BF95', mid: '#C8A070', lo: '#A58053' },
  steel: { hi: '#D9D7D1', mid: '#B6B4AD', lo: '#918F88' },
  ochre: { hi: '#EBCB8B', mid: '#D0AA6C', lo: '#AC884E' },
  slate: { hi: '#7C8794', mid: '#5E6976', lo: '#454F5B' },
};
export const INK = { line: '#DDD9D0', soft: '#EBE8E1', mid: '#B9B5AB', dark: '#55554F', black: '#262522', screen: '#FBFAF7', oxide: '#C9552B', deep: '#9C3712', wash: '#F6E3D8' };

/* how bright a face is, by the way it faces a light in front, above and to
   the left: 1 facing up, .62 facing left, .3 facing right */
const tone = (n) => Math.max(0, Math.min(1, 0.3 * n[0] + 0.62 * n[1] + n[2]));
export const shade = (m, t) => (t >= 0.62 ? mix(m.mid, m.hi, (t - 0.62) / 0.38) : mix(m.lo, m.mid, Math.max(0, (t - 0.3) / 0.32)));

/* ---- outlines, in a plane's own units (u to the right, v down) --------------- */
export const rr = (w, h, r = 0, seg = 4) => {
  r = Math.min(r, w / 2, h / 2);
  if (!r) return [[0, 0], [w, 0], [w, h], [0, h]];
  const pts = [];
  const arc = (cx, cy, a0) => { for (let i = 0; i <= seg; i++) { const a = a0 + (i / seg) * Math.PI / 2; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
  arc(w - r, r, -Math.PI / 2); arc(w - r, h - r, 0); arc(r, h - r, Math.PI / 2); arc(r, r, Math.PI);
  return pts;
};
export const circ = (r, n = 28, cx = 0, cy = 0, sq = 1) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2;
  return [cx + r * Math.cos(a), cy + r * sq * Math.sin(a)];
});
export const shift = (pts, du, dv) => pts.map(([u, v]) => [u + du, v + dv]);
/* part of a circle, as points: angles in degrees, clockwise from three o'clock */
export const arc = (cx, cy, r, a0, a1, n = 10) => Array.from({ length: n + 1 }, (_, i) => {
  const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});
export const turn = (pts, deg, cx = 0, cy = 0) => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return pts.map(([u, v]) => [cx + (u - cx) * c - (v - cy) * s, cy + (u - cx) * s + (v - cy) * c]);
};

/* ---- planes ------------------------------------------------------------------
   A frame is where a flat thing sits: its corner O, the directions its own u
   and v run in, and the way it faces (N). Depth goes back, against N. */
export const F = {
  /* lying flat at height z: u along x, v along y */
  top: (x, y, z = 0) => ({ O: [x, y, z], U: [1, 0, 0], V: [0, 1, 0], N: [0, 0, 1] }),
  /* standing, facing left (+y): u along x, v down. (x, y, z) is its top left corner */
  left: (x, y, z) => ({ O: [x, y, z], U: [1, 0, 0], V: [0, 0, -1], N: [0, 1, 0] }),
  /* standing, facing right (+x): u runs back along y, v down */
  right: (x, y, z) => ({ O: [x, y, z], U: [0, -1, 0], V: [0, 0, -1], N: [1, 0, 0] }),
  /* facing left and leaning back by `deg`, from a bottom edge at (x, y, z): a screen on its hinge */
  lean: (x, y, z, h, deg) => {
    const a = (deg * Math.PI) / 180, V = [0, Math.sin(a), -Math.cos(a)];
    return { O: add([x, y, z], mul(V, -h)), U: [1, 0, 0], V, N: [0, Math.cos(a), Math.sin(a)] };
  },
  /* facing right and leaning back */
  leanR: (x, y, z, h, deg) => {
    const a = (deg * Math.PI) / 180, V = [Math.sin(a), 0, -Math.cos(a)];
    return { O: add([x, y, z], mul(V, -h)), U: [0, -1, 0], V, N: [Math.cos(a), 0, Math.sin(a)] };
  },
};

/* ---- a scene ------------------------------------------------------------------ */
export function scene({ W = 480, H = 300, ox = W / 2, oy = 190 } = {}) {
  const P = (p) => [ox + (p[0] - p[1]) * C, oy + (p[0] + p[1]) * S - (p[2] || 0)];
  const pv = (v) => [(v[0] - v[1]) * C, (v[0] + v[1]) * S - v[2]];
  const pt = (p) => { const q = P(p); return `${f1(q[0])} ${f1(q[1])}`; };
  const things = [], shadows = [], ground = [];
  let seq = 0;

  /* flat SVG, put on a frame */
  const on = (fr, svg) => `<g transform="matrix(${[...pv(fr.U), ...pv(fr.V)].map(f3).join(' ')} ${P(fr.O).map(f1).join(' ')})">${svg}</g>`;

  /* an outline on a frame, `depth` thick: its sides that face the viewer, then its face */
  function solid(fr, pts, depth, m, o = {}) {
    const at = ([u, v]) => add(add(fr.O, mul(fr.U, u)), mul(fr.V, v));
    const back = (p) => add(p, mul(fr.N, -depth));
    const area = pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
    const sides = new Map();
    if (depth > 0) pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length];
      let nu = q[1] - p[1], nv = -(q[0] - p[0]);
      if (area < 0) { nu = -nu; nv = -nv; }
      const len = Math.hypot(nu, nv);
      if (len < 1e-6) return;
      const E = add(mul(fr.U, nu / len), mul(fr.V, nv / len));
      if (E[0] + E[1] + E[2] <= 1e-3) return;                 // faces away
      const fill = shade(o.side || m, tone(E));
      const a = at(p), b = at(q);
      sides.set(fill, (sides.get(fill) || '') + `M${pt(a)}L${pt(b)}L${pt(back(b))}L${pt(back(a))}Z`);
    });
    let out = '';
    for (const [fill, d] of sides) out += `<path d="${d}" fill="${fill}" stroke="${fill}" stroke-width=".6" stroke-linejoin="round"/>`;
    if (o.face !== 'none') {
      const fill = o.face || shade(m, tone(fr.N));
      out += `<path d="M${pts.map((p) => pt(at(p))).join('L')}Z" fill="${fill}" stroke="${fill}" stroke-width=".6" stroke-linejoin="round"/>`;
    }
    return out + (o.art ? on(fr, o.art) : '');
  }

  /* where a thing is drawn among the others: further back first. `at` is the
     point of it nearest the viewer, on the ground */
  const put = (at, svg, k = 0) => { things.push([at[0] + at[1] + (at[2] || 0) * 0.002 + k, seq++, svg]); };
  /* a soft shadow on the ground: an ellipse, or any flat SVG in ground units */
  const shadow = (x, y, rx, ry = rx, k = 1) => shadows.push(on(F.top(x, y, 0), `<ellipse rx="${f1(rx)}" ry="${f1(ry)}" opacity="${k}"/>`));
  const shadowArt = (svg) => shadows.push(on(F.top(0, 0, 0), svg));
  /* drawn on the ground itself, under everything: the dashes that show which way things go */
  const floor = (svg) => ground.push(on(F.top(0, 0, 0), svg));

  function render({ R = 138, rim = 7, disc = true, wide = 1, defs = '', under = '', over = '' } = {}) {
    const c = P([0, 0, 0]), rx = R * Math.SQRT2 * C * wide, ry = R * Math.SQRT2 * S;
    const stage = disc ? `<ellipse cx="${f1(c[0])}" cy="${f1(c[1] + rim + 16)}" rx="${f1(rx * 0.97)}" ry="${f1(ry * 0.9)}" fill="#1B1B19" opacity=".24" filter="url(#soft)"/>`
      + `<path d="M${f1(c[0] - rx)} ${f1(c[1])}v${rim}a${f1(rx)} ${f1(ry)} 0 0 0 ${f1(rx * 2)} 0v${-rim}Z" fill="#D2C9B6"/>`
      + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(ry)}" fill="url(#disc)"/>`
      + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx * 0.72)}" ry="${f1(ry * 0.72)}" fill="none" stroke="#DED7C8" stroke-width="1.2" stroke-dasharray="2 5" stroke-linecap="round"/>` : '';
    things.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
      + `<defs><filter id="soft" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>`
      + `<filter id="sh" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="3.2"/></filter>`
      + `<radialGradient id="disc" cx="50%" cy="36%" r="72%"><stop offset="0" stop-color="#FBF8F1"/><stop offset="1" stop-color="#EAE3D4"/></radialGradient>${defs}</defs>`
      + under + stage
      + `<g fill="none">${ground.join('')}</g>`
      + `<g fill="#2A1D12" opacity=".26" filter="url(#sh)">${shadows.join('')}</g>`
      + things.map((t) => t[2]).join('') + over + '</svg>';
  }

  return { P, pv, pt, on, solid, put, shadow, shadowArt, floor, render, W, H };
}

/* ---- flat art, for faces ------------------------------------------------------ */
export const art = {
  rect: (x, y, w, h, fill, r = 0, extra = '') => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}"${r ? ` rx="${f1(r)}"` : ''} fill="${fill}"${extra}/>`,
  bar: (x, y, w, fill = INK.line, h = 3.2) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h / 2)}" fill="${fill}"/>`,
  dot: (cx, cy, r, fill, extra = '') => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="${fill}"${extra}/>`,
  path: (d, fill, extra = '') => `<path d="${d}" fill="${fill}"${extra}/>`,
  line: (d, stroke, w = 1.6, extra = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`,
  /* a tick in a disc */
  check: (cx, cy, r, bg = INK.oxide, fg = '#FFFFFF') => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="${bg}"/>`
    + `<path d="M${f1(cx - r * 0.42)} ${f1(cy + r * 0.04)}l${f1(r * 0.3)} ${f1(r * 0.3)} ${f1(r * 0.56)}${f1(-r * 0.62)}" fill="none" stroke="${fg}" stroke-width="${f1(r * 0.3)}" stroke-linecap="round" stroke-linejoin="round"/>`,
};
