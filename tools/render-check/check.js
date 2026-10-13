// 真实渲染检查：无头 Chromium 逐页加载 mdBook 站点
// 用法: node check.js [baseURL]
//   默认 http://127.0.0.1:8734（先在被检目录起 python3 -m http.server 8734）
//   也可传 https://youngy620.github.io/mit15s50-poker-theory 检查线上
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://127.0.0.1:8734';
const CHROME = process.env.CHROME_PATH ||
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1124/chrome-mac/Chromium.app/Contents/MacOS/Chromium`;
const SHOTS = path.join(__dirname, 'shots');

const PAGES = [
  'index.html', 'ch01-introduction.html', 'ch02-perfect-info-1.html', 'ch03-mcts.html',
  'ch04-normal-form.html', 'ch05-efg-cfr.html', 'ch06-phi-regret.html',
  'ch07-nonlinear-deviations.html', 'ch08-optimism.html', 'ch09-cfr-speedups.html',
  'ch10-abstraction-1.html', 'ch11-abstraction-2.html', 'ch12-libratus-1.html',
  'ch13-libratus-2.html', 'ch14-libratus-3.html', 'ch15-klss.html', 'ch16-pluribus.html',
  'ch17-deep-learning.html', 'ch18-team-games.html', 'ch19-mechanism-design.html',
  'ch20-double-oracle.html', 'hw1.html', 'hw2.html',
];

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const problems = [];

  for (const lang of ['', 'zh/']) {
    for (const p of PAGES) {
      const url = `${BASE}/${lang}${p}`;
      const name = `${lang}${p}`.replace(/\//g, '_');
      const consoleErrs = [];
      page.on('console', m => { if (m.type() === 'error') consoleErrs.push(m.text()); });
      page.on('pageerror', e => consoleErrs.push(String(e)));
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // 等 MathJax 完成排版
      const math = await page.evaluate(async () => {
        if (!window.MathJax) return { loaded: false };
        if (window.MathJax.startup?.promise) {
          try { await window.MathJax.startup.promise; } catch (e) { return { loaded: true, error: String(e) }; }
        }
        return {
          loaded: true,
          version: window.MathJax.version,
          typeset: document.querySelectorAll('mjx-container').length,
        };
      });

      // 文本节点中残留的生公式 / 常见渲染失败痕迹
      const raw = await page.evaluate(() => {
        const skip = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA']);
        const hits = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode: n => skip.has(n.parentElement?.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
        });
        const re = /\$[^$\n]{2,80}\$|\\\\dfrac|\\\\frac|\\\\text\{|\\\\times|\\\\approx|\\\\ln /;
        let n;
        while ((n = walker.nextNode())) {
          const t = n.nodeValue;
          if (re.test(t)) hits.push(t.trim().slice(0, 90));
        }
        return hits.slice(0, 8);
      });

      // 图片是否都加载成功
      const imgs = await page.evaluate(() =>
        [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src')));

      await page.screenshot({ path: path.join(SHOTS, name.replace('.html', '.png')), fullPage: false });

      const status = resp?.status();
      const issues = [];
      if (status !== 200) issues.push(`HTTP ${status}`);
      if (!math.loaded) issues.push('MathJax 未加载');
      if (math.error) issues.push(`MathJax 排版错误: ${math.error}`);
      if (math.typeset === 0) issues.push('警告: 页面无 mjx-container（若该页无公式可忽略）');
      if (raw.length) issues.push(`残留生公式: ${raw.join(' | ')}`);
      if (imgs.length) issues.push(`图片加载失败: ${imgs.join(', ')}`);
      if (consoleErrs.length) issues.push(`控制台错误: ${[...new Set(consoleErrs)].slice(0, 3).join(' | ')}`);
      if (issues.length) problems.push(`${lang}${p}\n    ${issues.join('\n    ')}`);
      console.log(`${issues.length ? 'FAIL' : 'ok  '} ${lang}${p}  math=${math.typeset ?? '-'} raw=${raw.length}`);
    }
  }
  await browser.close();
  console.log('\n==== 汇总 ====');
  console.log(problems.length ? problems.join('\n') : '全部页面渲染正常');
  process.exit(problems.length ? 1 : 0);
})();
