# Hermes / WorkBuddy 适配验收

日期：2026-11-05。插件源码版本：1.0.4。当前状态：本地源码适配完成，尚未发布。

## 实现

- Hermes：原生 `mcp_servers.vsc` + `auth: oauth`，共享 5 个 Skills。
- WorkBuddy：stdio 启动固定版本 `mcp-remote@0.16.1`，使用 HTTP-only 传输、email scope 和 300 秒授权等待；5 个独立 Skill ZIP。
- 全部技能允许客户端工具名前缀，增加 Hermes / WorkBuddy 登录排障；保留会员、额度、禁止整库导出及未连接不伪造资源的规则。
- 技能 frontmatter 增补 WorkBuddy 的双语展示信息、版本和作者。
- 网站安装页增加两套指引、可复制配置、7 个下载文件，支持四标签键盘导航及手机布局。

## 已验证

| 检查 | 结果 |
| --- | --- |
| Hermes YAML 与全部 JSON 解析 | 通过 |
| 5 个技能 frontmatter，包括 WorkBuddy 必要展示字段 | 通过 |
| 5 个 ZIP 单技能目录结构，内容与共享源码一致 | 通过 |
| 网站 7 个下载 URL 返回 200，文件字节与构建产物一致 | 通过 |
| WorkBuddy 固定版本桥接启动、initialize、tools/list、tools/call | 本地 HTTP-only MCP fixture 通过；不含 OAuth |
| 生产 VSC 未授权请求 | 返回 401 与 WWW-Authenticate 发现入口 |
| 生产公开 OAuth 元数据 | email scope、DCR、PKCE S256 均可发现 |
| 网站 TypeScript、目标文件 oxlint / oxfmt、git diff --check | 通过 |
| 桌面与手机可见标签切换、ArrowRight 环绕、End 键 | 通过 |
| 390px、320px 页面宽度 | 无横向溢出；390px 四标签均可访问 |

## 待验收

本机未安装 Hermes / WorkBuddy，尚未验证两款客户端中的真实账号登录、回调、Token 刷新、撤销后的失败行为，以及登录后的 `vsc_whoami` 和真实资源搜索。未更改用户客户端配置，未创建生产测试账号，也未修改服务端权限。

安装页来自已有、尚未上线的 `codex/plugin-install-guide` 分支；本次网页修改基于该分支，不代表生产网站已发布。插件和网页应一起发布，避免安装命令仍获取旧技能或下载链接不存在。

## 复测

```bash
python3 scripts/build-clients.py
node scripts/smoke-workbuddy.mjs
```

桥接测试会通过 npx 获取固定版本并启动一个本地临时 MCP 服务，不读取 VSC 账号或凭证。官网构建时，将 `build-clients.py --output <网站仓库>/public/plugin-clients` 的输出一起发布。

两款客户端的最终验收步骤见 [Hermes](hermes.md) 和 [WorkBuddy](workbuddy.md)。
