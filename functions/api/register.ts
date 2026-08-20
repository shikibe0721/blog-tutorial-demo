import { json, hashPassword } from './_utils';

export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const { username, password } = await request.json();
    const name = String(username || '').trim();

    if (!name || !password) return json({ error: '用户名和密码不能为空' }, 400);
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]{2,16}$/.test(name)) return json({ error: '用户名只能含中文/字母/数字/下划线，2-16 个字符' }, 400);
    if (String(password).length < 6) return json({ error: '密码至少 6 位' }, 400);

    const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(name).first();
    if (existing) return json({ error: '这个用户名已经被注册了' }, 409);

    const salt = crypto.randomUUID();
    const hash = await hashPassword(String(password), salt);
    await env.DB.prepare('INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)').bind(name, hash, salt).run();

    const user = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(name).first();
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
    await env.DB.prepare('INSERT INTO sessions (token, user_id, username, expires_at) VALUES (?, ?, ?, ?)').bind(token, user.id, name, expires).run();

    return json({ token, username: name });
  } catch {
    return json({ error: '注册失败，请重试' }, 500);
  }
}
