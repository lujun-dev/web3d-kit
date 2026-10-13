/* 搬运件自检：把 assets/vendor 下的第三方件逐个 import 并实例化一遍，
   核对「搬运件 ↔ 运行时 three 版本」的 API 对得上（这是搬运唯一的真实风险）。
   用法：node tools/verify-vendor.mjs */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(import.meta.dirname, '..');
const { build } = require(path.join(ROOT, 'node_modules', 'esbuild'));
const { chromium } = require('C:/Users/lu/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright');

const THREE_VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules', 'three', 'package.json'), 'utf8')).version;
const V = '../assets/vendor/three/examples/jsm/';

// 逐个 import + 能实例化的就实例化（构造参数都取最小可用值）
const entry = `import * as THREE from 'three';
${[
  ['Object3D'],
].map(() => '').join('')}
import { Reflector } from '${V}objects/Reflector.js';
import { ReflectorForSSRPass } from '${V}objects/ReflectorForSSRPass.js';
import { Refractor } from '${V}objects/Refractor.js';
import { Water } from '${V}objects/Water.js';
import { Sky } from '${V}objects/Sky.js';
import { Lensflare, LensflareElement } from '${V}objects/Lensflare.js';
import { MarchingCubes } from '${V}objects/MarchingCubes.js';
import { DecalGeometry } from '${V}geometries/DecalGeometry.js';
import { RoundedBoxGeometry } from '${V}geometries/RoundedBoxGeometry.js';
import { ConvexGeometry } from '${V}geometries/ConvexGeometry.js';
import { ConvexHull } from '${V}math/ConvexHull.js';
import { SimplexNoise } from '${V}math/SimplexNoise.js';
import { ImprovedNoise } from '${V}math/ImprovedNoise.js';
import { Lut } from '${V}math/Lut.js';
import { MeshSurfaceSampler } from '${V}math/MeshSurfaceSampler.js';
import { Octree } from '${V}math/Octree.js';
import { RoomEnvironment } from '${V}environments/RoomEnvironment.js';
import { OutlineEffect } from '${V}effects/OutlineEffect.js';
import { RGBELoader } from '${V}loaders/RGBELoader.js';
import { OrbitControls } from '${V}controls/OrbitControls.js';
import { EffectComposer } from '${V}postprocessing/EffectComposer.js';
import { RenderPass } from '${V}postprocessing/RenderPass.js';
import { ShaderPass } from '${V}postprocessing/ShaderPass.js';
import { OutputPass } from '${V}postprocessing/OutputPass.js';
import { SMAAPass } from '${V}postprocessing/SMAAPass.js';
import { LUTPass } from '${V}postprocessing/LUTPass.js';
import { GTAOPass } from '${V}postprocessing/GTAOPass.js';
import { SSRPass } from '${V}postprocessing/SSRPass.js';
import { BokehPass } from '${V}postprocessing/BokehPass.js';
import { UnrealBloomPass } from '${V}postprocessing/UnrealBloomPass.js';
import * as BufferGeometryUtils from '${V}utils/BufferGeometryUtils.js';
import * as SceneUtils from '${V}utils/SceneUtils.js';
import { VignetteShader } from '${V}shaders/VignetteShader.js';
import { ColorifyShader } from '${V}shaders/ColorifyShader.js';
import { RGBShiftShader } from '${V}shaders/RGBShiftShader.js';
import { DotScreenShader } from '${V}shaders/DotScreenShader.js';
import { HalftoneShader } from '${V}shaders/HalftoneShader.js';
import { ConvolutionShader } from '${V}shaders/ConvolutionShader.js';

export async function run() {
  const results = [];
  const ok = (name, fn) => {
    try { const v = fn(); results.push({ name, ok: true, note: v === undefined ? '' : String(v) }); }
    catch (e) { results.push({ name, ok: false, note: String(e).slice(0, 120) }); }
  };

  const canvas = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  const geo = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());

  ok('Reflector', () => new Reflector(geo, { textureWidth: 64, textureHeight: 64 }).constructor.name);
  ok('ReflectorForSSRPass', () => new ReflectorForSSRPass(geo, { textureWidth: 64, textureHeight: 64 }).constructor.name);
  ok('Refractor', () => new Refractor(geo, { textureWidth: 64, textureHeight: 64 }).constructor.name);
  ok('Water', () => { const w = new Water(geo, { textureWidth: 64, textureHeight: 64 }); return w.material.type; });
  ok('Sky', () => new Sky().material.type);
  ok('Lensflare', () => { const l = new Lensflare(); l.addElement(new LensflareElement(new THREE.Texture(), 1, 0)); return 'children=' + l.children.length; });
  ok('MarchingCubes', () => { const m = new MarchingCubes(8, new THREE.MeshBasicMaterial()); return m.enableUvs; });
  ok('DecalGeometry', () => new DecalGeometry(mesh, new THREE.Vector3(0, 0, 1), new THREE.Euler(), new THREE.Vector3(1, 1, 1)).attributes.position.count);
  ok('RoundedBoxGeometry', () => new RoundedBoxGeometry(1, 1, 1, 2, 0.1).attributes.position.count);
  ok('ConvexGeometry', () => new ConvexGeometry([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)]).attributes.position.count);
  ok('ConvexHull', () => new ConvexHull().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)]).faces.length);
  ok('SimplexNoise', () => { const s = new SimplexNoise({ random: () => 0.42 }); return s.noise3d(0.1, 0.2, 0.3).toFixed(4); });
  ok('ImprovedNoise', () => new ImprovedNoise().noise(0.1, 0.2, 0.3).toFixed(4));
  ok('Lut', () => new Lut(2).constructor.name);
  ok('MeshSurfaceSampler', () => { const smp = new MeshSurfaceSampler(mesh).build(); const v = new THREE.Vector3(); smp.sample(v); return v.toArray().map((n) => n.toFixed(2)).join(','); });
  ok('Octree', () => new Octree().subTrees.length);
  ok('RoomEnvironment', () => new RoomEnvironment().constructor.name);
  ok('OutlineEffect', () => new OutlineEffect(renderer).constructor.name);
  ok('RGBELoader', () => new RGBELoader().constructor.name);
  ok('OrbitControls', () => new OrbitControls(camera, canvas).constructor.name);
  ok('EffectComposer', () => new EffectComposer(renderer, new THREE.WebGLRenderTarget(64, 64)).passes.length);
  ok('RenderPass', () => new RenderPass(scene, camera).constructor.name);
  ok('ShaderPass', () => new ShaderPass(VignetteShader).material.type);
  ok('OutputPass', () => new OutputPass().constructor.name);
  ok('SMAAPass', () => new SMAAPass(64, 64).constructor.name);
  ok('LUTPass', () => new LUTPass().constructor.name);
  ok('GTAOPass', () => new GTAOPass(scene, camera, 64, 64).constructor.name);
  ok('SSRPass', () => new SSRPass({ renderer, scene, camera, width: 64, height: 64 }).constructor.name);
  ok('BokehPass', () => new BokehPass(scene, camera, {}).constructor.name);
  ok('UnrealBloomPass', () => new UnrealBloomPass(new THREE.Vector2(64, 64), 1, 0.5, 0.85).constructor.name);
  ok('BufferGeometryUtils', () => Object.keys(BufferGeometryUtils).length);
  ok('SceneUtils', () => Object.keys(SceneUtils).length);
  ok('VignetteShader', () => Object.keys(VignetteShader.uniforms).join(','));
  ok('ColorifyShader', () => typeof ColorifyShader.fragmentShader === 'string');
  ok('RGBShiftShader', () => typeof RGBShiftShader.fragmentShader === 'string');
  ok('DotScreenShader', () => typeof DotScreenShader.fragmentShader === 'string');
  ok('HalftoneShader', () => typeof HalftoneShader.fragmentShader === 'string');
  ok('ConvolutionShader', () => typeof ConvolutionShader.fragmentShader === 'string');
  return { three: THREE.REVISION, results };
}
`;
const entryPath = path.join(ROOT, 'dist', 'verify-vendor-entry.js');
fs.mkdirSync(path.dirname(entryPath), { recursive: true });
fs.writeFileSync(entryPath, entry, 'utf8');
const out = path.join(ROOT, 'dist', 'verify-vendor.js');
await build({ entryPoints: [entryPath], bundle: true, format: 'esm', target: 'es2020', outfile: out,
  external: ['three', 'three/addons/*'], logLevel: 'warning' });
const bundle = fs.readFileSync(out, 'utf8');

const html = `<!doctype html><html><head><meta charset="utf-8"><title>vendor verify</title></head>
<body><canvas id="scene" width="64" height="64"></canvas><script type="importmap">
{ "imports": { "three": "https://registry.npmmirror.com/three/${THREE_VERSION}/files/build/three.module.js",
  "three/addons/": "https://registry.npmmirror.com/three/${THREE_VERSION}/files/examples/jsm/" } }
</script><script type="module">
${bundle}
window.__threeRev = THREE.REVISION;
window.__run = run;
</script></body></html>`;
const htmlPath = path.join(ROOT, 'dist', 'verify-vendor.html');
fs.writeFileSync(htmlPath, html, 'utf8');

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 320, height: 200 } });
const problems = [];
page.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
await page.goto('file:///' + encodeURI(htmlPath.replace(/\\/g, '/')), { waitUntil: 'load' });
await page.waitForTimeout(3000);
const probe = await page.evaluate(() => ({ hasRun: typeof window.__run, hasThree: typeof window.__threeRev }));
console.log('probe:', JSON.stringify(probe));
console.log('problems:', JSON.stringify(problems));
const result = probe.hasRun === 'function' ? await page.evaluate(() => window.__run()) : { three: '?', results: [] };
await browser.close();
const failed = result.results.filter((r) => !r.ok);
console.log(JSON.stringify({ runtimeThree: result.three, checked: result.results.length, failed, problems }, null, 1));
console.log(failed.length || problems.length ? 'FAIL' : 'PASS');
