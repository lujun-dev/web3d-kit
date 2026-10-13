/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { COLORS } from '../core/constants.js';
import {
  addBlock,
  addBox,
  addCylinder,
  addMesh,
  addPanel,
  addRod,
  addTube,
  addUmbrella,
  getCachedGeometry,
  withTransform,
} from '../core/geometry.js';

/* buildBicycle（props） */
export function buildBicycle(position, rotationY) {
  withTransform(position, rotationY, () => {
    const outlined = W.buckets.outlined;
    const cutout = W.buckets.cutout;
    const frame = { color: '#8fd3c1' };
    const metal = { color: COLORS.silver };
    const rear = [-0.5, 0.33, 0];
    const front = [0.52, 0.33, 0];
    const tireGeometry = getCachedGeometry('tire', () => {
      return new THREE.TorusGeometry(0.31, 0.024, 8, 36);
    });
    const rimGeometry = getCachedGeometry('rim', () => {
      return new THREE.TorusGeometry(0.285, 0.009, 6, 36);
    });
    const fenderGeometry = getCachedGeometry('fender', () => {
      return new THREE.TorusGeometry(0.35, 0.02, 4, 18, 2.3);
    });
    for (const wheel of [rear, front]) {
      addMesh(outlined, tireGeometry, wheel, null, [1, 1, 1], { color: '#24272d' });
      addMesh(outlined, rimGeometry, wheel, null, [1, 1, 1], metal);
      addPanel(cutout, wheel, 0.58, 0.58, '+z', { map: W.atlasRects.spokes });
      addCylinder(outlined, wheel, 0.025, 0.1, metal, { rotation: [Math.PI / 2, 0, 0], segments: 8 });
      addMesh(outlined, fenderGeometry, wheel, [0, 0, 0.42], [1, 1, 1.6], frame);
    }
    const bottomBracket = [-0.02, 0.3, 0];
    const headBottom = [0.36, 0.62, 0];
    const headTop = [0.33, 0.8, 0];
    addRod(outlined, headBottom, headTop, 0.022, frame);
    addTube(outlined, [bottomBracket, [0.1, 0.34, 0], [0.24, 0.46, 0], headBottom], 0.02, frame, 16, 6);
    addRod(outlined, bottomBracket, [-0.13, 0.76, 0], 0.02, frame);
    for (const side of [-1, 1]) {
      addRod(outlined, [bottomBracket[0], bottomBracket[1], side * 0.03], [rear[0], rear[1], side * 0.045], 0.012, frame);
      addRod(outlined, [-0.12, 0.7, side * 0.025], [rear[0], rear[1], side * 0.045], 0.012, frame);
      addRod(outlined, [headBottom[0], headBottom[1], side * 0.03], [front[0], front[1], side * 0.045], 0.013, frame);
      addRod(outlined, [rear[0], rear[1], side * 0.05], [-0.44, 0.0, side * 0.12], 0.01, metal);
    }
    addBox(outlined, [-0.26, 0.33, 0.05], [0.5, 0.08, 0.012], frame, [0, 0, 0.03]);
    addRod(outlined, [-0.13, 0.76, 0], [-0.15, 0.86, 0], 0.012, metal);
    addBox(outlined, [-0.16, 0.89, 0], [0.26, 0.07, 0.15], { color: '#4a3428' });
    addRod(outlined, headTop, [0.31, 0.95, 0], 0.014, metal);
    addTube(outlined, [[0.2, 0.97, -0.3], [0.29, 0.955, -0.18], [0.31, 0.95, 0], [0.29, 0.955, 0.18], [0.2, 0.97, 0.3]], 0.011, metal, 20, 6);
    addCylinder(outlined, [0.19, 0.97, -0.34], 0.017, 0.1, { color: '#2a2d33' }, { rotation: [Math.PI / 2, 0, 0] });
    addCylinder(outlined, [0.19, 0.97, 0.34], 0.017, 0.1, { color: '#2a2d33' }, { rotation: [Math.PI / 2, 0, 0] });
    addPanel(cutout, [0.6, 0.98, 0.16], 0.32, 0.22, '+z', { map: W.atlasRects.basket });
    addPanel(cutout, [0.6, 0.98, -0.16], 0.32, 0.22, '+z', { map: W.atlasRects.basket });
    addPanel(cutout, [0.76, 0.98, 0], 0.32, 0.22, '+x', { map: W.atlasRects.basket });
    addPanel(cutout, [0.44, 0.98, 0], 0.32, 0.22, '+x', { map: W.atlasRects.basket });
    addPanel(cutout, [0.6, 0.87, 0], 0.32, 0.32, '+y', { map: W.atlasRects.basket });
    addRod(outlined, [0.44, 1.09, -0.16], [0.76, 1.09, -0.16], 0.008, metal, 5);
    addRod(outlined, [0.44, 1.09, 0.16], [0.76, 1.09, 0.16], 0.008, metal, 5);
    addRod(outlined, [0.44, 1.09, -0.16], [0.44, 1.09, 0.16], 0.008, metal, 5);
    addRod(outlined, [0.76, 1.09, -0.16], [0.76, 1.09, 0.16], 0.008, metal, 5);
    addRod(outlined, [0.46, 0.87, 0], [0.36, 0.72, 0], 0.01, metal, 5);
    addBlock(outlined, [-0.78, 0.7, -0.07], [-0.3, 0.72, 0.07], metal);
    addRod(outlined, [-0.72, 0.7, -0.06], [rear[0], rear[1], -0.05], 0.008, metal, 5);
    addRod(outlined, [-0.72, 0.7, 0.06], [rear[0], rear[1], 0.05], 0.008, metal, 5);
    addCylinder(outlined, [0.45, 0.66, 0], 0.035, 0.06, { color: '#f4f1ea' }, { rotation: [0, 0, Math.PI / 2], segments: 10 });
    addUmbrella([0.24, 0.1, 0.4], '#dfe6ea', [0.05, 0, -0.08]);
  });
}
