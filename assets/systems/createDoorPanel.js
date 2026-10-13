/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { COLORS, FLOOR_Y, LAYER_OUTLINED, LAYER_PLAIN } from '../core/constants.js';
import { GeometryBucket, addBlock, addPanel } from '../core/geometry.js';

/* createDoorPanel（systems） */
export function createDoorPanel(centerX) {
  const group = new THREE.Group();
  const bucket = new GeometryBucket();
  const aluminum = { color: COLORS.aluminum };
  const width = 0.85;
  const height = 2.18;
  addBlock(bucket, [-width / 2, 0, -0.025], [-width / 2 + 0.05, height, 0.025], aluminum);
  addBlock(bucket, [width / 2 - 0.05, 0, -0.025], [width / 2, height, 0.025], aluminum);
  addBlock(bucket, [-width / 2, height - 0.07, -0.025], [width / 2, height, 0.025], aluminum);
  addBlock(bucket, [-width / 2, 0, -0.025], [width / 2, 0.1, 0.025], aluminum);
  addPanel(bucket, [0, 1.05, 0.004], 0.34, 0.085, '+z', { map: W.atlasRects.autoDoorSticker });
  addPanel(bucket, [0, 1.05, -0.004], 0.34, 0.085, '-z', { map: W.atlasRects.autoDoorSticker });
  const frame = bucket.createMesh(W.materials.toon);
  frame.castShadow = true;
  frame.receiveShadow = true;
  frame.layers.set(LAYER_OUTLINED);
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(width - 0.1, height - 0.17), W.materials.exteriorGlass);
  pane.position.set(0, 0.1 + (height - 0.17) / 2, 0);
  pane.layers.set(LAYER_PLAIN);
  pane.renderOrder = 2;
  group.add(frame, pane);
  group.position.set(centerX, FLOOR_Y, -1.025);
  W.scene.add(group);
  return group;
}
