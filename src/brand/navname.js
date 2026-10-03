/* navname.js — his name, and its place in the home page's nav (2026-10-03).

   His words: "make also make the nav bar stick to the top(Not for the first
   viewport). One from there, we scroll up, the name should animatedly be
   shorter and go on the nav bar......." src/styles/navbar.css does the
   motion; this writes the two things it moves, at build time (there is
   still no JavaScript):

   - each line of the hero's name gets an inner box (b.hn) the scroll can
     move, so the line's own load-time rise (page-home.css, boot.css, on the
     spans) is left alone. The heading still reads "Syed Ali Hamad Gilani"
     in the HTML;
   - the nav gets its own copy of the name, one line, beside the mark —
     hidden from screen readers, which already hear the name from the mark's
     label and the heading;
   - the line above the name ("AI Automation Engineer & Web Developer") gets
     a box (div.eb) that fades as the name lifts off through it — on its
     own box for the same reason, its load-time rise is on the paragraph.

   Every pattern must match once, or the build throws. */

const H1 = '<h1><span>Syed Ali</span> <span>Hamad</span> <span>Gilani</span></h1>';
const MARK = /(<a class="mark" href="\/" aria-label="[^"]*">[\s\S]*?)(<\/a>)/;
const EYEBROW = /<p class="eyebrow">[^<]*<\/p>/g;

export function withNavName(page) {
  if (page.split(H1).length !== 2) throw new Error('navname: expected the hero\'s name once');
  page = page.replace(H1, '<h1><span><b class="hn hn1">Syed Ali</b></span> <span><b class="hn hn2">Hamad</b></span> <span><b class="hn hn3">Gilani</b></span></h1>');
  if ((page.match(EYEBROW) || []).length !== 1) throw new Error('navname: expected the hero\'s eyebrow once');
  page = page.replace(EYEBROW, '<div class="eb">$&</div>');
  if (!MARK.test(page)) throw new Error('navname: no mark in the nav');
  return page.replace(MARK, '$1<span class="navname" aria-hidden="true">Syed Ali Hamad Gilani</span>$2');
}
