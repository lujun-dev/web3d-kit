/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { FONT_STYLESHEETS, TEXT_SAMPLE } from '../core/constants.js';
import { loadStylesheet } from './loadStylesheet.js';
import { waitFor } from './waitFor.js';

/* waitForFonts（systems） */
export async function waitForFonts() {
  if (FONT_STYLESHEETS.length === 0 || !document.fonts || typeof document.fonts.load !== 'function') {
    return;
  }
  const stylesheetResults = await Promise.race([
    Promise.all(FONT_STYLESHEETS.map(loadStylesheet)),
    waitFor(2500).then(() => {
      return [];
    }),
  ]);
  if (!stylesheetResults.some(Boolean)) {
    return;
  }
  const requests = [
    document.fonts.load('400 48px "Dela Gothic One"', TEXT_SAMPLE),
    document.fonts.load('800 48px "M PLUS Rounded 1c"', TEXT_SAMPLE),
    document.fonts.load('400 48px "Yusei Magic"', TEXT_SAMPLE),
  ];
  await Promise.race([Promise.allSettled(requests), waitFor(3000)]);
}
