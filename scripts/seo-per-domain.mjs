// Bitta build to'rtta filial domeniga xizmat qiladi. Bu skript build/ dan keyin ishga tushib,
// har bir domen uchun alohida statik fayllarni yaratadi:
//   build/_domains/<filial>/index.html   — domenga xos <title>, description, canonical, Open Graph, JSON-LD
//   build/_domains/<filial>/robots.txt   — domenning o'z sitemap manzili bilan
//   build/_domains/<filial>/sitemap.xml  — domenning ochiq sahifalari
// Deploy paytida shu fayllar tegishli domen papkasiga build/ ustidan nusxalanadi
// (qarang: deploy buyrug'i) va _domains/ o'chiriladi. Ijtimoiy tarmoq botlari JavaScript ishlatmaydi,
// shuning uchun ular aynan shu statik meta'larni ko'radi.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOMAINS, PAGES, OG_IMAGE, MAIN_SITE, fill, branchOf, buildJsonLd } from '../src/shared/seo/seoData.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(root, 'build');
const html = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const out = path.join(buildDir, '_domains');
fs.rmSync(out, { recursive: true, force: true });

for (const [key, { host, branch }] of Object.entries(DOMAINS)) {
  const name = branchOf(branch)?.name || key;
  const home = PAGES[0];
  const title = fill(home.title.uz, name);
  const desc = fill(home.desc.uz, name);
  const url = `https://${host}/`;

  const head = [
    `<meta name="description" content="${esc(desc)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(`Turon International School — ${name}`)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="uz_UZ" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    `<script type="application/ld+json" data-seo="ld">${JSON.stringify(buildJsonLd(branch, host)).replace(/</g, '\\u003c')}</script>`,
  ].map((l) => `    ${l}`).join('\n');

  let page = html
    .replace(/<html lang="[^"]*"/, '<html lang="uz"')
    .replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`)
    .replace('</head>', `${head}\n  </head>`);

  const dir = path.join(out, key);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page);
  fs.writeFileSync(
    path.join(dir, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /editable\n\nSitemap: https://${host}/sitemap.xml\n`,
  );
  const today = new Date().toISOString().slice(0, 10);
  const urls = PAGES.map((p) => `  <url>\n    <loc>https://${host}${p.path === '/' ? '/' : p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`).join('\n');
  fs.writeFileSync(
    path.join(dir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  console.log(`[seo] ${host}: ${title}`);
}
void MAIN_SITE;
