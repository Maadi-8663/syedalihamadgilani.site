/* brands.js — the hero cluster's logos in their own colours (2026-09-28).

   Syed: "The logos in the clusters are all white. Make them colourfull... use
   the original colour of the logos. Like green for Whatsapp." Until then every
   mark in the cluster was set in the site's ink on a plaster disc. The next
   day the cluster doubled to 38 (src/pictures/cluster.js), and the added
   tools' colours were taken the same way.

   Each colour is the brand's own as Simple Icons publishes it — v16.29.0,
   data/simple-icons.json, where every entry cites the brand's guidelines or
   press kit. They are copied here rather than imported: simple-icons sits in
   node_modules only as a leftover, in neither package.json nor the lockfile,
   so a build on Vercel would not have it. To re-check them against the
   package, if it is still installed (prints only mismatches):

     node --input-type=module -e "import {BRAND, SI_TITLE} from './src/pictures/brands.js'; import fs from 'node:fs'; const d = JSON.parse(fs.readFileSync('node_modules/simple-icons/data/simple-icons.json', 'utf8')); for (const [t, h] of Object.entries(BRAND)) { const x = d.find((i) => i.title === (SI_TITLE[t] || t)); if (!x || '#' + x.hex !== h) console.log('MISMATCH', t, h, x && x.hex); }"

   (or search the titles at simpleicons.org). Next.js and ElevenLabs really are
   black. Logos that are several colours (Gmail, Python, Google Ads, Gemini,
   Meta) take the one colour Simple Icons gives them.

   withBrandColours() adds `--brand` to each tile's inline style at build time,
   and theme.css paints the mark with it; home.html stays as ported. It throws
   if a tile names a brand this list does not know, rather than ship one grey
   logo among coloured ones. */

export const BRAND = {
  'n8n': '#EA4B71',
  'TypeScript': '#3178C6',
  'Google Gemini': '#8E75B2',
  'Python': '#3776AB',
  'Next.js': '#000000',
  'PostgreSQL': '#4169E1',
  'React': '#61DAFB',
  'Supabase': '#3FCF8E',
  'Google Ads': '#4285F4',
  'Shopify': '#7AB55C',
  'Gmail': '#EA4335',
  'Google Sheets': '#34A853',
  'WhatsApp': '#25D366',
  'Stripe': '#635BFF',
  'Docker': '#2496ED',
  'Node.js': '#5FA04E',
  'Meta': '#0467DF',
  'Telegram': '#26A5E4',
  'ElevenLabs': '#000000',
  'HubSpot': '#FF7A59',
  'Google Calendar': '#4285F4',
  'Prisma': '#2D3748',
  'Airtable': '#18BFFF',
  'Make': '#6D00CC',
  'NGINX': '#009639',
  'Notion': '#000000',
  'JavaScript': '#F7DF1E',
  'Google Maps': '#4285F4',
  'Ollama': '#000000',
  'Tailwind CSS': '#06B6D4',
  'Express': '#0A0A0A',
  'Vite': '#9135FF',
  'Google Drive': '#4285F4',
  'Flask': '#3BABC3',
  'GitHub': '#181717',
  'LangChain': '#7FC8FF',
  'FastAPI': '#009688',
  'Google Search': '#4285F4',
  /* on the Integrations page only (src/integrations/marks.js), 2026-09-29 */
  'Zapier': '#FF4F00',
  'IFTTT': '#000000',
  'Node-RED': '#8F0000',
  'Apache Airflow': '#017CEE',
};

/* A tile named for what the tool did, where Simple Icons names the brand. */
export const SI_TITLE = { 'Google Search': 'Google' };

export function withBrandColours(page) {
  let placed = 0;
  const out = page.replace(
    /<span class="tile" style="([^"]*)"([^>]*?) aria-label="([^"]+)">/g,
    (m, style, rest, name) => {
      const hex = BRAND[name];
      if (!hex) throw new Error(`brand colours: no colour for the cluster tile "${name}" — add it from Simple Icons`);
      placed++;
      return `<span class="tile" style="${style};--brand:${hex}"${rest} aria-label="${name}">`;
    },
  );
  if (!placed) throw new Error('brand colours: no cluster tiles found — the hero markup changed');
  return out;
}

/* The Home services page's tool marks, coloured the same way (2026-09-29, his
   request: "Make the logos on the Home services page colourful too"). A tool
   set in type (.tnode.wide) has no mark and keeps its ink. The caption under
   the marks said they were "set in one ink", so it changes in the same step —
   the words and the marks cannot disagree — and it now points to the page
   that says what each integration does. */
const INK = 'Marks are the vendors’ own, set in one ink; a tool without a published mark is set in type.';
const COLOUR = 'Marks are the vendors’ own, in their own colours; a tool without a published mark is set in type. '
  + '<a class="link" href="/integrations/">What each integration does</a>';

export function withTnodeColours(page) {
  let placed = 0;
  let out = page.replace(/<li class="tnode" tabindex="0" aria-label="([^",]+), used in [^"]*">/g, (m, name) => {
    const hex = BRAND[name];
    if (!hex) throw new Error(`brand colours: no colour for the tool mark "${name}" — add it from Simple Icons`);
    placed++;
    return m.replace('<li class="tnode"', `<li class="tnode" style="--brand:${hex}"`);
  });
  if (!placed) throw new Error('brand colours: no tool marks found — the sector markup changed');
  if (out.split(INK).length !== 2) throw new Error('brand colours: the tool-mark caption changed — update withTnodeColours');
  return out.replace(INK, COLOUR);
}
