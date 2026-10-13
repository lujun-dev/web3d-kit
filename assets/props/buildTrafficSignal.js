/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { CHANNEL, COLORS, LOT_Y } from '../core/constants.js';
import {
  addBlock,
  addCylinder,
  addMesh,
  addPanel,
  addRod,
  getCachedGeometry,
} from '../core/geometry.js';

/* buildTrafficSignal（props） */
export function buildTrafficSignal() {
  const outlined = W.buckets.outlined;
  const poleX = 11.2;
  const poleZ = -10.8;
  addCylinder(outlined, [poleX, LOT_Y + 3.0, poleZ], 0.1, 6.0, { color: COLORS.pole }, { segments: 12, topRadius: 0.085 });
  addRod(outlined, [poleX, LOT_Y + 5.45, poleZ], [8.3, LOT_Y + 5.55, poleZ], 0.055, { color: COLORS.pole });
  const headX = 8.9;
  const headY = LOT_Y + 5.3;
  addBlock(outlined, [headX - 0.62, headY - 0.2, poleZ - 0.14], [headX + 0.62, headY + 0.2, poleZ + 0.08], { color: '#8d949b' });
  addBlock(outlined, [headX - 0.66, headY - 0.24, poleZ - 0.16], [headX + 0.66, headY + 0.24, poleZ - 0.14], { color: '#2a2d33' });
  const visor = getCachedGeometry('visor', () => {
    return new THREE.CylinderGeometry(0.15, 0.15, 0.22, 14, 1, true, Math.PI / 2, Math.PI);
  });
  const lamps = [
    { channel: CHANNEL.signalGreen, color: '#2de0b8', offset: -0.38 },
    { channel: CHANNEL.signalYellow, color: '#ffc233', offset: 0 },
    { channel: CHANNEL.signalRed, color: '#ff3b3b', offset: 0.38 },
  ];
  for (const lamp of lamps) {
    addCylinder(outlined, [headX + lamp.offset, headY, poleZ + 0.09], 0.13, 0.02, { channel: lamp.channel, color: lamp.color, emissive: 4.0 }, { rotation: [Math.PI / 2, 0, 0], segments: 18 });
    addMesh(outlined, visor, [headX + lamp.offset, headY + 0.01, poleZ + 0.2], [Math.PI / 2, 0, 0], [1, 1, 1], { color: '#7d848b' });
  }
  addBlock(outlined, [poleX - 0.18, LOT_Y + 2.2, poleZ + 0.1], [poleX + 0.18, LOT_Y + 2.95, poleZ + 0.3], { color: '#8d949b' });
  addPanel(outlined, [poleX, LOT_Y + 2.76, poleZ + 0.305], 0.28, 0.28, '+z', { channel: CHANNEL.walkRed, emissive: 2.5, map: W.atlasRects.walkRed });
  addPanel(outlined, [poleX, LOT_Y + 2.4, poleZ + 0.305], 0.28, 0.28, '+z', { channel: CHANNEL.walkGreen, emissive: 2.5, map: W.atlasRects.walkGreen });
}
