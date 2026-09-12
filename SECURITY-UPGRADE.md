# 安全升级说明（P0 修复版）

本次修复涉及 **1 项数据库迁移** 和 **确认 1 个环境变量**，部署前必须完成，否则后台无法登录。

## 1. D1 迁移：新增管理员会话表

在 Cloudflare Dashboard 的 D1 控制台（或 `wrangler d1 execute <DB> --local/--remote`）执行：

```sql
CREATE TABLE IF NOT EXISTS admin_sessions (
  token TEXT PRIMARY KEY,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions (expires_at);
```

> 过期会话在各接口读取时会顺手清理；如需定期全量清理可加：
> `DELETE FROM admin_sessions WHERE expires_at < datetime('now');`

## 2. 环境变量确认

- `ADMIN_PASSWORD`：后台管理密码，必须已在 Workers 环境变量（或 Secrets）中配置：
  ```bash
  wrangler secret put ADMIN_PASSWORD
  ```
  代码中不保留任何默认值，未配置时登录接口直接返回 500 并提示。

## 3. 本次代码变更清单

| 问题 | 修复 |
|---|---|
| 后台无鉴权（前端拿到 `'authenticated'` 常量后，POST/PUT/DELETE `/api/posts` 完全裸奔） | 登录成功签发随机 256bit 会话 token（12h 有效，存 `admin_sessions` 表）；`posts` 写接口强制校验；前端统一走 `adminFetch` 携带 Bearer token，401 自动回退登录页 |
| token 硬编码 `token: 'authenticated'` | 移除；token 为 `crypto.getRandomValues` 生成的 64 位十六进制随机串 |
| SQL 列名注入（PUT 把请求体任意键直接拼进 `SET` 子句） | 列名白名单（title/slug/content/description/author/tags/cover_url/cover_alt/pub_date），未知键返回 400 |
| 密码弱加密（单轮 SHA-256） | 新注册改为 PBKDF2-SHA256 × 150,000 轮（格式 `pbkdf2$150000$salt$hash`）；存量旧格式在**登录验证通过后透明升级**，用户无感 |
| 密码比较时序侧信道 | `timingSafeEqual` 恒定时间比较（管理密码 & 哈希） |

## 4. 遗留建议（非本次 P0 范围）

- 用户注册接口无验证码/速率限制，可考虑对 `/api/register`、`/api/login` 加 IP 限速（同 auth.ts 的思路）。
- 文章详情 HTML 里的 markdown 渲染仅做了转义 + 简单替换，如果将来支持更复杂语法注意 XSS。
- `localStorage` 存 token 可被 XSS 读取；当前页面已有转义，若引入第三方 markdown 库建议改 HttpOnly Cookie 会话。
