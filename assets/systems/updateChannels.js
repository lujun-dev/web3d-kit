/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { CHANNEL, SIGNAL_COLORS } from '../core/constants.js';
import {
  computeFailingTubeLevel,
  computeHangingSignLevel,
  computeSecurityLevel,
  computeStoreSignLevel,
  computeTelevisionLevel,
  getSignalState,
  rainLights,
} from '../core/util.js';

/* updateChannels（systems） */
export function updateChannels(time) {
  const levels = W.sharedUniforms.uChannelLevels.value;
  const signalState = getSignalState(time);
  const cycle = time % 24;
  const isWalkFlashing = cycle > 7 && cycle < 10 && Math.floor(time * 4) % 2 === 0;
  levels[CHANNEL.steady] = 1;
  levels[CHANNEL.storeSign] = computeStoreSignLevel(time);
  levels[CHANNEL.poleSign] = 1;
  levels[CHANNEL.poleSignSub] = computeFailingTubeLevel(time);
  levels[CHANNEL.interiorLights] = 1;
  levels[CHANNEL.vending] = 0.97 + 0.03 * Math.sin(time * 3.1);
  levels[CHANNEL.signalGreen] = signalState === 'green' ? 1 : 0.05;
  levels[CHANNEL.signalYellow] = signalState === 'yellow' ? 1 : 0.05;
  levels[CHANNEL.signalRed] = signalState === 'red' ? 1 : 0.05;
  levels[CHANNEL.walkGreen] = signalState === 'green' && !isWalkFlashing ? 1 : 0.05;
  levels[CHANNEL.walkRed] = signalState === 'green' ? 0.05 : 1;
  levels[CHANNEL.alleyLamp] = 0.86 + 0.08 * Math.sin(time * 2.3) + 0.06 * Math.sin(time * 7.1 + 1.3);
  levels[CHANNEL.securityLight] = computeSecurityLevel(time);
  levels[CHANNEL.doorSensor] = W.door.phase === 'closed' ? 0.25 : 0.6 + 0.4 * Math.sin(time * 30);
  levels[CHANNEL.hangingSign] = computeHangingSignLevel(time);
  levels[CHANNEL.neighborTv] = computeTelevisionLevel(time);

  W.lights.signal.color.copy(SIGNAL_COLORS[signalState]);
  W.lights.security.intensity = W.lights.security.userData.baseIntensity * levels[CHANNEL.securityLight];
  W.lights.alleyLamp.intensity = W.lights.alleyLamp.userData.baseIntensity * levels[CHANNEL.alleyLamp];
  W.lights.poleSign.intensity = W.lights.poleSign.userData.baseIntensity * (0.85 + 0.15 * levels[CHANNEL.poleSignSub]);
  W.lights.frontSpill.intensity = W.lights.frontSpill.userData.baseIntensity * (1 + 0.08 * W.door.openAmount);
  rainLights[5].color.setRGB(0.8, 0.95, 1.1).multiplyScalar(levels[CHANNEL.securityLight]);
  rainLights[6].color.copy(SIGNAL_COLORS[signalState]).multiplyScalar(0.9);
}
