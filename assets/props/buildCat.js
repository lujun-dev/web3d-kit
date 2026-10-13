/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { CHANNEL, LAYER_OUTLINED, LOT_Y } from '../core/constants.js';
import { GeometryBucket, addCylinder, addSphere, addTube, withTransform } from '../core/geometry.js';

/* buildCat（props） */
export function buildCat() {
  const position = new THREE.Vector3(3.25, LOT_Y, -0.12);
  const rotationY = 0.5;
  withTransform([position.x, position.y, position.z], rotationY, () => {
    const outlined = W.buckets.outlined;
    const fur = { color: '#fdf8ee' };
    const patch = { color: '#e39a55' };
    addSphere(outlined, [0, 0.16, -0.02], 0.13, fur, { scale: [1.0, 1.25, 1.05] });
    addSphere(outlined, [0, 0.21, 0.06], 0.085, fur);
    addSphere(outlined, [-0.08, 0.08, -0.06], 0.075, fur);
    addSphere(outlined, [0.08, 0.08, -0.06], 0.075, fur);
    addSphere(outlined, [-0.035, 0.03, 0.1], 0.03, fur, { scale: [1, 0.8, 1.4] });
    addSphere(outlined, [0.035, 0.03, 0.1], 0.03, fur, { scale: [1, 0.8, 1.4] });
    addSphere(outlined, [0, 0.235, -0.08], 0.09, patch, { scale: [1.1, 0.72, 1.05] });
    addSphere(outlined, [0, 0.38, 0.05], 0.09, fur, { scale: [1.08, 0.95, 1] });
    addSphere(outlined, [0, 0.428, 0.035], 0.062, patch, { scale: [1.2, 0.6, 1.1] });
    for (const side of [-1, 1]) {
      addCylinder(outlined, [side * 0.055, 0.465, 0.035], 0.036, 0.075, patch, { rotation: [0, 0, -side * 0.35], segments: 8, topRadius: 0.002 });
      addSphere(outlined, [side * 0.034, 0.395, 0.126], 0.012, { channel: CHANNEL.steady, color: '#e3f26a', emissive: 0.9 }, { scale: [1, 1.3, 0.6] });
    }
    addSphere(outlined, [0, 0.36, 0.125], 0.036, fur, { scale: [1.2, 0.8, 0.8] });
    addSphere(outlined, [0, 0.374, 0.156], 0.009, { color: '#e89aa0' });
  });
  const tailBucket = new GeometryBucket();
  addTube(tailBucket, [[0, 0, 0], [0.05, 0.01, -0.07], [0.14, 0.015, -0.08], [0.21, 0.04, -0.02], [0.23, 0.09, 0.05]], 0.022, { color: '#e39a55' }, 20, 8);
  W.catTail = tailBucket.createMesh(W.materials.toon);
  const tailBase = new THREE.Vector3(0, 0.05, -0.14).applyAxisAngle(W.Y_AXIS, rotationY).add(position);
  W.catTail.position.copy(tailBase);
  W.catTailBaseRotation = rotationY;
  W.catTail.rotation.y = rotationY;
  W.catTail.castShadow = true;
  W.catTail.layers.set(LAYER_OUTLINED);
  W.scene.add(W.catTail);
}
