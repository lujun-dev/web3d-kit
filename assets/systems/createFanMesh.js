/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { LAYER_PLAIN } from '../core/constants.js';
import { GeometryBucket, addBox, addCylinder } from '../core/geometry.js';

/* createFanMesh（systems） */
export function createFanMesh(radius) {
  const bucket = new GeometryBucket();
  for (let blade = 0; blade < 4; blade += 1) {
    const angle = (blade * Math.PI) / 2;
    addBox(bucket, [Math.cos(angle) * radius * 0.48, Math.sin(angle) * radius * 0.48, 0], [radius * 0.85, radius * 0.36, 0.008], { color: '#838a93' }, [0, 0, angle]);
  }
  addCylinder(bucket, [0, 0, 0], radius * 0.16, 0.04, { color: '#555b64' }, { rotation: [Math.PI / 2, 0, 0], segments: 10 });
  const mesh = bucket.createMesh(W.materials.toon);
  mesh.layers.set(LAYER_PLAIN);
  return mesh;
}
