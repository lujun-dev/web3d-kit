/* 线上页面诊断：收集失败请求 / 非 200 响应 / 控制台，等待场景就绪，输出现场状态
   用法：node tools/probe-live.mjs <URL> [超时秒] [截图路径] */
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/lu/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright');

const url = process.argv[2];
const waitSeconds = Number(process.argv[3] || 150);
const shot = process.argv[4] ? path.resolve(process.argv[4]) : null;

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const failed = [];
const bad = [];
const logs = [];
page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText} ${r.url().slice(0, 120)}`));
page.on('response', (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url().slice(0, 120)}`); });
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push(`${m.type()}: ${m.text().slice(0, 160)}`); });
page.on('pageerror', (e) => logs.push('pageerror: ' + String(e.message).slice(0, 160)));

const t0 = Date.now();
await page.goto(url, { waitUntil: 'load', timeout: 90000 });
let ready = false;
try {
  await page.waitForFunction(() => parseFloat(getComputedStyle(document.getElementById('scene')).opacity) > 0.98, null, { timeout: waitSeconds * 1000 });
  ready = true;
} catch { ready = false; }
const state = await page.evaluate(() => ({
  opacity: (document.getElementById('scene') && getComputedStyle(document.getElementById('scene')).opacity) || null,
  photos: window.__photos ? Object.keys(window.__photos) : null,
  check: window.__check ? window.__check() : null,
}));
if (shot) { fs.mkdirSync(path.dirname(shot), { recursive: true }); await page.screenshot({ path: shot, timeout: 120000 }); }
console.log(JSON.stringify({ url, ready, 用时秒: Math.round((Date.now() - t0) / 1000), state, failed: failed.slice(0, 12), bad: bad.slice(0, 12), logs: logs.slice(0, 12) }, null, 1));
await browser.close();
