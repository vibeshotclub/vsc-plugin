---
name: vsc-lexicon
description: 使用 Vibe Shot Club 风格图谱（1600 多个视觉风格概念，覆盖艺术史、插画、摄影、电影、3D、平面、建筑、材质等 13 个领域）。用于找风格、介绍风格、区分相近风格、随机一个风格、随机组提示词、多风格混搭。图片和视频的风格需求默认都用这个库。Use for style concepts, style prompt templates, random styles and style mixing.
---

# 风格图谱（Lexicon）

> **先确认插件已连接。** 当前会话里没有 `vsc_` 开头的工具（工具名可能带前缀，例如 `mcp__vsc__vsc_search`；客户端按需加载工具时先按 `vsc` 搜一次），或者调用返回未登录、401、授权失效时，立即停下，告诉用户 VSC 插件还没连接，并给出登录方法：Codex 运行 `codex mcp login vsc`；Claude Code 输入 `/mcp` 选中 `plugin:vsc:vsc` 登录。完整话术见 `vsc-creative-director` 第 0 节。**不要**改用 vibeshot.club 网页、浏览器、网站接口、网页搜索或记忆来代替库里的内容。

## 库的结构

- 共 13 个领域、157 个谱系，下面是一个个风格概念。13 个领域如下：
  - A 西方艺术史与绘画
  - B 东方与全球传统
  - C 插画出版与概念设计
  - D 漫画动漫与角色
  - E 平面海报与排版
  - F 摄影光学与胶片
  - G 电影电视与视频
  - H CG/3D/数字与游戏
  - I 动画与动态设计
  - J UI/UX
  - K 流行文化与亚文化
  - L 建筑空间与环境
  - M 材质表面与产品
- 每个概念的详情包含以下字段：
  - `summary`：定义
  - `features`：可辨识的特征
  - `facets`：媒介、技法、构图、色彩、光、质感
  - `applications`：适用场景
  - `prompt.template_en`：提示词模板，带 `[subject]` 槽位
  - `prompt.negative_en`：负面提示词
  - `confusables`：易混淆的风格，以及两者的区别
  - `relations`：与其他风格的关系
- 模板和样图都按 gpt-image-2.5 的写法制作，对其他图片模型通用。

## 1. 找风格

- **用户知道风格名**：调用 `vsc_search({ library: "lexicon", keywords: ["巴洛克", "baroque"] })`。
- **用户只描述了一种感觉**：把感觉拆成媒介、光、色、质感的关键词再搜。也可以先用 `vsc_browse({ library: "lexicon" })` 看领域和适用场景，再用 `filters: { domain, application }` 缩小范围。
- **用户不知道要什么风格**：调用 `vsc_random({ library: "lexicon", count: 1–3 })`。如果知道用途（比如做海报），就加上 `filters: { application: "poster" }`。
- **用户在两个风格之间犹豫**：用 `confusables` 里的 `difference` 讲清两者的区别。

## 2. 介绍风格

按这个顺序介绍：一句话讲定义，再讲 2–3 个可辨识的特征，然后说适合做什么。需要看样图时，调用 `vsc_media({ library: "lexicon", id })`。不要照搬全文。

## 3. 写提示词

1. 调用 `vsc_get_style({ id })`。
2. 把 `template_en` 里的 `[subject]` 换成用户的主体。模板里写的光线和构图约束要保留。
3. 把 `negative_en` 作为负面提示词。如果目标模型不支持负面提示词，就改写成正向约束，例如把 "no stretched faces" 改成 "keep faces natural"。
4. 默认用英文模板。`template_zh` 只用来向用户解释。

## 4. 随机组提示词、风格混搭

- 先用 `vsc_random({ library: "lexicon", count: 2 或 3 })` 抽风格，或者使用用户指定的风格，再调用 `vsc_mix_styles({ ids, subject })`。
- 第一个风格负责"形"，其余风格补充色、光、质感。可以参考 `relations` 里 `often_combined_with` 类型的关系来挑组合，不要把两个形态都很强的风格硬凑在一起。
- 给用户的结果里写清楚：组合了哪几个风格、每个风格贡献了什么（见 `contributions`），以及完整的提示词。

## 5. 用户指明要用 MJ

1. **把模板压缩成短语**：删掉 "Create a ... of" 这类句式，把长句拆成用逗号分隔的关键短语，保留风格、光线、构图三类信息。
2. **推荐 sref**：用这个风格的关键词调用 `vsc_search({ library: "sref" })`，找 1–2 个相近的码，告诉用户："可以先试试这个 sref；如果不喜欢，我再帮你换其他的。"
3. 用户想换码时，按 `vsc-sref` 的"换码"规则继续推荐。

## 非会员

非会员可以使用 60 个固定样例风格。被锁定的条目会返回 `locked: true`，这时请引导用户开通会员。你可以给出自己对这个风格的通用理解，但必须明确说明"这不是 VSC 图谱内容"，不能冒充库里的内容。
