/* words.js — display headings, split into words at build time so the CSS in
   src/styles/motion.css can reveal them word by word (2026-09-28).

   There is still no JavaScript on the page. Each word stays real text in the
   HTML, wrapped in two spans — a mask (.w) and the word that rises inside it
   (carrying its index as --i) — and the spaces between words are kept, so the
   heading reads, wraps, copies and indexes exactly as before.

     withWords(page, [/<h2 class="say rv">/])            revealed on scroll
     withWords(page, [/<h1 class="serif"[^>]*>/], 'load') revealed on page load

   Each pattern matches the opening tag of the heading; the heading runs to its
   own closing tag (headings here never nest). A pattern that matches nothing
   throws, so a markup change cannot silently drop the effect. */

function wrapWords(inner) {
  let i = 0;
  return inner
    .split(/(<[^>]+>)/)
    .map((part) => (part.startsWith('<')
      ? part
      : part.replace(/\S+/g, (w) => `<span class="w"><span style="--i:${i++}">${w}</span></span>`)))
    .join('');
}

function addClass(open, cls) {
  return /\sclass="/.test(open)
    ? open.replace(/\sclass="([^"]*)"/, (m, c) => ` class="${c} ${cls}"`)
    : open.replace(/^<([a-zA-Z0-9]+)/, `<$1 class="${cls}"`);
}

export function withWords(page, opens, mode = 'scroll') {
  const cls = mode === 'load' ? 'wsplit wload' : 'wsplit';
  for (const re of opens) {
    const g = new RegExp(re.source, 'g');
    let out = '', last = 0, n = 0, m;
    while ((m = g.exec(page))) {
      const open = m[0];
      const tag = open.match(/^<([a-zA-Z0-9]+)/)[1];
      const close = `</${tag}>`;
      const end = page.indexOf(close, m.index + open.length);
      if (end === -1) throw new Error(`words: ${open} never closes`);
      out += page.slice(last, m.index) + addClass(open, cls) + wrapWords(page.slice(m.index + open.length, end)) + close;
      last = g.lastIndex = end + close.length;
      n++;
    }
    if (!n) throw new Error(`words: nothing matched ${re}`);
    page = out + page.slice(last);
  }
  return page;
}
