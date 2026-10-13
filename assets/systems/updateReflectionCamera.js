/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { reflectionCamera, reflectionMatrix } from '../core/util.js';

/* updateReflectionCamera（systems） */
export function updateReflectionCamera() {
  W.camera.updateMatrixWorld();
  const { clipPlane, farCorner, look, plane, planePoint, position, up } = W.reflectionScratch;
  position.setFromMatrixPosition(W.camera.matrixWorld);
  look.set(0, 0, -1).applyQuaternion(W.camera.quaternion).add(position);
  up.set(0, 1, 0).applyQuaternion(W.camera.quaternion);
  reflectionCamera.position.set(position.x, -position.y, position.z);
  reflectionCamera.up.set(up.x, -up.y, up.z);
  reflectionCamera.lookAt(look.x, -look.y, look.z);
  reflectionCamera.near = W.camera.near;
  reflectionCamera.far = W.camera.far;
  reflectionCamera.updateMatrixWorld();
  reflectionCamera.projectionMatrix.copy(W.camera.projectionMatrix);
  reflectionMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
  reflectionMatrix.multiply(reflectionCamera.projectionMatrix);
  reflectionMatrix.multiply(reflectionCamera.matrixWorldInverse);
  // Oblique near plane so nothing below the street leaks into the mirror image.
  plane.setFromNormalAndCoplanarPoint(W.Y_AXIS, planePoint);
  plane.applyMatrix4(reflectionCamera.matrixWorldInverse);
  clipPlane.set(plane.normal.x, plane.normal.y, plane.normal.z, plane.constant);
  const elements = reflectionCamera.projectionMatrix.elements;
  farCorner.set(
    (Math.sign(clipPlane.x) + elements[8]) / elements[0],
    (Math.sign(clipPlane.y) + elements[9]) / elements[5],
    -1,
    (1 + elements[10]) / elements[14],
  );
  clipPlane.multiplyScalar(2 / clipPlane.dot(farCorner));
  elements[2] = clipPlane.x;
  elements[6] = clipPlane.y;
  elements[10] = clipPlane.z + 1;
  elements[14] = clipPlane.w;
  reflectionCamera.projectionMatrixInverse.copy(reflectionCamera.projectionMatrix).invert();
}
