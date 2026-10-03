# Syed Ali Hamad Gilani — portfolio

The source of **https://syedalihamadgilani.site** — AI automation engineer and
web developer.

Astro 5, static: twenty pages — sixteen of them one per system — and **zero
JavaScript shipped**. Every effect is CSS — items arrive one by one as the
page scrolls (cards stand up, logos turn over and are traced, rows are inked
in, photographs come out of depth), all of it scrubbed and reversible; on the
home page the first screen holds while the next slides over it, and the name
goes up into a nav that stays at the top. Scroll-driven animation timelines,
`:has()` filters, a CSS typewriter — and the phone layout is its own
design, not a shrunk desktop. The
expertise pictures, the workflow drawings and the phone diagrams are built at
build time from real workflow data, and the headings are split into words at
build time so they can rise word by word.

    npm install
    npm run build      # output in dist/

Deployed on Vercel from this repository: every push to `main` goes live.
