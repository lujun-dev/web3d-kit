/* 截图 + 控制台报错采集：node test/shots.mjs [宽] [高] */
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/lu/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright');

const root = path.resolve(import.meta.dirname, '..');
const html = path.join(root, 'dist', fs.readdirSync(path.join(root, 'dist')).find((name) => name.endsWith('.html')));
const width = Number(process.argv[2] || 1440);
const height = Number(process.argv[3] || 900);

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const problems = [];
page.on('pageerror', (error) => problems.push('pageerror: ' + error.message));
page.on('console', (message) => { if (message.type() === 'error') problems.push('console: ' + message.text()); });

await page.goto('file:///' + encodeURI(html.replace(/\\/g, '/')), { waitUntil: 'load' });
await page.waitForFunction(() => window.__shop && window.__shop.ready, null, { timeout: 20000 });
await page.waitForTimeout(1200);

// 双击直接打开时的首帧（不调用 show，验证不会空白）
const initial = await page.evaluate(() => ({
  opacity: getComputedStyle(document.getElementById('scene')).opacity,
  frames: window.__shop.frames(),
}));
await page.screenshot({ path: path.join(root, 'shots', '0-initial.png') });

const shops = await page.evaluate(() => window.__shop.shops);
const reports = [];
fs.mkdirSync(path.join(root, 'shots'), { recursive: true });
for (let index = 0; index < shops.length; index += 1) {
  await page.evaluate((value) => window.__shop.show(value), index);
  await page.waitForTimeout(1600);
  const stats = await page.evaluate(() => window.__shop.stats());
  const summary = { meshes: stats.meshes, triangles: stats.triangles, materials: stats.materials, textures: stats.textures, drawCalls: stats.drawCalls };
  const file = path.join(root, 'shots', `${index + 1}-${shops[index].id}.png`);
  await page.screenshot({ path: file });
  reports.push({ index: index + 1, ...shops[index], ...summary, file });
}
// 隐藏 UI 的一张（录素材用）
await page.evaluate(() => { window.__shop.show(0), window.__shop.toggleUi(); });
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(root, 'shots', 'ui-hidden.png') });

await browser.close();
console.log(JSON.stringify({ initialOpen: initial, reports, problems }, null, 1));
process.exit(problems.length ? 1 : 0);
