/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { PACKAGE_COLUMNS, PACKAGE_PALETTE, PACKAGE_ROWS, PACKAGE_WORDS } from '../core/constants.js';
import { packageColors } from '../core/util.js';
import { drawPackageFace } from './drawPackageFace.js';

/* drawPackageSheet（regions） */
export function drawPackageSheet(context, width, height) {
  const cellWidth = width / PACKAGE_COLUMNS;
  const cellHeight = height / PACKAGE_ROWS;
  for (let row = 0; row < PACKAGE_ROWS; row += 1) {
    for (let column = 0; column < PACKAGE_COLUMNS; column += 1) {
      const index = row * PACKAGE_COLUMNS + column;
      const accent = PACKAGE_PALETTE[(column * 7 + row * 5 + 3) % PACKAGE_PALETTE.length];
      context.save();
      context.translate(column * cellWidth, row * cellHeight);
      context.beginPath();
      context.rect(0, 0, cellWidth, cellHeight);
      context.clip();
      drawPackageFace(context, cellWidth, cellHeight, row, packageColors[index], accent, PACKAGE_WORDS[row][column]);
      context.restore();
    }
  }
}
