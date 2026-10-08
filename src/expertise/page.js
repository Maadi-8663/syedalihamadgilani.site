/* page.js — the six expertise pages (2026-10-04).

   Built here rather than ported, like the system pages and /integrations/:
   there is no Artifact for them. A card on the home page ("What I do") opens
   its page, and the page answers what he asked for, in his order (data.js
   has his words): the tools and stack behind that kind of work, every
   project of that kind, and a way to book a call about it.

   They wear the register's clothes, so they read as part of the site: the
   nav and footer are cut from work.html at build time, so they cannot drift
   apart; the spine and its section nodes and the section labels are the
   register's own markup, so page-base.css, page-work.css, mobile.css and
   scenes.css treat them as they treat /work/. The card's picture
   (src/pictures/expertise.js) heads the page it opens. Styles of their own
   are in src/styles/expertise.css.

   Since 2026-10-04 the pages use the gallery's parts ("visuals instead of
   text everywhere"): the stack is cards that turn, a tool's mark on the face
   and what it is used for on the back, as on the Integrations page; and the
   projects are the cards /work/ shows (src/work/cards.js), each with its
   cover and its line about this expertise.

   Nothing here is typed twice. A project's name, sector and tools come from
   src/systems/data.js; its figure and where that was counted from come from
   its row on the register (work.html), as does everything about the one
   ported system, Lead-to-Cash. And every claim in data.js is checked against
   its source before a page is built — see check() — so this throws rather
   than publish a tool nothing on the page uses, or a sentence its system's
   own page does not carry. */

import { EXPERTISE, EVIDENCE } from './data.js';
import { expertiseMarks, EXTRA_BRAND } from './marks.js';
import { SYSTEMS, PORTED } from '../systems/data.js';
import GRAPHS from '../systems/graphs.json';
import { GROUPS as INTEGRATIONS } from '../integrations/tools.js';
import { toolMarks } from '../pictures/cluster.js';
import { integrationMarks, DRAWN_BRAND } from '../integrations/marks.js';
import { BRAND } from '../pictures/brands.js';
import { expertisePictures } from '../pictures/expertise.js';
import { withIntegrationsLink } from '../integrations/nav.js';
import { withBrandMark } from '../brand/mark.js';
import { registerRows, text } from '../work/register.js';
import { projectCard } from '../work/cards.js';
import { siteCover } from '../systems/cover.js';
import { site } from '../data/site.js';
import pkg from '../../package.json';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pad = (n) => String(n).padStart(2, '0');
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const cut = (page, open, close) => {
  const a = page.indexOf(open), b = page.indexOf(close, a);
  if (a === -1 || b === -1) throw new Error(`expertise: ${open} not found in work.html`);
  return page.slice(a, b + close.length);
};
/* every string in a system's entry, as one text */
const strings = (v) => (typeof v === 'string' ? v : Array.isArray(v) ? v.map(strings).join(' \n ') : v && typeof v === 'object' ? Object.values(v).map(strings).join(' \n ') : '');

/* Tools the site sets in type because no mark is published for them. A name
   in a stack must be one of these or have a mark, so a typo cannot ship. */
const TYPESET = new Set(['GoHighLevel', 'HouseCall Pro', 'CallRail', 'Skyvern', 'Apify', 'PandaDoc', 'AssemblyAI']);

/* ---- the register's rows: figures, sources and the ported system ---------
   (read by src/work/register.js, which /work/ itself is built from) */

/* What a page needs of each system. `row` is its row on the register, which
   its card is built from; `blob` is the system's published text, lower-cased:
   what a project's line and a tool's note are checked against. */
function records({ work, system, sector }) {
  const rows = registerRows(work);
  const out = new Map();
  const row = (slug) => {
    const r = rows.get(slug);
    if (!r) throw new Error(`expertise: ${slug} has no row on the register`);
    return r;
  };
  for (const sys of SYSTEMS) {
    const r = row(sys.slug);
    if ((sys.prov === 'delivered') !== (r.prov === 'Delivered')) throw new Error(`expertise: ${sys.slug} is ${sys.prov} in data.js and ${r.prov} on the register`);
    out.set(sys.slug, { slug: sys.slug, n: sys.n, name: sys.name, sub: sys.sub, prov: r.prov, dot: r.dot, col3: r.col3, row: r,
      tools: sys.tools, href: `/work/${sys.slug}/`, blob: strings(sys).toLowerCase() });
  }
  /* the ported system: its row is its record, its own page and the sector
     page are its text */
  const r = row(PORTED.slug);
  out.set(PORTED.slug, { slug: PORTED.slug, n: PORTED.n, name: PORTED.name, sub: text(r.sector), prov: r.prov, dot: r.dot, col3: r.col3, row: r,
    tools: [...r.marked, ...r.texts], href: `/work/${PORTED.slug}/`, blob: `${r.text} \n ${text(system)} \n ${text(sector)}`.toLowerCase() });
  return out;
}

/* ---- the checks ---------------------------------------------------------- */

function check(x, recs, marks) {
  const fail = (msg) => { throw new Error(`expertise (${x.slug}): ${msg}`); };
  const projects = x.projects.map(([slug]) => recs.get(slug) || fail(`no system ${slug}`));
  if (new Set(x.projects.map(([s]) => s)).size !== x.projects.length) fail('a project is listed twice');

  /* a project's line: each phrase it rests on is in that system's own text */
  for (const [slug, , needs] of x.projects) {
    if (!needs || !needs.length) fail(`${slug}'s line names no source phrase`);
    for (const n of needs) if (!recs.get(slug).blob.includes(n)) fail(`${slug}'s line rests on “${n}”, which its page no longer says`);
  }

  /* the stack: a tool is used by a project on this page, or EVIDENCE says where */
  const used = new Set(projects.flatMap((p) => p.tools));
  const listed = new Set(projects.map((p) => p.slug));
  const seen = new Set();
  for (const layer of x.stack) {
    for (const [tool, note, needs] of layer.tools) {
      if (seen.has(tool)) fail(`${tool} is in the stack twice`);
      seen.add(tool);
      if (!note) fail(`${tool} has no note`);
      if (!marks.has(tool) && !TYPESET.has(tool)) fail(`${tool} has no mark and is not a tool the site sets in type`);
      if (marks.has(tool) && !brandOf(tool)) fail(`no brand colour for ${tool}`);
      if (!used.has(tool)) {
        const e = EVIDENCE[tool];
        const ok = e === 'code-nodes' ? projects.some((p) => GRAPHS[p.slug]?.workflows.some((w) => w.nodes.some((nd) => nd[3] === 'code')))
          : e === 'package.json' ? Boolean(x.self && pkg.dependencies?.[tool.toLowerCase()])
          : Array.isArray(e) ? (e.every((s) => recs.has(s)) ? e.every((s) => listed.has(s)) : e.some((t) => used.has(t)))
          : false;
        if (!ok) fail(`${tool} is in the stack, but no project on the page uses it and EVIDENCE does not place it`);
      }
      for (const [slug, phrases] of Object.entries(needs || {})) {
        if (!listed.has(slug)) fail(`${tool}'s note cites ${slug}, which is not on the page`);
        for (const n of phrases) if (!recs.get(slug).blob.includes(n)) fail(`${tool}'s note rests on “${n}”, which ${slug}'s page no longer says`);
      }
    }
  }
  if (x.slug === 'ai-automation' && !projects.every((p) => p.tools.includes('n8n'))) fail('the n8n note says every system here runs on it; one does not');

  /* what he offers beyond the stack: on the Integrations page, and not above */
  for (const t of x.also || []) {
    if (seen.has(t)) fail(`${t} is in the stack and in "also"`);
    if (!INTEGRATIONS.some((g) => g.tools.some(([name]) => name === t))) fail(`${t} is offered here but is not on the Integrations page`);
  }
  return projects;
}

/* ---- the page's parts ---------------------------------------------------- */

const arrow = (size = 16) => `<svg class="sy" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const arrowDown = '<svg class="sy" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
const dotFull = '<svg class="mk" width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="5"/></svg>';
const dotRing = '<svg class="mk" width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
const sized = (svg, px) => svg.replace(/width="\d+" height="\d+"/, `width="${px}" height="${px}"`);
const brandOf = (tool) => BRAND[tool] || EXTRA_BRAND[tool] || DRAWN_BRAND[tool];

const section = (n, label, inner, { id, cls = '' } = {}) =>
  `<section class="run${cls ? ` ${cls}` : ''}"${id ? ` id="${id}"` : ''}>
      <span class="snode" aria-hidden="true"></span><h2 class="label-m slabel">${pad(n)} — ${label}</h2>
      <div class="wrap">${inner}</div>
    </section>`;

function counts(x, projects) {
  const total = projects.length + (x.self ? 1 : 0);
  const built = projects.filter((p) => p.prov === 'Built').length;
  return { total, built, delivered: total - built, word: WORDS[total] || String(total) };
}

/* "14 systems · 7 delivered · 7 built": the head of the page prints it, and
   since 2026-10-08 so does the page's card on the home page (pile.js), from
   this one function, so the two cannot disagree. */
function factsOf(x, projects) {
  const c = counts(x, projects);
  const [one, many] = x.noun || ['system', 'systems'];
  return [`<span>${c.total} ${c.total === 1 ? one : many}</span>`,
    c.built ? `<span>${dotFull}${c.delivered} delivered</span>` : `<span>${dotFull}all delivered</span>`,
    ...(c.built ? [`<span>${dotRing}${c.built} built</span>`] : [])].join('');
}

function head(x, projects, picture) {
  return `<div class="wrap ex-top">
      <p class="label ex-crumb"><a href="/#expertise">Expertise</a> &nbsp;/&nbsp; <span>${pad(x.n)}</span></p>
      <div class="ex-head">
        <div>
          <h1 class="serif">${esc(x.title)}</h1>
          <p class="body">${esc(x.lede)}</p>
          <p class="label-m ex-facts">${factsOf(x, projects)}</p>
          <p class="ex-cta"><a class="ex-jump" href="#book-a-call">Book a call ${arrowDown}</a></p>
        </div>
        <div class="ex-pic pic pic--${picture[0]}">${picture[1]}</div>
      </div>
    </div>`;
}

/* The stack, as cards that turn (the Integrations page's card, so its
   styles, its arrival and its phone layout are that page's): a tool's mark
   in its brand's colour, its name, and the layer of the stack it belongs
   to; on the back, what it is used for. A tool with no published mark is
   set in type. */
function stack(n, x, marks) {
  const tool = (layer) => ([name, note]) => {
    const svg = marks.get(name);
    const front = svg
      ? `<span class="mark">${svg}</span><h3 class="nm">${esc(name)}</h3>`
      : `<h3 class="nm type">${esc(name)}</h3>`;
    return `<li class="icard" tabindex="0"${svg ? ` style="--brand:${brandOf(name)}"` : ''}><div class="flip">`
      + `<div class="side front">${front}<p class="lay">${esc(layer)}</p></div>`
      + `<div class="side back"><p class="bt" aria-hidden="true">${svg || ''}<span>${esc(name)}</span></p><p class="tx">${esc(note)}</p></div>`
      + `</div></li>`;
  };
  const cards = x.stack.flatMap((l) => l.tools.map(tool(l.label))).join('');

  let also = '';
  if (x.also?.length) {
    const pill = (name) => {
      const g = INTEGRATIONS.find((grp) => grp.tools.some(([t]) => t === name));
      const svg = marks.get(name);
      return `<li><a class="ex-pill" href="/integrations/#${g.id}"${svg ? ` style="--brand:${brandOf(name)}"` : ''}>${svg ? sized(svg, 15) : ''}${esc(name)}</a></li>`;
    };
    also = `<div class="ex-also">
          <h3 class="label">Also offered</h3>
          <ul class="ex-pills">${x.also.map(pill).join('')}</ul>
          <p class="small ex-also-note">What each of these covers is on the <a class="link" href="/integrations/">Integrations</a> page.</p>
        </div>`;
  }
  const [, many] = x.noun || ['system', 'systems'];
  return section(n, 'Tools and stack', `<p class="body ex-intro">What this work is built on. Every tool below is part of at least one of the ${many} further down this page.<span class="int-hint"> <span class="if-hover">Hover</span><span class="if-touch">Tap</span> a card to see what it is used for.</span></p>
        <ul class="icards ex-stack">${cards}</ul>
        ${also}`, { id: 'stack' });
}

/* The projects, as the cards /work/ shows: each system's cover, and the line
   that says what it shows about this expertise. The one project that is not
   a system — this site — has a scene of its own, and no link. */
function cards(list, marks) {
  return list.map(({ p, line }) => (p.row
    ? projectCard({ ...p.row, tools: p.tools, href: p.href }, marks, { line: esc(line) })
    : projectCard({ slug: 'site', prov: p.prov, groupTitle: esc(p.sub.split(' · ')[0]), name: esc(p.name), dot: p.dot, col3: p.col3, tools: p.tools, href: null },
      marks, { line: esc(line), cover: siteCover() }))).join('\n        ');
}

function booking(n, x) {
  const b = x.book;
  return section(n, 'Book a call', `<div class="more ex-book">
          <div class="more-say"><h3 class="more-h serif" id="book">${esc(b.h)}</h3><p class="body ex-book-p">${esc(b.p)}</p></div>
          <form class="more-form" action="mailto:${site.email}?subject=${encodeURIComponent(b.subject)}" method="post" enctype="text/plain">
            <label class="q" for="book-msg">${esc(b.q)}</label>
            <textarea id="book-msg" name="Message" rows="6" required placeholder="${esc(b.ph)}"></textarea>
            <button class="send" type="submit">Book an appointment ${arrow(16)}</button>
            <p class="note">This opens your email app with your message, addressed to <a class="link" href="mailto:${site.email}">${site.email}</a>.</p>
          </form>
        </div>`, { id: 'book-a-call', cls: 'ex-booking' });
}

function others(x) {
  const links = EXPERTISE.filter((o) => o.slug !== x.slug)
    .map((o) => `<li><a class="ex-pill ex-other" href="/expertise/${o.slug}/"><span class="mono">${pad(o.n)}</span>${esc(o.title)}</a></li>`).join('');
  return `<section class="run ex-end">
      <span class="snode ghost" aria-hidden="true"></span><h2 class="label-m slabel" style="color:var(--ink3)">More expertise</h2>
      <div class="wrap"><ul class="ex-pills ex-others">${links}</ul></div>
    </section>`;
}

/* ---- the page ------------------------------------------------------------ */

const find = (slug) => {
  const x = EXPERTISE.find((e) => e.slug === slug);
  if (!x) throw new Error(`expertise: no page ${slug}`);
  return x;
};
const allMarks = (home) => new Map([...toolMarks(home), ...integrationMarks(), ...expertiseMarks()]);

/* The nav, with Expertise as the current section: these pages hang off the
   home page's "What I do", which is where that link goes. */
function navFor(work) {
  let found = 0;
  const nav = cut(work, '<nav class="nav"', '</nav>')
    .replace(/ aria-current="page"/g, '')
    .replace(/<a href="\/#expertise">Expertise<\/a>/g, () => { found++; return '<a href="/#expertise" aria-current="true">Expertise</a>'; });
  if (found !== 2) throw new Error(`expertise: expected the Expertise link twice (row and phone menu), found ${found}`);
  return withBrandMark(withIntegrationsLink(nav));
}

export function expertisePage(slug, { work, home, system, sector }) {
  const x = find(slug);
  const marks = allMarks(home);
  const recs = records({ work, system, sector });
  const projects = check(x, recs, marks);

  const picture = expertisePictures(home, { described: true, first: true })[x.card];
  if (!picture) throw new Error(`expertise: no picture for the card "${x.card}"`);

  const lineOf = new Map(x.projects.map(([s, line]) => [s, line]));
  const list = projects.sort((a, b) => a.n - b.n).map((p) => ({ p, line: lineOf.get(p.slug) }));
  const delivered = list.filter(({ p }) => p.prov === 'Delivered'), built = list.filter(({ p }) => p.prov === 'Built');
  if (x.self) {
    delivered.push({ line: x.self.line, p: { ...x.self, prov: 'Delivered', dot: recs.get(PORTED.slug).dot, href: null,
      col3: `<div class="fig">${esc(x.self.fig)}</div><div class="src">${esc(x.self.src)}</div>` } });
  }

  let n = 1;
  const parts = [head(x, projects, picture), stack(n++, x, marks)];
  parts.push(section(n++, 'Delivered', `<div class="gallery ex-gallery">
        ${cards(delivered, marks)}
        </div>`, { id: 'delivered' }));
  if (built.length) {
    parts.push(section(n++, 'Built, not yet deployed', `<p class="small ex-built-note">The workflow JSON is in the repository and imports into n8n; the node counts are taken from it. None of these has yet run against live accounts.</p>
        <div class="gallery ex-gallery">
        ${cards(built, marks)}
        </div>`, { id: 'built' }));
  }
  parts.push(booking(n++, x), others(x));

  return `<div class="page">
${navFor(work)}
<main id="main" class="ex">
  <div class="body-run">
    <span class="spine" aria-hidden="true"></span>
    ${parts.join('\n\n    ')}
  </div>
</main>
${cut(work, '<footer>', '</footer>')}
</div>`;
}

/* For the route: every slug, and what each page's head needs. */
export const SLUGS = EXPERTISE.map((x) => x.slug);

/* For the home page's card: the page's own counts, checked against their
   sources exactly as the page is. */
export function expertiseFacts(slug, { work, home, system, sector }) {
  const x = find(slug);
  return factsOf(x, check(x, records({ work, system, sector }), allMarks(home)));
}
export function expertiseMeta(slug, { work, home, system, sector }) {
  const x = find(slug);
  const recs = records({ work, system, sector });
  const projects = check(x, recs, allMarks(home));
  return {
    title: `${x.title} — Syed Ali Hamad Gilani`,
    description: x.description(counts(x, projects)),
    name: x.title,
    tools: x.stack.flatMap((l) => l.tools.map(([t]) => t)),
    projects: projects.sort((a, b) => a.n - b.n).map((p) => ({ name: p.name, href: p.href })),
  };
}
