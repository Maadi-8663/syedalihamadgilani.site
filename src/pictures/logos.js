/* logos.js — every brand mark the pictures draw, as path data (2026-10-04).

   Syed, of the workflow drawings: "These workflows still use the empty
   nodes. Use real logos of the relevant nodes insted." And the pictures that
   cover each project (scenes.js) show the tools a system is built from by
   their own marks. Both read their marks from here.

   Most are already in the repo — the home cluster's (cluster.js), the
   Integrations page's and the expertise pages' (their marks.js) — and are
   collected, not copied again. Two more kinds are added:

     SI      a mark Simple Icons v16.29.0 publishes (CC0) that no page used
             until now. Copied in, not imported, for the reason brands.js
             gives; scripts/check-marks.mjs re-checks it against the package
             while that is still in node_modules.
     DRAWN   a mark Simple Icons no longer publishes: OpenAI, Slack, Twilio
             and LinkedIn. n8n draws each of these on its own node, so a
             workflow drawn with real logos needs them. OpenAI's and
             LinkedIn's are the paths Simple Icons published before it
             dropped them; Slack's is its four-colour mark on the same
             published geometry; Twilio's is constructed (a ring and four
             dots: its whole mark). Rendered and compared by eye, 2026-10-04.

   A mark is { parts: [[fill, path], …], back? }: one part in the brand's
   colour for all but Slack, and `back` where the mark needs a ground of its
   own (JavaScript's black letters on its yellow). Colours are brands.js's.
   The home cluster still shows only marks with evidence AND a published
   mark: nothing here changes what is in it. */

import { toolMarks } from './cluster.js';
import { BRAND } from './brands.js';
import { EXTRA as INTEGRATIONS } from '../integrations/marks.js';
import { EXTRA as EXPERTISE } from '../expertise/marks.js';

export const SI = [
  { label: 'Buffer', slug: 'buffer', hex: '#231F20',
    path: 'M1.371 5.476L11.943 0l10.686 5.476-10.686 5.495zm3.36 4.81l7.212 3.547 7.288-3.547 3.398 1.655-10.686 5.202L1.371 11.94zm0 6.171l7.212 3.911 7.288-3.91 3.398 1.815L11.943 24 1.371 18.273z' },
];

export const DRAWN = {
  OpenAI: [['#000000', 'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z']],
  Slack: [
    ['#E01E5A', 'M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z'],
    ['#36C5F0', 'M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z'],
    ['#2EB67D', 'M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z'],
    ['#ECB22E', 'M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z'],
  ],
  Twilio: [['#F22F46', 'M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm0 3.2a8.8 8.8 0 1 1 0 17.6 8.8 8.8 0 0 1 0-17.6zM9.04 6.56a2.48 2.48 0 1 0 0 4.96 2.48 2.48 0 0 0 0-4.96zm5.92 0a2.48 2.48 0 1 0 0 4.96 2.48 2.48 0 0 0 0-4.96zm-5.92 5.92a2.48 2.48 0 1 0 0 4.96 2.48 2.48 0 0 0 0-4.96zm5.92 0a2.48 2.48 0 1 0 0 4.96 2.48 2.48 0 0 0 0-4.96z']],
  LinkedIn: [['#0A66C2', 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z']],
};

/* label -> mark, for every mark the site has. `home` is home.html, which
   holds the ported cluster's nineteen. */
export function logoSet(home) {
  const set = new Map();
  for (const [label, svg] of toolMarks(home)) {
    const d = svg.match(/<path d="([^"]+)"/);
    if (!d) throw new Error(`logos: the cluster's mark for ${label} has no path`);
    if (!BRAND[label]) throw new Error(`logos: no brand colour for ${label}`);
    const back = svg.match(/<rect [^>]*fill="(#[0-9a-fA-F]+)"/);
    set.set(label, { parts: [[BRAND[label], d[1]]], ...(back ? { back: back[1] } : {}) });
  }
  for (const t of INTEGRATIONS) {
    if (!BRAND[t.label]) throw new Error(`logos: no brand colour for ${t.label}`);
    set.set(t.label, { parts: [[BRAND[t.label], t.path]] });
  }
  for (const t of [...EXPERTISE, ...SI]) set.set(t.label, { parts: [[t.hex, t.path]] });
  for (const [label, parts] of Object.entries(DRAWN)) set.set(label, { parts });
  return set;
}

/* a mark as SVG, `size` units square with its corner at (x, y) */
export function logoSvg(set, label, x, y, size, fill) {
  const m = set.get(label);
  if (!m) throw new Error(`logos: no mark for "${label}"`);
  const k = Math.round((size / 24) * 1000) / 1000;
  return `<g transform="translate(${x} ${y}) scale(${k})">`
    + (m.back ? `<rect x="1" y="1" width="22" height="22" fill="${m.back}"/>` : '')
    + m.parts.map(([c, d]) => `<path fill="${fill || c}" d="${d}"/>`).join('') + '</g>';
}
