/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from './world.js';
import { createCanvas } from './canvas.js';
import { GLASS_FRAGMENT_SHADER, GLASS_VERTEX_SHADER, GROUND_FRAGMENT_BODY, GROUND_FRAGMENT_HEADER, LAYER_EFFECTS } from './constants.js';
import { PAVING_NORMAL_REPEAT, photos } from './photos.js';
import { reflectionMatrix, toonGradient } from './util.js';

/* createToonMaterial（core/materials） */
export function createToonMaterial(map, isCutout) {
  const material = new THREE.MeshToonMaterial({
    alphaTest: isCutout ? 0.5 : 0,
    color: 0xffffff,
    gradientMap: toonGradient,
    map,
    side: isCutout ? THREE.DoubleSide : THREE.FrontSide,
    vertexColors: true,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uChannelLevels = W.sharedUniforms.uChannelLevels;
    shader.uniforms.uInteriorTint = W.sharedUniforms.uInteriorTint;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        attribute vec3 aEmission;
        uniform float uChannelLevels[16];
        varying float vEmissionStrength;
        varying float vInteriorStrength;
        varying vec3 vToonWorldNormal;`)
      .replace('#include <color_vertex>', `#include <color_vertex>
        vEmissionStrength = aEmission.x * uChannelLevels[int(aEmission.y + 0.5)];
        vInteriorStrength = aEmission.z;`)
      .replace('#include <defaultnormal_vertex>', `#include <defaultnormal_vertex>
        vToonWorldNormal = normalize((vec4(transformedNormal, 0.0) * viewMatrix).xyz);`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform vec3 uInteriorTint;
        varying float vEmissionStrength;
        varying float vInteriorStrength;
        varying vec3 vToonWorldNormal;`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float interiorShade = 0.7 + 0.3 * normalize(vToonWorldNormal).y;
        totalEmissiveRadiance += diffuseColor.rgb * (vEmissionStrength + vInteriorStrength * interiorShade * uInteriorTint);`);
  };
  material.customProgramCacheKey = () => {
    return isCutout ? 'hoshizora-toon-cutout' : 'hoshizora-toon-solid';
  };
  return material;
}

/* createGlassMaterial（core/materials） */
export function createGlassMaterial(hasRain) {
  return new THREE.ShaderMaterial({
    blendDst: THREE.OneMinusSrcAlphaFactor,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blending: THREE.CustomBlending,
    depthWrite: false,
    fragmentShader: GLASS_FRAGMENT_SHADER,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: { uRain: { value: hasRain ? 1 : 0 }, uTime: W.sharedUniforms.uTime },
    vertexShader: GLASS_VERTEX_SHADER,
  });
}

/* createGroundMaterial（core/materials） */
export function createGroundMaterial(albedoTexture, wetTexture) {
  const material = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: W.groundGradient, map: albedoTexture });
  // 真实石面法线（CC0 PavingStones131）：repeat 与 canvas 里 205px 一张贴图对齐（地面 UV 0..1 覆盖 24 单位）
  if (photos.pavingNormal) {
    const normalMap = new THREE.Texture(photos.pavingNormal);
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(PAVING_NORMAL_REPEAT, PAVING_NORMAL_REPEAT);
    normalMap.needsUpdate = true;
    material.normalMap = normalMap;
    material.normalScale = new THREE.Vector2(0.85, 0.85);
  }
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uReflectionMap = { value: W.reflectionTarget.texture };
    shader.uniforms.uReflectionMatrix = { value: reflectionMatrix };
    shader.uniforms.uWetMap = { value: wetTexture };
    shader.uniforms.uTime = W.sharedUniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGroundWorld;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvGroundWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${GROUND_FRAGMENT_HEADER}`)
      .replace('#include <opaque_fragment>', `${GROUND_FRAGMENT_BODY}\n#include <opaque_fragment>`);
  };
  material.customProgramCacheKey = () => {
    return 'hoshizora-ground';
  };
  return material;
}

/* createSpotLight（core/materials） */
export function createSpotLight(options) {
  const { angle, color, decay, distance, intensity, penumbra, position, shadowSize, target } = options;
  const light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
  light.position.set(position[0], position[1], position[2]);
  light.target.position.set(target[0], target[1], target[2]);
  if (shadowSize) {
    light.castShadow = true;
    light.shadow.mapSize.set(shadowSize, shadowSize);
    light.shadow.bias = -0.0004;
    light.shadow.normalBias = 0.03;
    light.shadow.camera.near = 0.3;
    light.shadow.radius = 2;
  }
  light.userData.baseIntensity = intensity;
  W.scene.add(light, light.target);
  return light;
}

/* createPointLight（core/materials） */
export function createPointLight(color, intensity, distance, position) {
  const light = new THREE.PointLight(color, intensity, distance, 2);
  light.position.set(position[0], position[1], position[2]);
  light.userData.baseIntensity = intensity;
  W.scene.add(light);
  return light;
}

/* createLightCone（core/materials） */
export function createLightCone(apex, height, radius, color, intensity, channel) {
  const geometry = new THREE.CylinderGeometry(0.12, radius, height, 32, 1, true);
  geometry.translate(0, -height / 2, 0);
  const material = new THREE.ShaderMaterial({
    blending: THREE.AdditiveBlending,
    defines: { CHANNEL_INDEX: channel },
    depthWrite: false,
    fragmentShader: /* glsl */`
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uTime;
      uniform float uChannelLevels[16];
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;
      varying float vAlong;
      void main() {
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        float facing = abs(dot(normalize(vWorldNormal), viewDirection));
        float body = pow(facing, 1.6);
        float fade = clamp(1.0 - vAlong, 0.0, 1.0) * smoothstep(0.0, 0.06, vAlong) * smoothstep(1.0, 0.85, vAlong);
        float shimmer = 0.85 + 0.15 * sin(vWorldPosition.y * 13.0 - uTime * 9.0 + vWorldPosition.x * 5.0);
        gl_FragColor = vec4(uColor * uIntensity * body * fade * shimmer * uChannelLevels[CHANNEL_INDEX], 1.0);
      }
    `,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: { uChannelLevels: W.sharedUniforms.uChannelLevels, uColor: { value: new THREE.Color(color) }, uHeight: { value: height }, uIntensity: { value: intensity }, uTime: W.sharedUniforms.uTime },
    vertexShader: /* glsl */`
      uniform float uHeight;
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;
      varying float vAlong;
      void main() {
        vAlong = -position.y / uHeight;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(apex[0], apex[1], apex[2]);
  mesh.layers.set(LAYER_EFFECTS);
  W.scene.add(mesh);
}

/* createBackgroundTexture（core/materials） */
export function createBackgroundTexture() {
  const canvas = createCanvas(512, 512);
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#1c2548');
  gradient.addColorStop(0.5, '#0d1328');
  gradient.addColorStop(1, '#04060c');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 512);
  const glow = context.createRadialGradient(256, 250, 10, 256, 250, 300);
  glow.addColorStop(0, 'rgba(70, 90, 150, 0.35)');
  glow.addColorStop(1, 'rgba(70, 90, 150, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, 512, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
