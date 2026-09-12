import { json, verifyPassword, rehashUser } from './_utils';

export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const { username, password } = await request.json();
    const name = String(username || '').trim();

    const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(name).first();
    if (!user) return json({ error: '用户名或密码错误' }, 401);

    const pw = String(password || '');
    if (!(await verifyPassword(user, pw))) return json({ error: '用户名或密码错误' }, 401);

    // 旧格式哈希在验证成功后透明升级为 PBKDF2
    if (!String(user.password_hash || '').startsWith('pbkdf2$')) {
      await rehashUser(env, user.id, pw);
    }

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
    await env.DB.prepare('INSERT INTO sessions (token, user_id, username, expires_at) VALUES (?, ?, ?, ?)').bind(token, user.id, user.username, expires).run();

    return json({ token, username: user.username });
  } catch {
    return json({ error: '登录失败，请重试' }, 500);
  }
}
