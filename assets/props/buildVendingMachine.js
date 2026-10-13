/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { CHANNEL, FACE } from '../core/constants.js';
import { addBlock, withTransform } from '../core/geometry.js';

/* buildVendingMachine（props） */
export function buildVendingMachine(position, rect, bodyColor) {
  withTransform(position, Math.PI / 2, () => {
    const outlined = W.buckets.outlined;
    addBlock(outlined, [-0.5, 0, -0.375], [0.5, 0.06, 0.375], { color: '#2a2d33' });
    addBlock(outlined, [-0.5, 0.06, -0.375], [0.5, 1.83, 0.375], { color: bodyColor, faces: { [FACE.pz]: { channel: CHANNEL.vending, color: '#ffffff', emissive: 0.95, map: rect } } });
    addBlock(outlined, [-0.52, 1.83, -0.39], [0.52, 1.88, 0.42], { color: bodyColor });
    addBlock(outlined, [-0.42, 0.12, 0.375], [0.42, 0.28, 0.41], { color: '#16181c' });
    addBlock(outlined, [0.14, 0.72, 0.375], [0.44, 1.0, 0.395], { color: '#2b2f36' });
  });
}
