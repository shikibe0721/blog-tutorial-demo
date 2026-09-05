import { checkSession, json } from '../_utils';

function getToken(request: Request) {
  return (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
}

export async function onRequestGet(context: any) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    'SELECT * FROM posts ORDER BY pub_date DESC'
  ).all();

  return json(results);
}

export async function onRequestPost(context: any) {
  const token = getToken(context.request);
  const session = await checkSession(context.env, token);
  if (!session) return json({ error: '未登录' }, 401);

  const { request, env } = context;
  const body = await request.json();
  const { title, slug, content, description, author, tags, cover_url, cover_alt, pub_date } = body;

  if (!String(title || '').trim() || !String(slug || '').trim() || !pub_date) {
    return json({ error: '标题、slug 和发布日期不能为空' }, 400);
  }

  const result = await env.DB.prepare(`
    INSERT INTO posts (title, slug, content, description, author, tags, cover_url, cover_alt, pub_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    title, slug, content || '', description || '', author || session.username,
    JSON.stringify(tags || []), cover_url || '', cover_alt || '', pub_date
  ).run();

  return json({ id: result.meta.last_row_id, success: true }, 201);
}
