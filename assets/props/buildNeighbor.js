/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import {
  CHANNEL,
  COLORS,
  FACE,
  HYDRANGEA_COLORS,
  LOT_Y,
  SHRUB_COLORS,
} from '../core/constants.js';
import {
  addBlock,
  addBox,
  addCylinder,
  addMesh,
  addPanel,
  addRod,
  addShrub,
  addSphere,
  getCachedGeometry,
} from '../core/geometry.js';
import { pickRandom, randomBetween } from '../core/math.js';
import { buildAcUnit } from './buildAcUnit.js';

/* buildNeighbor（props） */
export function buildNeighbor() {
  const outlined = W.buckets.outlined;
  const wall = '#b9b29a';
  const minX = -11.7;
  const maxX = -7.3;
  const minZ = -11.6;
  const maxZ = -2.2;
  addBlock(outlined, [minX, LOT_Y, minZ], [maxX, 6.0, maxZ], { color: wall });
  addBlock(outlined, [minX - 0.03, 3.1, minZ - 0.03], [maxX + 0.03, 3.25, maxZ + 0.03], { color: '#9c9580' });

  // Gable roof with tiles.
  const ridgeX = (minX + maxX) / 2;
  const halfSpan = (maxX - minX) / 2 + 0.3;
  const rise = 1.25;
  const slopeAngle = Math.atan2(rise, halfSpan);
  const slabLength = Math.hypot(halfSpan, rise);
  const segmentLength = (maxZ - minZ + 0.6) / 4;
  for (const side of [-1, 1]) {
    for (let segment = 0; segment < 4; segment += 1) {
      const centerZ = minZ - 0.3 + segmentLength * (segment + 0.5);
      addBox(outlined, [ridgeX + (side * halfSpan) / 2, 6.0 + rise / 2 + 0.06, centerZ], [slabLength, 0.12, segmentLength], { color: '#2e3542', faces: { [FACE.py]: { color: '#ffffff', map: W.atlasRects.roofTiles } } }, [0, 0, -side * slopeAngle]);
    }
  }
  addBox(outlined, [ridgeX, 6.0 + rise + 0.1, (minZ + maxZ) / 2], [0.22, 0.14, maxZ - minZ + 0.6], { color: '#252b36' });
  const gable = getCachedGeometry('gable', () => {
    const shape = new THREE.Shape();
    shape.moveTo(-(maxX - minX) / 2, 0);
    shape.lineTo((maxX - minX) / 2, 0);
    shape.lineTo(0, rise - 0.05);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, depth: 0.1 });
  });
  addMesh(outlined, gable, [ridgeX, 6.0, maxZ - 0.1], null, [1, 1, 1], { color: wall });
  addMesh(outlined, gable, [ridgeX, 6.0, minZ], null, [1, 1, 1], { color: wall });

  // Front: closed stationery shop with its shutter down.
  addBlock(outlined, [-11.2, LOT_Y, maxZ], [-8.2, 2.6, maxZ + 0.06], { color: '#ffffff', faces: { [FACE.pz]: { map: W.atlasRects.shutter } } });
  addBlock(outlined, [-11.3, 2.6, maxZ], [-8.1, 2.88, maxZ + 0.2], { color: '#8d949b' });
  addBlock(outlined, [-11.5, 2.88, maxZ], [-7.9, 2.94, maxZ + 0.55], { color: '#6d737b' });
  addBlock(outlined, [-11.3, 2.96, maxZ], [-8.1, 3.4, maxZ + 0.06], { color: '#5c3f2b', faces: { [FACE.pz]: { color: '#ffffff', map: W.atlasRects.neighborSign } } });
  addBlock(outlined, [-8.0, LOT_Y, maxZ], [-7.4, 2.3, maxZ + 0.04], { color: '#5b4636' });
  addBlock(outlined, [-7.52, 1.05, maxZ + 0.04], [-7.47, 1.2, maxZ + 0.06], { color: '#c9a45c' });
  addBlock(outlined, [-8.02, 2.3, maxZ], [-7.38, 2.36, maxZ + 0.3], { color: '#6d737b' });
  addBlock(outlined, [-7.9, 1.35, maxZ + 0.04], [-7.78, 1.5, maxZ + 0.07], { color: '#e8e8e2', emissive: 0.4 });

  // Upstairs: a lit window behind curtains and a small balcony.
  addBlock(outlined, [-11.0, 3.9, maxZ], [-8.8, 5.2, maxZ + 0.03], { channel: CHANNEL.steady, color: '#ffffff', emissive: 1.1, faces: { [FACE.pz]: { map: W.atlasRects.curtainWindow } } });
  addBlock(outlined, [-8.3, 4.2, maxZ], [-7.7, 4.9, maxZ + 0.03], { color: '#27303d' });
  addBlock(outlined, [-11.3, 3.55, maxZ], [-8.5, 3.65, maxZ + 0.7], { color: '#9c9580' });
  for (let x = -11.25; x <= -8.5; x += 0.25) {
    addRod(outlined, [x, 3.65, maxZ + 0.66], [x, 4.4, maxZ + 0.66], 0.012, { color: '#6d737b' }, 4);
  }
  addRod(outlined, [-11.3, 4.4, maxZ + 0.66], [-8.5, 4.4, maxZ + 0.66], 0.025, { color: '#6d737b' }, 6);
  addRod(outlined, [-11.3, 4.4, maxZ], [-11.3, 4.4, maxZ + 0.66], 0.025, { color: '#6d737b' }, 6);
  addRod(outlined, [-8.5, 4.4, maxZ], [-8.5, 4.4, maxZ + 0.66], 0.025, { color: '#6d737b' }, 6);
  addRod(outlined, [-11.1, 5.6, maxZ + 0.02], [-11.1, 5.6, maxZ + 0.6], 0.015, { color: COLORS.silver }, 4);
  addRod(outlined, [-8.7, 5.6, maxZ + 0.02], [-8.7, 5.6, maxZ + 0.6], 0.015, { color: COLORS.silver }, 4);
  addRod(outlined, [-11.1, 5.6, maxZ + 0.5], [-8.7, 5.6, maxZ + 0.5], 0.015, { color: COLORS.silver }, 4);
  buildAcUnit([-10.6, 3.65, maxZ + 0.32], 0);
  addCylinder(outlined, [-8.85, 3.8, maxZ + 0.35], 0.12, 0.24, { color: '#b5653a' }, { topRadius: 0.15 });
  addShrub(-8.85, maxZ + 0.35, 0.2, true);

  // Alley side: television glow, a bathroom window, side door with its lamp, gas meter.
  addBlock(outlined, [maxX, 4.2, -6.2], [maxX + 0.03, 4.9, -5.2], { channel: CHANNEL.neighborTv, color: '#ffffff', emissive: 1.2, faces: { [FACE.px]: { map: W.atlasRects.televisionWindow } } });
  addBlock(outlined, [maxX, 4.5, -9.4], [maxX + 0.03, 4.9, -8.8], { channel: CHANNEL.steady, color: '#fff1d6', emissive: 0.5 });
  addBlock(outlined, [maxX, LOT_Y, -5.0], [maxX + 0.04, 2.2, -4.2], { color: '#6b5a4a' });
  addBlock(outlined, [maxX, 2.35, -5.2], [maxX + 0.4, 2.42, -4.0], { color: '#7d848b' });
  addBlock(outlined, [maxX, 2.55, -4.66], [maxX + 0.06, 2.7, -4.54], { color: '#3a3f47' });
  addSphere(outlined, [maxX + 0.12, 2.6, -4.6], 0.07, { channel: CHANNEL.alleyLamp, color: '#ffd9a0', emissive: 3.5 });
  addBlock(outlined, [maxX, 1.2, -7.2], [maxX + 0.2, 1.55, -6.9], { color: '#d9d9d2' });
  addRod(outlined, [maxX + 0.08, LOT_Y, -7.05], [maxX + 0.08, 1.2, -7.05], 0.025, { color: '#c9b23a' }, 6);
  addRod(outlined, [maxX + 0.08, 1.55, -7.05], [maxX + 0.08, 5.8, -7.05], 0.025, { color: '#c9b23a' }, 6);
  addRod(outlined, [maxX + 0.08, 6.0, maxZ - 0.12], [maxX + 0.08, LOT_Y, maxZ - 0.12], 0.04, { color: '#9aa1a8' });

  // Front yard: potted plants, hydrangeas, bulletin board and the garbage point.
  for (let index = 0; index < 5; index += 1) {
    const x = -11.2 + index * 0.62;
    addCylinder(outlined, [x, LOT_Y + 0.14, -1.85], 0.14, 0.28, { color: '#b5653a' }, { topRadius: 0.17 });
    addSphere(outlined, [x, LOT_Y + 0.42, -1.85], randomBetween(0.18, 0.24), { color: pickRandom(SHRUB_COLORS) }, { isFaceted: true });
    if (index % 2 === 0) {
      addSphere(outlined, [x + 0.05, LOT_Y + 0.58, -1.8], 0.11, { color: pickRandom(HYDRANGEA_COLORS) }, { isFaceted: true });
    }
  }
  const boardX = -9.6;
  const boardZ = 3.4;
  addRod(outlined, [boardX - 0.75, LOT_Y, boardZ], [boardX - 0.75, LOT_Y + 1.95, boardZ], 0.04, { color: '#5c3f2b' });
  addRod(outlined, [boardX + 0.75, LOT_Y, boardZ], [boardX + 0.75, LOT_Y + 1.95, boardZ], 0.04, { color: '#5c3f2b' });
  addBlock(outlined, [boardX - 0.8, LOT_Y + 0.95, boardZ - 0.04], [boardX + 0.8, LOT_Y + 1.95, boardZ + 0.04], { color: '#6b4a32', faces: { [FACE.pz]: { color: '#ffffff', map: W.atlasRects.bulletin } } });
  addBox(outlined, [boardX, LOT_Y + 2.05, boardZ + 0.08], [1.8, 0.05, 0.36], { color: '#4a5a6a' }, [0.25, 0, 0]);
  addPanel(W.buckets.exteriorGlass, [boardX, LOT_Y + 1.45, boardZ + 0.06], 1.5, 0.92, '+z', {});
  for (let bag = 0; bag < 5; bag += 1) {
    addSphere(outlined, [-11.0 + randomBetween(-0.3, 0.3), LOT_Y + 0.18, 3.1 + randomBetween(-0.2, 0.2)], randomBetween(0.17, 0.22), { color: pickRandom(['#f2f2ee', '#e6ebf0', '#d8e2ea']) });
  }
  addSphere(outlined, [-11.0, LOT_Y + 0.2, 3.1], 0.42, { color: '#2f64c9' }, { isFaceted: true, scale: [1.25, 0.55, 0.95] });
}
