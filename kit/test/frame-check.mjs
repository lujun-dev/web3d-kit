/* 构图量测：把关键点的屏幕坐标打出来，别靠肉眼猜有没有裁到 */
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/lu/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright');

const root = path.resolve(import.meta.dirname, '..');
const html = path.join(root, 'dist', fs.readdirSync(path.join(root, 'dist')).find((name) => name.endsWith('.html')));
const W = Number(process.argv[2] || 1440);
const H = Number(process.argv[3] || 900);

const POINTS = [
  ['底座-左前角', -5.82, 0, 5.82],
  ['底座-右前角', 5.82, 0, 5.82],
  ['底座-左后角', -5.82, 0, -5.82],
  ['底座-右后角', 5.82, 0, -5.82],
  ['正脊顶', 0, 6.8, -1.75],
  ['马头墙顶', 4.4, 4.62, 1.2],
  ['隔壁墙檐', 5.5, 3.92, 1.2],
  ['城楼左', -6.5, 6.2, -11.5],
  ['城楼右', 5.5, 6.2, -11.5],
  ['右塔顶', 3.3, 4.9, -8.8],
  ['左塔顶', -4.2, 4.3, -9.0],
  ['匾额中心', 0, 2.7, 0.67],
  ['灯箱中心', 0, 2.16, -1.35],
  ['货架顶层', 0, 2.14, -2.05],
  ['柜台面', 0, 1.28, -0.75],
  ['水缸口', -4.4, 1.2, 1.35],
  ['井台', -3.3, 1.38, 4.35],
  ['摊车顶', 4.2, 2.62, 2.7],
  ['石灯笼顶', 2.2, 1.33, 4.58],
  ['竖幌底', 3.56, 1.66, 1.6],
];

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await page.goto('file:///' + encodeURI(html.replace(/\\/g, '/')), { waitUntil: 'load' });
await page.waitForFunction(() => window.__shop && window.__shop.ready, null, { timeout: 20000 });
await page.waitForTimeout(900);

const rows = await page.evaluate((points) => points.map(([name, x, y, z]) => {
  const p = window.__shop.project(x, y, z);
  return { name, x: p.x, y: p.y };
}), POINTS);

let bad = 0;
for (const r of rows) {
  const out = r.x < 8 || r.x > W - 8 || r.y < 8 || r.y > H - 8;
  if (out) bad += 1;
  console.log(`${out ? '出画 ' : '     '}${r.name.padEnd(12)} screen=(${String(r.x).padStart(5)}, ${String(r.y).padStart(4)})`);
}
const xs = rows.map((r) => r.x); const ys = rows.map((r) => r.y);
console.log(`\n画布 ${W}x${H} | 内容范围 x ${Math.min(...xs)}..${Math.max(...xs)}  y ${Math.min(...ys)}..${Math.max(...ys)} | 出画点 ${bad}`);
await browser.close();
process.exit(0);
