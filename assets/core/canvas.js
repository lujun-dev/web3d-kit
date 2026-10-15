/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from './world.js';
import { FACE, FONT_PLAIN, GROUND_SCALE } from './constants.js';
import { addBox, addCylinder, addMesh, createTriangleProduct, getCachedGeometry } from './geometry.js';
import { random } from './math.js';
import { toGroundX, toGroundY } from './util.js';
import { PAVING_TILE_PX, drawPhotoTiled, photos } from './photos.js';

/* createCanvas（core/canvas） */
export function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/* drawText（core/canvas） */
export function drawText(context, text, x, y, options) {
  const {
    align = 'center',
    baseline = 'middle',
    color = '#ffffff',
    family = FONT_PLAIN,
    maxWidth = 0,
    size = 24,
    spacing = 0,
    stroke = '',
    strokeWidth = 0,
    weight = 700,
  } = options;
  context.font = `${weight} ${size}px ${family}`;
  context.textAlign = align;
  context.textBaseline = baseline;
  const hasLetterSpacing = 'letterSpacing' in context;
  if (hasLetterSpacing) {
    context.letterSpacing = `${spacing}px`;
  }
  if (stroke) {
    context.lineJoin = 'round';
    context.lineWidth = strokeWidth;
    context.strokeStyle = stroke;
    if (maxWidth > 0) {
      context.strokeText(text, x, y, maxWidth);
    } else {
      context.strokeText(text, x, y);
    }
  }
  context.fillStyle = color;
  if (maxWidth > 0) {
    context.fillText(text, x, y, maxWidth);
  } else {
    context.fillText(text, x, y);
  }
  if (hasLetterSpacing) {
    context.letterSpacing = '0px';
  }
}

/* drawVerticalText（core/canvas） */
export function drawVerticalText(context, text, x, y, size, options) {
  const characters = Array.from(text);
  for (let index = 0; index < characters.length; index += 1) {
    drawText(context, characters[index], x, y + index * size * 1.08, { ...options, size });
  }
}

/* traceRoundedRect（core/canvas） */
export function traceRoundedRect(context, x, y, width, height, radius) {
  const clampedRadius = Math.max(0, Math.min(radius, width / 2, height / 2));
  context.beginPath();
  context.moveTo(x + clampedRadius, y);
  context.arcTo(x + width, y, x + width, y + height, clampedRadius);
  context.arcTo(x + width, y + height, x, y + height, clampedRadius);
  context.arcTo(x, y + height, x, y, clampedRadius);
  context.arcTo(x, y, x + width, y, clampedRadius);
  context.closePath();
}

/* fillRoundedRect（core/canvas） */
export function fillRoundedRect(context, x, y, width, height, radius, color) {
  traceRoundedRect(context, x, y, width, height, radius);
  context.fillStyle = color;
  context.fill();
}

/* traceStar（core/canvas） */
export function traceStar(context, centerX, centerY, outerRadius, innerRadius) {
  context.beginPath();
  for (let point = 0; point < 10; point += 1) {
    const radius = point % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (point * Math.PI) / 5;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (point === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }
  context.closePath();
}

/* fillCircle（core/canvas） */
export function fillCircle(context, x, y, radius, color) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
}

/* fillEllipse（core/canvas） */
export function fillEllipse(context, x, y, radiusX, radiusY, rotation, color) {
  context.beginPath();
  context.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
}

/* extendAtlasEdges（core/canvas） */
export function extendAtlasEdges(context, left, top, width, height, padding) {
  const canvas = context.canvas;
  context.drawImage(canvas, left, top, width, 1, left, top - padding, width, padding);
  context.drawImage(canvas, left, top + height - 1, width, 1, left, top + height, width, padding);
  context.drawImage(canvas, left, top - padding, 1, height + padding * 2, left - padding, top - padding, padding, height + padding * 2);
  context.drawImage(canvas, left + width - 1, top - padding, 1, height + padding * 2, left + width, top - padding, padding, height + padding * 2);
}

/* getSubRect（core/canvas） */
export function getSubRect(rect, column, row, columnCount, rowCount) {
  const cellWidth = (rect.u1 - rect.u0) / columnCount;
  const cellHeight = (rect.v1 - rect.v0) / rowCount;
  return {
    u0: rect.u0 + column * cellWidth + cellWidth * 0.02,
    u1: rect.u0 + (column + 1) * cellWidth - cellWidth * 0.02,
    v0: rect.v1 - (row + 1) * cellHeight + cellHeight * 0.02,
    v1: rect.v1 - row * cellHeight - cellHeight * 0.02,
  };
}

/* createGradientTexture（core/canvas） */
export function createGradientTexture(values, filter) {
  const data = new Uint8Array(values.length * 4);
  for (let index = 0; index < values.length; index += 1) {
    const level = Math.round(Math.max(0, Math.min(1, values[index])) * 255);
    data[index * 4] = level;
    data[index * 4 + 1] = level;
    data[index * 4 + 2] = level;
    data[index * 4 + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, values.length, 1, THREE.RGBAFormat);
  texture.minFilter = filter;
  texture.magFilter = filter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

/* fillGroundRect（core/canvas） */
export function fillGroundRect(context, minX, minZ, maxX, maxZ, color) {
  context.fillStyle = color;
  context.fillRect(toGroundX(minX), toGroundY(minZ), (maxX - minX) * GROUND_SCALE, (maxZ - minZ) * GROUND_SCALE);
}

/* drawPavers（core/canvas） */
export function drawPavers(context, minX, minZ, maxX, maxZ, isAlongZ) {
  const paversLeft = toGroundX(minX);
  const paversTop = toGroundY(minZ);
  const paversWidth = (maxX - minX) * GROUND_SCALE;
  const paversHeight = (maxZ - minZ) * GROUND_SCALE;
  context.save();
  context.beginPath();
  context.rect(toGroundX(minX), toGroundY(minZ), (maxX - minX) * GROUND_SCALE, (maxZ - minZ) * GROUND_SCALE);
  context.clip();
  fillGroundRect(context, minX, minZ, maxX, maxZ, '#555861');
  // 真实铺装照片（CC0 PavingStones131）在时直接平铺；夜里压暗一层，免得比周围沥青亮
  if (drawPhotoTiled(context, photos.paving, paversLeft, paversTop, paversWidth, paversHeight, PAVING_TILE_PX)) {
    context.fillStyle = 'rgba(16, 20, 30, 0.14)';
    context.fillRect(paversLeft, paversTop, paversWidth, paversHeight);
    context.restore();
    return;
  }
  const longSide = 0.22 * GROUND_SCALE;
  const shortSide = 0.11 * GROUND_SCALE;
  const stepX = isAlongZ ? shortSide : longSide;
  const stepY = isAlongZ ? longSide : shortSide;
  let row = 0;
  for (let y = toGroundY(minZ); y < toGroundY(maxZ); y += stepY) {
    const offset = isAlongZ ? 0 : (row % 2) * stepX * 0.5;
    let column = 0;
    for (let x = toGroundX(minX) - stepX; x < toGroundX(maxX); x += stepX) {
      const shiftY = isAlongZ ? (column % 2) * stepY * 0.5 : 0;
      const isWarm = random() < 0.07;
      const shade = 100 + Math.floor(random() * 16);
      context.fillStyle = isWarm ? '#6f625a' : `rgb(${shade}, ${shade + 3}, ${shade + 10})`;
      context.fillRect(x + offset + 1, y + shiftY + 1, stepX - 2, stepY - 2);
      column += 1;
    }
    row += 1;
  }
  context.restore();
}

/* drawTactilePaving（core/canvas） */
export function drawTactilePaving(context, minX, minZ, maxX, maxZ, isLinear) {
  fillGroundRect(context, minX, minZ, maxX, maxZ, '#d6ae2c');
  const step = 0.075 * GROUND_SCALE;
  for (let y = toGroundY(minZ) + step / 2; y < toGroundY(maxZ); y += step) {
    for (let x = toGroundX(minX) + step / 2; x < toGroundX(maxX); x += step) {
      if (isLinear) {
        context.fillStyle = '#f0c93e';
        context.fillRect(x - step * 0.4, y - 1, step * 0.8, 2.4);
      } else {
        fillCircle(context, x, y, step * 0.26, '#f2cc45');
      }
    }
  }
}

/* drawGrate（core/canvas） */
export function drawGrate(context, centerX, centerZ, isAlongX) {
  const width = (isAlongX ? 0.62 : 0.28) * GROUND_SCALE;
  const height = (isAlongX ? 0.28 : 0.62) * GROUND_SCALE;
  const left = toGroundX(centerX) - width / 2;
  const top = toGroundY(centerZ) - height / 2;
  context.fillStyle = '#16181c';
  context.fillRect(left, top, width, height);
  // 真实金属篦子贴图（CC0 Metal032）在时用它顶掉程序化格栅
  if (drawPhotoTiled(context, photos.metal, left, top, width, height, 110)) {
    context.strokeStyle = '#6d727a';
    context.lineWidth = 2;
    context.strokeRect(left, top, width, height);
    return;
  }
  context.fillStyle = '#5b6068';
  if (isAlongX) {
    for (let x = left + 3; x < left + width; x += 6) {
      context.fillRect(x, top, 2.5, height);
    }
  } else {
    for (let y = top + 3; y < top + height; y += 6) {
      context.fillRect(left, y, width, 2.5);
    }
  }
  context.strokeStyle = '#6d727a';
  context.lineWidth = 2;
  context.strokeRect(left, top, width, height);
}

/* drawDiamondMarking（core/canvas） */
export function drawDiamondMarking(context, centerX, centerZ, isAlongX) {
  const halfLong = 1.35 * GROUND_SCALE;
  const halfShort = 0.45 * GROUND_SCALE;
  const x = toGroundX(centerX);
  const y = toGroundY(centerZ);
  context.beginPath();
  if (isAlongX) {
    context.moveTo(x - halfLong, y);
    context.lineTo(x, y - halfShort);
    context.lineTo(x + halfLong, y);
    context.lineTo(x, y + halfShort);
  } else {
    context.moveTo(x, y - halfLong);
    context.lineTo(x + halfShort, y);
    context.lineTo(x, y + halfLong);
    context.lineTo(x - halfShort, y);
  }
  context.closePath();
  context.strokeStyle = '#e6e6df';
  context.lineWidth = 0.12 * GROUND_SCALE;
  context.stroke();
}

/* fillCornerOutside（core/canvas） */
export function fillCornerOutside(context, minX, minZ, maxX, maxZ, centerX, centerZ, radius, color) {
  context.save();
  context.beginPath();
  context.rect(toGroundX(minX), toGroundY(minZ), (maxX - minX) * GROUND_SCALE, (maxZ - minZ) * GROUND_SCALE);
  context.clip();
  context.beginPath();
  context.rect(toGroundX(minX), toGroundY(minZ), (maxX - minX) * GROUND_SCALE, (maxZ - minZ) * GROUND_SCALE);
  context.arc(toGroundX(centerX), toGroundY(centerZ), radius * GROUND_SCALE, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill('evenodd');
  context.restore();
}

/* fillCaseTier（core/canvas） */
export function fillCaseTier(tier, baseY, frontX, startZ, endZ) {
  const bucket = W.buckets.plain;
  const bento = W.atlasRects.bento;
  if (tier === 3) {
    const geometry = getCachedGeometry('onigiri', () => {
      return createTriangleProduct(0.1, 0.092, 0.024, 0.034);
    });
    for (let z = startZ + 0.06; z < endZ - 0.05; z += 0.115) {
      for (const depthOffset of [0.04, 0.16]) {
        const rect = getSubRect(bento, Math.floor(random() * 8), 0, 8, 4);
        addMesh(bucket, geometry, [frontX - depthOffset, baseY, z], [0, Math.PI / 2, 0], [1, 1, 1], { color: '#ffffff', faces: { 1: { color: '#f4f1ea', map: null } }, map: rect });
      }
    }
    return;
  }
  if (tier === 2) {
    const geometry = getCachedGeometry('sandwich', () => {
      return createTriangleProduct(0.12, 0.11, 0.006, 0.055);
    });
    for (let z = startZ + 0.07; z < endZ - 0.06; z += 0.13) {
      const rect = getSubRect(bento, Math.floor(random() * 8), 1, 8, 4);
      addMesh(bucket, geometry, [frontX - 0.05, baseY, z], [0, Math.PI / 2, 0], [1, 1, 1], { color: '#ffffff', faces: { 1: { color: '#e9d3a5', map: null } }, map: rect });
      addMesh(bucket, geometry, [frontX - 0.2, baseY, z], [0, Math.PI / 2, 0], [1, 1, 1], { color: '#ffffff', faces: { 1: { color: '#e9d3a5', map: null } }, map: rect });
    }
    return;
  }
  if (tier === 1) {
    for (let z = startZ + 0.11; z < endZ - 0.1; z += 0.22) {
      for (const depthOffset of [0.1, 0.28]) {
        const rect = getSubRect(bento, Math.floor(random() * 8), 2, 8, 4);
        addBox(bucket, [frontX - depthOffset, baseY + 0.025, z], [0.16, 0.05, 0.2], { color: '#1d1b1a', faces: { [FACE.py]: { color: '#ffffff', map: rect } } });
      }
    }
    return;
  }
  for (let z = startZ + 0.08; z < endZ - 0.08; z += 0.16) {
    const column = Math.floor(random() * 8);
    const rect = getSubRect(bento, column, 3, 8, 4);
    const radius = column < 4 ? 0.068 : 0.045;
    for (const depthOffset of [0.09, 0.25]) {
      addCylinder(bucket, [frontX - depthOffset, baseY + 0.035, z], radius, 0.07, { color: column < 4 ? '#1d1b1a' : '#f4f1ea', faces: { 1: { color: '#ffffff', map: rect } } }, { segments: 14 });
    }
  }
}
