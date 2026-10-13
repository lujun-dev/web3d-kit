/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { CHANNEL, FACE, FLOOR_Y } from '../core/constants.js';
import { addBlock, addPanel } from '../core/geometry.js';

/* buildIceFreezer（props） */
export function buildIceFreezer() {
  const outlined = W.buckets.outlined;
  const minX = 0.15;
  const maxX = 0.95;
  const minZ = -4.1;
  const maxZ = -2.95;
  addBlock(outlined, [minX, FLOOR_Y, minZ], [maxX, 0.84, maxZ], { color: '#f1f3f5', faces: { [FACE.px]: { color: '#8fc6ee' }, [FACE.nx]: { color: '#8fc6ee' } } });
  addPanel(outlined, [0.55, 0.62, maxZ + 0.005], 0.7, 0.175, '+z', { map: W.atlasRects.freezerLabel });
  addBlock(outlined, [minX, 0.84, minZ], [maxX, 0.9, minZ + 0.05], { color: '#c9ced4' });
  addBlock(outlined, [minX, 0.84, maxZ - 0.05], [maxX, 0.9, maxZ], { color: '#c9ced4' });
  addBlock(outlined, [minX, 0.84, minZ], [minX + 0.05, 0.9, maxZ], { color: '#c9ced4' });
  addBlock(outlined, [maxX - 0.05, 0.84, minZ], [maxX, 0.9, maxZ], { color: '#c9ced4' });
  addPanel(W.buckets.plain, [0.55, 0.79, -3.525], 0.7, 1.05, '+y', { channel: CHANNEL.interiorLights, emissive: 0.45, map: W.atlasRects.iceCream });
  addPanel(W.buckets.interiorGlass, [0.55, 0.885, -3.525], 0.72, 1.07, '+y', {});
}
