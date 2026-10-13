/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillCircle, fillEllipse, fillRoundedRect } from '../core/canvas.js';
import { BRAND, FONT_DISPLAY, FONT_HAND, FONT_ROUNDED } from '../core/constants.js';
import { drawPosterFrame } from './drawPosterFrame.js';

/* drawWindowPosters（regions） */
export function drawWindowPosters(context, width, height) {
  const posterWidth = width / 4;
  const drawers = [
    (poster) => {
      drawPosterFrame(poster, posterWidth, height, '#f07b2c', '#fff3df');
      drawText(poster, 'おでん', posterWidth / 2, height * 0.17, { color: '#d9480f', family: FONT_DISPLAY, size: height * 0.16, weight: 400 });
      poster.strokeStyle = '#b08850';
      poster.lineWidth = 6;
      poster.beginPath();
      poster.moveTo(posterWidth * 0.5, height * 0.28);
      poster.lineTo(posterWidth * 0.5, height * 0.78);
      poster.stroke();
      poster.fillStyle = '#8a8580';
      poster.beginPath();
      poster.moveTo(posterWidth * 0.5, height * 0.3);
      poster.lineTo(posterWidth * 0.64, height * 0.45);
      poster.lineTo(posterWidth * 0.36, height * 0.45);
      poster.closePath();
      poster.fill();
      fillCircle(poster, posterWidth * 0.5, height * 0.54, posterWidth * 0.13, '#f3e2b8');
      fillEllipse(poster, posterWidth * 0.5, height * 0.69, posterWidth * 0.09, height * 0.055, 0, '#fffaf0');
      drawText(poster, '全品70円', posterWidth / 2, height * 0.87, { color: '#ffffff', family: FONT_DISPLAY, size: height * 0.1, stroke: '#d9480f', strokeWidth: 8, weight: 400 });
    },
    (poster) => {
      drawPosterFrame(poster, posterWidth, height, '#d62828', '#fff8ec');
      fillCircle(poster, posterWidth * 0.36, height * 0.46, posterWidth * 0.2, '#ffffff');
      fillCircle(poster, posterWidth * 0.64, height * 0.5, posterWidth * 0.2, '#fdf0dc');
      poster.strokeStyle = '#d8c9b0';
      poster.lineWidth = 3;
      for (const x of [0.36, 0.64]) {
        poster.beginPath();
        poster.arc(posterWidth * x, height * 0.44, posterWidth * 0.06, 0, Math.PI * 1.5);
        poster.stroke();
      }
      drawText(poster, '肉まん', posterWidth / 2, height * 0.18, { color: '#d62828', family: FONT_DISPLAY, size: height * 0.14, weight: 400 });
      drawText(poster, 'あんまん', posterWidth / 2, height * 0.78, { color: '#7a4b2a', family: FONT_ROUNDED, size: height * 0.09, weight: 800 });
    },
    (poster) => {
      drawPosterFrame(poster, posterWidth, height, '#f48fb1', '#fff0f5');
      fillRoundedRect(poster, posterWidth * 0.34, height * 0.34, posterWidth * 0.32, height * 0.4, 8, '#ffffff');
      poster.fillStyle = '#f06292';
      poster.fillRect(posterWidth * 0.34, height * 0.5, posterWidth * 0.32, height * 0.12);
      fillCircle(poster, posterWidth * 0.5, height * 0.44, posterWidth * 0.07, '#e53950');
      drawText(poster, '新発売', posterWidth / 2, height * 0.16, { color: '#e53950', family: FONT_HAND, size: height * 0.13, weight: 400 });
      drawText(poster, 'いちごミルク', posterWidth / 2, height * 0.85, { color: '#c2185b', family: FONT_ROUNDED, maxWidth: posterWidth * 0.84, size: height * 0.085, weight: 800 });
    },
    (poster) => {
      drawPosterFrame(poster, posterWidth, height, '#5b3a29', '#f4e6d4');
      fillRoundedRect(poster, posterWidth * 0.32, height * 0.4, posterWidth * 0.36, height * 0.3, 10, '#ffffff');
      poster.fillStyle = BRAND.sky;
      poster.fillRect(posterWidth * 0.32, height * 0.5, posterWidth * 0.36, height * 0.08);
      poster.strokeStyle = 'rgba(120, 90, 70, 0.6)';
      poster.lineWidth = 4;
      for (const offset of [-0.08, 0.02, 0.12]) {
        poster.beginPath();
        poster.moveTo(posterWidth * (0.5 + offset), height * 0.36);
        poster.bezierCurveTo(posterWidth * (0.46 + offset), height * 0.3, posterWidth * (0.54 + offset), height * 0.27, posterWidth * (0.5 + offset), height * 0.22);
        poster.stroke();
      }
      drawText(poster, 'ホットコーヒー', posterWidth / 2, height * 0.12, { color: '#5b3a29', family: FONT_ROUNDED, maxWidth: posterWidth * 0.84, size: height * 0.08, weight: 800 });
      drawText(poster, '100円', posterWidth / 2, height * 0.84, { color: '#d9480f', family: FONT_DISPLAY, size: height * 0.12, weight: 400 });
    },
  ];
  drawers.forEach((draw, index) => {
    context.save();
    context.translate(index * posterWidth, 0);
    context.beginPath();
    context.rect(0, 0, posterWidth, height);
    context.clip();
    draw(context);
    context.restore();
  });
}
