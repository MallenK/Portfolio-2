import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = process.env.URL || 'http://localhost:3001/';
const OUT = '.impeccable/review';
fs.mkdirSync(OUT, { recursive: true });

const targets = [
  { name: 'desktop', w: 1440, h: 900, dsf: 1 },
  { name: 'desktop-light', w: 1440, h: 900, dsf: 1, theme: 'light' },
  { name: 'mobile', w: 390, h: 844, dsf: 2, mobile: true }
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox']
});

for (const t of targets) {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.setViewport({
    width: t.w,
    height: t.h,
    deviceScaleFactor: t.dsf,
    isMobile: !!t.mobile,
    hasTouch: !!t.mobile
  });
  const wantTheme = t.theme || 'dark';
  await page.evaluateOnNewDocument((th) => {
    try { localStorage.setItem('portfolio-theme', th); } catch (e) {}
  }, wantTheme);
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => m.type() === 'error' && errs.push('CONSOLE ' + m.text()));

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));

  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = t.theme ? 2 : 6;
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((total - t.h) * (i / steps));
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await new Promise((r) => setTimeout(r, 1100));
    await page.screenshot({ path: `${OUT}/${t.name}-${i}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `${OUT}/${t.name}.png` });

  fs.writeFileSync(`${OUT}/${t.name}.errors.txt`, errs.join('\n') || 'none');
  console.log(t.name, 'done — errors:', errs.length);
  await page.close();
}

await browser.close();
console.log('shots complete');
