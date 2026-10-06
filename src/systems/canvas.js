/* canvas.js — a workflow, drawn the way n8n shows it (2026-10-04).

   Until now a workflow's nodes were empty shapes: a square, a diamond for a
   gate, a circle for a model. Syed: "These workflows still use the empty
   nodes. Use real logos of the relevant nodes insted." So every node now
   carries the icon n8n itself puts on it:

     a vendor's node   the vendor's own mark, in its own colour — Gmail,
                       Google Sheets, Slack, Telegram, Postgres, OpenAI …
                       (src/pictures/logos.js)
     n8n's own nodes   Code, If, Switch, Edit Fields, HTTP Request, Wait … —
                       each with the sign n8n gives it (braces, a signpost, a
                       pen, a globe, a pause), in n8n's colour for it. These
                       are drawn here, in the same idea as n8n's icons; they
                       are not n8n's files.

   The shapes are n8n's too: a node is a rounded square, a trigger has a
   rounded left side and a bolt beside it, and a model or a parser wired into
   another node is round and hangs below it on a dashed line.

   Nothing else changed: the nodes sit at their exported positions, the
   wires are the exported connections, and a node type this file does not
   know stops the build rather than being drawn blank. A built system's
   nodes are named under them, as on the canvas; a client's are not (its
   export is kept as shape and type only), and say their type on hover.

   The drawing is as wide as the workflow is: a short one is drawn at full
   size, a long one is scaled to the card, and on a phone the card scrolls
   sideways rather than shrink the nodes to dots (systems.css). */

import { logoSvg } from '../pictures/logos.js';

const r1 = (n) => Math.round(n * 10) / 10;
const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* type -> [the name n8n gives the node, the vendor whose mark it carries] */
const VENDOR = {
  googleSheets: ['Google Sheets', 'Google Sheets'], postgres: ['Postgres', 'PostgreSQL'], slack: ['Slack', 'Slack'], slackTrigger: ['Slack Trigger', 'Slack'],
  telegram: ['Telegram', 'Telegram'], gmail: ['Gmail', 'Gmail'], gmailTrigger: ['Gmail Trigger', 'Gmail'], googleDrive: ['Google Drive', 'Google Drive'],
  googleCalendar: ['Google Calendar', 'Google Calendar'], googleGemini: ['Google Gemini', 'Google Gemini'], twilio: ['Twilio', 'Twilio'],
  lmChatOpenAi: ['OpenAI Chat Model', 'OpenAI'], embeddingsOpenAi: ['Embeddings OpenAI', 'OpenAI'], vectorStoreSupabase: ['Supabase Vector Store', 'Supabase'],
};
/* type -> [the name n8n gives the node, its sign, its colour] */
const CORE = {
  code: ['Code', 'braces', '#F08A1B'],
  if: ['If', 'signs', '#3F8A2B'],
  switch: ['Switch', 'signs', '#3D84D6'],
  filter: ['Filter', 'funnel', '#3D84D6'],
  httpRequest: ['HTTP Request', 'globe', '#3A46E0'],
  set: ['Edit Fields', 'pen', '#3A46E0'],
  webhook: ['Webhook', 'hook', '#C73A63'],
  respondToWebhook: ['Respond to Webhook', 'hook', '#C73A63'],
  noOp: ['No Operation', 'arrow', '#8E8E88'],
  wait: ['Wait', 'pause', '#8A3A52'],
  executeWorkflow: ['Execute Workflow', 'enter', '#F2664F'],
  executeWorkflowTrigger: ['When Executed by Another Workflow', 'leave', '#F2664F'],
  scheduleTrigger: ['Schedule Trigger', 'clock', '#2DB592'],
  manualTrigger: ['Manual Trigger', 'cursor', '#85878D'],
  splitInBatches: ['Loop Over Items', 'loop', '#1F7A5C'],
  merge: ['Merge', 'merge', '#12ADBE'],
  extractFromFile: ['Extract from File', 'fileout', '#7C5CE0'],
  formTrigger: ['n8n Form Trigger', 'form', '#12A594'],
  agent: ['AI Agent', 'robot', '#262522'],
  chainLlm: ['Basic LLM Chain', 'link', '#262522'],
  outputParserStructured: ['Structured Output Parser', 'code', '#262522'],
  documentDefaultDataLoader: ['Default Data Loader', 'doc', '#262522'],
  textSplitterRecursiveCharacterTextSplitter: ['Recursive Character Text Splitter', 'split', '#262522'],
};
/* The signs, on a 24-unit square. n8n's are mostly solid, so these are too
   where a solid one reads better small. The group a sign sits in strokes in
   the node's colour: a part marked FILL is also filled with it, a SOLID part
   is the colour with no outline, and a CUT part is drawn over one in white. */
const FILL = 'fill="currentColor" stroke-width="1.2"';
const SOLID = 'fill="currentColor" stroke="none"';
const CUT = 'stroke="#fff"';
const SIGN = {
  braces: '<path d="M9.5 4.5C7.6 4.5 7 5.6 7 7.2v2.2c0 1.3-.7 2.2-2.2 2.6 1.5.4 2.2 1.3 2.2 2.6v2.2c0 1.6.6 2.7 2.5 2.7M14.5 4.5c1.9 0 2.5 1.1 2.5 2.7v2.2c0 1.3.7 2.2 2.2 2.6-1.5.4-2.2 1.3-2.2 2.6v2.2c0 1.6-.6 2.7-2.5 2.7"/>',
  code: '<path d="m8.5 7.5-4.5 4.5 4.5 4.5M15.5 7.5l4.5 4.5-4.5 4.5"/>',
  signs: `<path d="M12 2.6v18.8"/><path ${FILL} d="M5.6 4.7h10.2l3.3 2.8-3.3 2.8H5.6z"/><path ${FILL} d="M18.4 12.7H8.2l-3.3 2.8 3.3 2.8h10.2z"/>`,
  funnel: `<path ${FILL} d="M4.2 5h15.6l-6.1 7.2v6.2L10.3 20v-7.8z"/>`,
  globe: '<circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c2.9 2.9 2.9 14.3 0 17.2M12 3.4c-2.9 2.9-2.9 14.3 0 17.2"/>',
  pen: `<path ${FILL} d="M4.3 19.7v-3.9l9.8-9.8 3.9 3.9-9.8 9.8z"/><path ${FILL} d="m16 4.2 1.2-1.2a1.5 1.5 0 0 1 2.1 0l1.7 1.7a1.5 1.5 0 0 1 0 2.1L19.8 8z"/>`,
  hook: '<circle cx="6.5" cy="16.5" r="2.4"/><circle cx="17.5" cy="16.5" r="2.4"/><circle cx="12" cy="7" r="2.4"/><path d="M10.8 9.1 7.7 14.4M13.2 9.1l3.1 5.3M8.9 16.5h6.2"/>',
  arrow: '<path stroke-width="2.5" d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  pause: `<circle cx="12" cy="12" r="9.2" ${SOLID}/><path ${CUT} stroke-width="2.3" d="M9.7 8.6v6.8M14.3 8.6v6.8"/>`,
  enter: '<path d="M3.5 12h11M10.5 8l4 4-4 4M14 4h5.5v16H14"/>',
  leave: '<path d="M10 4H4.5v16H10M9.5 12h11M16.5 8l4 4-4 4"/>',
  clock: `<circle cx="12" cy="12" r="9.2" ${SOLID}/><path ${CUT} d="M12 7.2V12l3.2 2.4"/>`,
  cursor: `<path ${FILL} d="M6 3.6 18.4 10.8l-5.3 1.4 3 5.6-2.3 1.2-3-5.6-3.9 3.8z"/>`,
  loop: '<path d="M19.5 9A8 8 0 0 0 5.2 7.3L4 9"/><path d="M4 4.5V9h4.5"/><path d="M4.5 15a8 8 0 0 0 14.3 1.7L20 15"/><path d="M20 19.5V15h-4.5"/>',
  merge: '<path d="M4 6.5h4.5l5 5.5H20M4 17.5h4.5l5-5.5"/><path d="m17 9 3 3-3 3"/>',
  fileout: '<path d="M13 3.5H6v17h7M13 3.5l4 4V10M13 3.5v4h4"/><path d="M12 15h8.5M17.5 12l3 3-3 3"/>',
  form: '<rect x="4.5" y="3.5" width="15" height="17" rx="2"/><path d="M8 8.5h8M8 12.5h8M8 16.5h4"/>',
  robot: `<path d="M12 7.6V4.8M2.5 12.4v3.4M21.5 12.4v3.4"/><circle cx="12" cy="3.7" r="1.3" ${SOLID}/><rect x="4.7" y="7.6" width="14.6" height="12" rx="2.6" ${SOLID}/><circle cx="9" cy="12.5" r="1.5" fill="#fff" stroke="none"/><circle cx="15" cy="12.5" r="1.5" fill="#fff" stroke="none"/><path ${CUT} stroke-width="1.6" d="M9.4 16.2h5.2"/>`,
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  split: '<path stroke-width="2.4" d="M9 4.5v15M15 4.5v15"/>',
};
/* a model, a parser, an embedding, a splitter: wired INTO the node that uses it, and drawn round */
const SUB = /^(lmChat|lmOpenAi|outputParser|embeddings|textSplitter|documentDefaultDataLoader|memory|tool)/;

/* the name n8n gives a node of this type; throws for a type nothing here knows */
export function nodeName(type) {
  const n = VENDOR[type] || CORE[type];
  if (!n) throw new Error(`canvas: no icon for the node type "${type}" — add it to VENDOR or CORE in src/systems/canvas.js`);
  return n[0];
}

/* a name on at most two lines of `max` characters */
const wrap = (text, max) => {
  const lines = [''];
  for (const word of String(text).split(' ')) {
    if ((lines.at(-1) + ' ' + word).trim().length > max && lines.at(-1)) lines.push(word);
    else lines[lines.length - 1] = (lines.at(-1) + ' ' + word).trim();
  }
  return lines.length > 2 ? [lines[0], `${lines[1].replace(/[\s—–-]+$/, '')}…`] : lines;
};

/* The workflow: { svg, width, narrow } — width is the drawing's own, in px, at
   full size; narrow is the least it should be given: a narrower card scrolls
   the drawing instead of shrinking it past that. Without names a node may go
   down to 28px; with them to 36px, under which the names stop being
   readable (on a phone the first drawings were at 24px, and their names at
   5.5px). */
export function workflowCanvas(wf, logos, { names = false, label = 'The workflow' } = {}) {
  /* at full size a node is 40px: n8n's hundred units at four tenths */
  const FULL = 0.4, MAXW = 1060, mx = 30, top = 20;
  const u = Math.min(FULL, (MAXW - 2 * mx - 100 * FULL) / Math.max(wf.w, 1));
  const sub = wf.nodes.map((n) => SUB.test(n[3]));
  /* The closest two nodes set how big a node can be: side by side there has
     to be a wire's length between them, one above the other a name's height.
     The round ones wired into a node (a model, a parser) sit closer to each
     other than nodes do, so they are sized from their own spacing. */
  let room = 1e9, subRoom = 1e9;
  wf.nodes.forEach(([x, y], i) => wf.nodes.forEach(([x2, y2], j) => {
    if (j <= i) return;
    const dx = Math.abs(x2 - x), dy = Math.abs(y2 - y);
    if (sub[i] && sub[j]) subRoom = Math.min(subRoom, Math.max(dx * 0.82, dy * 0.8));
    else room = Math.min(room, Math.max(dx * 0.62, dy * 0.74));
  }));
  const N = r1(Math.max(14, Math.min(100 * FULL, room * u)));
  const NS = r1(Math.min(N * 0.9, subRoom * u));
  const size = (i) => (sub[i] ? NS : N);

  /* names: as big as the nodes allow, as long as the columns allow */
  const fs = r1(Math.max(7.6, Math.min(9.2, N * 0.23))), lh = r1(fs * 1.17), cw = fs * 0.5;
  const hops = wf.edges.filter(([a, b, ai]) => !ai && wf.nodes[b][0] > wf.nodes[a][0]).map(([a, b]) => wf.nodes[b][0] - wf.nodes[a][0]).sort((p, q) => p - q);
  const col = hops.length ? hops[0] : 220;
  const chars = Math.max(9, Math.min(18, Math.floor((col * u - 6) / cw)));

  const bottom = names ? r1(2 * lh + 12) : 18;
  const W = r1(wf.w * u + N + 2 * mx);
  let H = wf.h * u + N + top + bottom;
  /* a node's box is N wide whatever it holds; a round one sits in the middle of its box */
  const P = wf.nodes.map(([x, y]) => [mx + x * u, top + y * u]);
  const boxes = P.map(([x, y], i) => { const s = size(i), o = (N - s) / 2; return [x + o, y + o, x + o + s, y + o + s]; });

  /* a path through right-angled corners, each one rounded */
  const round = (pts, q) => {
    let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1];
      const a = Math.min(q, Math.hypot(cx - px, cy - py) / 2), b = Math.min(q, Math.hypot(nx - cx, ny - cy) / 2);
      d += `L${r1(cx - Math.sign(cx - px) * a)} ${r1(cy - Math.sign(cy - py) * a)}Q${r1(cx)} ${r1(cy)} ${r1(cx + Math.sign(nx - cx) * b)} ${r1(cy + Math.sign(ny - cy) * b)}`;
    }
    return `${d}L${r1(pts.at(-1)[0])} ${r1(pts.at(-1)[1])}`;
  };

  let edges = '';
  for (const [a, b, ai] of wf.edges) {
    const [x1, y1] = P[a], [x2, y2] = P[b];
    if (ai) {
      /* from the top of the round one up to the foot of the node it is wired into */
      const sx = x1 + N / 2, sy = y1 + N / 2 - size(a) / 2, ex = x2 + N / 2, ey = y2 + N / 2 + size(b) / 2, k = Math.max(6, (sy - ey) * 0.5);
      edges += `<path class="ed ai" d="M${r1(sx)} ${r1(sy)}C${r1(sx)} ${r1(sy - k)} ${r1(ex)} ${r1(ey + k)} ${r1(ex)} ${r1(ey)}"/>`;
      continue;
    }
    const sx = x1 + N / 2 + size(a) / 2, sy = y1 + N / 2, ex = x2 + N / 2 - size(b) / 2, ey = y2 + N / 2, dx = Math.max(8, Math.abs(ex - sx) / 2);
    if (ex < sx + 8) {
      /* A wire back up the canvas (a loop's return), or straight down to the
         node below: as n8n draws one — out to the right, round, and in from
         the left. It runs between the two rows where nothing stands there,
         else under the two nodes, clear of their names, else under whatever
         does stand between them. */
      const g = Math.max(6, N * 0.42), clear = names ? 2 * lh + 9 : N * 0.5, lft = ex - g, rgt = sx + g;
      const crosses = (yy) => boxes.some(([bx0, by0, bx1, by1], j) => j !== a && j !== b && bx1 > lft && bx0 < rgt && yy > by0 - 5 && yy < by1 + 5);
      const tries = [];
      if (y2 - (y1 + N) >= 14) tries.push((y1 + N + y2) / 2);
      if (y1 - (y2 + N) >= 14) tries.push((y2 + N + y1) / 2);
      tries.push(Math.max(y1, y2) + N + clear);
      let yr = tries.find((yy) => !crosses(yy));
      if (yr === undefined) yr = Math.max(...boxes.filter(([bx0, , bx1]) => bx1 > lft && bx0 < rgt).map((bx) => bx[3])) + clear;
      H = Math.max(H, yr + 9);
      edges += `<path class="ed" d="${round([[sx, sy], [rgt, sy], [rgt, yr], [lft, yr], [lft, ey], [ex, ey]], N * 0.22)}"/>`;
      continue;
    }
    edges += `<path class="ed" d="M${r1(sx)} ${r1(sy)}C${r1(sx + dx)} ${r1(sy)} ${r1(ex - dx)} ${r1(ey)} ${r1(ex)} ${r1(ey)}"/>`;
  }
  H = r1(H);

  /* names, where there is room: clear of every other node and of the names already set */
  const named = new Map();
  if (names) {
    const taken = boxes.map(([x0, y0, x1, y1]) => [x0 - 1, y0 - 1, x1 + 1, y1 + 1]);
    wf.nodes.forEach(([, , , type, name], i) => {
      const lines = wrap(name || nodeName(type), chars);
      const wd = Math.max(...lines.map((l) => l.length)) * cw + 2, cx = P[i][0] + N / 2, y = P[i][1] + N / 2 + size(i) / 2 + 3;
      const box = [cx - wd / 2, y, cx + wd / 2, y + lines.length * lh];
      if (box[0] < 2 || box[2] > W - 2) return;
      if (taken.some((b, j) => j !== i && box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) return;
      taken.push(box);
      named.set(i, lines);
    });
  }

  let nodes = '';
  wf.nodes.forEach(([, , k, type, name], i) => {
    const [x, y] = P[i], cx = x + N / 2, cy = y + N / 2, r = N * 0.24;
    const title = nodeName(type);
    const tip = `<title>${esc(names && name ? `${name} · ${title}` : title)}</title>`;
    let shape;
    if (sub[i]) shape = `<circle class="nb" cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(NS / 2)}"/>`;
    else if (k === 'trigger') {
      shape = `<path class="nb" d="M${r1(x + N / 2)} ${r1(y)}H${r1(x + N - r)}a${r1(r)} ${r1(r)} 0 0 1 ${r1(r)} ${r1(r)}V${r1(y + N - r)}a${r1(r)} ${r1(r)} 0 0 1 ${r1(-r)} ${r1(r)}H${r1(x + N / 2)}a${r1(N / 2)} ${r1(N / 2)} 0 0 1 0 ${r1(-N)}z"/>`
        + `<path class="bolt" d="M${r1(x - N * 0.2)} ${r1(cy - N * 0.2)}l${r1(-N * 0.15)} ${r1(N * 0.22)}h${r1(N * 0.11)}l${r1(-N * 0.05)} ${r1(N * 0.18)} ${r1(N * 0.17)} ${r1(-N * 0.24)}h${r1(-N * 0.11)}z"/>`;
    } else shape = `<rect class="nb" x="${r1(x)}" y="${r1(y)}" width="${N}" height="${N}" rx="${r1(r)}"/>`;
    /* the icon: a little larger in a small node, where it has to carry the node alone */
    const s = sub[i] ? NS * 0.6 : N * (N < 28 ? 0.64 : 0.58), ix = r1(cx - s / 2), iy = r1(cy - s / 2);
    const icon = VENDOR[type]
      ? logoSvg(logos, VENDOR[type][1], ix, iy, r1(s))
      : `<g transform="translate(${ix} ${iy}) scale(${r2(s / 24)})" fill="none" stroke="${CORE[type][2]}" color="${CORE[type][2]}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${SIGN[CORE[type][1]]}</g>`;
    const text = (named.get(i) || []).map((l, j) => `<text class="nl" x="${r1(cx)}" y="${r1(cy + size(i) / 2 + 3 + fs * 0.86 + j * lh)}">${esc(l)}</text>`).join('');
    nodes += `<g class="nd">${tip}${shape}${icon}${text}</g>`;
  });
  return {
    width: Math.round(W),
    narrow: Math.round(Math.min(W, (W * (names ? 36 : 28)) / N)),
    svg: `<svg class="wfc-svg" viewBox="0 0 ${W} ${H}" width="${Math.round(W)}" height="${Math.round(H)}" style="--fs:${fs}px" role="img" aria-label="${esc(label)}, node by node">${edges}${nodes}</svg>`,
  };
}
