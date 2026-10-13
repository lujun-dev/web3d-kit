/* 验证「拆出来的资产件拼回去 == 基准」：
   1) esbuild 打包 assets/scene/rainy-night-konbini.js（three 与 addons 保持外部，走 importmap）
   2) 塞进与基准同样的 HTML 壳（CSS + importmap + canvas）
   3) 本地 Playwright 打开 → 采控制台报错 → 读桶顶点数/网格数 → 截图
   用法：node tools/verify-assets.mjs [宽] [高] */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(import.meta.dirname, '..');
const { build } = require(path.join(ROOT, 'node_modules', 'esbuild'));
const { chromium } = require('C:/Users/lu/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright');

const W = Number(process.argv[2] || 1100);
const H = Number(process.argv[3] || 700);

// ── 1. 打包 ──
const out = path.join(ROOT, 'dist', 'asset-bundle.js');
fs.mkdirSync(path.dirname(out), { recursive: true });
const entryPath = path.join(ROOT, 'dist', 'verify-entry.js');
fs.mkdirSync(path.dirname(entryPath), { recursive: true });
fs.writeFileSync(entryPath, `import { W } from '../assets/core/world.js';
import { ready } from '../assets/scene/rainy-night-konbini.js';
window.__ready = ready;
window.__check = () => {
  const counts = {};
  for (const [k, b] of Object.entries(W.buckets || {})) counts[k] = b.positions ? b.positions.length / 3 : (b.vertexCount || 0);
  return { buckets: counts, meshes: (W.scene && W.scene.children.length) || 0, blend: document.getElementById('scene') ? getComputedStyle(document.getElementById('scene')).opacity : null };
};
`, 'utf8');
await build({
  entryPoints: [entryPath],
  bundle: true,
  format: 'esm',
  target: 'es2020',
  outfile: out,
  external: ['three', 'three/addons/*'],
  logLevel: 'warning',
});
const bundle = fs.readFileSync(out, 'utf8');
console.log('bundle 大小', (bundle.length / 1024).toFixed(1), 'KB');

// 探针：把桶顶点数/网格数暴露出来（临时拼在 bundle 末尾）
const bundleWithProbe = bundle;

const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>资产件拼装验证</title>
<style>
  :root { color-scheme: dark; --night-high: #151c36; --night-low: #04060b; }
  html, body { height: 100%; margin: 0; }
  body { background: radial-gradient(120% 90% at 50% 38%, var(--night-high), var(--night-low)); overflow: hidden; }
  #scene { cursor: grab; display: block; height: 100%; opacity: 0; outline: none; touch-action: none; transition: opacity 1.8s ease; width: 100%; }
  #scene.is-ready { opacity: 1; }
  #scene:active { cursor: grabbing; }
</style>
<script type="importmap">
{
  "imports": {
    "three": "https://registry.npmmirror.com/three/0.170.0/files/build/three.module.min.js",
    "three/addons/": "https://registry.npmmirror.com/three/0.170.0/files/examples/jsm/"
  }
}
</script>
</head>
<body>
<canvas id="scene"></canvas>
<script type="module">
${bundleWithProbe}
</script>
</body>
</html>
`;
const htmlPath = path.join(ROOT, 'dist', 'asset-verify.html');
fs.writeFileSync(htmlPath, html, 'utf8');

// ── 3. 跑起来看 ──
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const problems = [];
page.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
await page.goto('file:///' + encodeURI(htmlPath.replace(/\\/g, '/')), { waitUntil: 'load' });
try { await page.waitForFunction(() => parseFloat(getComputedStyle(document.getElementById('scene')).opacity) > 0.98, null, { timeout: 45000 }); }
catch { problems.push('warn: 画布淡入未完成'); }
await page.waitForTimeout(1200);
const check = await page.evaluate(() => (window.__check ? window.__check() : null));
console.log(JSON.stringify({ problems, check }, null, 1));
try { await page.screenshot({ path: path.join(ROOT, 'dist', 'asset-verify.png'), timeout: 120000 }); }
catch (e) { console.log('screenshot 失败:', String(e).slice(0, 120)); }
await browser.close();
