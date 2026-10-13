/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from './world.js';

/* createRandomGenerator（core/math） */
export function createRandomGenerator(seed) {
  let state = seed >>> 0;
  return function generateRandom() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/* random（core/math） */
export const random = createRandomGenerator(20260922);

/* randomBetween（core/math） */
export function randomBetween(minimum, maximum) {
  return minimum + (maximum - minimum) * random();
}

/* pickRandom（core/math） */
export function pickRandom(items) {
  return items[Math.floor(random() * items.length)];
}

/* hashNumber（core/math） */
export function hashNumber(value) {
  const sine = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return sine - Math.floor(sine);
}

/* computePixelRatio（core/math） */
export function computePixelRatio() {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const budget = Math.sqrt(5200000 / (W.viewportWidth * W.viewportHeight));
  return Math.max(0.6, Math.min(devicePixelRatio, 2, budget) * W.qualityScale);
}
