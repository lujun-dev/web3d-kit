/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { getSubRect } from '../core/canvas.js';
import { BOTTLE_KINDS, CHANNEL, COLORS, FACE, FLOOR_Y } from '../core/constants.js';
import { addBlock, addPanel } from '../core/geometry.js';
import { random } from '../core/math.js';

/* buildFridge（props） */
export function buildFridge() {
  const outlined = W.buckets.outlined;
  const plain = W.buckets.plain;
  const cutout = W.buckets.cutout;
  const frame = { color: '#2d3137' };
  addBlock(plain, [-4.25, 0.3, -7.8], [1.75, 2.3, -7.74], { channel: CHANNEL.interiorLights, color: '#e8f4ff', emissive: 0.75, interior: 0 });
  addBlock(outlined, [1.75, FLOOR_Y, -7.8], [1.85, 2.9, -7.1], { color: COLORS.interiorWall });
  for (let door$local = 0; door$local < 6; door$local += 1) {
    const left = -4.25 + door$local;
    for (let level = 0; level < 5; level += 1) {
      const shelfY = 0.42 + level * 0.37;
      const kind = Math.floor(random() * BOTTLE_KINDS.length);
      addBlock(plain, [left + 0.04, shelfY - 0.015, -7.72], [left + 0.96, shelfY, -7.2], { color: '#cfd6dd' });
      addPanel(cutout, [left + 0.5, shelfY + 0.155, -7.34], 0.9, 0.3, '+z', { emissive: 0.35, map: getSubRect(W.atlasRects.bottles, 0, kind, 1, BOTTLE_KINDS.length) });
      addPanel(cutout, [left + 0.5, shelfY + 0.155, -7.55], 0.9, 0.3, '+z', { color: '#b8c0c8', emissive: 0.2, map: getSubRect(W.atlasRects.bottles, 0, (kind + 1) % BOTTLE_KINDS.length, 1, BOTTLE_KINDS.length) });
    }
    addBlock(outlined, [left, FLOOR_Y, -7.16], [left + 0.05, 2.35, -7.1], frame);
    addBlock(outlined, [left + 0.84, 0.95, -7.08], [left + 0.87, 1.55, -7.04], { color: COLORS.silver });
    addPanel(W.buckets.interiorGlass, [left + 0.525, 1.33, -7.13], 0.95, 1.96, '+z', {});
  }
  addBlock(outlined, [1.7, FLOOR_Y, -7.16], [1.75, 2.35, -7.1], frame);
  addBlock(outlined, [-4.25, 2.3, -7.16], [1.75, 2.36, -7.1], frame);
  addBlock(outlined, [-4.25, FLOOR_Y, -7.16], [1.75, 0.32, -7.1], frame);
  addBlock(outlined, [-4.25, 2.36, -7.2], [1.75, 2.9, -7.1], { color: '#ffffff', faces: { [FACE.pz]: { channel: CHANNEL.interiorLights, emissive: 0.8, interior: 0, map: W.atlasRects.fridgeHeader } } });
}
