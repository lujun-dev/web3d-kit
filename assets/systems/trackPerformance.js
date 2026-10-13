/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { performanceMonitor } from '../core/util.js';
import { handleResize } from './handleResize.js';

/* trackPerformance（systems） */
export function trackPerformance(deltaTime) {
  if (performanceMonitor.hasSettled) {
    return;
  }
  if (performanceMonitor.warmup > 0) {
    performanceMonitor.warmup -= deltaTime;
    return;
  }
  performanceMonitor.elapsed += deltaTime;
  performanceMonitor.frames += 1;
  if (performanceMonitor.elapsed < 2.5) {
    return;
  }
  const averageFrameTime = performanceMonitor.elapsed / performanceMonitor.frames;
  performanceMonitor.elapsed = 0;
  performanceMonitor.frames = 0;
  if (averageFrameTime > 1 / 38 && W.qualityScale > 0.6) {
    W.qualityScale *= 0.82;
    handleResize();
    performanceMonitor.warmup = 0.5;
    return;
  }
  performanceMonitor.hasSettled = true;
}
