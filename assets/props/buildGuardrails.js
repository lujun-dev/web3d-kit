/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { buildGuardrail } from './buildGuardrail.js';

/* buildGuardrails（props） */
export function buildGuardrails() {
  buildGuardrail(-11.8, 5.35, -8.3, 5.35);
  buildGuardrail(5.35, -11.8, 5.35, -7.2);
  buildGuardrail(5.35, -3.2, 5.35, 0.9);
  buildGuardrail(-11.8, 10.82, 0.9, 10.82);
  buildGuardrail(5.5, 10.82, 11.8, 10.82);
  buildGuardrail(10.82, -11.8, 10.82, 0.9);
}
