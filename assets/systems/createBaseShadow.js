/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { createCanvas } from '../core/canvas.js';
import { LAYER_EFFECTS } from '../core/constants.js';

/* createBaseShadow（systems） */
export function createBaseShadow() {
  const canvas = createCanvas(256, 256);
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(128, 128, 30, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
  gradient.addColorStop(0.55, 'rgba(0, 0, 0, 0.45)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(46, 46), new THREE.MeshBasicMaterial({ depthWrite: false, map: texture, transparent: true }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -1.82;
  mesh.layers.set(LAYER_EFFECTS);
  W.scene.add(mesh);
}
