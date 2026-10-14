const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1124/chrome-mac/Chromium.app/Contents/MacOS/Chromium` });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(process.argv[2], { waitUntil: 'networkidle' });
  await page.evaluate(() => window.MathJax?.startup?.promise);
  const el = await page.$(process.argv[3]);
  await el.scrollIntoViewIfNeeded();
  await page.screenshot({ path: process.argv[4] });
  await browser.close();
})();
