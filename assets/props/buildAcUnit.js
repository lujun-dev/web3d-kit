/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { COLORS, FACE } from '../core/constants.js';
import { addBlock, addPanel, withTransform } from '../core/geometry.js';
import { randomBetween } from '../core/math.js';
import { registerFan } from '../systems/registerFan.js';

/* buildAcUnit（props） */
export function buildAcUnit(position, rotationY) {
  withTransform(position, rotationY, () => {
    addBlock(W.buckets.outlined, [-0.36, 0, -0.14], [0.36, 0.08, 0.14], { color: COLORS.metal });
    addBlock(W.buckets.outlined, [-0.4, 0.08, -0.15], [0.4, 0.68, 0.15], { color: '#e8e8e3', faces: { [FACE.pz]: { color: '#ffffff', map: W.atlasRects.acFace } } });
    addPanel(W.buckets.cutout, [-0.08, 0.38, 0.162], 0.5, 0.5, '+z', { map: W.atlasRects.acGrill });
  });
  registerFan(position, [0, rotationY, 0], [-0.08, 0.38, 0.155], 0.22, randomBetween(5, 8));
}
