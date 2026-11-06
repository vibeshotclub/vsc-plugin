# 在 Hermes 中使用 VSC

采用 Hermes 原生 MCP OAuth + 5 个共享 Skills。需要支持 `hermes mcp login` 的 Hermes 版本。MCP 提供资源访问，Skills 提供选库、提示词和会员边界规则，两者都要安装。

## 1. 安装 Skills

在终端逐条执行，保留 Hermes 的安全扫描提示，不要用 `--force` 跳过：

```bash
hermes skills install vibeshotclub/vsc-plugin/plugins/vsc/skills/vsc-creative-director
hermes skills install vibeshotclub/vsc-plugin/plugins/vsc/skills/vsc-lexicon
hermes skills install vibeshotclub/vsc-plugin/plugins/vsc/skills/vsc-sref
hermes skills install vibeshotclub/vsc-plugin/plugins/vsc/skills/vsc-motion
hermes skills install vibeshotclub/vsc-plugin/plugins/vsc/skills/vsc-prompt-gallery
```

尚未发布的本地版本：可将本仓库 `plugins/vsc/skills/` 中的 5 个目录复制到当前 Hermes profile 的 `skills/` 中；已有同名目录时先备份，再决定更新。发布前，上面的 GitHub 安装命令仍会获取旧版本。

## 2. 配置 MCP

将 [config.yaml](../adapters/hermes/config.yaml) 的 `vsc` 项合并进 `~/.hermes/config.yaml` 的 `mcp_servers`，保留其他配置。如果已有该键，不要再创建第二个同名键。如果使用命名 profile 或 `HERMES_HOME`，请修改对应 profile 的配置，并在同一 profile 安装 Skills 和授权。

```yaml
mcp_servers:
  vsc:
    url: https://vibeshot.club/api/mcp
    auth: oauth
```

## 3. 授权并验证

在新的终端中执行，避免对话内配置自动重载的短超时：

```bash
hermes mcp login vsc
```

打开 VSC 授权链接，自己完成登录和「允许连接」，再新开 Hermes 会话。远程服务器运行 Hermes 时，按 Hermes 官方 SSH OAuth 指南配置回调转发。

发送：

> 加载 vsc-creative-director，先调用 VSC 的 vsc_whoami 确认连接和会员状态，再搜索 3 个适合复古科幻海报的风格。找不到工具或授权失败时请明确报告，不要用网页或记忆代替。

工具可能显示为 `mcp_vsc_vsc_whoami` 或 `mcp__vsc__vsc_whoami`，以当前版本实际名称为准。仅看到工具列表不代表授权成功，应确认 `vsc_whoami` 的真实返回。

## 官方依据

- [Hermes MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp/)
- [Hermes Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills/)

验证范围：配置结构、技能内容和 VSC 公开授权发现端点；尚未完成 Hermes 客户端内的真实登录与资源调用验收。
