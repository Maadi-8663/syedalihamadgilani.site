/* page.js — the Integrations page (2026-09-29).

   Built here rather than ported: it has no Artifact. It wears the register's
   clothes so that it reads as part of the site — /work/'s nav and footer,
   taken from work.html at build time so they cannot drift apart, its spine,
   and its sticky group headers — and adds one thing, a card that flips. The
   front of each card is the tool's mark in its brand's colour (the marks are
   the home page cluster's, the colours brands.js's) or, for a tool with no
   published mark, its name set in type; the back says what connecting that
   tool does (tools.js).

   The flip is CSS (integrations.css): hover turns a card, and so does focus,
   for keyboards and for taps on a phone. All of the text is in the HTML from
   the first paint. This throws if a card would ship without its mark or its
   colour. */

import { GROUPS, TYPESET } from './tools.js';
import { toolMarks } from '../pictures/cluster.js';
import { BRAND } from '../pictures/brands.js';
import { withIntegrationsLink } from './nav.js';

export const TOOL_COUNT = GROUPS.reduce((n, g) => n + g.tools.length, 0);

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
  'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/* The count in words, as /work/ writes "Sixteen systems." */
export function spell(n) {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '');
  throw new Error(`integrations: no words for ${n}`);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const cut = (page, open, close) => {
  const a = page.indexOf(open), b = page.indexOf(close, a);
  if (a === -1 || b === -1) throw new Error(`integrations: ${open} not found in work.html`);
  return page.slice(a, b + close.length);
};

export function integrationsPage({ work, home }) {
  const marks = toolMarks(home);

  const card = ([name, text]) => {
    const typeset = TYPESET.has(name);
    const svg = marks.get(name);
    if (typeset === Boolean(svg)) {
      throw new Error(`integrations: ${name} ${typeset ? 'has a mark but is set in type' : 'has no mark in the cluster'}`);
    }
    if (!typeset && !BRAND[name]) throw new Error(`integrations: no brand colour for ${name}`);
    const front = typeset
      ? `<div class="side front"><h3 class="nm type">${esc(name)}</h3></div>`
      : `<div class="side front"><span class="mark">${svg}</span><h3 class="nm">${esc(name)}</h3></div>`;
    const back = `<div class="side back"><p class="bt" aria-hidden="true">${typeset ? '' : svg}<span>${esc(name)}</span></p>`
      + `<p class="tx">${esc(text)}</p></div>`;
    return `<li class="icard" tabindex="0"${typeset ? '' : ` style="--brand:${BRAND[name]}"`}><div class="flip">${front}${back}</div></li>`;
  };

  const group = (g, i) => `<section class="group" id="${g.id}">
        <span class="snode" style="top:40px" aria-hidden="true"></span>
        <div class="ghead"><span class="ring"><svg class="sy " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${g.icon}</svg></span><h2>${esc(g.title)}</h2><span class="n">${String(i + 1).padStart(2, '0')} · ${g.tools.length} ${g.tools.length === 1 ? 'TOOL' : 'TOOLS'}</span></div>
        <ul class="icards">${g.tools.map(card).join('')}</ul>
      </section>`;

  const count = spell(TOOL_COUNT);
  const nav = withIntegrationsLink(cut(work, '<nav class="nav"', '</nav>'), { current: true });
  return `<div class="page">
${nav}
<main id="main" class="reg">
  <div class="body-run">
    <span class="spine" aria-hidden="true"></span>
    <div class="wrap" style="padding-top:64px">
      <p class="label">Integrations</p>
      <h1 class="serif" style="font-size:clamp(48px,6.6vw,96px);line-height:1;margin-top:20px">${count[0].toUpperCase() + count.slice(1)} tools.</h1>
      <div class="reg-head">
        <p class="body" style="max-width:760px">The platforms, services and frameworks I connect and build with, grouped by the job they do.<span class="int-hint"> <span class="if-hover">Hover</span><span class="if-touch">Tap</span> a card to see what each integration covers.</span></p>
      </div>
      ${GROUPS.map(group).join('')}
    </div>
  </div>
</main>
${cut(work, '<footer>', '</footer>')}
</div>`;
}
