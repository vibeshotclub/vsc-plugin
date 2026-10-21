---
name: vsc-prompt-gallery
description: 使用 Vibe Shot Club 提示词画廊（收录优秀创作者的真实作品与完整提示词，以视频为主）。用户按主题找提示词、想看某位创作者怎么写、要参考真实案例改写提示词时使用。Use to find real prompts by theme or by creator name.
---

# 提示词画廊（Gallery）

> **先确认插件已连接。** 当前会话里没有 `vsc_` 开头的工具（工具名可能带前缀，例如 `mcp__vsc__vsc_search`；客户端按需加载工具时先按 `vsc` 搜一次），或者调用返回未登录、401、授权失效时，立即停下，告诉用户 VSC 插件还没连接，并给出登录方法：Codex 运行 `codex mcp login vsc`；Claude Code 输入 `/mcp` 选中 `plugin:vsc:vsc` 登录。完整话术见 `vsc-creative-director` 第 0 节。**不要**改用 vibeshot.club 网页、浏览器、网站接口、网页搜索或记忆来代替库里的内容。

## 库里有什么

每件作品包含以下信息：
- 标题、描述
- 完整提示词、负面提示词
- 模型（Seedance、Runway、Kling、Midjourney 等）
- 媒体类型（图片或视频）
- 作者、来源链接、标签

提示词大多是英文，保留作者原文。

## 按创作者找

1. 调用 `vsc_search({ library: "gallery", creator: "名字或 @handle" })`。服务端会同时匹配用户名和显示名。
2. 如果匹配到多位创作者，先让用户确认是哪一位。不知道有哪些创作者时，可以用 `vsc_browse({ library: "gallery" })` 查看。
3. 总结这位创作者的提示词习惯：常用结构、常用词、参数、偏好的模型。总结比罗列更有用。

## 按主题找

1. 先把用户的主题**扩展成中英文关键词**再搜。例如"国潮海报"可以扩展为 `["国潮", "中国风海报", "chinese poster", "oriental", "new chinese style"]`。
2. 结果不理想时，换同义词或更宽泛的上位词再搜一次。不要用同一组词反复搜。
3. 需要限定模型或媒体类型时，用 `filters: { model: "seedance", media_type: "video" }`。

## 读提示词，讲清用途

调用 `vsc_get_prompt({ id })` 后，按下面的结构告诉用户：
- **用途**：适合做什么，例如海报、头像、产品图、分镜。根据提示词内容和标签来判断。
- **结构拆解**：主体、风格、光线、构图、参数分别对应哪几段。
- **可替换位**：换成用户自己的主题时，要改哪几个词。
- **改写版**：直接给出一条换成用户主题后的提示词。

用户想看原作品时，调用 `vsc_media({ library: "gallery", id })`。

## 署名

引用作品时，附上作者名和网站链接。改写后的提示词也要注明"参考自 @作者"（详情里的 `attribution` 字段）。

## 非会员

非会员可以看到所有作品的标题、作者、标签和模型，另外可以查看 30 条固定样例的完整提示词（搜索结果中 `prompt_available: true` 的条目）。其他作品返回 `locked: true`。**不要补写或猜测被锁定的提示词。**可以根据标题和标签给出"我的通用写法"，但必须注明"这不是作者原文"。
