/* covers.js — a cover picture for every system (2026-10-04).

   Syed, after a measured review showed the pages past the home page were
   nearly all words (the Work page: 912 of them and no picture): "I want to
   keep visuals instead of text everywhere, that too modern and
   professional." He approved a proposal with a cover on every system, and
   said how they should look: "Do all four, with drawings(Modern, should not
   feel like drawings)". So these are drawn, but as product pictures rather
   than diagrams — a window on the site's pigment grounds, like the expertise
   pictures (expertise.js), with depth: the system's workflow close up, its
   run path lit, and a card floating over it that names one of its guards.

   None of it is invented, which is the rule the whole site keeps:

     canvas   a workflow at its exported node positions, node by node, each
              with the icon of its real type (src/systems/graphs.json, which
              scripts/extract-systems.mjs counts from the JSON). Built systems
              show their node names; a client's system shows node types only,
              as everywhere on the site. The view is close and the rest runs
              off the frame: the crop is deliberate, as in expertise.js.
     steps    for a system no export was supplied for, the steps of its own
              write-up ("How it runs" on its page), as a row of tiles.
     product  the two platforms are not workflows: AdWash's cover is its
              expertise picture (expertise.js, measured figures and all), and
              Just Grade Metrics' is a scorecard that shows only what its
              page prints (a quote found, or the call held for a person; 31
              tables under row-level security).

   The card over each picture carries the first guard of that system, word
   for word, and the pill its counted figure. The functions here are pure
   (data in, an <svg> out), so the pages that use them pass the graph in.

   `thumb` draws the same picture for a thumbnail (the home page's timeline):
   the top left of the window, close, with no words in it and heavier lines,
   since at that size neither a label nor a hairline survives. */

export const K = {
  win: '#FBFAF7', win2: '#F1F0EB', line: '#E3E2DD', mute: '#DAD9D3',
  ink: '#1B1B19', ink2: '#3A3A37', ink3: '#77766F',
  oxide: '#9C3712', oxideHi: '#E07A4F', wash: '#F0E4DC',
  night: '#252421', nightTop: '#1D1C1A', nightNode: '#34332F', nightEdge: '#63625B',
  nightLine: '#3E3D38', nightInk: '#EDECE6', nightInk2: '#A7A69E',
};
const H = 300;
const THUMB = '0 0 320 200';      // what a thumbnail shows of the 480 x 300 picture
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const r1 = (n) => Math.round(n * 10) / 10;
const wx0 = 28;                     // where a cover's window starts, and its pill with it

function T(x, y, s, o = {}) {
  const a = [`x="${r1(x)}"`, `y="${r1(y)}"`, `font-size="${o.size ?? 11}"`, `fill="${o.fill ?? K.ink}"`];
  if (o.cls) a.push(`class="${o.cls}"`);
  if (o.w) a.push(`font-weight="${o.w}"`);
  if (o.a) a.push(`text-anchor="${o.a}"`);
  if (o.ls) a.push(`letter-spacing="${o.ls}"`);
  /* an outline in the ground's colour, under the letters: a wire that passes
     behind a name is cut by it rather than struck through it */
  if (o.halo) a.push(`stroke="${o.halo}" stroke-width="2.6" stroke-linejoin="round" paint-order="stroke"`);
  return `<text ${a.join(' ')}>${esc(s)}</text>`;
}
function wrap(text, max) {
  const lines = [''];
  for (const w of String(text).split(' ')) {
    if ((lines.at(-1) + ' ' + w).trim().length > max && lines.at(-1)) lines.push(w);
    else lines[lines.length - 1] = (lines.at(-1) + ' ' + w).trim();
  }
  return lines;
}
/* a line that will not fit is cut at a word, with an ellipsis */
const clip = (lines, n) => (lines.length > n ? [...lines.slice(0, n - 1), `${lines[n - 1]}…`] : lines);

const defs = (id) => `<filter id="${id}-sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#141311" flood-opacity=".34"/></filter>`
  + `<filter id="${id}-sh2" x="-20%" y="-30%" width="140%" height="180%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#141311" flood-opacity=".28"/></filter>`;

function frame(id, { x, y, w, h, dark = false, title = '', r = 10, bh = 26 }) {
  const top = dark ? K.nightTop : K.win2, dot = dark ? '#4A4944' : '#CFCEC8';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${dark ? K.night : K.win}" filter="url(#${id}-sh)"/>`
    + `<path d="M${x} ${y + bh}V${y + r}a${r} ${r} 0 0 1 ${r}-${r}H${x + w - r}a${r} ${r} 0 0 1 ${r} ${r}V${y + bh}Z" fill="${top}"/>`
    + `<path d="M${x} ${y + bh + 0.5}H${x + w}" stroke="${dark ? K.nightLine : K.line}"/>`
    + [14, 25, 36].map((d) => `<circle cx="${x + d}" cy="${y + bh / 2}" r="3.1" fill="${dot}"/>`).join('')
    + (title ? T(x + 50, y + bh / 2 + 3.5, title, { size: 10, fill: dark ? K.nightInk2 : K.ink3 }) : '');
}

/* the counted figure, bottom left */
function pill(x, y, text) {
  const w = Math.round(text.length * 5.15 + 32);
  return `<g><rect x="${x}" y="${y}" width="${w}" height="24" rx="12" fill="${K.win}"/><circle cx="${x + 14}" cy="${y + 12}" r="3.2" fill="${K.oxide}"/>`
    + `${T(x + 23, y + 15.5, text, { size: 8.5, fill: K.ink2, cls: 'm' })}</g>`;
}

/* a 24-unit line icon (src/systems/glyphs.js, or one of NODE below), drawn
   centred on a point at a size; `sw` is its stroke at that size, in px */
function icon(d, cx, cy, size, stroke, sw = 1.4) {
  const k = size / 24;
  return `<g transform="translate(${r1(cx - size / 2)} ${r1(cy - size / 2)}) scale(${r1(k * 100) / 100})" fill="none" stroke="${stroke}" stroke-width="${r1(sw / k)}" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
}

/* one of the system's guards, on a card floating over the picture:
   { t: its name, icon: its 24-unit drawing } */
function guardCard(id, W, guard) {
  const lines = clip(wrap(guard.t, 27), 2), w = 198, h = 44 + (lines.length - 1) * 11.5, x = W - w - 14, y = H - h - 14;
  return `<g><rect x="${x}" y="${r1(y)}" width="${w}" height="${r1(h)}" rx="10" fill="${K.win}" filter="url(#${id}-sh2)"/>`
    + `<rect x="${x + 9}" y="${r1(y + (h - 26) / 2)}" width="26" height="26" rx="7" fill="${K.wash}"/>`
    + icon(guard.icon, x + 22, y + h / 2, 15, K.oxide, 1.3)
    + T(x + 44, y + 16.5, 'GUARD', { size: 6.6, fill: K.ink3, cls: 'm', ls: '1.1' })
    + lines.map((l, i) => T(x + 44, y + 29 + i * 11.5, l, { size: 9.2, fill: K.ink, w: 500 })).join('') + '</g>';
}

/* ---- the node icons: n8n's node types, in the site's line style ------------ */
const NODE = {
  code: '<path d="m9 8-4 4 4 4M15 8l4 4-4 4"/>',
  globe: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.6 2.6 2.6 13.4 0 16M12 4c-2.6 2.6-2.6 13.4 0 16"/>',
  reply: '<path d="M10 7.5 5 12l5 4.5"/><path d="M5 12h9a5 5 0 0 1 5 5v1"/>',
  play: '<path d="M8.5 6.5v11l9-5.5z"/>',
  dot: '<circle cx="12" cy="12" r="2.6"/>',
  braces: '<path d="M9.5 5C7.5 5 7 6 7 7.5v2c0 1.2-.6 2-2 2.5 1.4.5 2 1.3 2 2.5v2C7 18 7.5 19 9.5 19M14.5 5c2 0 2.5 1 2.5 2.5v2c0 1.2.6 2 2 2.5-1.4.5-2 1.3-2 2.5v2c0 1.5-.5 2.5-2.5 2.5"/>',
  hook: '<circle cx="6.5" cy="16.5" r="2.3"/><circle cx="17.5" cy="16.5" r="2.3"/><circle cx="12" cy="7" r="2.3"/><path d="M10.9 9 7.7 14.5M13.1 9l3.2 5.5M8.8 16.5h6.4"/>',
  flow: '<rect x="4" y="6" width="6" height="12" rx="1.5"/><rect x="14" y="6" width="6" height="12" rx="1.5"/><path d="M10 12h4"/>',
};
/* node type -> [icon, the name n8n gives a node of that type] */
const TYPES = {
  code: ['code', 'Code'], if: ['route', 'If'], switch: ['route', 'Switch'], filter: ['filter', 'Filter'],
  httpRequest: ['globe', 'HTTP Request'], googleSheets: ['sheet', 'Google Sheets'], set: ['pen', 'Edit Fields'], postgres: ['db', 'Postgres'],
  respondToWebhook: ['reply', 'Respond to Webhook'], slack: ['hash', 'Slack'], telegram: ['send', 'Telegram'], noOp: ['dot', 'No Operation'],
  wait: ['clock', 'Wait'], executeWorkflow: ['flow', 'Execute Workflow'], executeWorkflowTrigger: ['play', 'When Executed'],
  scheduleTrigger: ['clock', 'Schedule Trigger'], webhook: ['hook', 'Webhook'], manualTrigger: ['play', 'Manual Trigger'],
  gmail: ['mail', 'Gmail'], gmailTrigger: ['mail', 'Gmail Trigger'], googleDrive: ['folder', 'Google Drive'], splitInBatches: ['loop', 'Loop Over Items'],
  googleCalendar: ['calendar', 'Google Calendar'],
  merge: ['merge', 'Merge'], extractFromFile: ['doc', 'Extract From File'], twilio: ['phone', 'Twilio'], googleGemini: ['spark', 'Google Gemini'],
  slackTrigger: ['hash', 'Slack Trigger'], formTrigger: ['list', 'Form Trigger'],
  agent: ['spark', 'AI Agent'], chainLlm: ['spark', 'LLM Chain'], lmChatOpenAi: ['spark', 'OpenAI Chat Model'], outputParserStructured: ['braces', 'Structured Output'],
  vectorStoreSupabase: ['db', 'Supabase Vector Store'], embeddingsOpenAi: ['spark', 'Embeddings'], documentDefaultDataLoader: ['doc', 'Data Loader'],
  textSplitterRecursiveCharacterTextSplitter: ['scissors', 'Text Splitter'],
};
/* a model, a parser or an embedding is wired INTO the node that uses it, and n8n draws it round */
const SUB = /^(lmChat|lmOpenAi|outputParser|embeddings|textSplitter|documentDefaultDataLoader|memory|tool)/;

/* ---- a workflow, close up -------------------------------------------------- */
export function canvasCover(id, wf, glyphs, { title, note, guard, W = 480, thumb = false }) {
  const wx = 28, wy = 26, top = wy + 26, padL = 28, room = H - top, k = thumb ? 1.8 : 1;
  /* a node is 100 canvas units; close enough that it reads as the product (30-42px) */
  const s = Math.max(0.3, Math.min(0.42, (room - 6) / (wf.h + 190)));
  const N = 100 * s;
  const trig = Math.max(0, wf.nodes.findIndex((n) => n[2] === 'trigger'));
  const contentH = wf.h * s + N + 20, clear = room - 66;    // the pill and the guard card take the foot
  let y0 = top + 14 + (clear - contentH) / 2;
  if (contentH > clear) {
    /* taller than the view: hold the trigger's row a third of the way down */
    y0 = top + clear * 0.42 - wf.nodes[trig][1] * s - N / 2;
    y0 = Math.min(top + 16, Math.max(y0, H - 22 - contentH));
  }
  const P = wf.nodes.map(([x, y]) => [wx + padL + x * s, y0 + y * s]);
  /* where nodes sit one above another, a name gets one line, or it would run into the node below */
  const dense = wf.nodes.some(([x, y], i) => wf.nodes.some(([x2, y2], j) => j !== i && Math.abs(x2 - x) < 150 && y2 > y && y2 - y < 190));

  /* the run path: from the trigger, the first way on, a few steps */
  const next = wf.nodes.map(() => []);
  for (const [a, b, ai] of wf.edges) if (!ai) next[a].push(b);
  const lit = new Map();        // a wire of the run path -> which hop it is, so the path can draw hop by hop
  for (let a = trig, hops = 0, seen = new Set([trig]); next[a].length && hops < 7; hops++) {
    const b = next[a][0];
    lit.set(`${a}>${b}`, hops);
    if (seen.has(b)) break;
    seen.add(b); a = b;
  }

  /* A node's name is set only where it has room: clear of every other node
     and of the names already set. The run path's nodes choose first. */
  const named = new Map();
  if (!thumb) {
    const onPath = new Set([...lit.keys()].flatMap((key) => key.split('>').map(Number)));
    const taken = P.map(([x, y]) => [x - 1, y - 1, x + N + 1, y + N + 1]);
    const order = wf.nodes.map((_, i) => i).sort((a, b) => Number(onPath.has(b)) - Number(onPath.has(a)));
    for (const i of order) {
      const [, , , type, name] = wf.nodes[i];
      if (!TYPES[type]) continue;                 // reported where the node is drawn
      const lines = clip(wrap(name || TYPES[type][1], 16), dense ? 1 : 2);
      const w = Math.max(...lines.map((l) => l.length)) * 3.7 + 4, cx = P[i][0] + N / 2, y = P[i][1] + N + 3.5;
      const box = [cx - w / 2, y, cx + w / 2, y + lines.length * 8.4];
      if (taken.some((b, j) => j !== i && box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) continue;
      taken.push(box);
      named.set(i, lines);
    }
  }

  let edges = '', glow = '', nodes = '', labels = '';
  for (const [a, b, ai] of wf.edges) {
    const [x1, y1] = P[a], [x2, y2] = P[b];
    if (ai) {
      const sx = x1 + N / 2, sy = y1 + N * 0.14, ex = x2 + N / 2, ey = y2 + N;
      edges += `<path class="sub" d="M${r1(sx)} ${r1(sy)}C${r1(sx)} ${r1(sy - N * 0.5)} ${r1(ex)} ${r1(ey + N * 0.5)} ${r1(ex)} ${r1(ey)}" fill="none" stroke="#76756E" stroke-width="1.1" stroke-dasharray="3 3"/>`;
      continue;
    }
    const sx = x1 + N, sy = y1 + N / 2, ex = x2, ey = y2 + N / 2, dx = Math.max(10, Math.abs(ex - sx) / 2);
    const d = `M${r1(sx)} ${r1(sy)}C${r1(sx + dx)} ${r1(sy)} ${r1(ex - dx)} ${r1(ey)} ${r1(ex)} ${r1(ey)}`;
    const hot = lit.has(`${a}>${b}`), hop = lit.get(`${a}>${b}`);
    /* the run path is a wire: it draws itself on as a card arrives with the
       scroll (scenes.css), and on load at the head of a system's page */
    if (hot) glow += `<path class="wire" pathLength="1" style="--w:${hop}" d="${d}" fill="none" stroke="${K.oxideHi}" stroke-width="${5 * k}" opacity=".28"/>`;
    edges += `<path class="${hot ? `wire" pathLength="1" style="--w:${hop}` : 'e'}" d="${d}" fill="none" stroke="${hot ? K.oxideHi : '#76756E'}" stroke-width="${r1((hot ? 1.7 : 1.25) * k)}"/>`;
    if (!thumb) {
      edges += `<circle cx="${r1(sx)}" cy="${r1(sy)}" r="2.2" fill="${hot ? K.oxideHi : '#8E8D86'}"/>`
        + `<rect x="${r1(ex - 2.4)}" y="${r1(ey - 3.6)}" width="2.4" height="7.2" rx="1" fill="${hot ? K.oxideHi : '#8E8D86'}"/>`;
    }
  }
  wf.nodes.forEach(([, , k, type], i) => {
    const [x, y] = P[i], c = [x + N / 2, y + N / 2], r = N * 0.18;
    if (!TYPES[type]) throw new Error(`covers: no icon for the node type "${type}" (${id}) — add it to TYPES`);
    const [ic] = TYPES[type], d = glyphs[ic] || NODE[ic];
    if (!d) throw new Error(`covers: no drawing for the icon "${ic}"`);
    const ai = k === 'ai', sub = SUB.test(type);
    if (sub) {
      nodes += `<circle cx="${r1(c[0])}" cy="${r1(c[1])}" r="${r1(N * 0.4)}" fill="url(#${id}-nd)" stroke="${K.oxideHi}" stroke-width="${k}"/>` + (thumb ? '' : icon(d, c[0], c[1], N * 0.42, K.oxideHi, 1.2));
    } else if (k === 'trigger') {
      nodes += `<path d="M${r1(x + N * 0.46)} ${r1(y)}H${r1(x + N - r)}a${r1(r)} ${r1(r)} 0 0 1 ${r1(r)} ${r1(r)}V${r1(y + N - r)}a${r1(r)} ${r1(r)} 0 0 1 ${r1(-r)} ${r1(r)}H${r1(x + N * 0.46)}a${r1(N * 0.46)} ${r1(N / 2)} 0 0 1 0 ${r1(-N)}z" fill="url(#${id}-nd)" stroke="${K.oxideHi}" stroke-width="${r1(1.3 * k)}"/>`
        + (thumb ? '' : icon(d, c[0] + N * 0.03, c[1], N * 0.5, K.oxideHi, 1.4));
    } else {
      nodes += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(N)}" height="${r1(N)}" rx="${r1(r)}" fill="url(#${id}-nd)" stroke="${ai ? K.oxideHi : K.nightEdge}" stroke-width="${r1((ai ? 1.2 : 1) * k)}"/>`
        + (thumb ? '' : icon(d, c[0], c[1], N * 0.5, ai ? K.oxideHi : K.nightInk, 1.4));
    }
    /* its name, as n8n sets it under a node: the system's own for a built
       system, the type's for a client's */
    (named.get(i) || []).forEach((l, j) => { labels += T(c[0], y + N + 10 + j * 8.4, l, { size: 7, fill: K.nightInk2, a: 'middle', halo: K.night }); });
  });
  const [tx, ty] = P[trig];
  return `<svg viewBox="${thumb ? THUMB : `0 0 ${W} ${H}`}" preserveAspectRatio="xMinYMin slice" aria-hidden="true" focusable="false">`
    + `<defs>${defs(id)}<pattern id="${id}-dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".85" fill="#3D3C37"/></pattern>`
    + `<linearGradient id="${id}-nd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#413F3A"/><stop offset="1" stop-color="#302F2B"/></linearGradient>`
    + `<radialGradient id="${id}-halo"><stop offset="0" stop-color="${K.oxideHi}" stop-opacity=".2"/><stop offset="1" stop-color="${K.oxideHi}" stop-opacity="0"/></radialGradient>`
    + `<clipPath id="${id}-cv"><rect x="${wx}" y="${top + 1}" width="${W - wx}" height="${H - top}"/></clipPath></defs>`
    + `<g class="lift">${frame(id, { x: wx, y: wy, w: W, h: H, dark: true, title: thumb ? '' : title })}`
    + `<g clip-path="url(#${id}-cv)"><rect x="${wx}" y="${top + 1}" width="${W - wx}" height="${H - top}" fill="url(#${id}-dots)"/>`
    + `<ellipse cx="${r1(tx + N * 2.4)}" cy="${r1(ty + N / 2)}" rx="${r1(N * 5)}" ry="${r1(N * 2.6)}" fill="url(#${id}-halo)"/>`
    + `${glow}${edges}${nodes}${labels}</g></g>`
    + (thumb ? '' : pill(wx + 14, H - 40, note) + (guard ? guardCard(id, W, guard) : '')) + '</svg>';
}

/* ---- the write-up's steps, for a system with no export --------------------- */
export function stepsCover(id, steps, glyphs, { title, note, guard, W = 480, thumb = false }) {
  const wx = 28, wy = 26, ww = W - 56, n = steps.length, size = 46, cy = wy + 26 + 62;
  const xs = steps.map((_, i) => wx + 50 + (i * (ww - 100)) / Math.max(1, n - 1));
  let body = '';
  steps.forEach((st, i) => {
    const cx = xs[i], first = i === 0;
    if (i) {
      const a = xs[i - 1] + size / 2 + 5, b = cx - size / 2 - 5;
      body += `<path class="wire" pathLength="1" style="--w:${i - 1}" d="M${r1(a)} ${cy}H${r1(b)}" fill="none" stroke="#D2AE9B" stroke-width="1.4"/><path class="e" d="M${r1(b - 4)} ${cy - 3.5}l4 3.5l-4 3.5" fill="none" stroke="#D2AE9B" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    body += `<rect x="${r1(cx - size / 2)}" y="${cy - size / 2}" width="${size}" height="${size}" rx="13" fill="${first ? K.oxide : `url(#${id}-tile)`}" stroke="${first ? K.oxide : '#E6D3C8'}" filter="url(#${id}-sh3)"/>`
      + icon(glyphs[st.g], cx, cy, 22, first ? K.win : K.oxide, thumb ? 2.2 : 1.5);
    if (thumb) return;
    body += T(cx, cy + size / 2 + 15, String(i + 1).padStart(2, '0'), { size: 7.5, fill: K.ink3, cls: 'm', a: 'middle' });
    clip(wrap(st.t, 11), 3).forEach((l, j) => { body += T(cx, cy + size / 2 + 29 + j * 12, l, { size: 10.4, fill: K.ink, w: 500, a: 'middle' }); });
  });
  return `<svg viewBox="${thumb ? THUMB : `0 0 ${W} ${H}`}" preserveAspectRatio="xMinYMin slice" aria-hidden="true" focusable="false">`
    + `<defs>${defs(id)}<filter id="${id}-sh3" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="#5A2A14" flood-opacity=".16"/></filter>`
    + `<linearGradient id="${id}-tile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="${K.wash}"/></linearGradient></defs>`
    + `<g class="lift">${frame(id, { x: wx, y: wy, w: ww, h: H, title: thumb ? '' : title })}${body}</g>`
    + (thumb ? '' : pill(wx + 14, H - 40, note) + (guard ? guardCard(id, W, guard) : '')) + '</svg>';
}

/* ---- Just Grade Metrics: a score, and the quote it must rest on ------------ */
export function gradeCover(id, { title, note, guard, W = 480, thumb = false }) {
  const wx = 28, wy = 26, x = wx + 20, top = wy + 46;
  const bar = (bx, by, bw, fill = K.mute, bh = 6) => `<rect x="${r1(bx)}" y="${r1(by)}" width="${r1(bw)}" height="${bh}" rx="${bh / 2}" fill="${fill}"/>`;
  let body = thumb ? '' : T(x, top, 'TRANSCRIPT', { size: 7, fill: K.ink3, cls: 'm', ls: '1.2' });
  [[0, 150], [1, 118], [0, 164, true], [1, 96], [0, 132]].forEach(([who, w, quoted], i) => {
    const y = top + 14 + i * 26;
    if (quoted) body += `<rect x="${x - 6}" y="${y - 5}" width="204" height="24" rx="5" fill="${K.wash}"/><rect x="${x - 6}" y="${y - 5}" width="2.6" height="24" rx="1.3" fill="${K.oxide}"/>`;
    body += `<circle cx="${x + 7}" cy="${y + 7}" r="6.5" fill="${who ? K.mute : K.ink2}"/>` + bar(x + 22, y + 1, w, quoted ? '#D9B9A8' : K.mute) + bar(x + 22, y + 11, w * 0.62, quoted ? '#D9B9A8' : K.line);
  });
  const sx = x + 228;
  body += `<path d="M${sx - 16} ${wy + 26}V${H}" stroke="${K.line}"/>` + (thumb ? '' : T(sx, top, 'SCORECARD', { size: 7, fill: K.ink3, cls: 'm', ls: '1.2' }));
  [['quote verified verbatim', true], ['quote not found', false]].forEach(([label, ok], i) => {
    const y = top + 14 + i * 46;
    body += bar(sx, y + 1, 120, K.ink2, 7) + bar(sx, y + 13, 84)
      + `<rect x="${sx}" y="${y + 24}" width="${ok ? 124 : 150}" height="15" rx="4" fill="${ok ? K.wash : K.night}"/>`
      + (ok ? `<path class="e" d="M${sx + 6} ${y + 32}l2.6 2.6l5-5.2" fill="none" stroke="${K.oxide}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`
        : `<path class="e" d="M${sx + 6.5} ${y + 28.5}l5 5M${sx + 11.5} ${y + 28.5}l-5 5" fill="none" stroke="${K.oxideHi}" stroke-width="1.5" stroke-linecap="round"/>`)
      + (thumb ? '' : T(sx + 18, y + 34.6, ok ? label : `${label} → to a person`, { size: 7.2, fill: ok ? K.oxide : K.nightInk, cls: 'm' }));
  });
  return `<svg viewBox="${thumb ? THUMB : `0 0 ${W} ${H}`}" preserveAspectRatio="xMinYMin slice" aria-hidden="true" focusable="false">`
    + `<defs>${defs(id)}</defs><g class="lift">${frame(id, { x: wx, y: wy, w: W, h: H, title: thumb ? '' : title })}${body}</g>`
    + (thumb ? '' : pill(wx + 14, H - 40, note) + (guard ? guardCard(id, W, guard) : '')) + '</svg>';
}

/* ---- a picture that already exists (expertise.js), as a cover -------------
   `body` is that picture's drawing, 480 wide and drawn for a 360 frame, with
   its ids already renamed to this cover's; the cover shows its top 300.
   `dx`, `dy` move it: its window up to where a cover's window starts, and to
   the middle of a wide cover. */
export function pictureCover(id, body, { note, guard, W = 480, thumb = false, dx = 0, dy = 0 }) {
  return `<svg viewBox="${thumb ? THUMB : `0 0 ${W} ${H}`}" preserveAspectRatio="xMinYMin slice" aria-hidden="true" focusable="false">`
    + `<defs>${defs(id)}</defs><g transform="translate(${dx} ${dy})">${body}</g>`
    + (thumb ? '' : (note ? pill(wx0 + 14, H - 40, note) : '') + (guard ? guardCard(id, W, guard) : '')) + '</svg>';
}
