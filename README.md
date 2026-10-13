# web3d-kit

在网页上搭**微缩场景**（diorama）的工具箱：方形的小街角，能拖动旋转缩放，导出成**一个单文件 HTML**，离线双击即开、没有 CDN、没有服务器。

这个仓库的立场很明确：**先拆件、再拼接**，不要直接让 AI 生成一整场景。

- 拆件可验证：件是死的，拼起来对不对能用数字量（顶点数、包围盒、构图量测）核。
- 生成不可验证：好不好全凭感觉，而且下一次生成只会漂移，不会更好。
- 拆件越用越厚：新场景只写自己的装配，管线与素材不用重做。

怎么借、怎么拼、怎么加件：**[docs/资产复用指南.md](docs/资产复用指南.md)**。

## 仓库结构

```
assets/           资产包（一件一文件，机械拆出，不改写实现）
  core/           运行时：world（世界与状态 W）· constants · canvas · math · geometry · materials · util
  regions/        程序化贴图 63 件（canvas 画的，一张一文件）
  props/          构件 35 件（店面 / 邻楼 / 电线杆 / 自行车 / 猫 …）
  systems/        机制 32 件（雨三层 · 溅水 · 滴水 · 发光通道 · 地面反射 · 墨线合成 · 泛光调色 · 自动门 …）
  scene/          场景形状与装配范例（把资产件拼回一场完整雨夜街景）
  manifest.json   清单：部件名 / 文件 / 类别 / 行数
kit/              装配与自检工具
  blocks/registry.js   积木注册表 + 分轮（?step=1 几何 / 2 贴图 / 3 着色器与后处理）
  test/*.mjs           客观自检：出画量测、亮度直方图、特效是否真生效、零外链
tools/
  split-assets.py      拆分器（可复跑：从基准单文件重新生成整包）
  verify-assets.mjs    保真验证：把资产件拼回去 → 打包 → 跑起来 → 对照顶点数与报错
docs/                  资产复用指南 · 同类开源拆解
```

## 跑起来

```bash
npm install                 # three + esbuild（跑验证与打包用）
node tools/verify-assets.mjs   # 把资产件拼回场景、打包、跑起来、对照数字
```

验证通过的样子：无 pageerror / console error，且桶顶点数与基准一致
（`outlined 77240 · plain 44108 · cutout 320 · exteriorGlass 36 · interiorGlass 40`，场景 50 个网格）。
**拆包改动的唯一合法理由是新增件**，不该让老件的数字变。

## 资产包的三个约定

1. **一件一文件**，函数名 = 文件名；贴图进 `regions/`，构件进 `props/`，机制进 `systems/`。
2. **不改写件**：件是从原实现机械拆出来的，只搬移、不改逻辑；要改就新增一个件，别动老件（老件被别的场景引用着）。
3. **状态集中在 `W`**：会被跨模块改写的绑定都放在 `assets/core/world.js` 的 `W` 里，件只通过 `W` 读写（ES 模块的具名导入是只读的，不能跨模块赋值）。

## 分轮构建

每个产物都能分三轮打开，一层一层判：

| stage | 看到什么 |
| --- | --- |
| `?step=1` | 只有几何与布局（扁平色，无贴图无后处理） |
| `?step=2` | + 程序化贴图与描边 |
| `?step=3` | + 着色器与后处理（默认） |

每一轮出图交人判，不要一口气全上。

## 自检不是「看着行」

| 脚本 | 断言什么 |
| --- | --- |
| `kit/test/frame-check.mjs` | 关键点的屏幕坐标：不出画 |
| `kit/test/look-check.mjs` | 亮度直方图：均值 / 分位 / 死黑占比 / 过曝占比 + fps |
| `kit/test/effects.mjs` | 每个特效都能**可量测地**改变像素，否则判死代码 |
| `kit/test/compliance.mjs` | 单文件保证：无外链、无内联事件、无外部请求 |
| `tools/verify-assets.mjs` | 资产包拼回去后不报错、桶顶点数与基准一致 |

## 素材不进货

`assets.lock.json` 只记**去哪拿**（HDRI、PBR 贴图集…）与 sha256，`scripts/fetch-assets.mjs` 负责重下与校验；
仓库里永远不放大素材本体，新克隆也能复原同样的字节。

## License

代码 MIT。资产包是本地的机械拆解产物，文档与提交信息里不写来源。

---

### English summary

A toolkit for building miniature diorama scenes on the web (one single-file, offline HTML, no CDN).
The house rule: **split reusable pieces first, then assemble — do not ask an AI to generate a whole scene.**
Pieces are verifiable (vertex counts, bounding boxes, framing measurements); generated scenes are not.
`assets/` holds one-piece-per-file building blocks (regions / props / systems), `tools/verify-assets.mjs`
proves a reassembled scene matches the baseline bucket counts exactly. See `docs/资产复用指南.md`.
