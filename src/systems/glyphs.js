/* glyphs.js — the line icons on the system pages (2026-09-30).

   24-unit drawings in the site's icon style: one stroke weight, round caps,
   no fills, so they take the accent from `currentColor` like the icons the
   ported pages already draw (the guards, the architecture). Each names a
   thing a step does, never a vendor: the vendors' own marks are the tool
   badges at the foot of a page. */

export const GLYPHS = {
  phone: '<path d="M6 3.5h3l1.6 4.3-2.1 1.3a11 11 0 0 0 6.4 6.4l1.3-2.1 4.3 1.6v3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4 5.6 2 2 0 0 1 6 3.5z"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  mail: '<rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="m3 7.5 9 6 9-6"/>',
  send: '<path d="M21 3 3 10.5l7 3 3 7.5z"/><path d="m10 13.5 4.5-4.5"/>',
  chat: '<path d="M4 5h16v10H9l-5 4z"/>',
  message: '<path d="M4 5h16v10H9l-5 4z"/><path d="M8 9.5h8M8 12h5"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  sheet: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18M3 14.5h18M9 9v11"/>',
  db: '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  folder: '<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/>',
  spark: '<path d="m12 3 2.2 5.3L19.5 10.5l-5.3 2.2L12 18l-2.2-5.3L4.5 10.5l5.3-2.2z"/>',
  route: '<path d="M4 12h5"/><path d="m9 12 4-6h7"/><path d="m9 12 4 6h7"/>',
  shield: '<path d="M12 3 5 6v5.5c0 4.2 3 7.6 7 9.5 4-1.9 7-5.3 7-9.5V6z"/><path d="m9 12 2.2 2.2L15 10.4"/>',
  check: '<circle cx="12" cy="12" r="8"/><path d="m8.5 12 2.5 2.5 4.5-4.5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20.5a7 7 0 0 1 14 0"/>',
  users: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><circle cx="16.5" cy="9" r="2.5"/><path d="M15.5 14.2a5 5 0 0 1 5 5.3"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
  loop: '<path d="M19.5 9A8 8 0 0 0 5.2 7.3L4 9"/><path d="M4 4.5V9h4.5"/><path d="M4.5 15a8 8 0 0 0 14.3 1.7L20 15"/><path d="M20 19.5V15h-4.5"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  alert: '<path d="M12 3.5 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2v.3"/>',
  card: '<rect x="3" y="6" width="18" height="13" rx="1.5"/><path d="M3 10h18M7 15h4"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  chart: '<path d="M3 20.5h18M6 20.5v-7M11 20.5V6M16 20.5v-10"/>',
  sum: '<path d="M17 5H7l6 7-6 7h10"/>',
  hash: '<path d="M5 9h14M5 15h14M10 4 8.5 20M15.5 4 14 20"/>',
  merge: '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
  filter: '<path d="M4 5h16l-6.2 7.2v6.1L10.2 20v-7.8z"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
  quote: '<path d="M6.5 7.5h4v4c0 3-1.7 4.8-4 5.3M13.5 7.5h4v4c0 3-1.7 4.8-4 5.3"/>',
  weather: '<circle cx="8.5" cy="8.5" r="3"/><path d="M8.5 2.5V4M3 8.5H1.8M4.6 4.6l1 1M12.4 4.6l-1 1"/><path d="M8 20h9.5a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.4 1.3A2.9 2.9 0 0 0 8 20z"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12h.01"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  browser: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 8.5h18M6.2 6.2h.01M8.7 6.2h.01"/><path d="m11 12 1.8 6 1.1-2.4 2.4-1.1z"/>',
  list: '<path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01"/>',
  scissors: '<circle cx="6.5" cy="7" r="2.5"/><circle cx="6.5" cy="17" r="2.5"/><path d="m8.6 8.5 11 8M8.6 15.5l11-8"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  upload: '<path d="M12 15.5V4M7 8.5l5-5 5 5"/><path d="M4 15v4.5h16V15"/>',
  download: '<path d="M12 4v11.5M7 10.5l5 5 5-5"/><path d="M4 15v4.5h16V15"/>',
  box: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  wave: '<path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 11v2"/>',
  diff: '<rect x="3" y="4" width="8" height="16" rx="1.2"/><rect x="13" y="4" width="8" height="16" rx="1.2"/><path d="M5.5 9h3M15.5 9h3M15.5 13h3M5.5 13h1"/>',
  split: '<path d="M4 12h6"/><path d="M10 12 20 5M10 12l10 7M10 12h10"/>',
  map: '<path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8.5-8.5M16.5 6.5 19 9M14.5 8.5 16.5 10.5"/>',
};

/* An icon at a size, in the site's stroke style. */
export function glyph(name, size = 20) {
  const d = GLYPHS[name];
  if (!d) throw new Error(`glyphs: no icon named ${name}`);
  return `<svg class="sy" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" `
    + `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}
