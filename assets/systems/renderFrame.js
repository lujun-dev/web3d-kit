/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { LAYER_GROUND, LAYER_OUTLINED } from '../core/constants.js';
import { reflectionCamera } from '../core/util.js';
import { updateReflectionCamera } from './updateReflectionCamera.js';

/* renderFrame（systems） */
export function renderFrame(deltaTime) {
  // Mirror image for the wet street (the shadow maps refresh during this pass).
  updateReflectionCamera();
  W.renderer.shadowMap.needsUpdate = true;
  W.renderer.setRenderTarget(W.reflectionTarget);
  W.renderer.render(W.scene, reflectionCamera);

  // View-space normals and depth for the ink lines.
  W.camera.layers.set(LAYER_OUTLINED);
  W.camera.layers.enable(LAYER_GROUND);
  W.scene.overrideMaterial = W.normalPassMaterial;
  W.scene.background = null;
  W.renderer.setClearColor(W.normalClearColor, 1);
  W.renderer.setRenderTarget(W.normalTarget);
  W.renderer.render(W.scene, W.camera);
  W.scene.overrideMaterial = null;
  W.scene.background = W.backgroundTexture;
  W.renderer.setClearColor(W.blackColor, 1);
  W.camera.layers.enableAll();

  // Full color.
  W.renderer.setRenderTarget(W.sceneTarget);
  W.renderer.render(W.scene, W.camera);

  W.compositeMaterial.uniforms.tColor.value = W.sceneTarget.texture;
  W.compositeMaterial.uniforms.tNormal.value = W.normalTarget.texture;
  W.compositeMaterial.uniforms.tDepth.value = W.normalTarget.depthTexture;
  W.renderer.setRenderTarget(W.compositeTarget);
  W.compositeQuad.render(W.renderer);

  W.bloomPass.render(W.renderer, null, W.compositeTarget, deltaTime, false);

  W.gradeMaterial.uniforms.tInput.value = W.compositeTarget.texture;
  W.renderer.setRenderTarget(W.gradeTarget);
  W.gradeQuad.render(W.renderer);

  W.fxaaMaterial.uniforms.tDiffuse.value = W.gradeTarget.texture;
  W.renderer.setRenderTarget(null);
  W.fxaaQuad.render(W.renderer);
}
