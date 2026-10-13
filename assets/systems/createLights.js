/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { LOT_Y } from '../core/constants.js';
import { createPointLight, createSpotLight } from '../core/materials.js';

/* createLights（systems） */
export function createLights() {
  W.scene.add(new THREE.HemisphereLight(0x4a5f9e, 0x10131f, 1.6));
  const moon = new THREE.DirectionalLight(0x8ea2e0, 0.7);
  moon.position.set(-14, 22, -10);
  W.scene.add(moon, moon.target);
  W.lights.frontSpill = createSpotLight({ angle: 1.05, color: 0xffdcae, decay: 1.5, distance: 13, intensity: 55, penumbra: 0.7, position: [-0.6, 2.75, -1.45], shadowSize: 2048, target: [-0.6, LOT_Y, 3.0] });
  W.lights.sideSpill = createSpotLight({ angle: 0.95, color: 0xffdcae, decay: 1.5, distance: 10, intensity: 32, penumbra: 0.7, position: [3.4, 2.7, -2.6], shadowSize: 1024, target: [7.0, LOT_Y, -2.6] });
  W.lights.streetLamp = createSpotLight({ angle: 0.72, color: 0xd9ecff, decay: 1.6, distance: 14, intensity: 90, penumbra: 0.55, position: [-5.0, 6.28, 9.55], shadowSize: 1024, target: [-5.0, 0, 9.2] });
  W.lights.canopyLeft = createPointLight(0xffd29a, 5, 4.5, [-2.5, 2.7, -0.2]);
  W.lights.canopyRight = createPointLight(0xffd29a, 5, 4.5, [1.9, 2.7, -0.2]);
  W.lights.interior = createPointLight(0xfff0d6, 7, 8, [-0.7, 2.6, -4.4]);
  W.lights.vending = createPointLight(0xdcefff, 7, 4.5, [5.0, 1.3, -5.25]);
  W.lights.poleSign = createPointLight(0xbfe6ff, 5, 6, [-4.5, 5.8, 3.5]);
  W.lights.security = createPointLight(0xd2ecff, 4, 5.5, [-7.8, 4.7, 5.8]);
  W.lights.signal = createPointLight(0x2de0b8, 5, 9, [8.9, 5.2, -10.3]);
  W.lights.alleyLamp = createPointLight(0xffb46b, 3.5, 4.5, [-7.05, 2.55, -4.6]);
  W.lights.neighborWindow = createPointLight(0xffcf8a, 2, 4, [-9.9, 4.5, -1.6]);
  W.lights.backDoor = createPointLight(0xffd6a0, 2.5, 4, [2.87, 2.4, -8.4]);
}
