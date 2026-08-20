import { json, checkSession } from './_utils';

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  if (!slug) return json({ error: '缺少 slug' }, 400);

  const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM likes WHERE post_slug = ?').bind(slug).first();

  const token = (request.headers.get('Authorization') || '').replace('Bearer ', '');
  const session = await checkSession(env, token);
  let liked = false;
  if (session) {
    const row = await env.DB.prepare('SELECT id FROM likes WHERE post_slug = ? AND username = ?').bind(slug, session.username).first();
    liked = !!row;
  }
  return json({ count: count.n, liked });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const token = (request.headers.get('Authorization') || '').replace('Bearer ', '');
  const session = await checkSession(env, token);
  if (!session) return json({ error: '请先登录后再点赞' }, 401);

  const { slug } = await request.json();
  if (!slug) return json({ error: '缺少 slug' }, 400);

  const existing = await env.DB.prepare('SELECT id FROM likes WHERE post_slug = ? AND username = ?').bind(slug, session.username).first();
  if (existing) {
    await env.DB.prepare('DELETE FROM likes WHERE id = ?').bind(existing.id).run();
    return json({ liked: false });
  }
  await env.DB.prepare('INSERT INTO likes (post_slug, username) VALUES (?, ?)').bind(slug, session.username).run();
  return json({ liked: true });
}
