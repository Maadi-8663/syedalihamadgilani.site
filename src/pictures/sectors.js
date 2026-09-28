/* sectors.js — the sector cards at the foot of the home page (2026-09-28).

   Syed asked for the six sectors, until then a list of icon rows, to become
   cards: "one box for each with some appropriate backgrounds or pictures". Each
   card is a photograph of the kind of place the systems run in, and he approved
   the six below by name before they were downloaded. They are the photos his
   Notion catalogue already matched to these systems (catalog/covers.json),
   free under the Unsplash licence, which asks for no credit; the credits are
   kept here anyway:

     workshop  Marine Le Gac      home services: tools on a workshop wall
     salon     Greg Trowman       medical aesthetics: a treatment room
     parcels   CHUTTERSNAP        e-commerce: a parcel warehouse
     lawbooks  Abhishek Tewari    legal services: 1894 Chancery law reports
     contract  Romain Dancre      B2B outbound: a contract being signed
     storm     Thula Na           software: a storm over a city, for AdWash,
                                  whose bids move with the weather

   They are crops made for the card (4:5), at 400px and 640px wide, in
   public/photos/. They are decorative, so their alt text is empty: the card's
   own words say what the card is.

   withSectorCards() puts a photo and an arrow into each of the six sector
   links in home.html at build time, and drops the old icon ring; home.html
   stays exactly as ported. It throws if the links change, rather than ship a
   card without its picture. */

const PHOTOS = {
  '/sectors/home-services/': 'workshop',
  '/work/#aesthetics-voice-agent': 'salon',
  '/work/#shopify-support-automation': 'parcels',
  '/work/#labor-law-outreach': 'lawbooks',
  '/work/#linkedin-lead-pipeline': 'contract',
  '/work/#product': 'storm',
};

const ARROW = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const photo = (name) =>
  `<span class="sect-photo"><img src="/photos/${name}-400.webp" srcset="/photos/${name}-400.webp 400w, /photos/${name}-640.webp 640w" ` +
  `sizes="(max-width: 1000px) 46vw, 300px" width="400" height="500" alt="" loading="lazy" decoding="async"></span>`;

export function withSectorCards(page) {
  let placed = 0;
  const out = page.replace(
    /<a class="sect rv" href="([^"]+)"><span class="ring">[\s\S]*?<\/span><span>(<b>[\s\S]*?<\/b><i>[\s\S]*?<\/i>)<\/span><\/a>/g,
    (m, href, text) => {
      const name = PHOTOS[href];
      if (!name) throw new Error(`sector cards: no photo for the sector link ${href}`);
      placed++;
      return `<a class="sect rv" href="${href}">${photo(name)}<span class="tx">${text}</span><span class="go">${ARROW}</span></a>`;
    },
  );
  if (placed !== Object.keys(PHOTOS).length) {
    throw new Error(`sector cards: placed ${placed} of ${Object.keys(PHOTOS).length} — the sector markup changed`);
  }
  return out;
}
