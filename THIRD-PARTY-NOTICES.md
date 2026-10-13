# 第三方件声明（THIRD-PARTY NOTICES）

本仓库 `assets/` 下的自有资产（regions/props/systems/core/scene）为本地机械拆解产物；
`assets/vendor/` 下是**搬运进来的第三方件**，逐字未改，各自的许可与版权如下。

## three.js examples/jsm（51 个文件 · MIT）

来源：three.js 官方仓库 `examples/jsm/`（通过 npm 包 `three` 分发）。
许可：MIT —— 版权归 three.js authors，全文见 `assets/vendor/three/LICENSE`。

## tuxalin/procedural-tileable-shaders（17 个文件）

来源：tuxalin/procedural-tileable-shaders（GitHub）。许可与版权见包内 LICENSE 文件。

## 使用纪律

- 搬运件**不改写**：要改就新写一个件，别动 vendor 下的文件，将来好整包升级。
- 升级方式：改 `tools/vendor-third-party.py` 里的版本/清单 → 重跑 → 跑 `node tools/verify-vendor.mjs`。
- 自有资产与搬运件的分界必须清楚：文档里只写「搬运自 three.js 官方 / 见 THIRD-PARTY-NOTICES」，不写任何本地参照来源。
