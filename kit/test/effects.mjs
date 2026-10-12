/* 动效真伪自检：把每个特效开关一次，用画面像素指标证明"确实渲染了"（不是写了没生效） */
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/lu/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright');

const root = path.resolve(import.meta.dirname, '..');
const html = path.join(root, 'dist', '江南雨夜糖水铺.html');

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await page.goto('file:///' + encodeURI(html.replace(/\\/g, '/')), { waitUntil: 'load' });
await page.waitForFunction(() => window.__shop && window.__shop.ready, null, { timeout: 20000 });
await page.waitForTimeout(1500);

/* 指标：整屏亮度总和 + 亮像素数 + 蓝色像素数（雨丝是冷蓝、蒸汽是冷白） */
const METRIC = `() => new Promise((resolve) => {
  requestAnimationFrame(() => {
    const c = document.getElementById('scene');
    const t = document.createElement('canvas');
    t.width = c.width; t.height = c.height;
    const ctx = t.getContext('2d');
    ctx.drawImage(c, 0, 0);
    const d = ctx.getImageData(0, 0, t.width, t.height).data;
    let sum = 0, bright = 0, blue = 0, n = 0;
    for (let i = 0; i < d.length; i += 16) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      sum += r + g + b; n += 1;
      if (r + g + b > 260) bright += 1;
      if (b > r + 24 && b > 70) blue += 1;
    }
    resolve({ mean: +(sum / n).toFixed(1), bright, blue });
  });
})`;

async function metric() { return page.evaluate(`(${METRIC})()`); }

/* 通用化：凡是 effects 里带 .object 的开关都测一遍（不再写死场景的键名） */
const names = await page.evaluate(() => Object.entries(window.__shop.effects() || {})
  .filter(([, v]) => v && (v.object === undefined ? v.isObject3D === true : !!v.object))
  .map(([k]) => k));
const rows = [];
for (const key of names) {
  const onBefore = await metric();
  const toggled = await page.evaluate((k) => {
    const fx = window.__shop.effects();
    if (!fx || !fx[k]) return null;
    const o = fx[k].object || fx[k];
    o.visible = !o.visible;
    return o.visible;
  }, key);
  await page.waitForTimeout(500);
  const off = await metric();
  await page.evaluate((k) => {
    const fx = window.__shop.effects();
    const o = fx[k].object || fx[k];
    o.visible = !o.visible;
  }, key);
  await page.waitForTimeout(300);
  rows.push({
    特效: key,
    切换后可见: toggled,
    亮度变化: +(off.mean - onBefore.mean).toFixed(2),
    亮像素变化: off.bright - onBefore.bright,
    蓝像素变化: off.blue - onBefore.blue,
  });
}

/* 烛光/灯箱闪：比较两个时刻的灯箱材质颜色分量 */
const flick = await page.evaluate(async () => {
  const fx = window.__shop.effects();
  const arr = fx.lanterns || fx.lanternLights || [];
  const sample = () => { const l = arr[0]; return l ? +l.intensity.toFixed(4) : -1; };
  const a = sample();
  await new Promise((r) => setTimeout(r, 420));
  const b = sample();
  await new Promise((r) => setTimeout(r, 420));
  return { 灯笼光强采样: [a, b, sample()], 有变化: a !== b };
});

console.log(JSON.stringify({ 特效开关: rows, 闪烁: flick }, null, 1));
const ok = rows.length > 0 && rows.every((r) => Math.abs(r.蓝像素变化) > 0 || Math.abs(r.亮像素变化) > 0) && flick.有变化;
console.log(ok ? '\n动效自检：各特效开关均引起画面变化 → 确实在渲染' : '\n动效自检：有特效开关后画面无变化，需复查');
await browser.close();
process.exit(ok ? 0 : 1);
