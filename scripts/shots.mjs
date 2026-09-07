import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = process.env.URL || 'http://localhost:3002/';
const OUT = '.impeccable/review';
fs.mkdirSync(OUT, { recursive: true });

const targets = [
  { name: 'mobile', w: 390, h: 844, dsf: 2, mobile: true, theme: 'dark' },
  { name: 'mobile-light', w: 390, h: 844, dsf: 2, mobile: true, theme: 'light' },
  { name: 'desktop', w: 1440, h: 900, dsf: 1, theme: 'dark' }
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

for (const t of targets) {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.setViewport({ width: t.w, height: t.h, deviceScaleFactor: t.dsf, isMobile: !!t.mobile, hasTouch: !!t.mobile });
  await page.evaluateOnNewDocument((th) => { try { localStorage.setItem('portfolio-theme', th); } catch (e) {} }, t.theme);

  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => m.type() === 'error' && errs.push('CONSOLE ' + m.text()));

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3200));
  await page.screenshot({ path: `${OUT}/${t.name}.png` });

  // open a popup by clicking near a primary node, then screenshot
  const clicks = t.mobile
    ? [{ x: t.w * 0.5, y: t.h * 0.5 }]   // core-ish
    : [{ x: t.w * 0.5, y: t.h * 0.5 }];
  // try clicking the wordmark logo to open the core popup (reliable)
  try {
    await page.click('#navbar-logo');
    await new Promise((r) => setTimeout(r, 900));
    await page.screenshot({ path: `${OUT}/${t.name}-popup-core.png` });
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 500));
  } catch (e) { errs.push('popup ' + e.message); }

  // click a node on the canvas (proyectos is upper-right)
  try {
    const box = { x: t.w * (t.mobile ? 0.66 : 0.72), y: t.h * (t.mobile ? 0.42 : 0.35) };
    await page.mouse.click(box.x, box.y);
    await new Promise((r) => setTimeout(r, 900));
    await page.screenshot({ path: `${OUT}/${t.name}-popup-node.png` });
  } catch (e) { errs.push('node ' + e.message); }

  fs.writeFileSync(`${OUT}/${t.name}.errors.txt`, errs.join('\n') || 'none');
  console.log(t.name, 'done — errors:', errs.length);
  await page.close();
}

await browser.close();
console.log('shots complete');
