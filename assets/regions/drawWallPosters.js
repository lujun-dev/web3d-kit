/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillCircle, fillEllipse, fillRoundedRect } from '../core/canvas.js';
import { FONT_DISPLAY, FONT_HAND, FONT_ROUNDED } from '../core/constants.js';
import { randomBetween } from '../core/math.js';
import { drawPosterFrame } from './drawPosterFrame.js';
import { drawStar } from './drawStar.js';

/* drawWallPosters（regions） */
export function drawWallPosters(context, width, height) {
  const posterWidth = width / 3;
  const drawers = [
    (poster) => {
      drawPosterFrame(poster, posterWidth, height, '#b5651d', '#fff4e3');
      fillEllipse(poster, posterWidth * 0.5, height * 0.62, posterWidth * 0.26, height * 0.06, 0, '#e8d3b0');
      poster.fillStyle = '#b07a3a';
      poster.beginPath();
      poster.moveTo(posterWidth * 0.28, height * 0.6);
      poster.quadraticCurveTo(posterWidth * 0.5, height * 0.2, posterWidth * 0.72, height * 0.6);
      poster.closePath();
      poster.fill();
      fillCircle(poster, posterWidth * 0.5, height * 0.34, posterWidth * 0.06, '#7a4b2a');
      drawText(poster, 'スイーツフェア', posterWidth / 2, height * 0.14, { color: '#8a4b16', family: FONT_HAND, maxWidth: posterWidth * 0.86, size: height * 0.085, weight: 400 });
      drawText(poster, '期間限定', posterWidth / 2, height * 0.82, { color: '#ffffff', family: FONT_ROUNDED, size: height * 0.07, stroke: '#b5651d', strokeWidth: 6, weight: 800 });
    },
    (poster) => {
      drawPosterFrame(poster, posterWidth, height, '#2f6fd6', '#eaf4ff');
      poster.fillStyle = '#3ba6e6';
      poster.beginPath();
      poster.arc(posterWidth * 0.5, height * 0.52, posterWidth * 0.3, Math.PI, 0);
      poster.closePath();
      poster.fill();
      poster.strokeStyle = '#1f2d5c';
      poster.lineWidth = 5;
      poster.beginPath();
      poster.moveTo(posterWidth * 0.5, height * 0.52);
      poster.lineTo(posterWidth * 0.5, height * 0.72);
      poster.arc(posterWidth * 0.46, height * 0.72, posterWidth * 0.04, 0, Math.PI);
      poster.stroke();
      for (let drop = 0; drop < 7; drop += 1) {
        fillEllipse(poster, posterWidth * randomBetween(0.15, 0.85), height * randomBetween(0.2, 0.34), 3, 6, 0, '#3ba6e6');
      }
      drawText(poster, '雨の日', posterWidth / 2, height * 0.14, { color: '#1f2d5c', family: FONT_HAND, size: height * 0.1, weight: 400 });
      drawText(poster, 'ポイント2倍', posterWidth / 2, height * 0.85, { color: '#e84a3c', family: FONT_DISPLAY, maxWidth: posterWidth * 0.86, size: height * 0.09, weight: 400 });
    },
    (poster) => {
      drawPosterFrame(poster, posterWidth, height, '#ffd449', '#fffdf2');
      fillRoundedRect(poster, posterWidth * 0.26, height * 0.3, posterWidth * 0.48, height * 0.42, 6, '#e84a3c');
      poster.fillStyle = '#ffffff';
      poster.fillRect(posterWidth * 0.3, height * 0.36, posterWidth * 0.4, height * 0.1);
      drawStar(poster, posterWidth * 0.5, height * 0.58, posterWidth * 0.1, '#ffd449', '#1f2d5c', 3);
      drawText(poster, 'マンガ新刊', posterWidth / 2, height * 0.15, { color: '#1f2d5c', family: FONT_DISPLAY, maxWidth: posterWidth * 0.86, size: height * 0.09, weight: 400 });
      drawText(poster, '入荷しました', posterWidth / 2, height * 0.84, { color: '#e84a3c', family: FONT_HAND, maxWidth: posterWidth * 0.86, size: height * 0.075, weight: 400 });
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
