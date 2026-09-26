// Build'dan keyin har filial domeni va har ochiq sahifa uchun haqiqiy brauzerda tayyor HTML yaratadi:
//   build/_domains/<filial>/index.html                  (bosh sahifa)
//   build/_domains/<filial>/<sahifa yo'li>/index.html   (masalan about/vision/index.html)
// Botlar (Google, Telegram/Facebook ko'rinishi, GPTBot...) JavaScript'siz ham to'liq matn va domenga xos
// meta'larni ko'radi. Brauzerda sayt avvalgidek SPA (createRoot tayyor HTML'ni o'zi almashtiradi).
// Sahifa ma'lumotlari (bo'limlar, yangiliklar) haqiqiy admin.tisedu.uz API'sidan olinadi.
// Chrome topilmasa (yoki PRERENDER=0) — o'tkazib yuboriladi va faqat seo-per-domain natijasi qoladi.
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { preview } from 'vite';
import puppeteer from 'puppeteer-core';
import { DOMAINS, PAGES } from '../src/shared/seo/seoData.js';

if (process.env.PRERENDER === '0') process.exit(0);

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
const executablePath = CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.warn("[prerender] Chrome/Edge topilmadi (CHROME_PATH bering) — o'tkazib yuborildi.");
  process.exit(0);
}

const PORT = 4189;
const server = await preview({ preview: { port: PORT, strictPort: true } });
// --disable-web-security: localhost'dan admin.tisedu.uz API'siga CORS'siz so'rov (faqat build vaqtida)
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-web-security'] });
const out = path.resolve('build/_domains');
let failed = 0;
let done = 0;

for (const [key, { host, branch }] of Object.entries(DOMAINS)) {
  for (const { path: route } of PAGES) {
    const page = await browser.newPage();
    try {
      await page.evaluateOnNewDocument((h, b) => {
        window.__NO_REVEAL__ = true;          // animatsiya sinflari HTML'ga kirmasin
        window.__PRERENDER_HOST__ = h;        // domen -> filial
        localStorage.setItem('globalBranchId', String(b));
      }, host, branch);
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 45000 });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 100));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 400));
      });
      await page.waitForFunction(() => document.getElementById('root')?.children.length > 0, { timeout: 10000 });
      // Meta Pixel prerender paytida o'ziga <script src=fbevents.js> qo'shadi — HTML'ga kiritmaymiz (ikki marta yuklanib xato bermasin)
      await page.evaluate(() => document.querySelectorAll('script[src*="connect.facebook.net"]').forEach((s) => s.remove()));
      const html = '<!doctype html>\n' + (await page.evaluate(() => document.documentElement.outerHTML));
      const dir = route === '/' ? path.join(out, key) : path.join(out, key, route);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, 'index.html'), html);
      done += 1;
      console.log(`[prerender] ${host}${route} (${(html.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      failed += 1;
      console.warn(`[prerender] XATO ${host}${route}: ${e.message}`);
    } finally {
      await page.close();
    }
  }
}

await browser.close();
await server.close();
console.log(`[prerender] tayyor: ${done} ta, xato: ${failed} ta`);
if (failed) process.exitCode = 1;
