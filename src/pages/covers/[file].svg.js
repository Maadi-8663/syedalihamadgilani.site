/* The covers, as files: /covers/<slug>.svg for each scene, and
   /covers/<slug>-wide.svg for the two that have a wide drawing
   (src/pictures/scenes.js). Written at build time, like robots.txt, so a
   picture is never stale and nothing generated is committed. The pages show
   them as images (src/systems/cover.js says why).

   A scene is checked as it is written: the marks it drew are handed to
   cover.js, which stops the build if one is of a tool the system's own page
   does not list. */
import home from '../../html/home.html?raw';
import work from '../../html/work.html?raw';
import { SCENES, WIDE } from '../../pictures/scenes.js';
import { logoSet } from '../../pictures/logos.js';
import { checkSceneMarks } from '../../systems/cover.js';

export function getStaticPaths() {
  return Object.keys(SCENES).flatMap((slug) => [
    { params: { file: slug } },
    ...(WIDE.has(slug) ? [{ params: { file: `${slug}-wide` } }] : []),
  ]);
}

export function GET({ params }) {
  const wide = params.file.endsWith('-wide');
  const slug = wide ? params.file.slice(0, -'-wide'.length) : params.file;
  const marks = logoSet(home), used = new Set();
  const svg = SCENES[slug]({ get: (label) => { used.add(label); return marks.get(label); } }, wide);
  checkSceneMarks(slug, used, work);
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
  });
}
