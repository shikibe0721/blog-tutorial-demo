import { json, timingSafeEqual, createAdminSession, getBearerToken, requireAdmin } from './_utils';

// 服务端记录失败次数和时间（进程内，实例隔离但足以抬高爆破成本）
const failRecord: Record<string, { count: number; lockUntil: number }> = {};

// 校验当前管理员会话是否有效（前端刷新页面时调用）
export async function onRequestGet(context: any) {
  const session = await requireAdmin(context);
  if (!session) return json({ error: '未登录' }, 401);
  return json({ ok: true });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  // 用 IP 作为标识（Cloudflare 会自动注入 CF-Connecting-IP）
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  const record = failRecord[ip] || { count: 0, lockUntil: 0 };
  const now = Date.now();

  // 检查是否被锁定
  if (now < record.lockUntil) {
    const remain = Math.ceil((record.lockUntil - now) / 1000);
    return json({ error: '操作太频繁，请 ' + remain + ' 秒后再试', locked: true }, 429);
  }

  const { password } = await request.json();

  if (!env.ADMIN_PASSWORD) {
    return json({ error: '服务端未配置 ADMIN_PASSWORD' }, 500);
  }

  // 恒定时间比较，防时序侧信道
  if (timingSafeEqual(String(password || ''), String(env.ADMIN_PASSWORD))) {
    delete failRecord[ip];
    const session = await createAdminSession(env);
    if (!session) {
      return json({ error: '会话创建失败，请先执行后台会话表迁移（见 SECURITY-UPGRADE.md）' }, 500);
    }
    return json({ token: session.token, expiresAt: session.expiresAt });
  }

  // 密码错误，累加计数
  record.count++;
  if (record.count >= 5) {
    record.lockUntil = now + 60000; // 锁定 60 秒
    record.count = 0;
  }
  failRecord[ip] = record;

  const remaining = 5 - record.count;
  return json({
    error: remaining > 0
      ? '密码错误（还剩 ' + remaining + ' 次机会）'
      : '错误次数过多，已锁定 60 秒',
    locked: remaining <= 0,
  }, 401);
}

// 退出：销毁当前管理员会话
export async function onRequestDelete(context: any) {
  const { request, env } = context;
  const token = getBearerToken(request);
  if (token) {
    try {
      await env.DB.prepare('DELETE FROM admin_sessions WHERE token = ?').bind(token).run();
    } catch {}
  }
  return json({ ok: true });
}
