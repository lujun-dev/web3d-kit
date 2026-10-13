/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { CHANNEL, COLORS, FACE, LOT_Y, SHRUB_COLORS } from '../core/constants.js';
import {
  addBlock,
  addCylinder,
  addPanel,
  addRod,
  addShrub,
  addSphere,
} from '../core/geometry.js';
import { pickRandom, random, randomBetween } from '../core/math.js';
import { buildAcUnit } from './buildAcUnit.js';

/* buildBackyard（props） */
export function buildBackyard() {
  const outlined = W.buckets.outlined;
  for (let x = -7.3; x < 3.8; x += 2) {
    const end = Math.min(x + 2, 3.8);
    addBlock(outlined, [x, LOT_Y, -11.9], [end, 1.55, -11.7], { color: '#8f9296', faces: { [FACE.pz]: { color: '#ffffff', map: W.atlasRects.blockWall }, [FACE.nz]: { color: '#ffffff', map: W.atlasRects.blockWall } } });
  }
  addBlock(outlined, [-7.35, 1.55, -11.93], [3.85, 1.61, -11.67], { color: '#a4a7ab' });
  addBlock(outlined, [3.76, LOT_Y, -11.7], [3.84, 1.2, -11.6], { color: COLORS.metal });
  addBlock(outlined, [3.76, LOT_Y, -8.1], [3.84, 1.2, -8.0], { color: COLORS.metal });
  addBlock(outlined, [3.77, 1.1, -11.6], [3.83, 1.16, -8.1], { color: '#7d848b' });
  addBlock(outlined, [3.77, 0.25, -11.6], [3.83, 0.3, -8.1], { color: '#7d848b' });
  for (let z = -11.45; z < -8.1; z += 0.15) {
    addRod(outlined, [3.8, 0.3, z], [3.8, 1.1, z], 0.012, { color: '#7d848b' }, 4);
  }
  for (const x of [-3.9, -2.6, -1.3]) {
    buildAcUnit([x, LOT_Y, -8.2], Math.PI);
  }
  addBlock(outlined, [-4.3, 0.6, -8.08], [-0.9, 0.7, -8.0], { color: '#ecebe4' });
  addBlock(outlined, [2.45, LOT_Y, -8.04], [3.3, 2.25, -8.0], { color: '#8d949b' });
  addBlock(outlined, [2.4, 2.35, -8.5], [3.35, 2.42, -8.0], { color: '#6d737b' });
  addSphere(outlined, [2.87, 2.55, -8.08], 0.06, { channel: CHANNEL.steady, color: '#ffe0b0', emissive: 3 });
  addBlock(outlined, [3.12, 1.0, -8.07], [3.18, 1.12, -8.04], { color: COLORS.silver });
  for (const [x, z, levels] of [[0.9, -8.75, 3], [1.55, -8.75, 2]]) {
    for (let level = 0; level < levels; level += 1) {
      addBlock(outlined, [x - 0.3, LOT_Y + level * 0.3, z - 0.2], [x + 0.3, LOT_Y + level * 0.3 + 0.29, z + 0.2], { color: (level + Math.round(x)) % 2 === 0 ? '#3b7fd1' : '#f29e38' });
    }
  }
  // Garbage cage.
  const cageMinX = -0.6;
  const cageMaxX = 0.8;
  for (const [x, z] of [[cageMinX, -11.6], [cageMaxX, -11.6], [cageMinX, -10.7], [cageMaxX, -10.7]]) {
    addRod(outlined, [x, LOT_Y, z], [x, 1.32, z], 0.02, { color: '#3f6b3a' }, 5);
  }
  addPanel(W.buckets.cutout, [0.1, 0.74, -10.7], 1.4, 1.16, '+z', { map: W.atlasRects.basket });
  addPanel(W.buckets.cutout, [cageMinX, 0.74, -11.15], 0.9, 1.16, '+x', { map: W.atlasRects.basket });
  addPanel(W.buckets.cutout, [cageMaxX, 0.74, -11.15], 0.9, 1.16, '+x', { map: W.atlasRects.basket });
  addBlock(outlined, [cageMinX - 0.02, 1.32, -11.62], [cageMaxX + 0.02, 1.36, -10.68], { color: '#5b8a4a' });
  for (let bag = 0; bag < 5; bag += 1) {
    addSphere(outlined, [randomBetween(-0.35, 0.55), LOT_Y + 0.2, randomBetween(-11.45, -10.85)], randomBetween(0.18, 0.24), { color: pickRandom(['#f2f2ee', '#dfe8f0']) });
  }
  // Small tree peeking over the wall and the roofline.
  const treeX = 2.7;
  const treeZ = -10.6;
  addCylinder(outlined, [treeX, LOT_Y + 1.1, treeZ], 0.12, 2.2, { color: '#5a4332' }, { topRadius: 0.08 });
  addRod(outlined, [treeX, 2.0, treeZ], [treeX - 0.45, 2.8, treeZ + 0.2], 0.05, { color: '#5a4332' }, 6);
  addRod(outlined, [treeX, 2.1, treeZ], [treeX + 0.4, 2.9, treeZ - 0.3], 0.05, { color: '#5a4332' }, 6);
  for (let cluster = 0; cluster < 9; cluster += 1) {
    addSphere(outlined, [treeX + randomBetween(-0.8, 0.8), randomBetween(2.8, 3.9), treeZ + randomBetween(-0.55, 0.55)], randomBetween(0.5, 0.78), { color: pickRandom(SHRUB_COLORS) }, { isFaceted: true });
  }
  for (let x = -4.8; x < 2.0; x += randomBetween(0.6, 0.9)) {
    addShrub(x, -11.35, randomBetween(0.2, 0.3), random() < 0.25);
  }
}
