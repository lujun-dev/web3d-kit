/* 场景引擎：渲染器 / 相机 / 图集 / 构件 / 光效。与具体店铺解耦，店铺层只用这里的 API 拼装 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as art from './art.js';

/* BoxGeometry 六个面的 group 顺序 */
export const FACE = { px: 0, nx: 1, py: 2, ny: 3, pz: 4, nz: 5 };
/* 图层：0 描边层（会被墨线包裹），1 特效层（地面/光斑/雨/蒸汽/精灵，不描边） */
export const LAYER = { SOLID: 0, FX: 1 };

export const C = {
  ink: '#171210',
  wall: '#e7dcc4', wallDim: '#d3c7aa', plaster: '#cdbf9f',
  wood: '#8a5a34', woodDark: '#5a3620', woodMid: '#6f4526', woodLight: '#a9764a',
  pillar: '#8d3a2c', pillarDark: '#6d2b20', red: '#a63a2b', redDeep: '#8c2d24',
  gold: '#d9b055', goldDim: '#b8913f',
  tile: '#5d6672', tileDark: '#454d58',
  paper: '#ffcf8a', bamboo: '#cfa96b',
  stone: '#8f8d84', stoneDark: '#74726a', base: '#9a978d',
  white: '#f4ecd8', green: '#b9c98a', brown: '#c08a4a', sugar: '#e6c690',
  warm: '#ffb066', lamp: '#ffd79a', moon: '#9fb4d8',
};

/* =============================================================== 纹理图集 */

class Atlas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.entries = [];
  }

  register(name, pixelWidth, pixelHeight, draw) {
    const rect = { u0: 0, u1: 1, v0: 0, v1: 1, name };
    this.entries.push({ draw, name, pixelWidth, pixelHeight, rect });
    return rect;
  }

  build(renderer, options = {}) {
    const flat = !!options.flat;   /* 纯几何轮：不画贴图，只填平色，版式一致 */
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    const padding = 4;
    const ordered = [...this.entries].sort((a, b) => b.pixelHeight - a.pixelHeight);
    let cursorX = 0;
    let cursorY = 0;
    let rowHeight = 0;
    for (const entry of ordered) {
      const paddedWidth = entry.pixelWidth + padding * 2;
      const paddedHeight = entry.pixelHeight + padding * 2;
      if (cursorX + paddedWidth > this.width) {
        cursorX = 0;
        cursorY += rowHeight;
        rowHeight = 0;
      }
      if (cursorY + paddedHeight > this.height) throw new Error('图集溢出：' + entry.name);
      const left = cursorX + padding;
      const top = cursorY + padding;
      ctx.save();
      ctx.translate(left, top);
      ctx.beginPath();
      ctx.rect(0, 0, entry.pixelWidth, entry.pixelHeight);
      ctx.clip();
      if (flat) {
        let h = 0;
        for (let i = 0; i < entry.name.length; i += 1) h = (h * 31 + entry.name.charCodeAt(i)) >>> 0;
        const v = 150 + (h % 70);
        ctx.fillStyle = `rgb(${v},${v - 6},${v - 14})`;
        ctx.fillRect(0, 0, entry.pixelWidth, entry.pixelHeight);
      } else {
        entry.draw(ctx, entry.pixelWidth, entry.pixelHeight);
      }
      ctx.restore();
      bleed(ctx, left, top, entry.pixelWidth, entry.pixelHeight, padding);
      entry.rect.u0 = (left + 0.5) / this.width;
      entry.rect.u1 = (left + entry.pixelWidth - 0.5) / this.width;
      entry.rect.v0 = 1 - (top + entry.pixelHeight - 0.5) / this.height;
      entry.rect.v1 = 1 - (top + 0.5) / this.height;
      cursorX += paddedWidth;
      rowHeight = Math.max(rowHeight, paddedHeight);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    if (renderer) texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  }
}

function bleed(ctx, left, top, width, height, padding) {
  const canvas = ctx.canvas;
  ctx.drawImage(canvas, left, top, width, 1, left, top - padding, width, padding);
  ctx.drawImage(canvas, left, top + height - 1, width, 1, left, top + height, width, padding);
  ctx.drawImage(canvas, left - padding, top, 1, height, left - padding, top, padding, height);
  ctx.drawImage(canvas, left + width, top, 1, height, left + width, top, padding, height);
}

/* 构件登记：每推入一个几何体就记下它的包围盒，供 test/fit-audit.mjs 做悬空/穿插体检 */
export const PARTS = [];
function pushGeom(bucket, geometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  PARTS.push({
    bucket: bucket.name,
    min: [+box.min.x.toFixed(3), +box.min.y.toFixed(3), +box.min.z.toFixed(3)],
    max: [+box.max.x.toFixed(3), +box.max.y.toFixed(3), +box.max.z.toFixed(3)],
  });
  bucket.geoms.push(geometry);
  return geometry;
}

export const R = {};
export let atlasTexture = null;
export const M = {};

const CAKE = { 桂花糕: 'cake_gh', 绿豆糕: 'cake_ld', 月饼: 'cake_yb', 糖糕: 'cake_tg' };

function registerArt(atlas) {
  R.white = atlas.register('white', 8, 8, (ctx, w, h) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
  });
  /* 横丁（居酒屋）素材 */
  R.tile2 = atlas.register('kawara', 256, 256, (ctx, w, h) => ctx.drawImage(art.kawaraTexture(), 0, 0, w, h));
  R.siding = atlas.register('siding', 256, 256, (ctx, w, h) => ctx.drawImage(art.sidingTexture(), 0, 0, w, h));
  R.noren_1 = atlas.register('noren1', 320, 200, (ctx, w, h) => ctx.drawImage(art.norenTexture('呑み処'), 0, 0, w, h));
  R.noren_2 = atlas.register('noren2', 320, 200, (ctx, w, h) => ctx.drawImage(art.norenTexture('焼き鳥', { base: '#2a2f3a' }), 0, 0, w, h));
  R.lamp_1 = atlas.register('lamp1', 192, 256, (ctx, w, h) => ctx.drawImage(art.lanternJP('酒'), 0, 0, w, h));
  R.lamp_2 = atlas.register('lamp2', 192, 256, (ctx, w, h) => ctx.drawImage(art.lanternJP('焼', { body: '#e8d7a8' }), 0, 0, w, h));
  R.lamp_3 = atlas.register('lamp3', 192, 256, (ctx, w, h) => ctx.drawImage(art.lanternJP('鳥'), 0, 0, w, h));
  R.lamp_4 = atlas.register('lamp4', 192, 256, (ctx, w, h) => ctx.drawImage(art.lanternJP('呑'), 0, 0, w, h));
  R.sign_1 = atlas.register('sign1', 160, 640, (ctx, w, h) => ctx.drawImage(art.verticalSignJP('居酒屋 隆'), 0, 0, w, h));
  R.sign_2 = atlas.register('sign2', 160, 640, (ctx, w, h) => ctx.drawImage(art.verticalSignJP('呑み処', { bg: '#2b2f3a', ink: '#f0e6cd' }), 0, 0, w, h));
  R.menu_1 = atlas.register('menu1', 320, 448, (ctx, w, h) => ctx.drawImage(art.menuBoardJP(['本日のおすすめ', '焼き鳥 各種 150', 'おでん 100', '生ビール 400', '日本酒 500']), 0, 0, w, h));
  R.poster_1 = atlas.register('poster1', 256, 352, (ctx, w, h) => ctx.drawImage(art.posterJP(['営業時間', '18:00 - 翌 3:00', '定休日 火曜'], {}), 0, 0, w, h));
  R.poster_2 = atlas.register('poster2', 256, 352, (ctx, w, h) => ctx.drawImage(art.posterJP(['新装開店', 'お祝い', '大感謝祭'], { bg: '#f6e7c8' }), 0, 0, w, h));
  R.vending = atlas.register('vending', 256, 384, (ctx, w, h) => ctx.drawImage(art.vendingFront(), 0, 0, w, h));
  R.shutter = atlas.register('shutter', 256, 256, (ctx, w, h) => ctx.drawImage(art.shutterTexture(), 0, 0, w, h));
  R.nobori = atlas.register('nobori', 160, 640, (ctx, w, h) => ctx.drawImage(art.noboriTexture('炭火焼鳥'), 0, 0, w, h));
  R.aframe = atlas.register('aframe', 320, 448, (ctx, w, h) => ctx.drawImage(art.aframeTexture(['本日のおすすめ', 'ねぎま 150', 'つくね 180', 'ハイボール 350']), 0, 0, w, h));
  R.windows = atlas.register('windows', 256, 256, (ctx, w, h) => ctx.drawImage(art.buildingWindows(), 0, 0, w, h));
  R.pool = atlas.register('pool', 256, 256, (ctx, w, h) => {
    const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gradient.addColorStop(0, 'rgba(255,206,140,0.9)');
    gradient.addColorStop(0.4, 'rgba(255,168,86,0.35)');
    gradient.addColorStop(1, 'rgba(255,140,50,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  });
  R.plaster = atlas.register('plaster', 256, 256, (ctx, w, h) => {
    const source = art.plasterTexture();
    ctx.drawImage(source, 0, 0, w, h);
  });
  R.dark = atlas.register('dark', 8, 8, (ctx, w, h) => {
    ctx.fillStyle = '#1b1410';
    ctx.fillRect(0, 0, w, h);
  });
}

function toonFrom(texture, gradientMap) {
  return new THREE.MeshToonMaterial({
    color: 0xffffff, gradientMap, map: texture, vertexColors: true,
  });
}

function gradientTexture(values, filter) {
  const data = new Uint8Array(values.length * 4);
  for (let i = 0; i < values.length; i += 1) {
    const level = Math.round(Math.max(0, Math.min(1, values[i])) * 255);
    data[i * 4] = level;
    data[i * 4 + 1] = level;
    data[i * 4 + 2] = level;
    data[i * 4 + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, values.length, 1, THREE.RGBAFormat);
  texture.minFilter = filter;
  texture.magFilter = filter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

export function buildMaterials(renderer, options = {}) {
  const step = options.step === undefined ? currentStage() : options.step;
  const atlas = new Atlas(2048, 2048);
  registerArt(atlas);
  atlasTexture = atlas.build(renderer, { flat: step < 2 });

  const toonGradient = gradientTexture([0.0, 0.13, 0.58, 1.0], THREE.NearestFilter);
  const groundGradient = gradientTexture(
    Array.from({ length: 32 }, (unused, index) => {
      const t = (index + 0.5) / 32;
      return 0.05 * t + 0.95 * Math.pow(Math.max(0, t * 2 - 1), 0.8);
    }),
    THREE.LinearFilter,
  );
  const tiled = (canvas, gradientMap = toonGradient) => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 1;
    return toonFrom(texture, gradientMap);
  };

  M.solid = toonFrom(atlasTexture, toonGradient);
  M.wood = { material: tiled(art.woodTexture()), uvScale: 0.7 };
  M.tile = { material: tiled(art.tileTexture()), uvScale: 1.5 };
  M.brick = { material: tiled(art.brickTexture()), uvScale: 1.0 };
  M.ground = { material: tiled(art.stoneTexture(), groundGradient), uvScale: 2.4 };
  M.paper = { material: new THREE.MeshBasicMaterial({ map: paperTextureCached(), vertexColors: true, toneMapped: true }), uvScale: 0.42 };
  M.glow = new THREE.MeshBasicMaterial({ map: atlasTexture, vertexColors: true, toneMapped: true });
  M.glass = new THREE.MeshPhysicalMaterial({
    color: 0x9dbfe4, transparent: true, opacity: 0.24, roughness: 0.05, metalness: 0.05,
    ior: 1.45, reflectivity: 0.62, envMapIntensity: 2.8, side: THREE.DoubleSide, depthWrite: false,
  });
  return M;
}

let _paperTexture = null;
function paperTextureCached() {
  if (!_paperTexture) {
    _paperTexture = new THREE.CanvasTexture(art.paperTexture());
    _paperTexture.colorSpace = THREE.SRGBColorSpace;
    _paperTexture.wrapS = THREE.RepeatWrapping;
    _paperTexture.wrapT = THREE.RepeatWrapping;
    _paperTexture.anisotropy = 4;
  }
  return _paperTexture;
}

/* =============================================================== 构件（桶） */

/* 轮次（阶段）：1=只有几何与布局；2=加程序化贴图；3=加着色器与后处理 */
let STAGE = 3;
export function setStage(value) { STAGE = value; return STAGE; }
export function currentStage() { return STAGE; }

/* 固定种子随机：让同一场景每次打开完全一致（管线用 options.seed 触发） */
export function seedRandom(seed) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let v = state;
    v = Math.imul(v ^ (v >>> 15), v | 1);
    v ^= v + Math.imul(v ^ (v >>> 7), v | 61);
    return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
  };
}

export function withSeed(seed, fn) {
  const original = Math.random;
  Math.random = seedRandom(seed);
  try { return fn(); } finally { Math.random = original; }
}

export function buckets() {
  const make = (name, spec) => {
    if (spec && spec.material) return { name, geoms: [], material: spec.material, uvScale: spec.uvScale || 0 };
    return { name, geoms: [], material: spec, uvScale: 0 };
  };
  return {
    solid: make('solid', M.solid),
    wood: make('wood', M.wood),
    tile: make('tile', M.tile),
    brick: make('brick', M.brick),
    paper: make('paper', M.paper),
    glow: make('glow', M.glow),
    glass: { name: 'glass', geoms: [], material: M.glass, uvScale: 0 },
    ground: make('ground', M.ground),
  };
}

function resolvePaint(paint) {
  return typeof paint === 'string' ? { color: paint } : { ...paint };
}

function faceDimensions(size, face) {
  if (face === FACE.px || face === FACE.nx) return [size[2], size[1]];
  if (face === FACE.py || face === FACE.ny) return [size[0], size[2]];
  return [size[0], size[1]];
}

function setUV(uv, index, rect, bucket, dimensions) {
  const u = uv.getX(index);
  const v = uv.getY(index);
  if (rect) {
    uv.setXY(index, rect.u0 + u * (rect.u1 - rect.u0), rect.v0 + v * (rect.v1 - rect.v0));
  } else if (bucket.uvScale > 0) {
    uv.setXY(index, (u * dimensions[0]) / bucket.uvScale, (v * dimensions[1]) / bucket.uvScale);
  } else {
    uv.setXY(index, R.white.u0 + u * (R.white.u1 - R.white.u0), R.white.v0 + v * (R.white.v1 - R.white.v0));
  }
}

function applyColor(geometry, paint, opts = {}) {
  const base = resolvePaint(paint);
  const count = geometry.attributes.position.count;
  const colors = new Float32Array(count * 3);
  const perFace = base.faces || null;
  const strength = base.glow === undefined ? 1 : base.glow;
  for (let i = 0; i < count; i += 1) {
    const face = Math.floor(i / 4);
    const source = perFace && perFace[face] ? { ...base, ...perFace[face] } : base;
    const color = new THREE.Color(source.color || '#ffffff');
    const gain = (source.glow === undefined ? strength : source.glow) * (opts.gain || 1);
    colors[i * 3] = color.r * gain;
    colors[i * 3 + 1] = color.g * gain;
    colors[i * 3 + 2] = color.b * gain;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

function applyBoxUV(geometry, paint, bucket, size) {
  const base = resolvePaint(paint);
  const uv = geometry.attributes.uv;
  const faces = base.faces || null;
  for (let face = 0; face < 6; face += 1) {
    const override = faces && faces[face] ? { ...base, ...faces[face] } : base;
    const dimensions = faceDimensions(size, face);
    for (let i = face * 4; i < face * 4 + 4; i += 1) setUV(uv, i, override.map, bucket, dimensions);
  }
}

export function addBox(bucket, center, size, paint) {
  const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const rotation = resolvePaint(paint).rotate;
  if (rotation) {
    geometry.rotateX(rotation[0] || 0);
    geometry.rotateY(rotation[1] || 0);
    geometry.rotateZ(rotation[2] || 0);
  }
  geometry.translate(center[0], center[1], center[2]);
  applyColor(geometry, paint);
  applyBoxUV(geometry, paint, bucket, size);
  pushGeom(bucket, geometry);
  return geometry;
}

export function addBlock(bucket, minimum, maximum, paint) {
  return addBox(
    bucket,
    [(minimum[0] + maximum[0]) / 2, (minimum[1] + maximum[1]) / 2, (minimum[2] + maximum[2]) / 2],
    [maximum[0] - minimum[0], maximum[1] - minimum[1], maximum[2] - minimum[2]],
    paint,
  );
}

export function addQuad(bucket, corners, paint) {
  const [a, b, c, d] = corners.map((point) => new THREE.Vector3(...point));
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, d.x, d.y, d.z,
  ]), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([
    0, 0, 1, 0, 1, 1, 0, 1,
  ]), 2));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  geometry.computeVertexNormals();
  const base = resolvePaint(paint);
  const uv = geometry.attributes.uv;
  const width = a.distanceTo(b);
  const height = a.distanceTo(d);
  for (let i = 0; i < uv.count; i += 1) setUV(uv, i, base.map, bucket, [width, height]);
  const colors = new Float32Array(12);
  const color = new THREE.Color(base.color || '#ffffff');
  const gain = base.glow === undefined ? 1 : base.glow;
  for (let i = 0; i < 4; i += 1) {
    colors[i * 3] = color.r * gain;
    colors[i * 3 + 1] = color.g * gain;
    colors[i * 3 + 2] = color.b * gain;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  pushGeom(bucket, geometry);
  return geometry;
}

export function addTri(bucket, p0, p1, p2, paint) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([...p0, ...p1, ...p2]), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 0.5, 1]), 2));
  geometry.setIndex([0, 1, 2]);
  geometry.computeVertexNormals();
  const base = resolvePaint(paint);
  const color = new THREE.Color(base.color || '#ffffff');
  const colors = new Float32Array(9);
  for (let i = 0; i < 3; i += 1) {
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  pushGeom(bucket, geometry);
  return geometry;
}

export function addCylinder(bucket, center, radius, height, paint, options = {}) {
  const { segments = 12, axis = 'y', topRatio = 1, openEnded = false } = options;
  const geometry = new THREE.CylinderGeometry(radius * topRatio, radius, height, segments, 1, openEnded);
  if (axis === 'z') geometry.rotateX(Math.PI / 2);
  if (axis === 'x') geometry.rotateZ(Math.PI / 2);
  geometry.translate(center[0], center[1], center[2]);
  applyColor(geometry, paint);
  const uv = geometry.attributes.uv;
  const dimensions = [Math.PI * 2 * radius, height];
  for (let i = 0; i < uv.count; i += 1) setUV(uv, i, resolvePaint(paint).map, bucket, dimensions);
  pushGeom(bucket, geometry);
  return geometry;
}

export function addSphere(bucket, center, radius, paint, options = {}) {
  const { segments = 12, rings = 8, scale = [1, 1, 1] } = options;
  const geometry = new THREE.SphereGeometry(radius, segments, rings);
  geometry.scale(scale[0], scale[1], scale[2]);
  geometry.translate(center[0], center[1], center[2]);
  applyColor(geometry, paint);
  const uv = geometry.attributes.uv;
  const dimensions = [Math.PI * 2 * radius * scale[0], Math.PI * radius * scale[1]];
  for (let i = 0; i < uv.count; i += 1) setUV(uv, i, resolvePaint(paint).map, bucket, dimensions);
  pushGeom(bucket, geometry);
  return geometry;
}

export function addRod(bucket, start, end, radius, paint, segments = 8) {
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const direction = new THREE.Vector3().subVectors(b, a);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radius, radius, length, segments, 1);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  geometry.applyQuaternion(quaternion);
  const middle = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  geometry.translate(middle.x, middle.y, middle.z);
  applyColor(geometry, paint);
  const uv = geometry.attributes.uv;
  const dimensions = [Math.PI * 2 * radius, length];
  for (let i = 0; i < uv.count; i += 1) setUV(uv, i, resolvePaint(paint).map, bucket, dimensions);
  pushGeom(bucket, geometry);
  return geometry;
}

export let outlineMaterial = null;
export function setOutlineMaterial(material) { outlineMaterial = material; }

export function assemble(bucket, parent, options = {}) {
  if (!bucket.geoms.length) return null;
  const merged = mergeGeometries(bucket.geoms, false);
  bucket.geoms.forEach((geometry) => geometry.dispose());
  bucket.geoms.length = 0;
  const mesh = new THREE.Mesh(merged, bucket.material);
  mesh.castShadow = options.cast !== false;
  mesh.receiveShadow = options.receive !== false;
  mesh.layers.set(options.layer === undefined ? LAYER.SOLID : options.layer);
  parent.add(mesh);
  mesh.userData.disposable = true;
  /* 三渲二描边：同一份几何体外扩一层反面（inverted hull），与主渲染同批出，交给后期统一处理 */
  if (outlineMaterial && options.outline !== false && options.layer !== LAYER.FX) {
    const hull = new THREE.Mesh(merged, outlineMaterial);
    hull.castShadow = false;
    hull.receiveShadow = false;
    hull.layers.mask = mesh.layers.mask;
    hull.frustumCulled = false;
    hull.renderOrder = -1;
    parent.add(hull);
    mesh.userData.hull = hull;
  }
  return mesh;
}

/* =============================================================== 舞台 */

export function createStage(canvas) {
  /* antialias 关掉：抗锯齿交给后期链的 SMAA；preserveDrawingBuffer 为了自检脚本能读像素 */
  const renderer = new THREE.WebGLRenderer({ antialias: false, canvas, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.autoClear = false;
  renderer.setClearColor(0x05070d, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070a12);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 260);
  camera.layers.enableAll();

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.85;
  controls.panSpeed = 0.5;
  controls.minDistance = 3;
  controls.maxDistance = 60;
  controls.minPolarAngle = 0.15;
  controls.maxPolarAngle = 1.52;
  controls.enablePan = false;

  return { renderer, scene, camera, controls };
}

export function applyCameraPose(camera, controls, pose) {
  const polar = THREE.MathUtils.degToRad(pose.polar);
  const azimuth = THREE.MathUtils.degToRad(pose.azimuth);
  const distance = pose.distance;
  const target = new THREE.Vector3(...pose.target);
  camera.position.set(
    target.x + distance * Math.sin(polar) * Math.sin(azimuth),
    target.y + distance * Math.cos(polar),
    target.z + distance * Math.sin(polar) * Math.cos(azimuth),
  );
  camera.lookAt(target);
  camera.fov = pose.fov || 38;
  camera.updateProjectionMatrix();
  controls.target.copy(target);
  controls.update();
}

/* 墨线：反面外扩（inverted hull），一圈绘制整个描边层 */
export function createOutlineMaterial(color = '#2a2018', thickness = 0.03) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uThickness: { value: thickness } },
    vertexShader: `
      uniform float uThickness;
      void main() {
        vec3 n = normalize(normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float dist = max(0.001, -mv.z);
        vec3 shifted = position + n * uThickness * clamp(dist * 0.55, 0.55, 4.5);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(shifted, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() { gl_FragColor = vec4(uColor, 1.0); }
    `,
    side: THREE.BackSide,
  });
}

/* =============================================================== 光效 */

let glowTexture = null;
function getGlowTexture() {
  if (!glowTexture) {
    glowTexture = new THREE.CanvasTexture(art.roundGlowTexture());
    glowTexture.colorSpace = THREE.SRGBColorSpace;
  }
  return glowTexture;
}

/* 夜空穹顶：顶点色渐变（不受光照影响，给暗场一个层次） */
export function makeSky(radius = 90) {
  const geometry = new THREE.SphereGeometry(radius, 24, 16);
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const horizon = new THREE.Color('#04060b');
  const zenith = new THREE.Color('#101a30');
  const scratch = new THREE.Color();
  for (let i = 0; i < positions.count; i += 1) {
    const t = Math.max(0, Math.min(1, (positions.getY(i) / radius + 0.35) / 1.15));
    scratch.copy(horizon).lerp(zenith, Math.pow(t, 0.85));
    colors[i * 3] = scratch.r;
    colors[i * 3 + 1] = scratch.g;
    colors[i * 3 + 2] = scratch.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, depthWrite: false, toneMapped: false, fog: false });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.layers.set(LAYER.FX);
  mesh.renderOrder = -1;
  mesh.frustumCulled = false;
  return mesh;
}

export function makeGlowSprite(color, size, opacity = 0.5) {
  const material = new THREE.SpriteMaterial({
    map: getGlowTexture(), color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(size, size, 1);
  sprite.layers.set(LAYER.FX);
  sprite.userData.disposable = true;
  return sprite;
}

/* 地面上的暖光池（也是雨夜湿地的反光近似） */
export function makeLightPool(x, z, radiusX, radiusZ, color, opacity = 0.75, y = 0.012) {
  const material = new THREE.MeshBasicMaterial({
    map: atlasTexture, color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
  });
  const geometry = new THREE.PlaneGeometry(1, 1);
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i += 1) {
    setUV(uv, i, R.pool, { uvScale: 0 }, [1, 1]);
  }
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.scale.set(radiusX, radiusZ, 1);
  mesh.position.set(x, y, z);
  mesh.renderOrder = 3;
  mesh.layers.set(LAYER.FX);
  mesh.userData.disposable = true;
  return mesh;
}

export function warmPoint(x, y, z, intensity = 8, distance = 12, color = 0xffb066) {
  const light = new THREE.PointLight(color, intensity, distance, 2);
  light.position.set(x, y, z);
  return light;
}

export function moonLight(options = {}) {
  const light = new THREE.DirectionalLight(options.color || 0x93a9cf, options.intensity || 1.5);
  light.position.set(options.x || -9, options.y || 13, options.z || 8);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  const extent = options.extent || 14;
  light.shadow.camera.left = -extent;
  light.shadow.camera.right = extent;
  light.shadow.camera.top = extent;
  light.shadow.camera.bottom = -extent;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 60;
  light.shadow.bias = -0.0012;
  light.shadow.normalBias = 0.02;
  return light;
}

/* 雨：斜落雨丝（线段，比点精灵更像雨） */
export function makeRain(options = {}) {
  const count = options.count || 900;
  const area = options.area || 26;
  const height = options.height || 14;
  const cx = options.cx || 0;
  const cz = options.cz || 0;
  const y0 = options.y0 || 0;
  const slant = options.slant || [0.16, -1, 0.04];
  const positions = new Float32Array(count * 6);
  const speeds = new Float32Array(count);
  const heads = [];
  const direction = new THREE.Vector3(...slant).normalize();
  for (let i = 0; i < count; i += 1) {
    const head = new THREE.Vector3(cx + (Math.random() - 0.5) * area, y0 + Math.random() * height, cz + (Math.random() - 0.5) * area);
    heads.push(head);
    speeds[i] = 13 + Math.random() * 9;
    const tail = head.clone().addScaledVector(direction, -(0.42 + Math.random() * 0.5));
    positions.set([head.x, head.y, head.z, tail.x, tail.y, tail.z], i * 6);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({
    color: options.color || 0xa9c4ea, transparent: true,
    opacity: options.opacity === undefined ? 0.42 : options.opacity,
    depthWrite: false, toneMapped: false,
  });
  const lines = new THREE.LineSegments(geometry, material);
  lines.layers.set(LAYER.FX);
  lines.frustumCulled = false;
  lines.userData.disposable = true;
  return {
    object: lines,
    update(delta) {
      const array = geometry.attributes.position.array;
      for (let i = 0; i < count; i += 1) {
        const head = heads[i];
        head.addScaledVector(direction, speeds[i] * delta);
        if (head.y < y0 - 0.25) {
          head.set(cx + (Math.random() - 0.5) * area, y0 + height, cz + (Math.random() - 0.5) * area);
        }
        const tail = head.clone().addScaledVector(direction, -(0.42 + (speeds[i] - 13) * 0.06));
        array[i * 6] = head.x; array[i * 6 + 1] = head.y; array[i * 6 + 2] = head.z;
        array[i * 6 + 3] = tail.x; array[i * 6 + 4] = tail.y; array[i * 6 + 5] = tail.z;
      }
      geometry.attributes.position.needsUpdate = true;
    },
  };
}

/* 雨滴落地涟漪：地面上扩散并淡出的圆环 */
export function makeRipples(count = 22, area = 16, options = {}) {
  const peakOpacity = options.opacity === undefined ? 0.34 : options.opacity;
  let texture = null;
  if (!texture) {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(206,224,255,0.9)';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(64, 64, 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(206,224,255,0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(64, 64, 36, 0, Math.PI * 2);
    ctx.stroke();
    texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  const group = new THREE.Group();
  const ripples = [];
  for (let i = 0; i < count; i += 1) {
    const material = new THREE.MeshBasicMaterial({
      map: texture, transparent: true, opacity: 0.3, depthWrite: false,
      blending: THREE.AdditiveBlending, toneMapped: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set((Math.random() - 0.5) * area, 0.015, (Math.random() - 0.5) * area);
    mesh.layers.set(LAYER.FX);
    mesh.renderOrder = 4;
    mesh.userData.disposable = true;
    group.add(mesh);
    ripples.push({ mesh, phase: Math.random(), rate: 0.7 + Math.random() * 0.6 });
  }
  return {
    object: group,
    update(delta, time) {
      for (const ripple of ripples) {
        const t = ((time * ripple.rate + ripple.phase * 2.4) % 1.6) / 1.6;
        const scale = 0.25 + t * 1.15;
        ripple.mesh.scale.set(scale, scale, 1);
        ripple.mesh.material.opacity = peakOpacity * (1 - t) * Math.min(1, t * 6);
      }
    },
  };
}

/* 蒸汽：蒸笼上的白汽 */
export function makeSteam(origins, options = {}) {
  const rise = options.rise || 1.5;
  const spread = options.spread || 0.5;
  const puffs = [];
  const group = new THREE.Group();
  const texture = new THREE.CanvasTexture(art.roundGlowTexture('rgba(238,244,255,0.8)', 'rgba(238,244,255,0)'));
  texture.colorSpace = THREE.SRGBColorSpace;
  origins.forEach((origin, originIndex) => {
    for (let i = 0; i < 6; i += 1) {
      const material = new THREE.SpriteMaterial({
        map: texture, color: 0xe9effa, transparent: true, opacity: 0.3,
        depthWrite: false, toneMapped: false, blending: THREE.NormalBlending,
      });
      const sprite = new THREE.Sprite(material);
      const phase = Math.random();
      sprite.layers.set(LAYER.FX);
      sprite.userData.disposable = true;
      group.add(sprite);
      puffs.push({ sprite, phase, origin, offset: (Math.random() - 0.5) * spread, drift: (Math.random() - 0.5) * 0.3, index: originIndex });
    }
  });
  return {
    object: group,
    update(delta, time) {
      for (const puff of puffs) {
        const cycle = 2.9;
        const t = ((time * 0.5 + puff.phase * cycle) % cycle) / cycle;
        puff.sprite.position.set(
          puff.origin[0] + puff.offset + Math.sin((time + puff.phase * 6) * 1.1) * 0.12 + t * puff.drift,
          puff.origin[1] + t * rise + delta * 0,
          puff.origin[2] + puff.offset * 0.6,
        );
        const scale = 0.5 + t * 1.75;
        puff.sprite.scale.set(scale, scale * 1.45, 1);
        puff.sprite.material.opacity = 0.62 * Math.min(1, t * 8) * Math.pow(1 - t, 0.65);
      }
    },
  };
}
