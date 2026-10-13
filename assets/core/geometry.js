/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from './world.js';
import {
  COLORS,
  HYDRANGEA_COLORS,
  LAYER_EFFECTS,
  LAYER_OUTLINED,
  LAYER_PLAIN,
  LOT_Y,
  PANEL_ROTATIONS,
  SHRUB_COLORS,
  WET_SCALE,
} from './constants.js';
import { pickRandom, randomBetween } from './math.js';
import {
  geometryCache,
  getClosedUmbrellaGeometry,
  resolveColor,
  resolvePaint,
  toWetX,
  toWetY,
  unitBox,
  unitPlane,
  withMatrix,
} from './util.js';

/* GeometryBucket（core/geometry） */
export class GeometryBucket {
  constructor() {
    this.colors = [];
    this.emissions = [];
    this.indices = [];
    this.normals = [];
    this.positions = [];
    this.uvs = [];
    this.vertexCount = 0;
  }

  addGeometry(geometry, matrix, paint) {
    const position = geometry.attributes.position;
    const normal = geometry.attributes.normal;
    const uv = geometry.attributes.uv;
    const count = position.count;
    const groupOfVertex = new Int32Array(count).fill(-1);
    for (const group of geometry.groups) {
      const end = group.start + group.count;
      for (let item = group.start; item < end; item += 1) {
        const vertex = geometry.index ? geometry.index.getX(item) : item;
        groupOfVertex[vertex] = group.materialIndex;
      }
    }
    W.scratchNormalMatrix.getNormalMatrix(matrix);
    const resolvedByGroup = new Map();
    const whiteU = (W.whiteRect.u0 + W.whiteRect.u1) / 2;
    const whiteV = (W.whiteRect.v0 + W.whiteRect.v1) / 2;
    for (let vertex = 0; vertex < count; vertex += 1) {
      const group = groupOfVertex[vertex];
      let resolved = resolvedByGroup.get(group);
      if (!resolved) {
        resolved = resolvePaint(paint, group);
        resolvedByGroup.set(group, resolved);
      }
      W.scratchPosition.fromBufferAttribute(position, vertex).applyMatrix4(matrix);
      this.positions.push(W.scratchPosition.x, W.scratchPosition.y, W.scratchPosition.z);
      W.scratchNormal.fromBufferAttribute(normal, vertex).applyMatrix3(W.scratchNormalMatrix).normalize();
      this.normals.push(W.scratchNormal.x, W.scratchNormal.y, W.scratchNormal.z);
      const rect = resolved.map;
      if (rect && uv) {
        this.uvs.push(rect.u0 + (rect.u1 - rect.u0) * uv.getX(vertex), rect.v0 + (rect.v1 - rect.v0) * uv.getY(vertex));
      } else {
        this.uvs.push(whiteU, whiteV);
      }
      const color = resolveColor(resolved.color);
      this.colors.push(color.r, color.g, color.b);
      const interior = resolved.interior === undefined ? W.defaultInterior : resolved.interior;
      this.emissions.push(resolved.emissive || 0, resolved.channel || 0, interior);
    }
    const isMirrored = matrix.determinant() < 0;
    const base = this.vertexCount;
    const indexCount = geometry.index ? geometry.index.count : count;
    for (let item = 0; item < indexCount; item += 3) {
      const first = geometry.index ? geometry.index.getX(item) : item;
      const second = geometry.index ? geometry.index.getX(item + 1) : item + 1;
      const third = geometry.index ? geometry.index.getX(item + 2) : item + 2;
      if (isMirrored) {
        this.indices.push(base + first, base + third, base + second);
      } else {
        this.indices.push(base + first, base + second, base + third);
      }
    }
    this.vertexCount += count;
  }

  createMesh(material) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(this.normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(this.uvs, 2));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3));
    geometry.setAttribute('aEmission', new THREE.Float32BufferAttribute(this.emissions, 3));
    geometry.setIndex(this.indices);
    geometry.computeBoundingSphere();
    return new THREE.Mesh(geometry, material);
  }
}

/* getCurrentTransform（core/geometry） */
export function getCurrentTransform() {
  return W.transformStack[W.transformStack.length - 1];
}

/* withTransform（core/geometry） */
export function withTransform(position, rotationY, build) {
  const local = new THREE.Matrix4().compose(
    new THREE.Vector3(position[0], position[1], position[2]),
    new THREE.Quaternion().setFromAxisAngle(W.Y_AXIS, rotationY),
    new THREE.Vector3(1, 1, 1),
  );
  W.transformStack.push(getCurrentTransform().clone().multiply(local));
  build();
  W.transformStack.pop();
}

/* composeMatrix（core/geometry） */
export function composeMatrix(position, rotation, scale) {
  const matrix = new THREE.Matrix4().compose(
    new THREE.Vector3(position[0], position[1], position[2]),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(rotation ? rotation[0] : 0, rotation ? rotation[1] : 0, rotation ? rotation[2] : 0)),
    new THREE.Vector3(scale[0], scale[1], scale[2]),
  );
  return matrix.premultiply(getCurrentTransform());
}

/* getCachedGeometry（core/geometry） */
export function getCachedGeometry(key, create) {
  let geometry = geometryCache.get(key);
  if (!geometry) {
    geometry = create();
    geometryCache.set(key, geometry);
  }
  return geometry;
}

/* addBox（core/geometry） */
export function addBox(bucket, center, size, paint, rotation) {
  bucket.addGeometry(unitBox, composeMatrix(center, rotation, size), paint);
}

/* addBlock（core/geometry） */
export function addBlock(bucket, minimum, maximum, paint) {
  addBox(
    bucket,
    [(minimum[0] + maximum[0]) / 2, (minimum[1] + maximum[1]) / 2, (minimum[2] + maximum[2]) / 2],
    [maximum[0] - minimum[0], maximum[1] - minimum[1], maximum[2] - minimum[2]],
    paint,
  );
}

/* addCylinder（core/geometry） */
export function addCylinder(bucket, center, radius, height, paint, options = {}) {
  const topRatio = options.topRadius === undefined ? 1 : Math.round((options.topRadius / radius) * 1000) / 1000;
  const segments = options.segments || 12;
  const isOpenEnded = !!options.isOpenEnded;
  const geometry = getCachedGeometry(`cylinder|${topRatio}|${segments}|${isOpenEnded}`, () => {
    return new THREE.CylinderGeometry(topRatio, 1, 1, segments, 1, isOpenEnded);
  });
  bucket.addGeometry(geometry, composeMatrix(center, options.rotation, [radius, height, radius]), paint);
}

/* addRod（core/geometry） */
export function addRod(bucket, start, end, radius, paint, segments = 8) {
  const startVector = new THREE.Vector3(start[0], start[1], start[2]);
  const endVector = new THREE.Vector3(end[0], end[1], end[2]);
  const direction = endVector.clone().sub(startVector);
  const length = direction.length();
  if (length < 1e-5) {
    return;
  }
  const quaternion = new THREE.Quaternion().setFromUnitVectors(W.Y_AXIS, direction.normalize());
  const middle = startVector.clone().add(endVector).multiplyScalar(0.5);
  const matrix = new THREE.Matrix4().compose(middle, quaternion, new THREE.Vector3(radius, length, radius)).premultiply(getCurrentTransform());
  const geometry = getCachedGeometry(`rod|${segments}`, () => {
    return new THREE.CylinderGeometry(1, 1, 1, segments, 1, false);
  });
  bucket.addGeometry(geometry, matrix, paint);
}

/* addSphere（core/geometry） */
export function addSphere(bucket, center, radius, paint, options = {}) {
  const isFaceted = !!options.isFaceted;
  const geometry = getCachedGeometry(`sphere|${isFaceted}`, () => {
    return isFaceted ? new THREE.IcosahedronGeometry(1, 1) : new THREE.SphereGeometry(1, 18, 12);
  });
  const scale = options.scale || [1, 1, 1];
  bucket.addGeometry(geometry, composeMatrix(center, options.rotation, [radius * scale[0], radius * scale[1], radius * scale[2]]), paint);
}

/* addMesh（core/geometry） */
export function addMesh(bucket, geometry, position, rotation, scale, paint) {
  bucket.addGeometry(geometry, composeMatrix(position, rotation, scale), paint);
}

/* addTube（core/geometry） */
export function addTube(bucket, points, radius, paint, tubularSegments = 24, radialSegments = 6) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => {
    return new THREE.Vector3(point[0], point[1], point[2]);
  }));
  const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
  bucket.addGeometry(geometry, getCurrentTransform(), paint);
  geometry.dispose();
}

/* addPanel（core/geometry） */
export function addPanel(bucket, center, width, height, facing, paint) {
  bucket.addGeometry(unitPlane, composeMatrix(center, PANEL_ROTATIONS[facing], [width, height, 1]), paint);
}

/* addQuad（core/geometry） */
export function addQuad(bucket, corners, paint) {
  const geometry = new THREE.BufferGeometry();
  const first = new THREE.Vector3(...corners[0]);
  const normal = new THREE.Vector3().subVectors(new THREE.Vector3(...corners[1]), first)
    .cross(new THREE.Vector3().subVectors(new THREE.Vector3(...corners[3]), first))
    .normalize();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(corners.flat(), 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute([...normal.toArray(), ...normal.toArray(), ...normal.toArray(), ...normal.toArray()], 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  bucket.addGeometry(geometry, getCurrentTransform(), paint);
}

/* addWetBlob（core/geometry） */
export function addWetBlob(context, x, z, radiusX, radiusZ, red, green, blue) {
  context.save();
  context.translate(toWetX(x), toWetY(z));
  context.scale(radiusX / radiusZ, 1);
  const radius = radiusZ * WET_SCALE;
  const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
  gradient.addColorStop(0, `rgb(${red}, ${green}, ${blue})`);
  gradient.addColorStop(1, 'rgb(0, 0, 0)');
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

/* createRoundedTriangleShape（core/geometry） */
export function createRoundedTriangleShape(width, height, radius) {
  const corners = [new THREE.Vector2(-width / 2, 0), new THREE.Vector2(width / 2, 0), new THREE.Vector2(0, height)];
  const shape = new THREE.Shape();
  for (let index = 0; index < 3; index += 1) {
    const current = corners[index];
    const previous = corners[(index + 2) % 3];
    const next = corners[(index + 1) % 3];
    const start = current.clone().add(previous.clone().sub(current).normalize().multiplyScalar(radius));
    const end = current.clone().add(next.clone().sub(current).normalize().multiplyScalar(radius));
    if (index === 0) {
      shape.moveTo(start.x, start.y);
    } else {
      shape.lineTo(start.x, start.y);
    }
    shape.quadraticCurveTo(current.x, current.y, end.x, end.y);
  }
  shape.closePath();
  return shape;
}

/* createTriangleProduct（core/geometry） */
export function createTriangleProduct(width, height, radius, depth) {
  const geometry = new THREE.ExtrudeGeometry(createRoundedTriangleShape(width, height, radius), { bevelEnabled: false, curveSegments: 4, depth });
  geometry.translate(0, 0, -depth / 2);
  const uv = geometry.attributes.uv;
  for (let index = 0; index < uv.count; index += 1) {
    uv.setXY(index, (uv.getX(index) + width / 2) / width, uv.getY(index) / height);
  }
  return geometry;
}

/* addUmbrella（core/geometry） */
export function addUmbrella(base, color, tilt) {
  const local = new THREE.Matrix4().compose(
    new THREE.Vector3(base[0], base[1], base[2]),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(tilt[0], tilt[1], tilt[2])),
    new THREE.Vector3(1, 1, 1),
  );
  withMatrix(local, () => {
    addMesh(W.buckets.outlined, getClosedUmbrellaGeometry(), [0, 0, 0], null, [1, 1, 1], { color });
    addRod(W.buckets.outlined, [0, 0.6, 0], [0, 0.86, 0], 0.006, { color: COLORS.silver }, 5);
    const handle = getCachedGeometry('umbrellaHandle', () => {
      return new THREE.TorusGeometry(0.035, 0.011, 6, 10, Math.PI);
    });
    addMesh(W.buckets.outlined, handle, [0.035, 0.86, 0], null, [1, 1, 1], { color: '#3a2a20' });
    addRod(W.buckets.outlined, [0.07, 0.86, 0], [0.07, 0.8, 0], 0.011, { color: '#3a2a20' }, 5);
  });
}

/* addWire（core/geometry） */
export function addWire(start, end, sag, radius) {
  const points = [];
  for (let index = 0; index <= 14; index += 1) {
    const t = index / 14;
    points.push([
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t - sag * 4 * t * (1 - t),
      start[2] + (end[2] - start[2]) * t,
    ]);
  }
  addTube(W.buckets.outlined, points, radius, { color: '#15171c' }, 28, 5);
}

/* addShrub（core/geometry） */
export function addShrub(x, z, radius, isHydrangea) {
  addSphere(W.buckets.outlined, [x, LOT_Y + 0.25 + radius * 0.55, z], radius, { color: pickRandom(SHRUB_COLORS) }, { scale: [1.15, 0.85, 1.15] });
  if (isHydrangea) {
    for (let bloom = 0; bloom < 3; bloom += 1) {
      addSphere(W.buckets.outlined, [x + randomBetween(-0.2, 0.2), LOT_Y + 0.3 + radius * 1.05, z + randomBetween(-0.15, 0.15)], randomBetween(0.09, 0.13), { color: pickRandom(HYDRANGEA_COLORS) }, { isFaceted: true });
    }
  }
}

/* createQuadGeometry（core/geometry） */
export function createQuadGeometry(minimumX, maximumX, minimumY, maximumY) {
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([
    minimumX, minimumY, 0,
    maximumX, minimumY, 0,
    maximumX, maximumY, 0,
    minimumX, maximumY, 0,
  ], 3));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  return geometry;
}

/* addEffectMesh（core/geometry） */
export function addEffectMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.layers.set(LAYER_EFFECTS);
  W.scene.add(mesh);
  return mesh;
}

/* finalizeBuckets（core/geometry） */
export function finalizeBuckets() {
  const outlinedMesh = W.buckets.outlined.createMesh(W.materials.toon);
  outlinedMesh.castShadow = true;
  outlinedMesh.receiveShadow = true;
  outlinedMesh.layers.set(LAYER_OUTLINED);
  const plainMesh = W.buckets.plain.createMesh(W.materials.toon);
  plainMesh.receiveShadow = true;
  plainMesh.layers.set(LAYER_PLAIN);
  const cutoutMesh = W.buckets.cutout.createMesh(W.materials.cutout);
  cutoutMesh.receiveShadow = true;
  cutoutMesh.layers.set(LAYER_PLAIN);
  const interiorGlassMesh = W.buckets.interiorGlass.createMesh(W.materials.interiorGlass);
  interiorGlassMesh.layers.set(LAYER_PLAIN);
  interiorGlassMesh.renderOrder = 1;
  const exteriorGlassMesh = W.buckets.exteriorGlass.createMesh(W.materials.exteriorGlass);
  exteriorGlassMesh.layers.set(LAYER_PLAIN);
  exteriorGlassMesh.renderOrder = 2;
  W.scene.add(outlinedMesh, plainMesh, cutoutMesh, interiorGlassMesh, exteriorGlassMesh);
}
