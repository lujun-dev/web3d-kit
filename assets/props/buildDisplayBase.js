/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { FACE } from '../core/constants.js';
import { addBlock, addQuad } from '../core/geometry.js';

/* buildDisplayBase（props） */
export function buildDisplayBase() {
  const bucket = W.buckets.outlined;
  addBlock(bucket, [-12.55, -1.8, -12.55], [12.55, -1.02, 12.55], { color: '#2b1e17' });
  addBlock(bucket, [-12.62, -1.02, -12.62], [12.62, -0.94, 12.62], { color: '#b8924f', emissive: 0.04 });
  for (let segment = 0; segment < 6; segment += 1) {
    const start = -12 + segment * 4;
    const end = start + 4;
    addQuad(bucket, [[start, -0.94, 12], [end, -0.94, 12], [end, 0, 12], [start, 0, 12]], { map: W.atlasRects.strata });
    addQuad(bucket, [[end, -0.94, -12], [start, -0.94, -12], [start, 0, -12], [end, 0, -12]], { map: W.atlasRects.strata });
    addQuad(bucket, [[12, -0.94, end], [12, -0.94, start], [12, 0, start], [12, 0, end]], { map: W.atlasRects.strata });
    addQuad(bucket, [[-12, -0.94, start], [-12, -0.94, end], [-12, 0, end], [-12, 0, start]], { map: W.atlasRects.strata });
  }
  addBlock(bucket, [-1.6, -1.71, 12.55], [1.6, -1.11, 12.6], { color: '#c79a4a', faces: { [FACE.pz]: { color: '#ffffff', emissive: 0.05, map: W.atlasRects.plaque } } });
}
