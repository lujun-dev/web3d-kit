/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { W } from '../core/world.js';
import {
  createCanvas,
  drawDiamondMarking,
  drawGrate,
  drawPavers,
  drawTactilePaving,
  drawText,
  fillCornerOutside,
  fillEllipse,
  fillGroundRect,
} from '../core/canvas.js';
import {
  FONT_PLAIN,
  GROUND_SCALE,
  GROUND_SIZE,
  LOT_Y,
  PUDDLES,
  WET_SCALE,
  WET_SIZE,
} from '../core/constants.js';
import { addWetBlob, finalizeBuckets } from '../core/geometry.js';
import { createBackgroundTexture, createGlassMaterial, createToonMaterial } from '../core/materials.js';
import { loadPhotos } from '../core/photos.js';
import { ASPHALT_TILE_PX, drawPhotoTiled, photos } from '../core/photos.js';
import { random, randomBetween } from '../core/math.js';
import {
  registerAtlasRegions,
  strokeGroundArc,
  toGroundX,
  toGroundY,
  toWetX,
  toWetY,
} from '../core/util.js';
import { buildAlley } from '../props/buildAlley.js';
import { buildBackyard } from '../props/buildBackyard.js';
import { buildBicycle } from '../props/buildBicycle.js';
import { buildCat } from '../props/buildCat.js';
import { buildDisplayBase } from '../props/buildDisplayBase.js';
import { buildGround } from '../props/buildGround.js';
import { buildGuardrails } from '../props/buildGuardrails.js';
import { buildInterior } from '../props/buildInterior.js';
import { buildNeighbor } from '../props/buildNeighbor.js';
import { buildPlanters } from '../props/buildPlanters.js';
import { buildPoleSign } from '../props/buildPoleSign.js';
import { buildPolesAndWires } from '../props/buildPolesAndWires.js';
import { buildRoadSigns } from '../props/buildRoadSigns.js';
import { buildRooftop } from '../props/buildRooftop.js';
import { buildStoreShell } from '../props/buildStoreShell.js';
import { buildStorefrontItems } from '../props/buildStorefrontItems.js';
import { buildStreetLamp } from '../props/buildStreetLamp.js';
import { buildTrafficSignal } from '../props/buildTrafficSignal.js';
import { buildVendingArea } from '../props/buildVendingArea.js';
import { drawManhole } from '../regions/drawManhole.js';
import { animate } from '../systems/animate.js';
import { createDoors } from '../systems/createDoors.js';
import { createEffects } from '../systems/createEffects.js';
import { createLights } from '../systems/createLights.js';
import { handleResize } from '../systems/handleResize.js';
import { placeInitialCamera } from '../systems/placeInitialCamera.js';
import { waitForFonts } from '../systems/waitForFonts.js';

/* drawGroundAlbedo（scene） */
export function drawGroundAlbedo() {
  const canvas = createCanvas(GROUND_SIZE, GROUND_SIZE);
  const context = canvas.getContext('2d');
  const asphalt = '#373b44';
  const lineWhite = '#e6e6df';
  const curbConcrete = '#8c8f97';
  const gutterConcrete = '#5f626a';
  context.fillStyle = asphalt;
  context.fillRect(0, 0, GROUND_SIZE, GROUND_SIZE);
  // 真实沥青照片（CC0 Asphalt033）铺满路面底子；后面的区域色块/铺装/标线照旧盖在上面
  if (drawPhotoTiled(context, photos.asphalt, 0, 0, GROUND_SIZE, GROUND_SIZE, ASPHALT_TILE_PX)) {
    context.fillStyle = 'rgba(14, 18, 28, 0.34)';
    context.fillRect(0, 0, GROUND_SIZE, GROUND_SIZE);
    // 再叠一层同图（overlay 混合）：把照片本身的颗粒对比拉出来，否则沥青太平看不出材质
    context.save();
    context.globalAlpha = 0.5;
    context.globalCompositeOperation = 'overlay';
    drawPhotoTiled(context, photos.asphalt, 0, 0, GROUND_SIZE, GROUND_SIZE, ASPHALT_TILE_PX);
    context.restore();
  }

  // Store lot, alley, neighbor yard and back yard.
  fillGroundRect(context, -12, -12, 3.8, 3.8, '#5d6068');
  fillGroundRect(context, -5.2, 0.35, 3.8, 3.8, '#32363e');
  fillGroundRect(context, -5.2, -1.0, 3.9, 0.35, '#7a7d85');
  context.strokeStyle = 'rgba(40, 42, 48, 0.45)';
  context.lineWidth = 1.5;
  for (let x = -5.2; x <= 3.9; x += 0.3) {
    context.beginPath();
    context.moveTo(toGroundX(x), toGroundY(-1.0));
    context.lineTo(toGroundX(x), toGroundY(0.35));
    context.stroke();
  }
  for (let z = -1.0; z <= 0.35; z += 0.3) {
    context.beginPath();
    context.moveTo(toGroundX(-5.2), toGroundY(z));
    context.lineTo(toGroundX(3.9), toGroundY(z));
    context.stroke();
  }
  fillGroundRect(context, -12, -2.2, -7.3, 3.8, '#666870');
  context.strokeStyle = 'rgba(30, 32, 38, 0.5)';
  for (let z = -2.2; z < 3.8; z += 1.5) {
    context.beginPath();
    context.moveTo(toGroundX(-12), toGroundY(z));
    context.lineTo(toGroundX(-7.3), toGroundY(z));
    context.stroke();
  }
  fillGroundRect(context, -7.3, -11.7, -5.2, 3.8, '#4a4d55');
  fillGroundRect(context, -6.42, -11.6, -6.08, 3.6, '#2a2d33');
  for (let z = -11.6; z < 3.6; z += 0.5) {
    drawGrate(context, -6.25, z + 0.25, false);
  }
  fillGroundRect(context, -5.2, -11.7, 3.8, -8.0, '#565961');
  fillGroundRect(context, -12, -12, 3.8, -11.7, '#4a453e');

  // Sidewalks.
  drawPavers(context, -12, 3.8, 5.6, 5.6, false);
  drawPavers(context, 3.8, -12, 5.6, 4.4, true);
  drawPavers(context, -12, 10.6, 12, 12, false);
  drawPavers(context, 10.6, -12, 12, 5.6, true);
  fillGroundRect(context, -3.6, 3.8, 1.6, 5.42, '#6a6c74');
  fillCornerOutside(context, 4.4, 4.4, 5.6, 5.6, 4.4, 4.4, 1.2, asphalt);
  fillCornerOutside(context, 10.6, 4.8, 11.4, 5.6, 11.4, 4.8, 0.8, asphalt);

  // Curb stones.
  fillGroundRect(context, -12, 5.42, 4.4, 5.6, curbConcrete);
  fillGroundRect(context, 5.42, -12, 5.6, 4.4, curbConcrete);
  strokeGroundArc(context, 4.4, 4.4, 1.11, 0, Math.PI / 2, 0.18, curbConcrete);
  fillGroundRect(context, -12, 10.6, 12, 10.78, curbConcrete);
  fillGroundRect(context, 10.6, -12, 10.78, 4.8, curbConcrete);
  strokeGroundArc(context, 11.4, 4.8, 0.71, Math.PI / 2, Math.PI, 0.18, curbConcrete);

  // Concrete gutters beside the curbs.
  fillGroundRect(context, -12, 5.6, 4.4, 5.9, gutterConcrete);
  fillGroundRect(context, 5.6, -12, 5.9, 4.4, gutterConcrete);
  strokeGroundArc(context, 4.4, 4.4, 1.35, 0, Math.PI / 2, 0.3, gutterConcrete);
  fillGroundRect(context, -12, 10.3, 12, 10.6, gutterConcrete);
  fillGroundRect(context, 10.3, -12, 10.6, 4.8, gutterConcrete);
  strokeGroundArc(context, 11.4, 4.8, 0.95, Math.PI / 2, Math.PI, 0.3, gutterConcrete);
  for (const x of [-9.5, -4.4, 0.6]) {
    drawGrate(context, x, 5.75, true);
  }
  for (const x of [-8.2, -1.8, 7.6]) {
    drawGrate(context, x, 10.45, true);
  }
  for (const z of [-9.8, -4.6, -0.6]) {
    drawGrate(context, 5.75, z, false);
  }
  for (const z of [-8.4, -2.6]) {
    drawGrate(context, 10.45, z, false);
  }

  // Asphalt repairs, cracks and oil stains.
  for (let patch = 0; patch < 9; patch += 1) {
    const isFrontRoad = random() < 0.6;
    const x = isFrontRoad ? randomBetween(-11, 11) : randomBetween(6.2, 10);
    const z = isFrontRoad ? randomBetween(6.2, 10) : randomBetween(-11, 0);
    context.fillStyle = 'rgba(20, 22, 26, 0.35)';
    context.fillRect(toGroundX(x), toGroundY(z), randomBetween(0.6, 1.8) * GROUND_SCALE, randomBetween(0.4, 1.2) * GROUND_SCALE);
  }
  context.strokeStyle = 'rgba(18, 19, 22, 0.55)';
  context.lineWidth = 1.5;
  for (let crack = 0; crack < 26; crack += 1) {
    let x = toGroundX(randomBetween(-11.5, 11.5));
    let y = toGroundY(randomBetween(5.8, 10.4));
    if (random() < 0.4) {
      x = toGroundX(randomBetween(5.8, 10.4));
      y = toGroundY(randomBetween(-11.5, 5));
    }
    context.beginPath();
    context.moveTo(x, y);
    for (let segment = 0; segment < 5; segment += 1) {
      x += randomBetween(-14, 14);
      y += randomBetween(-14, 14);
      context.lineTo(x, y);
    }
    context.stroke();
  }
  for (let stain = 0; stain < 5; stain += 1) {
    fillEllipse(context, toGroundX(randomBetween(-3.2, 1.2)), toGroundY(randomBetween(1.4, 3.2)), randomBetween(10, 26), randomBetween(8, 18), random() * 3, 'rgba(10, 10, 14, 0.35)');
  }

  // Road markings.
  fillGroundRect(context, -12, 5.92, 1.1, 6.04, lineWhite);
  fillGroundRect(context, -12, 10.16, 1.1, 10.28, lineWhite);
  fillGroundRect(context, 5.3, 10.16, 12, 10.28, lineWhite);
  fillGroundRect(context, 5.92, -12, 6.04, 1.1, lineWhite);
  fillGroundRect(context, 10.16, -12, 10.28, 1.1, lineWhite);
  for (let x = -12; x < 1.0; x += 3.0) {
    fillGroundRect(context, x, 8.03, Math.min(x + 1.7, 1.0), 8.17, lineWhite);
  }
  for (let z = 6.0; z < 10.2; z += 0.9) {
    fillGroundRect(context, 1.4, z, 5.0, z + 0.45, lineWhite);
  }
  for (let x = 6.0; x < 10.2; x += 0.9) {
    fillGroundRect(context, x, 1.4, x + 0.45, 5.0, lineWhite);
  }
  fillGroundRect(context, 5.95, 0.6, 10.25, 0.92, lineWhite);
  context.save();
  context.translate(toGroundX(8.1), toGroundY(-1.75));
  context.rotate(Math.PI);
  context.scale(1, 2.5);
  drawText(context, '止まれ', 0, 0, { color: lineWhite, family: FONT_PLAIN, size: 0.95 * GROUND_SCALE, weight: 900 });
  context.restore();
  drawDiamondMarking(context, -7.6, 6.85, true);
  drawDiamondMarking(context, 8.1, -7.2, false);
  drawManhole(context, -3.6, 7.3);
  drawManhole(context, 8.3, -9.2);

  // Tactile paving at the crossings and along the store-side sidewalk.
  drawTactilePaving(context, 1.6, 5.02, 4.8, 5.32, false);
  drawTactilePaving(context, 5.02, 1.6, 5.32, 4.8, false);
  drawTactilePaving(context, 1.6, 10.88, 4.8, 11.18, false);
  drawTactilePaving(context, 10.88, 1.6, 11.18, 4.8, false);
  drawTactilePaving(context, -12, 4.5, 1.6, 4.8, true);
  drawTactilePaving(context, 4.5, -12, 4.8, 1.6, true);

  // Parking stalls and bicycle area.
  for (const x of [-3.4, -1.0, 1.4]) {
    fillGroundRect(context, x - 0.05, 0.75, x + 0.05, 3.4, lineWhite);
  }
  fillGroundRect(context, -3.45, 3.3, 1.45, 3.4, lineWhite);
  context.strokeStyle = lineWhite;
  context.lineWidth = 0.07 * GROUND_SCALE;
  const bikeX = toGroundX(-4.3);
  const bikeY = toGroundY(0.85);
  const wheel = 0.22 * GROUND_SCALE;
  context.beginPath();
  context.arc(bikeX - wheel * 1.3, bikeY, wheel, 0, Math.PI * 2);
  context.moveTo(bikeX + wheel * 2.3, bikeY);
  context.arc(bikeX + wheel * 1.3, bikeY, wheel, 0, Math.PI * 2);
  context.moveTo(bikeX - wheel * 1.3, bikeY);
  context.lineTo(bikeX, bikeY - wheel);
  context.lineTo(bikeX + wheel * 1.3, bikeY);
  context.stroke();

  // Fine grain everywhere.
  if (typeof window !== 'undefined') window.__groundCanvas = canvas; // 诊断探针
  const image = context.getImageData(0, 0, GROUND_SIZE, GROUND_SIZE);
  const data = image.data;
  let seed = 12345;
  for (let index = 0; index < data.length; index += 4) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const noise = ((seed >>> 24) - 128) * 0.1;
    data[index] += noise;
    data[index + 1] += noise;
    data[index + 2] += noise;
  }
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = W.renderer.capabilities.getMaxAnisotropy();
  return texture;
}

/* drawWetMask（scene） */
export function drawWetMask() {
  const canvas = createCanvas(WET_SIZE, WET_SIZE);
  const context = canvas.getContext('2d');
  context.fillStyle = 'rgb(0, 130, 0)';
  context.fillRect(0, 0, WET_SIZE, WET_SIZE);
  context.globalCompositeOperation = 'lighter';
  for (let blob = 0; blob < 70; blob += 1) {
    addWetBlob(context, randomBetween(-12, 12), randomBetween(-12, 12), randomBetween(0.8, 3), randomBetween(0.8, 3), 0, 90, 0);
  }
  for (const puddle of PUDDLES) {
    const count = 5 + Math.floor(random() * 4);
    for (let blob = 0; blob < count; blob += 1) {
      const offsetX = (random() - 0.5) * puddle.width * 0.7;
      const offsetZ = (random() - 0.5) * puddle.depth * 0.7;
      addWetBlob(context, puddle.x + offsetX, puddle.z + offsetZ, puddle.width * randomBetween(0.3, 0.5), puddle.depth * randomBetween(0.3, 0.5), Math.round(150 * puddle.strength), 0, 0);
    }
  }
  for (let blob = 0; blob < 36; blob += 1) {
    const isFrontRoad = random() < 0.55;
    const x = isFrontRoad ? randomBetween(-11.5, 11.5) : randomBetween(5.8, 10.4);
    const z = isFrontRoad ? randomBetween(5.8, 10.4) : randomBetween(-11.5, 5);
    addWetBlob(context, x, z, randomBetween(0.15, 0.4), randomBetween(0.12, 0.3), 170, 0, 0);
  }
  context.fillStyle = 'rgb(0, 0, 220)';
  context.fillRect(toWetX(-12), toWetY(5.62), 16.4 * WET_SCALE, 0.3 * WET_SCALE);
  context.fillRect(toWetX(-12), toWetY(10.28), 24 * WET_SCALE, 0.3 * WET_SCALE);
  context.fillRect(toWetX(5.62), toWetY(-12), 0.3 * WET_SCALE, 16.4 * WET_SCALE);
  context.fillRect(toWetX(10.28), toWetY(-12), 0.3 * WET_SCALE, 16.8 * WET_SCALE);
  context.fillRect(toWetX(-6.42), toWetY(-11.6), 0.34 * WET_SCALE, 15.2 * WET_SCALE);
  context.globalCompositeOperation = 'source-over';
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

/* createLotShape（scene） */
export function createLotShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-12, 12);
  shape.lineTo(5.6, 12);
  shape.lineTo(5.6, -4.4);
  shape.absarc(4.4, -4.4, 1.2, 0, -Math.PI / 2, true);
  shape.lineTo(-12, -5.6);
  shape.closePath();
  return shape;
}

/* createFarRightShape（scene） */
export function createFarRightShape() {
  const shape = new THREE.Shape();
  shape.moveTo(10.6, 12);
  shape.lineTo(12, 12);
  shape.lineTo(12, -5.6);
  shape.lineTo(11.4, -5.6);
  shape.absarc(11.4, -4.8, 0.8, -Math.PI / 2, -Math.PI, true);
  shape.closePath();
  return shape;
}

/* createFarFrontShape（scene） */
export function createFarFrontShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-12, -10.6);
  shape.lineTo(12, -10.6);
  shape.lineTo(12, -12);
  shape.lineTo(-12, -12);
  shape.closePath();
  return shape;
}

/* createGroundGeometry（scene） */
export function createGroundGeometry() {
  const pieces = [];
  const road = new THREE.PlaneGeometry(24, 24, 1, 1);
  road.rotateX(-Math.PI / 2);
  pieces.push(road.toNonIndexed());
  for (const shape of [createLotShape(), createFarRightShape(), createFarFrontShape()]) {
    const extruded = new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, curveSegments: 12, depth: LOT_Y });
    extruded.rotateX(-Math.PI / 2);
    pieces.push(extruded.index ? extruded.toNonIndexed() : extruded);
  }
  for (const piece of pieces) {
    piece.clearGroups();
    piece.deleteAttribute('uv');
  }
  const merged = mergeGeometries(pieces, false);
  const position = merged.attributes.position;
  const uvs = new Float32Array(position.count * 2);
  for (let vertex = 0; vertex < position.count; vertex += 1) {
    uvs[vertex * 2] = (position.getX(vertex) + 12) / 24;
    uvs[vertex * 2 + 1] = 1 - (position.getZ(vertex) + 12) / 24;
  }
  merged.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  return merged;
}

/* initialize（scene） */
export async function initialize() {
  await waitForFonts();
  await loadPhotos();
  registerAtlasRegions();
  const atlasTexture = W.atlas.pack();
  W.materials = {
    cutout: createToonMaterial(atlasTexture, true),
    exteriorGlass: createGlassMaterial(true),
    interiorGlass: createGlassMaterial(false),
    toon: createToonMaterial(atlasTexture, false),
  };
  W.backgroundTexture = createBackgroundTexture();
  W.scene.background = W.backgroundTexture;
  buildDisplayBase();
  buildGround();
  buildStoreShell();
  buildInterior();
  buildStorefrontItems();
  buildPoleSign();
  buildVendingArea();
  buildBicycle([-4.35, LOT_Y, 2.0], Math.PI / 2 + 0.15);
  buildCat();
  buildStreetLamp();
  buildPolesAndWires();
  buildTrafficSignal();
  buildRoadSigns();
  buildGuardrails();
  buildPlanters();
  buildNeighbor();
  buildAlley();
  buildBackyard();
  buildRooftop();
  finalizeBuckets();
  createDoors();
  createLights();
  createEffects();
  handleResize();
  placeInitialCamera();
  window.addEventListener('resize', handleResize);
  W.renderer.setAnimationLoop(animate);
  requestAnimationFrame(() => {
    W.canvasElement.classList.add('is-ready');
  });
}
