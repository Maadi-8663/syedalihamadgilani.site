/* robots.txt is generated, not stored, so the sitemap URL always matches the
   origin the site was actually built for. The old public/robots.txt hard-coded
   a Cloudflare hostname that was never real. */
export function GET({ site }) {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site).href}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
