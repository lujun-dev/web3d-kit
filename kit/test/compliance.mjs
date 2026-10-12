/* 交付合规自检：外链/内联脚本/UI 元素/首帧，逐条出结论（不看感觉） */
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/lu/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright');

const root = path.resolve(import.meta.dirname, '..');
const html = path.join(root, 'dist', fs.readdirSync(path.join(root, 'dist')).find((name) => name.endsWith('.html')));
const source = fs.readFileSync(html, 'utf8');

/* 静态检查：外链 / 独立脚本文件 / 外部字体 */
const statics = {
  "外部http链接": (source.match(/https?:\/\/[^"')\s]+/g) || []).filter((u) => !u.includes('www.w3.org')),
  "外链script": (source.match(/<script[^>]*\ssrc=/gi) || []).length,
  "link标签": (source.match(/<link[^>]*\srel=/gi) || []).length,
  "内联script块数": (source.match(/<script(?![^>]*\ssrc=)[^>]*>/gi) || []).length,
  "行内事件": (source.match(/\son[a-z]+\s*=\s*"/gi) || []).length,
  "体积KB": Math.round(source.length / 1024),
};

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const requests = [];
page.on('request', (r) => requests.push(r.url()));
const problems = [];
page.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
await page.goto('file:///' + encodeURI(html.replace(/\\/g, '/')), { waitUntil: 'load' });
await page.waitForFunction(() => window.__shop && window.__shop.ready, null, { timeout: 20000 });
await page.waitForTimeout(1500);

const runtime = await page.evaluate(() => ({
  "ui元素": document.querySelectorAll('button, nav, input, select, textarea, [class*=panel], [class*=hud]').length,
  "画布不透明": getComputedStyle(document.getElementById('scene')).opacity,
  "帧数": window.__shop.frames(),
}));
const external = requests.filter((u) => !u.startsWith('file://') && !u.startsWith('data:'));

console.log(JSON.stringify({
  静态: statics,
  运行时: { ...runtime, 外链请求数: external.length, 请求总数: requests.length, 外链样例: external.slice(0, 3) },
  报错: problems,
}, null, 1));

const ok = statics["外部http链接"].length === 0 && statics["外链script"] === 0 && statics["link标签"] === 0
  && statics["行内事件"] === 0 && runtime["ui元素"] === 0 && Number(runtime["画布不透明"]) === 1
  && runtime["帧数"] > 0 && external.length === 0 && problems.length === 0;
console.log(ok ? '\n合规自检：全部通过' : '\n合规自检：有未通过项');
await browser.close();
process.exit(ok ? 0 : 1);
