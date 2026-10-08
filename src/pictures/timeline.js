/* timeline.js — the home page's experience, drawn to scale (2026-10-04).

   The section was a list: six roles, 247 words, no picture (measured on the
   built page). In the proposal he approved it is a timeline: one column a
   month from his first role to the month the site was built, a bar for each
   role across the months it covers, and beside the roles that produced
   systems on this site, those systems' covers, each opening its page.

   Nothing is typed here that the ported section does not say:

   - the roles, their organisations, their sentences and their tool marks
     are the ported <li>s, moved, not rewritten;
   - each bar is computed from the role's own dates ("Mar 2025 — now",
     "Aug — Sep 2026"), and "now" is the month of the build;
   - a system sits beside a role only where that role's own text names it:
     PRODUCED gives the phrase, and the build throws if the phrase is gone.
     The two short contracts name no system on the register, so they show
     none.

   Rows run from the earliest start to the latest, so the bars read as a
   chart. A thumbnail is the system's cover (src/systems/cover.js), small.
   home.html stays as ported; styles are src/styles/timeline.css. */

import { systemCover } from '../systems/cover.js';
import { registerRows, text } from '../work/register.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* organisation (the first part of the role's "org" line) -> the systems it
   produced, each with the phrase of the role's own text that says so */
const PRODUCED = {
  'Independent': [
    ['lead-to-cash-crm', 'a lead-to-cash CRM for three contracting companies'],
    ['shopify-support-automation', 'a Shopify support inbox handled end to end'],
    ['construction-lead-outreach', 'reply-aware outreach'],
    ['labor-law-outreach', 'reply-aware outreach'],
  ],
  'Yelu Marketing': [['adwash', 'its own Google Ads product, AdWash']],
  'BBAIM Academy': [['aesthetics-voice-agent', 'Five AI voice agents']],
  'Just Grade Metrics': [['just-grade-metrics', 'Just Grade Metrics']],
};

/* "Mar 2025 — now" / "Aug — Sep 2026" -> [first month, last month], counted
   in months from January of year 0; `now` for a role that continues */
function span(when, now) {
  const m = when.match(/^([A-Z][a-z]{2})(?: (\d{4}))? [–—] (?:(now)|([A-Z][a-z]{2}) (\d{4}))$/);
  if (!m) throw new Error(`timeline: cannot read the dates "${when}"`);
  const month = (name) => {
    const i = MONTHS.indexOf(name);
    if (i === -1) throw new Error(`timeline: "${name}" is not a month`);
    return i;
  };
  const endYear = m[3] ? null : Number(m[5]);
  const startYear = m[2] ? Number(m[2]) : endYear;
  if (startYear == null) throw new Error(`timeline: "${when}" has no year`);
  const a = startYear * 12 + month(m[1]);
  const b = m[3] ? now : endYear * 12 + month(m[4]);
  if (b < a) throw new Error(`timeline: "${when}" ends before it starts`);
  return { a, b, live: Boolean(m[3]) };
}

export function withTimeline(page, { work }, today = new Date()) {
  const sec = page.match(/<section class="sec" id="experience">[\s\S]*?<\/section>/);
  if (!sec) throw new Error('timeline: the experience section was not found');
  const list = sec[0].match(/<ul class="xp">([\s\S]*?)<\/ul>/);
  if (!list) throw new Error('timeline: the list of roles was not found');
  const now = today.getFullYear() * 12 + today.getMonth();
  const names = registerRows(work);

  const roles = [...list[1].matchAll(/<li class="rv">([\s\S]*?)<\/li>/g)].map(([, body], i) => {
    const one = (re, what) => {
      const m = body.match(re);
      if (!m) throw new Error(`timeline: role ${i + 1} has no ${what}`);
      return m[1];
    };
    const when = one(/<div class="when">([^<]+)<\/div>/, 'dates');
    const h3 = one(/<h3>([\s\S]*?)<\/h3>/, 'title');
    const org = one(/<p class="org">([\s\S]*?)<\/p>/, 'organisation');
    const say = one(/<\/p><p>([\s\S]*?)<\/p>/, 'sentence');
    const stack = (body.match(/<span class="stack">[\s\S]*<\/span>(?=<\/div>)/) || [''])[0];
    return { i, when, h3, org, say, stack, ...span(when.trim(), now), key: text(org).split(' · ')[0] };
  });
  if (roles.length !== 6) throw new Error(`timeline: expected six roles, found ${roles.length}`);
  for (const key of Object.keys(PRODUCED)) if (!roles.some((r) => r.key === key)) throw new Error(`timeline: no role at "${key}"`);

  const first = Math.min(...roles.map((r) => r.a));
  const cols = now - first + 1;
  const col = (month) => month - first + 1;            // 1-based grid line

  /* the years across the top, each over its own months */
  const years = [];
  for (let y = Math.floor(first / 12); y <= Math.floor(now / 12); y++) {
    const a = Math.max(first, y * 12), b = Math.min(now, y * 12 + 11);
    years.push({ y, a: col(a), b: col(b) + 1 });
  }
  const ticks = years.slice(1).map((yr) => `<i style="grid-column:${yr.a}"></i>`).join('');

  const thumb = ([slug, phrase], role) => {
    if (!`${text(role.org)} ${text(role.say)}`.includes(phrase)) throw new Error(`timeline: "${role.key}" no longer says “${phrase}”, which placed ${slug} beside it`);
    const row = names.get(slug);
    if (!row) throw new Error(`timeline: ${slug} is not on the register`);
    const c = systemCover(slug);
    const name = text(row.name).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    return `<a class="tl-thumb pic--${c.pigment}" href="/work/${slug}/" title="${name}" aria-label="${name}">${c.html}</a>`;
  };

  const rows = [...roles].sort((x, y) => x.a - y.a || x.i - y.i).map((r) => {
    const made = PRODUCED[r.key] || [];
    const thumbs = made.length ? `<div class="tl-thumbs">${made.map((m) => thumb(m, r)).join('')}</div>` : '';
    return `<li class="tl-row rv">
      <div class="tl-who"><h3>${r.h3}</h3><p class="org">${r.org}</p><div class="when">${r.when}</div>${r.stack}</div>
      <div class="tl-track" aria-hidden="true">${ticks}<span class="tl-bar${r.live ? ' now' : ''}" style="grid-column:${col(r.a)} / ${col(r.b) + 1}"></span></div>
      <div class="tl-did">${thumbs}<p>${r.say}</p></div>
    </li>`;
  });

  const axis = `<div class="tl-axis" aria-hidden="true"><p class="tl-key"><span><i class="now"></i>to now</span><span><i></i>finished</span></p>`
    + `<div class="tl-years">${years.map((yr) => `<span style="grid-column:${yr.a} / ${yr.b}">${yr.y}</span>`).join('')}</div></div>`;

  const out = sec[0].replace(list[0], `<div class="tl" style="--cols:${cols}">
    ${axis}
    <ol class="tl-rows">
    ${rows.join('\n    ')}
    </ol>
  </div>`);
  return page.replace(sec[0], out);
}
