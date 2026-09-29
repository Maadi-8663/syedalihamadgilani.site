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

import { GROUPS, TYPESET, CUSTOM } from './tools.js';
import { toolMarks } from '../pictures/cluster.js';
import { integrationMarks } from './marks.js';
import { BRAND } from '../pictures/brands.js';
import { withIntegrationsLink } from './nav.js';
import { withBrandMark } from '../brand/mark.js';
import { site } from '../data/site.js';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const cut = (page, open, close) => {
  const a = page.indexOf(open), b = page.indexOf(close, a);
  if (a === -1 || b === -1) throw new Error(`integrations: ${open} not found in work.html`);
  return page.slice(a, b + close.length);
};

export function integrationsPage({ work, home }) {
  const marks = new Map([...toolMarks(home), ...integrationMarks()]);

  const card = ([name, text]) => {
    if (CUSTOM[name]) {
      /* not a vendor's tool: its own line icon, in the one accent */
      const icon = '<svg class="sy" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" '
        + `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CUSTOM[name]}</svg>`;
      return `<li class="icard custom" tabindex="0"><div class="flip"><div class="side front"><span class="mark">${icon}</span><h3 class="nm">${esc(name)}</h3></div>`
        + `<div class="side back"><p class="bt" aria-hidden="true">${icon}<span>${esc(name)}</span></p><p class="tx">${esc(text)}</p></div></div></li>`;
    }
    const typeset = TYPESET.has(name);
    const svg = marks.get(name);
    if (typeset === Boolean(svg)) {
      throw new Error(`integrations: ${name} ${typeset ? 'has a mark but is set in type' : 'has no mark in the cluster or marks.js'}`);
    }
    if (!typeset && !BRAND[name]) throw new Error(`integrations: no brand colour for ${name}`);
    const front = typeset
      ? `<div class="side front"><h3 class="nm type">${esc(name)}</h3></div>`
      : `<div class="side front"><span class="mark">${svg}</span><h3 class="nm">${esc(name)}</h3></div>`;
    const back = `<div class="side back"><p class="bt" aria-hidden="true">${typeset ? '' : svg}<span>${esc(name)}</span></p>`
      + `<p class="tx">${esc(text)}</p></div>`;
    return `<li class="icard" tabindex="0"${typeset ? '' : ` style="--brand:${BRAND[name]}"`}><div class="flip">${front}${back}</div></li>`;
  };

  const tools = (g) => g.tools.filter(([name]) => !CUSTOM[name]).length;
  const group = (g, i) => `<section class="group" id="${g.id}">
        <span class="snode" style="top:40px" aria-hidden="true"></span>
        <div class="ghead"><span class="ring"><svg class="sy " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${g.icon}</svg></span><h2>${esc(g.title)}</h2><span class="n">${String(i + 1).padStart(2, '0')} · ${tools(g)} ${tools(g) === 1 ? 'TOOL' : 'TOOLS'}</span></div>
        <ul class="icards">${g.tools.map(card).join('')}</ul>
      </section>`;

  /* The close (his words, 2026-09-29: "And a lot more. Book an appointment to
     get your manual tasks automated... And add the place for writing"). The
     site ships no JavaScript and has no form back end, so the writing goes
     out as email: the browser turns the form into a message in the visitor's
     own email app, and the note says so. Measured in Chrome, 2026-09-29: as
     a GET form it wrote every space as "+" ("Hi+Syed,"); as plain text, below,
     spaces survive and the subject comes from the address, at the price of a
     "Message=" before the text and a line break where someone types "&". */
  const close = `<section class="more" aria-labelledby="more">
        <div class="more-say"><h2 class="more-h serif" id="more">And a lot more.</h2><p class="body rv">Book an appointment to get your manual tasks automated.</p></div>
        <form class="more-form rv" action="mailto:${site.email}?subject=Appointment%3A%20automating%20a%20manual%20task" method="post" enctype="text/plain">
          <label class="q" for="more-msg">What should be automated?</label>
          <textarea id="more-msg" name="Message" rows="6" required placeholder="The task, how often it happens, and the tools it touches. For example: every new web lead is copied into the CRM by hand, then sent a quote."></textarea>
          <button class="send" type="submit">Book an appointment <svg class="sy" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
          <p class="note">This opens your email app with your message, addressed to <a class="link" href="mailto:${site.email}">${site.email}</a>.</p>
        </form>
      </section>`;

  const nav = withBrandMark(withIntegrationsLink(cut(work, '<nav class="nav"', '</nav>'), { current: true }));
  return `<div class="page">
${nav}
<main id="main" class="reg">
  <div class="body-run">
    <span class="spine" aria-hidden="true"></span>
    <div class="wrap" style="padding-top:64px">
      <p class="label">Integrations</p>
      <h1 class="serif" style="font-size:clamp(48px,6.6vw,96px);line-height:1;margin-top:20px">Your tools, working together.</h1>
      <div class="reg-head">
        <p class="body" style="max-width:760px">The platforms, services and frameworks I connect and build with, grouped by the job they do.<span class="int-hint"> <span class="if-hover">Hover</span><span class="if-touch">Tap</span> a card to see what each integration covers.</span></p>
      </div>
      ${GROUPS.map(group).join('')}
      ${close}
    </div>
  </div>
</main>
${cut(work, '<footer>', '</footer>')}
</div>`;
}
