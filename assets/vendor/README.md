# assets/vendor —— 搬运进来的第三方件（不改写）

这里是**搬运件**，不是自拆件：文件逐字来自上游，许可头保留，方便整体升级。

| 来源 | 件数 | 许可 | 说明 |
|---|---|---|---|
| three.js `examples/jsm`（0.186.1） | 51 | MIT | 后处理（EffectComposer/SSRPass/GTAOPass/LUTPass/SMAAPass/OutputPass/BokehPass/UnrealBloomPass）· 物件（Reflector/ReflectorForSSRPass/Refractor/Water/Sky/Lensflare/MarchingCubes）· 几何与数学（DecalGeometry/RoundedBoxGeometry/ConvexGeometry/ConvexHull/SimplexNoise/ImprovedNoise/Lut/MeshSurfaceSampler/Octree）· 工具（BufferGeometryUtils/SceneUtils/UVsDebug）· RoomEnvironment · OutlineEffect · RGBELoader/HDRLoader · OrbitControls · 依赖的 shaders |
| tuxalin/procedural-tileable-shaders | 17 | 见包内 LICENSE | 程序化**可平铺**材质（GLSL），补我们「只有 canvas 贴图、没有 shader 材质件」的空档 |

用法：直接按原路径 import（我们把 `examples/jsm` 的目录结构原样保留，内部相对 import 不用改）：

```js
import { Reflector } from '../assets/vendor/three/examples/jsm/objects/Reflector.js';
import { SSRPass } from '../assets/vendor/three/examples/jsm/postprocessing/SSRPass.js';
```

运行时 `three` 由 importmap 提供，**版本要与搬运件的版本一致**（本包对 three 0.186.1 搬运）。

自检：`node tools/verify-vendor.mjs`（把这些件逐个 import 并实例化一遍，核对运行时 API 对得上）。
