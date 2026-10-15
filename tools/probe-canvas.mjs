/* 探针：打开页面 → 执行一段返回 dataURL 的表达式 → 存成 PNG（自检用）
   用法：node tools/probe-canvas.mjs <输出png> <表达式> [入口html]
   例：  node tools/probe-canvas.mjs dist/ground-canvas.png "window.__groundCanvas.toDataURL('image/png')" */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(import.meta.dirname, '..');
const { chromium } = require('C:/Users/lu/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright');

const out = path.resolve(process.argv[2]);
const expression = process.argv[3];
const entry = (process.argv[4] || 'dist/asset-verify.html').replace(/^\/+/, '');

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.hdr': 'image/vnd.radiance' };
const server = http.createServer((request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  const file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { response.writeHead(404).end('not found'); return; }
  response.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 800, height: 500 } });
const errors = [];
page.on('pageerror', (error) => errors.push(String(error.message).slice(0, 140)));
await page.goto(`${base}/${entry}`, { waitUntil: 'load' });
await page.waitForTimeout(8000);
const dataUrl = await page.evaluate(expression);
if (typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log(JSON.stringify({ saved: out, bytes: fs.statSync(out).size, errors }));
} else {
  console.log(JSON.stringify({ saved: null, got: String(dataUrl).slice(0, 200), errors }));
}
await browser.close();
server.close();
