import { json, checkSession } from './_utils';

const EMOJIS = ['👍', '❤️', '😂', '🤔'];

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  if (!slug) return json({ error: '缺少 slug' }, 400);

  const rows = await env.DB.prepare('SELECT emoji, COUNT(*) AS n FROM reactions WHERE post_slug = ? GROUP BY emoji').bind(slug).all();
  const counts: Record<string, number> = {};
  (rows.results || []).forEach((r: any) => { counts[r.emoji] = r.n; });

  const token = (request.headers.get('Authorization') || '').replace('Bearer ', '');
  const session = await checkSession(env, token);
  let mine: string[] = [];
  if (session) {
    const m = await env.DB.prepare('SELECT emoji FROM reactions WHERE post_slug = ? AND username = ?').bind(slug, session.username).all();
    mine = (m.results || []).map((r: any) => r.emoji);
  }
  return json({ counts, mine });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const token = (request.headers.get('Authorization') || '').replace('Bearer ', '');
  const session = await checkSession(env, token);
  if (!session) return json({ error: '请先登录' }, 401);

  const { slug, emoji } = await request.json();
  if (!slug || EMOJIS.indexOf(emoji) === -1) return json({ error: '无效' }, 400);

  const existing = await env.DB.prepare('SELECT id FROM reactions WHERE post_slug = ? AND username = ? AND emoji = ?').bind(slug, session.username, emoji).first();
  if (existing) {
    await env.DB.prepare('DELETE FROM reactions WHERE id = ?').bind(existing.id).run();
  } else {
    await env.DB.prepare('INSERT INTO reactions (post_slug, username, emoji) VALUES (?, ?, ?)').bind(slug, session.username, emoji).run();
  }
  return json({ ok: true });
}
