/* 出图：本地起静态服务 → Playwright 打开 → 截图 → 采控制台报错
   为什么要起服务：file:// 下浏览器会拦本地贴图（canvas 污点），贴图加载不出来 —— 必须走 http。
   用法：node tools/render-shot.mjs <输出png> [宽] [高] [入口html(相对仓库根)]
   例：  node tools/render-shot.mjs dist/shot-after.png 1440 900 dist/asset-verify.html */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(import.meta.dirname, '..');
const { chromium } = require('C:/Users/lu/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright');

const out = path.resolve(process.argv[2] || path.join(ROOT, 'dist', 'shot.png'));
const width = Number(process.argv[3] || 1440);
const height = Number(process.argv[4] || 900);
const entry = (process.argv[5] || 'dist/asset-verify.html').replace(/^\/+/, '');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.hdr': 'image/vnd.radiance',
  '.wasm': 'application/wasm', '.svg': 'image/svg+xml',
};

const server = http.createServer((request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  const file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    response.writeHead(404).end('not found');
    return;
  }
  response.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const problems = [];
page.on('pageerror', (error) => problems.push('pageerror: ' + error.message));
page.on('console', (message) => {
  if (message.type() === 'error') problems.push('console: ' + message.text());
  else if (message.type() === 'warning') problems.push('warn: ' + message.text());
});

await page.goto(`${base}/${entry}`, { waitUntil: 'load' });
try {
  await page.waitForFunction(() => parseFloat(getComputedStyle(document.getElementById('scene')).opacity) > 0.98, null, { timeout: 60000 });
} catch (error) {
  problems.push('等待就绪超时：' + String(error).slice(0, 120));
}
await page.waitForTimeout(2000);
fs.mkdirSync(path.dirname(out), { recursive: true });
await page.screenshot({ path: out, timeout: 120000 });
console.log(JSON.stringify({ shot: out, problems }, null, 1));

await browser.close();
server.close();
