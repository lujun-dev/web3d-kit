/* 画面体检：亮度分布（直方图分位）+ 死黑/过曝比例 + 帧率 + 特效是否生效
   用来回答"是不是太暗 / 分布不均"，不靠感觉 */
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/lu/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright');

const root = path.resolve(import.meta.dirname, '..');
const html = path.join(root, 'dist', fs.readdirSync(path.join(root, 'dist')).find((name) => name.endsWith('.html')));

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
page.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
await page.goto('file:///' + encodeURI(html.replace(/\\/g, '/')), { waitUntil: 'load' });
await page.waitForFunction(() => window.__shop && window.__shop.ready, null, { timeout: 30000 });
await page.waitForTimeout(2500);

const metrics = await page.evaluate(() => new Promise((resolve) => {
  const c = document.getElementById('scene');
  const t = document.createElement('canvas');
  t.width = c.width; t.height = c.height;
  const ctx = t.getContext('2d');
  ctx.drawImage(c, 0, 0);
  const d = ctx.getImageData(0, 0, t.width, t.height).data;
  const hist = new Array(32).fill(0);
  let n = 0; let sum = 0; let dead = 0; let blown = 0;
  const lumas = [];
  /* 主体区域：画面中央 55%（排除四周虚空），用它判定"模型是不是太暗" */
  const x0 = Math.floor(t.width * 0.22); const x1 = Math.floor(t.width * 0.78);
  const y0 = Math.floor(t.height * 0.14); const y1 = Math.floor(t.height * 0.86);
  let roiN = 0; let roiSum = 0; let roiDead = 0; const roiLumas = [];
  for (let y = 0; y < t.height; y += 1) {
    for (let x = 0; x < t.width; x += 1) {
      const i = (y * t.width + x) * 4;
      const l = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
      hist[Math.min(31, Math.floor(l * 32))] += 1;
      sum += l; n += 1; lumas.push(l);
      if (l < 0.045) dead += 1;
      if (l > 0.94) blown += 1;
      if (x >= x0 && x < x1 && y >= y0 && y < y1) { roiN += 1; roiSum += l; roiLumas.push(l); if (l < 0.045) roiDead += 1; }
    }
  }
  /* 右上角（含邻墙/屋顶背坡）单独量一遍，回答"是不是还有一块过曝的白板" */
  let urN = 0; let urBlown = 0; let urMax = 0; let urSum = 0;
  const ux0 = Math.floor(t.width * 0.60); const uy1 = Math.floor(t.height * 0.45);
  for (let y = 0; y < uy1; y += 1) {
    for (let x = ux0; x < t.width; x += 1) {
      const i = (y * t.width + x) * 4;
      const l = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
      urN += 1; urSum += l; if (l > urMax) urMax = l; if (l > 0.9) urBlown += 1;
    }
  }
  const upperRight = { mean: +(urSum / urN).toFixed(3), max: +urMax.toFixed(3), blownRatio: +(urBlown / urN * 100).toFixed(2) };
  roiLumas.sort((a, b) => a - b);
  const roi = {
    mean: +(roiSum / roiN).toFixed(3),
    p25: +roiLumas[Math.floor(0.25 * (roiLumas.length - 1))].toFixed(3),
    p50: +roiLumas[Math.floor(0.5 * (roiLumas.length - 1))].toFixed(3),
    p75: +roiLumas[Math.floor(0.75 * (roiLumas.length - 1))].toFixed(3),
    deadRatio: +(roiDead / roiN * 100).toFixed(2),
  };
  lumas.sort((a, b) => a - b);
  const q = (p) => +lumas[Math.floor(p * (lumas.length - 1))].toFixed(3);
  return resolve({
    roi,
    upperRight,
    mean: +(sum / n).toFixed(3),
    p05: q(0.05), p25: q(0.25), p50: q(0.5), p75: q(0.75), p95: q(0.95),
    deadRatio: +(dead / n * 100).toFixed(2),
    blownRatio: +(blown / n * 100).toFixed(2),
    histogram: hist.map((v) => +(v / n * 100).toFixed(1)),
  });
}));

/* 帧率（headless SwiftShader 下偏低是正常的，只看有没有量级问题） */
const fps = await page.evaluate(() => new Promise((resolve) => {
  const start = window.__shop.frames();
  const t0 = performance.now();
  setTimeout(() => resolve(+(((window.__shop.frames() - start) / ((performance.now() - t0) / 1000)).toFixed(1))), 1500);
}));

const stats = await page.evaluate(() => window.__shop.stats());
console.log(JSON.stringify({ 亮度: metrics, fps, stats, 报错: problems }, null, 1));
const ok = problems.length === 0 && metrics.roi.mean > 0.17 && metrics.roi.deadRatio < 12
  && metrics.upperRight.blownRatio < 2.5 && metrics.upperRight.mean < 0.62;
console.log(ok ? '\n画面体检：通过（不是死黑、没有大面积过曝、无报错）' : '\n画面体检：有指标不达标，见上');
await browser.close();
process.exit(ok ? 0 : 1);
