# VSC Plugin

装上这个插件后，Codex 和 Claude Code 可以直接调阅 [Vibe Shot Club](https://vibeshot.club) 的四个创作资源库：

| 资源库 | Agent 能做什么 |
|---|---|
| 风格图谱 | 找风格、介绍风格、区分相近风格，随机抽风格或组合提示词，混搭多种风格 |
| MJ 风格库 | 找 Midjourney sref 风格码、随机抽一个或组合几个码，按基准场景套用到你的主体上 |
| 动作运镜库 | 找动作和运镜参考、播放原片，按 Seedance 2.0 的提示词架构写动作提示词 |
| 提示词画廊 | 按主题或创作者找真实作品的提示词，讲清用途，再改写成你的主题 |

插件是 VSC 会员权益：会员可以调阅全部内容；非会员只能使用固定的样例。

## 安装

### Codex

```bash
codex plugin marketplace add vibeshotclub/vsc-plugin
codex plugin add vsc@vsc-plugin
codex mcp login vsc      # 浏览器会打开 vibeshot.club 的授权页
```

也可以在 Codex 里输入 `/plugins` 安装。装好后新开一个会话即可使用。

如果只想接 MCP（不带内置 skill），在 `~/.codex/config.toml` 里加上：

```toml
[mcp_servers.vsc]
url = "https://vibeshot.club/api/mcp"
scopes = ["email"]
```

然后执行 `codex mcp login vsc`。`scopes` 这一行建议保留：插件只需要 `email` 权限，不写的话 Codex 会申请全部权限。

### Claude Code

```text
/plugin marketplace add vibeshotclub/vsc-plugin
/plugin install vsc@vsc-plugin
```

如果只想接 MCP：`claude mcp add --transport http vsc https://vibeshot.club/api/mcp`，接好后在 `/mcp` 里完成登录。

## 首次授权

第一次调用时，浏览器会打开 vibeshot.club 的授权页。登录后，确认这是你自己正在用的 Agent，点「允许连接」即可。

- Agent 拿到的是**只读**授权：可以读取你有权查看的资源；不能在网站上发帖、评论、点赞、上传或修改资料，不能下载深度文件，也改不了你的密码。
- 授权凭证保存在你的电脑上。如果电脑不是你一个人在用，或者怀疑凭证泄露，请立即撤销授权。
- 想撤销授权，打开 <https://vibeshot.club/integrations/agents> 操作。撤销后，Agent 的下一次调用会立即失效。

### 装好后没有提示登录？

问 Agent 一个 VSC 的问题，它如果回答"VSC 插件还没有连接"，说明还没授权：Codex 运行 `codex mcp login vsc`，Claude Code 在 `/mcp` 里选中 `plugin:vsc:vsc` 登录。

不要用 Codex 的 plugin-creator 把本仓库导入成 ChatGPT 账号的私有插件。那样只会装上 skill，Codex 不会提示登录，资源库工具也不会出现。已经这样装了的话，先删掉，再按上面的「安装」重新装。

## 用法示例

- 帮我找 3 个适合赛博朋克海报的风格，给我一条能直接用的提示词
- 我不知道要什么风格，随机组一条提示词，主体是雨夜的天台快递员
- 用 MJ 随机给我 3 个风格码，配上基准图让我挑
- 找一个回旋踢的动作参考，写成 Seedance 提示词
- @umesh_ai 的提示词都怎么写？帮我改成国潮主题

## 额度与规则

插件为创作服务，**不提供整库列表或导出**。服务端会强制执行以下规则：

- 搜索必须带关键词或筛选条件。每页最多 20 条，最多翻 5 页。
- 每天和每月查看的不同条目数有上限。7 天内重复查看同一条目不重复计数。
- 如果调用方式接近遍历整库，插件会暂停 1 小时。

## 仓库结构

```
.agents/plugins/marketplace.json     Codex marketplace
.claude-plugin/marketplace.json      Claude Code marketplace
plugins/vsc/
  .codex-plugin/plugin.json          Codex 插件清单
  .claude-plugin/plugin.json         Claude Code 插件清单
  .mcp.json                          两边共用的 MCP 配置（HTTP + OAuth，只申请 email 权限）
  skills/                            两边共用的 5 个 skill
  assets/                            图标
```
