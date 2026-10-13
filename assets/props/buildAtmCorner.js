/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { CHANNEL, FACE, FLOOR_Y } from '../core/constants.js';
import { addBlock } from '../core/geometry.js';

/* buildAtmCorner（props） */
export function buildAtmCorner() {
  const outlined = W.buckets.outlined;
  addBlock(outlined, [-5.0, FLOOR_Y, -2.85], [-4.42, 1.62, -2.2], { color: '#d9dde2', faces: { [FACE.px]: { color: '#ffffff', map: W.atlasRects.atm } } });
  addBlock(outlined, [-5.0, 1.62, -2.85], [-4.5, 1.9, -2.2], { channel: CHANNEL.interiorLights, color: '#1f9e89', emissive: 0.9 });
  addBlock(outlined, [-5.0, FLOOR_Y, -2.1], [-4.38, 1.02, -1.35], { color: '#e6e8ea', faces: { [FACE.px]: { color: '#ffffff', map: W.atlasRects.copier } } });
  addBlock(outlined, [-4.98, 1.02, -2.05], [-4.42, 1.08, -1.4], { color: '#c9ced4' });
}
