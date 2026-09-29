/* mark.js — the AtoZ mark, with his photo beside it, in every page's nav
   (2026-09-29).

   Syed: "Now make a logo for me. The Company name is AtoZ. Logo should be
   branded. And it will be placed in the place of Gilani at the top. Along
   with the logo, I will give you a picture of mine, and also place the
   picture frame (ROUNDED) the same size of logo (Short size).... Side by
   side.... a part of the picture frame overlapping on the logo". How it got
   here, each round rendered in the nav and shown to him:
     - wordmarks in pills — "No not like this. I want a round brand logo.....
       Simple and professional";
     - round letter badges (AZ, A–Z) — "Dont write A to Z explicitly. Make
       some symbolic logo.";
     - symbols; he liked the Peak, a small network — "It should symbolize both
       A and Z hiddenly";
     - the Peak with both letters worked in — "seems like someone just tried
       to stuff both letters in it. Make something natural";
     - then he sent a reference, an elegant fine-line monogram in a ring ("Like
       something elegant like this"; "Dont use gold.... Use maroon, and
       white"), and chose this drawing, white on maroon.

   The drawing, in 48 units: a ring; an A whose legs run out to meet it; a
   stroke that curls in from the left and flows into the apex; and the
   crossbar, which runs on past the right leg into a curl. The Z is in there,
   unwritten: the curled stroke is its top, the A's left leg from the apex down
   to the crossbar its diagonal, the crossbar its foot. The photo overlaps the
   badge's right edge by 6px (brand.css), so the curl that ends the Z is kept
   clear of it.

   Built at build time like the site's other additions: the ported pages keep
   their "Gilani" mark and this swaps it, throwing unless it finds it once.
   The photo is scripts/make-avatar.py's crop of the portrait he supplied. */

const MAROON = '#9C3712', WHITE = '#FBFAF7';   // theme.css --accent and --on-accent
const f = (n) => (Math.round(n * 100) / 100).toString();

function monogram(w = 1.5) {
  const C = 24, R = 20.6;                      // the ring
  const apex = [24, 9.2], by = 38.2;           // the apex, and where the legs meet the ring
  const half = Math.sqrt(R * R - (by - C) ** 2);
  const left = [C - half, by], right = [C + half, by];
  const cy = 27.2;                             // the crossbar
  const cl = apex[0] + (left[0] - apex[0]) * ((cy - apex[1]) / (by - apex[1]));
  const legs = `M${f(left[0])} ${f(left[1])} L${f(apex[0])} ${f(apex[1])} L${f(right[0])} ${f(right[1])}`;
  // in from the left, curling down and back into itself: the Z's top
  const top = `M${f(apex[0])} ${f(apex[1])} H15.4 C11.3 ${f(apex[1])} 10.2 14.1 13 14.9 C15.3 15.5 16.3 13 14.6 12.3`;
  // on past the right leg, curling up and back: the Z's foot
  const foot = `M${f(cl)} ${f(cy)} H32.4 C35.6 ${f(cy)} 36.4 23.4 34.3 22.8 C32.6 22.3 31.9 24.3 33.3 24.8`;
  return `<svg class="em" viewBox="0 0 48 48" aria-hidden="true" focusable="false">`
    + `<circle cx="24" cy="24" r="24" fill="${MAROON}"/>`
    + `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="${WHITE}" stroke-width="${f(w * 0.8)}"/>`
    + `<g fill="none" stroke="${WHITE}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">`
    + `<path d="${legs}"/><path d="${top}"/><path d="${foot}"/></g></svg>`;
}

export const MARK = monogram();

const GILANI = '<a class="mark" href="/"><i aria-hidden="true"></i><b>Gilani</b></a>';
const PHOTO = '<img class="me" src="/photos/syed-96.webp" srcset="/photos/syed-96.webp 96w, /photos/syed-144.webp 144w" '
  + 'sizes="(max-width: 719px) 36px, 40px" width="40" height="40" alt="" decoding="async">';

export function withBrandMark(page) {
  const found = page.split(GILANI).length - 1;
  if (found !== 1) throw new Error(`mark: expected the Gilani mark once, found ${found}`);
  return page.replace(GILANI, `<a class="mark" href="/" aria-label="AtoZ — Syed Ali Hamad Gilani, home">${MARK}${PHOTO}</a>`);
}
