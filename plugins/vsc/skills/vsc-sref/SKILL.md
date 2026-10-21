---
name: vsc-sref
description: 使用 Vibe Shot Club 的 MJ 风格库（Midjourney SREF code、P 值、moodboard）。只在用户明确提到 Midjourney、MJ、sref 或风格码，或者要随机一个、组合一个风格码时使用；用户没提 MJ 时不要使用。Use only when the user explicitly asks for Midjourney --sref / --p style codes.
---

# MJ 风格库（SREF）

## 何时使用

- 用户明确提到 MJ、Midjourney、sref 或风格码。
- 用户说"随机一个风格码"或"组合一个风格码"。
- 在风格图谱的流程里，用户指明要用 MJ，由 `vsc-lexicon` 转过来推荐 sref。

以上情况都不符合时，不要调用本库。

## 库里有什么

每条风格码包括：
- `code`：完整参数串，必须原样使用。可能是 `--sref 123`、`--sref 123 456`、`-p xxx`，或者以图片 URL 开头的完整配方。
- `model_version` / `style_version`：MJ 的模型版本和风格版本。
- `category`、`tags`：分类和中英文风格标签。`description`：一句话风格描述。`palette`：主色，可能为空。
- `benchmarks`：在 4 个固定场景下验证过的原始提示词，场景分别是 portrait（人物）、environment（空间）、product（产品）、illustration（插画）。

## 找码

- **有风格方向**：先把用户的描述扩展成中英文关键词（例如"胶片人像"扩展为 `["胶片", "film", "颗粒", "grain", "人像", "portrait"]`），调用 `vsc_search({ library: "sref", keywords: [...], filters: { category } })`。结果里的 `description` 和 `tags` 根据基准图整理而来，可以用来解释每个码的风格；码的标题只是参数串，不用复述。用户选定后，再调用 `vsc_get_sref({ id })`。**搜不到时不要编造**，换同义词再搜，或者改用下面"随机候选"的办法让用户凭图挑。
- **随机候选**：调用 `vsc_random({ library: "sref", count: 3 })`，再为每个候选调用 `vsc_media({ library: "sref", id, slot })` 取一张最接近用户需求的基准图（slot 为 portrait、environment、product 或 illustration），让用户看图选择。
- **随机一个**：调用 `vsc_random({ library: "sref", count: 1 })`。
- **组合一个**：调用 `vsc_random({ library: "sref", count: 2 })`，或者从用户选定的码里挑两个，再按下文"多码组合"拼接。
- **用户给了码**：直接用码里的数字搜索，例如 `vsc_search({ library: "sref", keywords: ["4292182277"] })`。

## 把码套到用户的主体上

1. 在 4 个基准场景里，选和用户需求最接近的一个。
2. 保留该场景基准提示词里的镜头、光线和构图写法，只把主体换成用户的。
3. `code` 一个字符都不要改。补上版本参数 `--v {model_version}`；有风格版本时，再补 `--sv {style_version}`。
4. 风格强度用 `--sw` 调，默认是 100。风格太重就降到 50 左右，太轻就提到 200–400。
5. 提示词里不要再写和这个码相冲突的风格词。

```
{主体与场景，沿用基准结构} {code} --v {model_version} --sv {style_version} --ar {比例}
```

## 多码组合

- 平均混合：`--sref A B`。
- 按权重混合：`--sref A::2 B::1`。
- 两个码的版本不一致时，提醒用户效果可能不稳定。

## 换码

推荐时告诉用户"可以先试试这个"。用户不喜欢的话，按同一个方向再推荐 1–2 个相近的码，不要重复推荐同一个。

## 非会员

非会员只能使用一小部分固定样例。被锁定的码会返回 `locked: true`，这时请引导用户开通会员，不要编造代码。
