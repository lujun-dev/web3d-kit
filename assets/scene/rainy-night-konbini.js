/* 示例装配：把资产件按基准原样拼回同一场雨夜街景（这是装配范例，不是新做的场景）。
   只 import 这一个文件，世界与场景就会按基准顺序建起来。 */
import '../core/world.js';
import { initialize } from './index.js';

export const ready = initialize();
