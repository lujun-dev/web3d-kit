/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { computePixelRatio } from '../core/math.js';

/* handleResize（systems） */
export function handleResize() {
  W.viewportWidth = Math.max(1, window.innerWidth);
  W.viewportHeight = Math.max(1, window.innerHeight);
  const pixelRatio = computePixelRatio();
  W.renderer.setPixelRatio(pixelRatio);
  W.renderer.setSize(W.viewportWidth, W.viewportHeight, false);
  const drawingWidth = Math.max(1, Math.floor(W.viewportWidth * pixelRatio));
  const drawingHeight = Math.max(1, Math.floor(W.viewportHeight * pixelRatio));
  W.camera.aspect = W.viewportWidth / W.viewportHeight;
  W.camera.updateProjectionMatrix();
  W.sceneTarget.setSize(drawingWidth, drawingHeight);
  W.normalTarget.setSize(drawingWidth, drawingHeight);
  W.compositeTarget.setSize(drawingWidth, drawingHeight);
  W.gradeTarget.setSize(drawingWidth, drawingHeight);
  W.reflectionTarget.setSize(Math.max(1, Math.floor(drawingWidth / 2)), Math.max(1, Math.floor(drawingHeight / 2)));
  W.bloomPass.setSize(drawingWidth, drawingHeight);
  W.compositeMaterial.uniforms.uResolution.value.set(drawingWidth, drawingHeight);
  W.compositeMaterial.uniforms.uLineWidth.value = Math.max(1, pixelRatio * 0.75);
  W.compositeMaterial.uniforms.uCameraNear.value = W.camera.near;
  W.compositeMaterial.uniforms.uCameraFar.value = W.camera.far;
  W.gradeMaterial.uniforms.uResolution.value.set(drawingWidth, drawingHeight);
  W.fxaaMaterial.uniforms.resolution.value.set(1 / drawingWidth, 1 / drawingHeight);
}
