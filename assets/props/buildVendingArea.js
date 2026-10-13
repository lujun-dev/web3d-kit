/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { FACE, LOT_Y } from '../core/constants.js';
import { addBlock, withTransform } from '../core/geometry.js';
import { buildVendingMachine } from './buildVendingMachine.js';

/* buildVendingArea（props） */
export function buildVendingArea() {
  buildVendingMachine([4.2, LOT_Y, -4.75], W.atlasRects.vendingWhite, '#eef1f4');
  buildVendingMachine([4.2, LOT_Y, -5.8], W.atlasRects.vendingRed, '#d8453b');
  withTransform([4.05, LOT_Y, -6.75], Math.PI / 2, () => {
    addBlock(W.buckets.outlined, [-0.26, 0, -0.2], [0.26, 0.86, 0.2], { color: '#2361c4', faces: { [FACE.pz]: { color: '#ffffff', map: W.atlasRects.recycle } } });
    addBlock(W.buckets.outlined, [-0.28, 0.86, -0.22], [0.28, 0.9, 0.22], { color: '#1b4a9a' });
  });
}
