/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from './world.js';
import { createCanvas, createGradientTexture, extendAtlasEdges, getSubRect } from './canvas.js';
import {
  BRAND,
  FACE,
  FONT_ROUNDED,
  GROUND_SCALE,
  PACKAGE_COLUMNS,
  PACKAGE_ROWS,
  PRODUCT_CATEGORIES,
  WET_SCALE,
} from './constants.js';
import { addBox, addCylinder, getCachedGeometry, getCurrentTransform } from './geometry.js';
import { hashNumber, pickRandom, random, randomBetween } from './math.js';
import { drawAcFace } from '../regions/drawAcFace.js';
import { drawAcGrill } from '../regions/drawAcGrill.js';
import { drawAddressPlate } from '../regions/drawAddressPlate.js';
import { drawAtm } from '../regions/drawAtm.js';
import { drawBasketGrid } from '../regions/drawBasketGrid.js';
import { drawBentoSheet } from '../regions/drawBentoSheet.js';
import { drawBlockWall } from '../regions/drawBlockWall.js';
import { drawBottleStrips } from '../regions/drawBottleStrips.js';
import { drawBulletinBoard } from '../regions/drawBulletinBoard.js';
import { drawCaseSign } from '../regions/drawCaseSign.js';
import { drawCategorySigns } from '../regions/drawCategorySigns.js';
import { drawCigaretteShelf } from '../regions/drawCigaretteShelf.js';
import { drawClock } from '../regions/drawClock.js';
import { drawCoffeeMachine } from '../regions/drawCoffeeMachine.js';
import { drawCopier } from '../regions/drawCopier.js';
import { drawCounterFront } from '../regions/drawCounterFront.js';
import { drawCrosswalkSign } from '../regions/drawCrosswalkSign.js';
import { drawCurtainWindow } from '../regions/drawCurtainWindow.js';
import { drawDoorMat } from '../regions/drawDoorMat.js';
import { drawFreezerLabel } from '../regions/drawFreezerLabel.js';
import { drawFridgeHeader } from '../regions/drawFridgeHeader.js';
import { drawHotSnackTray } from '../regions/drawHotSnackTray.js';
import { drawIceCreamTop } from '../regions/drawIceCreamTop.js';
import { drawMagazineSheet } from '../regions/drawMagazineSheet.js';
import { drawMenuBoard } from '../regions/drawMenuBoard.js';
import { drawNeighborSign } from '../regions/drawNeighborSign.js';
import { drawNikumanFront } from '../regions/drawNikumanFront.js';
import { drawOdenTop } from '../regions/drawOdenTop.js';
import { drawOpenSign } from '../regions/drawOpenSign.js';
import { drawPackageSheet } from '../regions/drawPackageSheet.js';
import { drawPlaque } from '../regions/drawPlaque.js';
import { drawPoleAd } from '../regions/drawPoleAd.js';
import { drawPoleGuard } from '../regions/drawPoleGuard.js';
import { drawPoleSignFace } from '../regions/drawPoleSignFace.js';
import { drawPoleSignSub } from '../regions/drawPoleSignSub.js';
import { drawPopSigns } from '../regions/drawPopSigns.js';
import { drawPriceStrip } from '../regions/drawPriceStrip.js';
import { drawRecycleLabel } from '../regions/drawRecycleLabel.js';
import { drawRoofSurface } from '../regions/drawRoofSurface.js';
import { drawRoofTiles } from '../regions/drawRoofTiles.js';
import { drawShutter } from '../regions/drawShutter.js';
import { drawSignBack } from '../regions/drawSignBack.js';
import { drawSignBand } from '../regions/drawSignBand.js';
import { drawSmallLabel } from '../regions/drawSmallLabel.js';
import { drawSpokes } from '../regions/drawSpokes.js';
import { drawStaffSign } from '../regions/drawStaffSign.js';
import { drawSticker } from '../regions/drawSticker.js';
import { drawStopSign } from '../regions/drawStopSign.js';
import { drawStoreFloor } from '../regions/drawStoreFloor.js';
import { drawStrata } from '../regions/drawStrata.js';
import { drawStreetName } from '../regions/drawStreetName.js';
import { drawTrashLabels } from '../regions/drawTrashLabels.js';
import { drawVendingFront } from '../regions/drawVendingFront.js';
import { drawWalkSignal } from '../regions/drawWalkSignal.js';
import { drawWallPosters } from '../regions/drawWallPosters.js';
import { drawWetFloorSign } from '../regions/drawWetFloorSign.js';
import { drawWindowPosters } from '../regions/drawWindowPosters.js';

/* sprinkle（core/util） */
export function sprinkle(context, width, height, count, colors, minimumSize, maximumSize) {
  for (let index = 0; index < count; index += 1) {
    const size = randomBetween(minimumSize, maximumSize);
    context.fillStyle = pickRandom(colors);
    context.fillRect(random() * width, random() * height, size, size);
  }
}

/* TextureAtlas（core/util） */
export class TextureAtlas {
  constructor(width, height) {
    this.entries = [];
    this.height = height;
    this.width = width;
  }

  pack() {
    const canvas = createCanvas(this.width, this.height);
    const context = canvas.getContext('2d');
    const padding = 6;
    const ordered = [...this.entries].sort((first, second) => {
      return second.pixelHeight - first.pixelHeight;
    });
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
      if (cursorY + paddedHeight > this.height) {
        throw new Error('Texture atlas overflow');
      }
      const left = cursorX + padding;
      const top = cursorY + padding;
      context.save();
      context.translate(left, top);
      context.beginPath();
      context.rect(0, 0, entry.pixelWidth, entry.pixelHeight);
      context.clip();
      entry.draw(context, entry.pixelWidth, entry.pixelHeight);
      context.restore();
      extendAtlasEdges(context, left, top, entry.pixelWidth, entry.pixelHeight, padding);
      entry.rect.u0 = (left + 0.5) / this.width;
      entry.rect.u1 = (left + entry.pixelWidth - 0.5) / this.width;
      entry.rect.v0 = 1 - (top + entry.pixelHeight - 0.5) / this.height;
      entry.rect.v1 = 1 - (top + 0.5) / this.height;
      cursorX += paddedWidth;
      rowHeight = Math.max(rowHeight, paddedHeight);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = W.renderer.capabilities.getMaxAnisotropy();
    return texture;
  }

  register(pixelWidth, pixelHeight, draw) {
    const rect = { u0: 0, u1: 1, v0: 0, v1: 1 };
    this.entries.push({ draw, pixelHeight: Math.ceil(pixelHeight), pixelWidth: Math.ceil(pixelWidth), rect });
    return rect;
  }
}

/* toonGradient（core/util） */
export const toonGradient = createGradientTexture([0.0, 0.14, 0.62, 1.0], THREE.NearestFilter);

/* colorCache（core/util） */
export const colorCache = new Map();

/* resolveColor（core/util） */
export function resolveColor(value) {
  if (value instanceof THREE.Color) {
    return value;
  }
  const key = value === undefined ? '#ffffff' : value;
  let color = colorCache.get(key);
  if (!color) {
    color = new THREE.Color(key);
    colorCache.set(key, color);
  }
  return color;
}

/* resolvePaint（core/util） */
export function resolvePaint(paint, group) {
  if (paint.faces && paint.faces[group]) {
    return { ...paint, ...paint.faces[group] };
  }
  return paint;
}

/* withInterior（core/util） */
export function withInterior(level, build) {
  const previous = W.defaultInterior;
  W.defaultInterior = level;
  build();
  W.defaultInterior = previous;
}

/* unitBox（core/util） */
export const unitBox = new THREE.BoxGeometry(1, 1, 1);

/* unitPlane（core/util） */
export const unitPlane = new THREE.PlaneGeometry(1, 1);

/* geometryCache（core/util） */
export const geometryCache = new Map();

/* packageColors（core/util） */
export const packageColors = [];

/* registerAtlasRegions（core/util） */
export function registerAtlasRegions() {
  W.atlasRects.signFront = W.atlas.register(2048, 200, (context, width, height) => {
    drawSignBand(context, width, height, true);
  });
  W.atlasRects.signSide = W.atlas.register(1600, 200, (context, width, height) => {
    drawSignBand(context, width, height, false);
  });
  W.atlasRects.poleSignFace = W.atlas.register(512, 512, drawPoleSignFace);
  W.atlasRects.poleSignSub = W.atlas.register(512, 160, drawPoleSignSub);
  W.atlasRects.storeFloor = W.atlas.register(1024, 796, drawStoreFloor);
  W.atlasRects.packages = W.atlas.register(1024, 384, drawPackageSheet);
  W.atlasRects.magazines = W.atlas.register(512, 344, drawMagazineSheet);
  W.atlasRects.bottles = W.atlas.register(512, 512, drawBottleStrips);
  W.atlasRects.fridgeHeader = W.atlas.register(1024, 96, drawFridgeHeader);
  W.atlasRects.bento = W.atlas.register(512, 256, drawBentoSheet);
  W.atlasRects.categorySigns = W.atlas.register(256, 384, drawCategorySigns);
  W.atlasRects.windowPosters = W.atlas.register(800, 280, drawWindowPosters);
  W.atlasRects.wallPosters = W.atlas.register(600, 280, drawWallPosters);
  W.atlasRects.vendingWhite = W.atlas.register(384, 704, (context, width, height) => {
    drawVendingFront(context, width, height, '#eef1f4', '#2474d6');
  });
  W.atlasRects.vendingRed = W.atlas.register(384, 704, (context, width, height) => {
    drawVendingFront(context, width, height, '#d8453b', '#8f1d17');
  });
  W.atlasRects.doorMat = W.atlas.register(256, 160, drawDoorMat);
  W.atlasRects.cigarettes = W.atlas.register(512, 224, drawCigaretteShelf);
  W.atlasRects.counterFront = W.atlas.register(512, 128, drawCounterFront);
  W.atlasRects.hotSnack = W.atlas.register(256, 128, drawHotSnackTray);
  W.atlasRects.oden = W.atlas.register(192, 192, drawOdenTop);
  W.atlasRects.nikuman = W.atlas.register(256, 128, drawNikumanFront);
  W.atlasRects.menuBoard = W.atlas.register(512, 136, drawMenuBoard);
  W.atlasRects.coffeeMachine = W.atlas.register(128, 192, drawCoffeeMachine);
  W.atlasRects.atm = W.atlas.register(128, 256, drawAtm);
  W.atlasRects.copier = W.atlas.register(128, 128, drawCopier);
  W.atlasRects.staffSign = W.atlas.register(256, 64, drawStaffSign);
  W.atlasRects.poleGuard = W.atlas.register(64, 256, drawPoleGuard);
  W.atlasRects.poleAdDentist = W.atlas.register(72, 288, (context, width, height) => {
    drawPoleAd(context, width, height, true);
  });
  W.atlasRects.poleAdRealty = W.atlas.register(72, 288, (context, width, height) => {
    drawPoleAd(context, width, height, false);
  });
  W.atlasRects.addressPlate = W.atlas.register(192, 64, drawAddressPlate);
  W.atlasRects.stopSign = W.atlas.register(256, 256, drawStopSign);
  W.atlasRects.signBack = W.atlas.register(128, 128, drawSignBack);
  W.atlasRects.crosswalkSign = W.atlas.register(192, 192, drawCrosswalkSign);
  W.atlasRects.streetName = W.atlas.register(384, 96, drawStreetName);
  W.atlasRects.bulletin = W.atlas.register(512, 320, drawBulletinBoard);
  W.atlasRects.neighborSign = W.atlas.register(512, 70, drawNeighborSign);
  W.atlasRects.shutter = W.atlas.register(256, 256, drawShutter);
  W.atlasRects.blockWall = W.atlas.register(256, 192, drawBlockWall);
  W.atlasRects.roofTiles = W.atlas.register(256, 256, drawRoofTiles);
  W.atlasRects.iceCream = W.atlas.register(128, 192, drawIceCreamTop);
  W.atlasRects.freezerLabel = W.atlas.register(256, 64, drawFreezerLabel);
  W.atlasRects.walkRed = W.atlas.register(96, 96, (context, width, height) => {
    drawWalkSignal(context, width, height, false);
  });
  W.atlasRects.walkGreen = W.atlas.register(96, 96, (context, width, height) => {
    drawWalkSignal(context, width, height, true);
  });
  W.atlasRects.curtainWindow = W.atlas.register(256, 160, (context, width, height) => {
    drawCurtainWindow(context, width, height, false);
  });
  W.atlasRects.televisionWindow = W.atlas.register(160, 128, (context, width, height) => {
    drawCurtainWindow(context, width, height, true);
  });
  W.atlasRects.basket = W.atlas.register(128, 128, drawBasketGrid);
  W.atlasRects.spokes = W.atlas.register(256, 256, drawSpokes);
  W.atlasRects.autoDoorSticker = W.atlas.register(256, 64, (context, width, height) => {
    drawSticker(context, width, height, '自動ドア', '#2361c4', '#ffffff', FONT_ROUNDED);
  });
  W.atlasRects.wifiSticker = W.atlas.register(192, 64, (context, width, height) => {
    drawSticker(context, width, height, 'Free Wi-Fi', '#ffffff', '#2361c4', FONT_ROUNDED);
  });
  W.atlasRects.eatInSticker = W.atlas.register(192, 64, (context, width, height) => {
    drawSticker(context, width, height, 'イートイン', BRAND.lemon, BRAND.navy, FONT_ROUNDED);
  });
  W.atlasRects.atmSticker = W.atlas.register(128, 64, (context, width, height) => {
    drawSticker(context, width, height, 'ATM', '#1f9e89', '#ffffff', FONT_ROUNDED);
  });
  W.atlasRects.openSign = W.atlas.register(256, 96, drawOpenSign);
  W.atlasRects.acFace = W.atlas.register(256, 192, drawAcFace);
  W.atlasRects.acGrill = W.atlas.register(128, 128, drawAcGrill);
  W.atlasRects.trashLabels = W.atlas.register(384, 96, drawTrashLabels);
  W.atlasRects.recycle = W.atlas.register(128, 208, drawRecycleLabel);
  W.atlasRects.umbrellaBag = W.atlas.register(128, 64, (context, width, height) => {
    drawSmallLabel(context, width, height, 'かさ袋', '#ffffff', BRAND.navy);
  });
  W.atlasRects.hotSnackLabel = W.atlas.register(192, 40, (context, width, height) => {
    drawSmallLabel(context, width, height, 'ホットスナック', '#d62828', '#ffffff');
  });
  W.atlasRects.wetFloor = W.atlas.register(128, 160, drawWetFloorSign);
  W.atlasRects.plaque = W.atlas.register(512, 96, drawPlaque);
  W.atlasRects.strata = W.atlas.register(512, 128, drawStrata);
  W.atlasRects.roofSurface = W.atlas.register(512, 384, drawRoofSurface);
  W.atlasRects.clock = W.atlas.register(128, 128, drawClock);
  W.atlasRects.priceStrip = W.atlas.register(256, 24, drawPriceStrip);
  W.atlasRects.caseSign = W.atlas.register(512, 64, drawCaseSign);
  W.atlasRects.popSigns = W.atlas.register(640, 64, drawPopSigns);
}

/* toGroundX（core/util） */
export function toGroundX(x) {
  return (x + 12) * GROUND_SCALE;
}

/* toGroundY（core/util） */
export function toGroundY(z) {
  return (z + 12) * GROUND_SCALE;
}

/* strokeGroundArc（core/util） */
export function strokeGroundArc(context, centerX, centerZ, radius, startAngle, endAngle, width, color) {
  context.beginPath();
  context.arc(toGroundX(centerX), toGroundY(centerZ), radius * GROUND_SCALE, startAngle, endAngle);
  context.strokeStyle = color;
  context.lineWidth = width * GROUND_SCALE;
  context.stroke();
}

/* toWetX（core/util） */
export function toWetX(x) {
  return (x + 12) * WET_SCALE;
}

/* toWetY（core/util） */
export function toWetY(z) {
  return (z + 12) * WET_SCALE;
}

/* withMatrix（core/util） */
export function withMatrix(matrix, build) {
  W.transformStack.push(getCurrentTransform().clone().multiply(matrix));
  build();
  W.transformStack.pop();
}

/* getFrontFace（core/util） */
export function getFrontFace(facing) {
  if (facing[0] > 0.5) {
    return FACE.px;
  }
  if (facing[0] < -0.5) {
    return FACE.nx;
  }
  if (facing[1] > 0.5) {
    return FACE.pz;
  }
  return FACE.nz;
}

/* placeProducts（core/util） */
export function placeProducts(origin, along, facing, length, baseY, maxHeight, categoryName) {
  const category = PRODUCT_CATEGORIES[categoryName];
  const bucket = W.buckets.plain;
  let cursor = 0.02;
  while (cursor < length - 0.08) {
    const column = Math.floor(random() * PACKAGE_COLUMNS);
    const index = category.row * PACKAGE_COLUMNS + column;
    const width = randomBetween(category.width[0], category.width[1]);
    const height = Math.min(maxHeight, randomBetween(category.height[0], category.height[1]));
    const depth = randomBetween(category.depth[0], category.depth[1]);
    const repeat = 1 + Math.floor(random() * 3);
    const faceRect = getSubRect(W.atlasRects.packages, column, category.row, PACKAGE_COLUMNS, PACKAGE_ROWS);
    for (let copy = 0; copy < repeat && cursor + width < length; copy += 1) {
      const middle = cursor + width / 2;
      const inset = depth / 2 + 0.015;
      const centerX = origin[0] + along[0] * middle - facing[0] * inset;
      const centerZ = origin[1] + along[1] * middle - facing[1] * inset;
      if (category.isCylinder) {
        addCylinder(bucket, [centerX, baseY + height / 2, centerZ], width / 2, height, { color: '#ffffff', faces: { 0: { map: faceRect }, 1: { color: packageColors[index] === '#f6f2e8' ? '#d23a5f' : packageColors[index] } } }, { segments: 10, topRadius: width / 2 * 1.08 });
      } else {
        const isAlongZ = Math.abs(along[1]) > 0.5;
        const size = isAlongZ ? [depth, height, width] : [width, height, depth];
        addBox(bucket, [centerX, baseY + height / 2, centerZ], size, { color: packageColors[index], faces: { [getFrontFace(facing)]: { color: '#ffffff', map: faceRect } } });
      }
      cursor += width + 0.012;
    }
    cursor += 0.01;
  }
}

/* getClosedUmbrellaGeometry（core/util） */
export function getClosedUmbrellaGeometry() {
  return getCachedGeometry('umbrella', () => {
    return new THREE.LatheGeometry([
      new THREE.Vector2(0.003, 0),
      new THREE.Vector2(0.014, 0.04),
      new THREE.Vector2(0.036, 0.2),
      new THREE.Vector2(0.044, 0.44),
      new THREE.Vector2(0.03, 0.58),
      new THREE.Vector2(0.008, 0.64),
    ], 10);
  });
}

/* getLeftPerpendicular（core/util） */
export function getLeftPerpendicular(fromX, fromZ, toX, toZ) {
  const length = Math.hypot(toX - fromX, toZ - fromZ);
  return [-(toZ - fromZ) / length, (toX - fromX) / length];
}

/* getSignalState（core/util） */
export function getSignalState(time) {
  const cycle = time % 24;
  if (cycle < 10) {
    return 'green';
  }
  if (cycle < 13) {
    return 'yellow';
  }
  return 'red';
}

/* computeStoreSignLevel（core/util） */
export function computeStoreSignLevel(time) {
  const cycle = time % 13;
  if (cycle > 12.2 && cycle < 12.28) {
    return 0.72;
  }
  if (cycle > 12.36 && cycle < 12.42) {
    return 0.8;
  }
  return 1;
}

/* computeFailingTubeLevel（core/util） */
export function computeFailingTubeLevel(time) {
  const cycle = (time + 2.0) % 7.7;
  if (cycle < 0.9) {
    return hashNumber(Math.floor(time * 22)) > 0.5 ? 1 : 0.12;
  }
  return 0.97 + 0.03 * Math.sin(time * 40);
}

/* computeSecurityLevel（core/util） */
export function computeSecurityLevel(time) {
  const cycle = (time + 5) % 9.3;
  if (cycle < 0.5) {
    return hashNumber(Math.floor(time * 16) + 3) > 0.55 ? 1 : 0.05;
  }
  return 1;
}

/* computeHangingSignLevel（core/util） */
export function computeHangingSignLevel(time) {
  const cycle = (time + 7) % 17;
  if (cycle < 0.35) {
    return hashNumber(Math.floor(time * 20) + 9) > 0.4 ? 1 : 0.35;
  }
  return 1;
}

/* computeTelevisionLevel（core/util） */
export function computeTelevisionLevel(time) {
  const step = Math.floor(time * 2.2);
  const blend = (time * 2.2) % 1;
  const current = 0.45 + 0.55 * hashNumber(step + 17);
  const next = 0.45 + 0.55 * hashNumber(step + 18);
  return current + (next - current) * Math.min(1, blend * 6);
}

/* rainLights（core/util） */
export const rainLights = [
  { color: new THREE.Color(1.4, 1.55, 1.75), sphere: new THREE.Vector4(-5.0, 3.2, 9.3, 3.8) },
  { color: new THREE.Color(1.2, 0.95, 0.7), sphere: new THREE.Vector4(-0.6, 1.6, 0.9, 4.6) },
  { color: new THREE.Color(0.7, 0.6, 0.45), sphere: new THREE.Vector4(5.2, 1.6, -2.4, 3.0) },
  { color: new THREE.Color(0.9, 1.05, 1.2), sphere: new THREE.Vector4(5.0, 1.2, -5.25, 2.4) },
  { color: new THREE.Color(0.55, 0.85, 1.2), sphere: new THREE.Vector4(-4.6, 5.6, 3.4, 2.8) },
  { color: new THREE.Color(0.8, 0.95, 1.1), sphere: new THREE.Vector4(-7.8, 3.4, 5.7, 2.4) },
  { color: new THREE.Color(0.2, 1.0, 0.8), sphere: new THREE.Vector4(8.9, 5.0, -10.3, 2.4) },
];

/* rainLightUniforms（core/util） */
export const rainLightUniforms = {
  uLightColors: { value: rainLights.map((light) => {
    return light.color;
  }) },
  uLightSpheres: { value: rainLights.map((light) => {
    return light.sphere;
  }) },
}

/* dripSources（core/util） */
export const dripSources = [];

/* reflectionMatrix（core/util） */
export const reflectionMatrix = new THREE.Matrix4();

/* reflectionCamera（core/util） */
export const reflectionCamera = new THREE.PerspectiveCamera();

/* performanceMonitor（core/util） */
export const performanceMonitor = { elapsed: 0, frames: 0, hasSettled: false, warmup: 1.5 }
