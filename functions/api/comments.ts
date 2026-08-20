import { json, checkSession } from './_utils';

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  if (!slug) return json({ error: '缺少 slug' }, 400);
  const rows = await env.DB.prepare(
    'SELECT id, username, content, created_at FROM comments WHERE post_slug = ? ORDER BY id ASC'
  ).bind(slug).all();
  return json(rows.results || []);
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const token = (request.headers.get('Authorization') || '').replace('Bearer ', '');
  const session = await checkSession(env, token);
  if (!session) return json({ error: '请先登录后再评论' }, 401);

  const { slug, content } = await request.json();
  const text = String(content || '').trim();
  if (!slug) return json({ error: '缺少 slug' }, 400);
  if (!text) return json({ error: '评论不能为空' }, 400);
  if (text.length > 500) return json({ error: '评论不能超过 500 字' }, 400);

  await env.DB.prepare(
    'INSERT INTO comments (post_slug, username, content) VALUES (?, ?, ?)'
  ).bind(slug, session.username, text).run();

  return json({ ok: true });
}
