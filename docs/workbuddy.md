# 在 WorkBuddy 中使用 VSC

采用 WorkBuddy 的本地 stdio MCP 接口，通过 `mcp-remote` 完成 VSC 的 HTTP OAuth，再导入共享 Skills。此路径无需手填 API Key，也不依赖 WorkBuddy 市场上架。请在安装 WorkBuddy 的电脑上安装 Node.js 22 LTS 或更新的 LTS 版本，确认终端能运行 `node --version` 和 `npx --version`。

## 1. 配置 MCP

在 WorkBuddy 的 MCP 设置中打开配置。旧版入口为「插件 → MCP 服务器 → 配置 MCP」，新版可在「连接器」中管理 MCP。将 [mcp.json](../adapters/workbuddy/mcp.json) 中的 `vsc` 项合并到用户级 `~/.workbuddy/mcp.json`，或项目级 `.workbuddy/mcp.json`；保留原有服务器，不要覆盖整个文件。

配置固定使用 `mcp-remote@0.16.1`，通过 `http-only` 连接 VSC，并申请 `email` scope。首次启动时 npx 会下载桥接包，需可访问 npm。授权等待时间为 300 秒。

Windows 和 macOS 均使用同一份参数数组。若客户端无法找到 npx，重启 WorkBuddy 使其读取新 PATH；仍失败时，Windows 用 `where.exe npx`、macOS 用 `which npx` 定位启动文件，再按客户端的本地命令配置方式填写，不要把整条 shell 命令塞进 `command`。

## 2. 完成 OAuth

保存后信任、启用或重连 `vsc`。本地桥接会打开 VSC 授权页。请自己登录并点击「允许连接」，不需要把 Token 发给 Agent。

若浏览器未自动打开，可在 MCP 日志里寻找授权入口并在本机打开；授权 URL 可能包含临时状态值，请勿公开日志。若首次授权超时，重新连接后再试。

凭证由本机 mcp-remote 管理。可以在 [已连接的 Agent](https://vibeshot.club/integrations/agents) 撤销 VSC 授权，不要为排障删除其他服务的凭证目录。

## 3. 导入 5 个 Skills

从本仓库生成独立技能包：

```bash
python3 scripts/build-clients.py
```

在 WorkBuddy「技能 → 添加技能 / 上传技能」逐个导入 `dist/clients/` 下的五个 ZIP。每个包包含一个技能目录及其 `SKILL.md`：

- `vsc-creative-director.zip`
- `vsc-lexicon.zip`
- `vsc-sref.zip`
- `vsc-motion.zip`
- `vsc-prompt-gallery.zip`

也可以下载仓库 ZIP，解压后逐个导入 `plugins/vsc/skills/` 下的技能目录。不要将整个 marketplace 仓库当作单个 Skill 上传。仅导入 Skills 不会自动连接 MCP。

## 4. 验证

新建任务后发送：

> 使用 VSC 创作总监，先调用 vsc_whoami 确认连接和会员状态，再搜索 3 个适合复古科幻海报的风格。没有工具或授权失败时请明确报告，不要用网页或记忆代替。

需要同时确认 5 个 Skills 可见、MCP 连接成功，以及 `vsc_whoami` 和一次搜索返回真实结果。权限和额度仍由 VSC 服务端控制。

## 官方依据

- [WorkBuddy MCP 配置](https://www.codebuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/MCP-Guide)
- [WorkBuddy 技能格式](https://open.workbuddy.cn/docs/skill)
- [mcp-remote 项目说明](https://github.com/geelen/mcp-remote)

验证范围：配置结构、技能 ZIP 内容和 VSC 公开授权发现端点；尚未完成 WorkBuddy 客户端内的真实登录与资源调用验收。
