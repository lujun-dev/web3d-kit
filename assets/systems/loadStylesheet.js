/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';

/* loadStylesheet（systems） */
export function loadStylesheet(url) {
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.addEventListener('load', () => {
      resolve(true);
    });
    link.addEventListener('error', () => {
      resolve(false);
    });
    document.head.appendChild(link);
  });
}
