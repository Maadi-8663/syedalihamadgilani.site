/* page.js — the fifteen system pages (2026-09-30).

   Built here rather than ported, like /integrations/: there is no Artifact
   for them. Each wears the Lead-to-Cash page's clothes — its nav and footer,
   cut from system.html at build time so they cannot drift apart; its head,
   spine, section nodes, inventory bar, guards and tool badges, in the same
   markup, so page-system.css, mobile.css and motion.css treat them alike —
   and adds three things of its own (styles in systems.css):

     How it runs   the system as a sequence of steps. On a desktop the stage
                   pins and the scroll drives it: the rail lights step by
                   step, its wire draws on, and each step's sentence takes
                   the stage in turn. On a phone, or without scroll
                   timelines, or with motion reduced, it is a plain list with
                   every step lit. One list in the HTML serves both.
   The workflows every exported workflow drawn at its real node positions,
                   gates as diamonds, triggers filled; as it scrolls in it
                   lights up in the order a run would reach each node.
   Limits        what the system does not do, from its own write-up.

   Since 2026-10-04 a page opens on its system's cover (cover.js) where the
   small workflow diagram was — every system has one, export or not — and
   its guards are cards that turn (guards.js): "visuals instead of text".

   Every count is read from graphs.json (scripts/extract-systems.mjs), never
   typed; the few that data.js does type in prose are asserted below. Text
   comes from data.js, whose header names the sources. */

import { SYSTEMS, GROUPS, PORTED } from './data.js';
import { glyph, GLYPHS } from './glyphs.js';
import GRAPHS from './graphs.json';
import { toolMarks } from '../pictures/cluster.js';
import { integrationMarks } from '../integrations/marks.js';
import { headCover } from './cover.js';
import { guardCards } from './guards.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pad = (n) => String(n).padStart(2, '0');
const num = (n) => n.toLocaleString('en-US');
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const r2 = (n) => Math.round(n * 100) / 100;

const cut = (page, open, close) => {
  const a = page.indexOf(open), b = page.indexOf(close, a);
  if (a === -1 || b === -1) throw new Error(`systems: ${open} not found in system.html`);
  return page.slice(a, b + close.length);
};

/* ---- what the data must agree with ------------------------------------ */

/* Figures data.js states in words, checked against the counted JSON. */
const TYPED = {
  'shopify-support-automation': { wait: 14, telegram: 18, agent: 5, outputParserStructured: 5, if: 17 },
  'lsa-lead-responder': { if: 10, googleGemini: 4, scheduleTrigger: 2 },
};
const TYPED_SIZES = { 'shopify-support-automation': { 0: 48, 5: 5 } };

function typeCounts(g) {
  const c = new Map();
  for (const w of g.workflows) for (const n of w.nodes) c.set(n[3], (c.get(n[3]) || 0) + 1);
  return c;
}

function check(sys, g) {
  if (!g) return;
  const c = typeCounts(g);
  for (const [t, want] of Object.entries(TYPED[sys.slug] || {})) {
    if ((c.get(t) || 0) !== want) throw new Error(`systems: ${sys.slug} says ${want} ${t} nodes; the JSON has ${c.get(t) || 0}`);
  }
  for (const [i, want] of Object.entries(TYPED_SIZES[sys.slug] || {})) {
    if (g.workflows[i].nodes.length !== want) throw new Error(`systems: ${sys.slug} workflow ${i} is ${g.workflows[i].nodes.length} nodes, not ${want}`);
  }
  if (sys.flows.length !== g.workflows.length) throw new Error(`systems: ${sys.slug} names ${sys.flows.length} workflows; the JSON has ${g.workflows.length}`);
  /* each display name must be the workflow it sits beside (catches a reorder) */
  sys.flows.forEach(([name], i) => {
    const real = g.workflows[i].name.toLowerCase();
    for (const word of name.toLowerCase().match(/[a-z]{3,}/g)) {
      if (!real.includes(word.replace(/ing$/, ''))) throw new Error(`systems: ${sys.slug} calls workflow ${i} "${name}", but it is "${g.workflows[i].name}"`);
    }
  });
}

/* ---- drawing a workflow ------------------------------------------------ */

/* Depth of each node in a run: breadth-first from the triggers along the
   main connections. A model or parser wired into an agent lights with it. */
function depths(wf) {
  const n = wf.nodes.length, d = new Array(n).fill(-1), next = Array.from({ length: n }, () => []);
  for (const [a, b, ai] of wf.edges) if (!ai) next[a].push(b);
  const queue = [];
  wf.nodes.forEach((node, i) => { if (node[2] === 'trigger') { d[i] = 0; queue.push(i); } });
  if (!queue.length) { d[0] = 0; queue.push(0); }
  while (queue.length) {
    const a = queue.shift();
    for (const b of next[a]) if (d[b] === -1) { d[b] = d[a] + 1; queue.push(b); }
  }
  for (let pass = 0; pass < n && d.includes(-1); pass++) {
    for (const [a, b] of wf.edges) {
      if (d[a] === -1 && d[b] !== -1) d[a] = d[b];
      else if (d[b] === -1 && d[a] !== -1) d[b] = d[a] + 1;
    }
  }
  const max = Math.max(1, ...d);
  return d.map((v) => (v < 0 ? 1 : v / max));
}

/* The canvas at its exported positions, scaled into `width` units. Node
   sizes follow the scale, within limits, so a long ribbon stays legible
   and nodes never touch. `cls` is the drawing's class (a workflow's card). */
function canvas(wf, { width, maxScale, cls, names }) {
  const unit = Math.min(maxScale, (width - 40) / Math.max(wf.w, 1));
  const node = Math.max(6, Math.min(13, 176 * unit * 0.62));
  const m = 14, h = r2(wf.h * unit + node + m * 2);
  const off = r2((width - (wf.w * unit + node)) / 2);
  const P = wf.nodes.map(([x, y]) => [r2(off + x * unit), r2(m + y * unit)]);
  const t = depths(wf);
  const edges = wf.edges.map(([a, b, ai]) => {
    const [x1, y1] = P[a], [x2, y2] = P[b];
    const tt = `--t:${r2(t[a])};--u:${r2(Math.max(t[a], t[b]))}`;   // a wire back up the canvas draws in place
    if (ai) return `<path class="ed ai" pathLength="1" style="${tt}" d="M${r2(x1 + node / 2)} ${y1} L${r2(x2 + node / 2)} ${r2(y2 + node)}"/>`;
    const sx = x1 + node, sy = y1 + node / 2, ex = x2, ey = y2 + node / 2, mx = r2((sx + ex) / 2);
    return `<path class="ed" pathLength="1" style="${tt}" d="M${r2(sx)} ${r2(sy)} C${mx} ${r2(sy)} ${mx} ${r2(ey)} ${r2(ex)} ${r2(ey)}"/>`;
  }).join('');
  const nodes = wf.nodes.map(([, , k, type, name], i) => {
    const [x, y] = P[i], c = r2(node / 2);
    const tip = `<title>${esc(names && name ? `${name} · ${type}` : type)}</title>`;
    const st = `style="--t:${r2(t[i])}"`;
    if (k === 'branch') {
      const s = r2(node * 0.74);
      return `<g class="nd k-branch" ${st}>${tip}<rect x="${r2(x + c - s / 2)}" y="${r2(y + c - s / 2)}" width="${s}" height="${s}" rx="1.5" transform="rotate(45 ${r2(x + c)} ${r2(y + c)})"/></g>`;
    }
    if (k === 'ai') return `<g class="nd k-ai" ${st}>${tip}<circle cx="${r2(x + c)}" cy="${r2(y + c)}" r="${c}"/></g>`;
    return `<g class="nd k-${k}" ${st}>${tip}<rect x="${x}" y="${y}" width="${r2(node)}" height="${r2(node)}" rx="${r2(node / 4)}"/></g>`;
  }).join('');
  return `<svg class="${cls}" viewBox="0 0 ${width} ${h}" aria-hidden="true">${edges}${nodes}</svg>`;
}

/* ---- the page's parts -------------------------------------------------- */

const dot = '<svg class="mk" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="5"/></svg>';
const section = (label, inner, { ghost = false, id } = {}) =>
  `<section class="run"${id ? ` id="${id}"` : ''}>
      <span class="snode${ghost ? ' ghost' : ''}" aria-hidden="true"></span><h2 class="label-m slabel"${ghost ? ' style="color:var(--ink3)"' : ''}>${label}</h2>
      <div class="wrap">${inner}</div>
    </section>`;

function head(sys, g, sources) {
  const crumb = `<p class="label"><a href="/work/" style="color:var(--ink3)">Work</a> &nbsp;/&nbsp; `
    + `<a href="/work/#${sys.group}" style="color:var(--ink3)">${esc(GROUPS[sys.group])}</a> &nbsp;/&nbsp; <span style="color:var(--maroon)">${pad(sys.n)}</span>`
    + (sys.sector ? ` &nbsp;·&nbsp; <a href="/sectors/home-services/" style="color:var(--ink3)">Home services &amp; construction</a>` : '')
    + '</p>';
  let sub = esc(sys.sub);
  if (sys.link) sub = sub.replace(esc(sys.link[1]), `<a class="link" href="${sys.link[0]}">${esc(sys.link[1])}</a>`);

  let prov, figs = [];
  if (sys.source === 'json') {
    prov = 'Built — counted from the workflow JSON in the repo; not yet run against live accounts';
    figs = [[g.nodes, 'nodes'], [g.workflows.length, 'workflows'], [g.notes, 'sticky notes'], [g.connections, 'connections']];
  } else if (sys.source === 'export') {
    prov = 'Delivered — figures counted directly from the exported workflow JSON';
    figs = [[g.workflows.filter((w) => w.active).length, 'automations live'], [g.workflows.length, 'workflows'], [g.nodes + g.notes, 'nodes'], ...(sys.extraFigs || [])];
  } else if (sys.source === 'reported') {
    prov = 'Delivered — figures client-reported; no workflow export was supplied';
    figs = sys.figs;
  } else if (sys.source === 'production') {
    prov = sys.provLine;
    figs = sys.figs;
  } else {
    prov = 'Delivered — no workflow export was supplied, so nothing here is counted';
  }
  const figHtml = figs.length
    ? `<div class="figs">${figs.map(([v, l]) => `<div><b>${esc(typeof v === 'number' ? num(v) : v)}</b><i class="label">${esc(l)}</i></div>`).join('')}</div>`
      + (sys.extra ? `<p class="mono dim sys-extra">${esc(sys.extra)}</p>` : '')
    : '<p class="sys-nofig">No figures on this page: without an export there is nothing to count, and nothing is estimated.</p>';

  return `<div class="wrap" style="padding-top:48px">
      ${crumb}
      <div class="sys-head">
        <div>
          <h1 class="serif" style="font-size:clamp(34px,4.2vw,60px);line-height:1.05;margin-top:22px;max-width:18ch">${esc(sys.name)}</h1>
          <p class="body" style="margin-top:22px">${sub}</p>
          <p class="label-m sys-prov" style="margin-top:28px;display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.08em">${dot} <span>${esc(prov)}</span></p>
          ${figHtml}
        </div>
        ${headCover(sys.slug, sources)}
      </div>
    </div>`;
}

function problem(sys) {
  return section('The problem', `<p class="sys-say serif">${esc(sys.problem[0])}</p><p class="body sys-body">${esc(sys.problem[1])}</p>`);
}

/* The scroll sequence. Each step owns an equal share of the pinned scroll,
   written as percentages the CSS reads (--a to --b). Its sentence arrives and
   leaves inside that share, so two sentences are never on screen at once —
   a cross-fade was tried first and left both unreadable mid-way. */
function flow(sys, g) {
  const n = sys.steps.length, L = 100 / n;
  const items = sys.steps.map((s, i) => {
    const a = r2(i * L), b = r2((i + 1) * L);
    let meta = s.meta || '';
    if (s.wf != null) {
      const wf = g.workflows[s.wf];
      meta = `Workflow ${s.wf + 1} of ${g.workflows.length} · ${sys.flows[s.wf][0]} · ${wf.nodes.length} nodes` + (s.meta ? ` · ${s.meta}` : '');
    }
    return `<li class="fs" style="--a:${a};--b:${b}">
            <span class="fs-ring" aria-hidden="true">${glyph(s.g, 18)}<i class="fs-w"></i></span>
            <b class="fs-t">${esc(s.t)}</b>
            <div class="fs-cap"><p class="fs-n"><span>${pad(i + 1)} / ${pad(n)}</span>${meta ? ` ${esc(meta)}` : ''}</p><p class="fs-lede">${esc(s.lede)}</p>${s.exit ? `<p class="fs-exit">${esc(s.exit)}</p>` : ''}</div>
          </li>`;
  }).join('\n          ');
  return section('How it runs', `<div class="flow" style="--n:${n}">
        <div class="flow-stage">
          <ol class="flow-steps">
          ${items}
          </ol>
        </div>
      </div>`, { id: 'how-it-runs' });
}

function workflows(sys, g) {
  const built = sys.prov === 'built';
  const cards = g.workflows.map((wf, i) => {
    const [name, role] = sys.flows[i];
    const state = built ? '' : ` · ${wf.active ? 'live' : 'standby'}`;
    return `<li class="wfc">
          <p class="wfc-h"><span class="mono">${pad(i + 1)}</span><b>${esc(name)}</b></p>
          <div class="wfc-c">${canvas(wf, { width: 560, maxScale: 0.2, cls: 'wfc-svg', names: built })}</div>
          <p class="wfc-m mono">${wf.nodes.length} nodes · ${wf.edges.length} connections${wf.notes ? ` · ${wf.notes} ${wf.notes === 1 ? 'note' : 'notes'}` : ''}${state}</p>
          <p class="small">${esc(role)}</p>
        </li>`;
  }).join('\n        ');
  const key = `<p class="wfc-key mono"><span><i class="k-trigger"></i>trigger</span><span><i class="k-branch"></i>gate (if, switch, filter)</span><span><i class="k-ai"></i>model</span><span><i class="k-io"></i>everything else</span>${built ? '<span class="if-hover">Hover a node for its name</span>' : ''}</p>`;
  const count = WORDS[g.workflows.length] || g.workflows.length;
  return section(`The ${count} workflows, as ${built ? 'built' : 'exported'}`,
    `${key}<ul class="wfcs">
        ${cards}
      </ul>`);
}

function inventory(sys, g) {
  const counts = [...typeCounts(g)].sort((a, b) => b[1] - a[1]);
  const top = counts.slice(0, 8), rest = counts.slice(8).reduce((s, [, v]) => s + v, 0);
  const gates = counts.filter(([t]) => /^(if|switch|filter)$/.test(t)).reduce((s, [, v]) => s + v, 0);
  let shade = 0;
  const colour = (t) => (/^(if|switch|filter)$/.test(t) ? 'var(--accent)' : `var(--viz${(shade++ % 3) + 1})`);
  const rows = top.map(([t, v]) => [t, v, colour(t)]);
  if (rest) rows.push(['other', rest, 'var(--hair)']);
  const pct = (v) => ((v / g.nodes) * 100).toFixed(2);
  const bar = rows.map(([t, v, c]) => `<span title="${t} ${v}" style="width:${pct(v)}%;background:${c}"></span>`).join('');
  const keys = rows.map(([t, v, c]) => `<span><i style="background:${c}"></i>${t} <span class="dim">${v}</span></span>`).join('');
  const notes = sys.prov === 'built'
    ? ` The ${g.notes} sticky notes carry the reasoning on the canvas, at the point it applies.`
    : '';
  const total = sys.prov === 'built' ? '' : ` ${num(g.nodes + g.notes)} objects on the canvas = ${num(g.nodes)} executing nodes + ${g.notes} sticky notes.`;
  return section(`${num(g.nodes)} executing nodes, by type`,
    `<div class="inv" aria-hidden="true">${bar}</div>
        <div class="invkey">${keys}</div>
        <p class="small" style="margin-top:22px;max-width:900px"><span style="color:var(--maroon)">${gates} if, switch and filter nodes</span> decide whether anything happens next — the gates are a countable part of the system, not a claim about it.${total}${notes}</p>`);
}

function guards(sys) {
  const items = sys.guards.map((x) => {
    if (!GLYPHS[x.g]) throw new Error(`systems: no drawing for the guard icon "${x.g}" (${sys.slug})`);
    return { icon: GLYPHS[x.g], t: esc(x.t), d: esc(x.d) };
  });
  return section('The guards, and what each one prevents', guardCards(items));
}

function limits(sys) {
  return section('Limits, stated plainly', `<ul class="limits">${sys.limits.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`);
}

function builtWith(sys, marks, next) {
  const badges = sys.tools.map((t) => {
    const svg = marks.get(t);
    if (svg) {
      const face = svg.replace(/width="\d+" height="\d+"/, 'width="22" height="22"');
      const back = svg.replace(/width="\d+" height="\d+"/, 'width="16" height="16"');
      return `<li class="tnode" tabindex="0" title="${esc(t)}" aria-label="${esc(t)}"><span class="faces"><span class="face">${face}</span><span class="face back">${back}${esc(t)}</span></span></li>`;
    }
    return `<li class="tnode wide" tabindex="0" aria-label="${esc(t)}"><span class="faces"><span class="face txt">${esc(t)}</span><span class="face back">${esc(t)}</span></span></li>`;
  }).join('');
  return `<section class="run" style="padding-bottom:96px">
      <span class="snode ghost" aria-hidden="true"></span><h2 class="label-m slabel" style="color:var(--ink3)">Built with</h2>
      <div class="wrap">
        <div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:32px;align-items:start">
          <ul class="tools built" style="margin-top:24px">${badges}</ul>
          <div style="text-align:right;margin-top:24px"><p class="label">Next system</p><a class="link" href="/work/${next.slug}/" style="display:inline-block;margin-top:8px;font-size:16px">${esc(next.name)} →</a></div>
        </div>
      </div>
    </section>`;
}

/* ---- the page ---------------------------------------------------------- */

const ORDER = [PORTED, ...SYSTEMS].sort((a, b) => a.n - b.n);
export const nextOf = (slug) => ORDER[(ORDER.findIndex((s) => s.slug === slug) + 1) % ORDER.length];

export function systemPage(slug, { system, home }) {
  const sys = SYSTEMS.find((s) => s.slug === slug);
  if (!sys) throw new Error(`systems: no system ${slug}`);
  const g = GRAPHS[slug];
  if ((sys.source === 'json' || sys.source === 'export') !== Boolean(g)) throw new Error(`systems: ${slug} and graphs.json disagree on whether it has an export`);
  if (g) check(sys, g);

  const marks = new Map([...toolMarks(home), ...integrationMarks()]);
  const nav = cut(system, '<nav class="nav"', '</nav>');
  const footer = cut(system, '<footer>', '</footer>');

  const parts = [head(sys, g, { system, home }), problem(sys), flow(sys, g)];
  if (g) parts.push(workflows(sys, g), inventory(sys, g));
  parts.push(guards(sys), limits(sys), builtWith(sys, marks, nextOf(slug)));

  return `<div class="page">
${nav}
<main id="main">
  <div class="body-run sys">
    <span class="spine" aria-hidden="true"></span>
    ${parts.join('\n\n    ')}
  </div>
</main>
${footer}
</div>`;
}

/* For the route: every slug, and what each page's head needs. */
export const SLUGS = SYSTEMS.map((s) => s.slug);
export function systemMeta(slug) {
  const sys = SYSTEMS.find((s) => s.slug === slug);
  /* the search snippet states the node count in words: it must be the JSON's */
  const g = GRAPHS[slug], said = sys.description.match(/(\d[\d,]*) nodes/);
  if (said && (!g || Number(said[1].replace(/,/g, '')) !== (sys.prov === 'built' ? g.nodes : g.nodes + g.notes))) {
    throw new Error(`systems: ${slug}'s description says ${said[0]}; the JSON disagrees`);
  }
  return {
    title: `${sys.name} — Syed Ali Hamad Gilani`,
    description: sys.description,
    name: sys.name,
    about: sys.sub,
    keywords: sys.tools.join(', '),
  };
}
